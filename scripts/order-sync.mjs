import { readFileSync, writeFileSync, existsSync } from "fs";

// 自动同步链上 USDT 收款为订单（由 GitHub Actions 定时运行）
const SELLER = "0x5a93d426357cfc7b83d27cec9d4776b05fc73149";
const TRANSFER = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
const NETS = {
  bsc: { label: "BSC", rpc: "https://bsc.publicnode.com", token: "0x55d398326f99059fF775485246999027B3197955", dec: 18, blockTime: 3, chunk: 20000 },
  arb: { label: "Arbitrum", rpc: "https://arb1.arbitrum.io/rpc", token: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", dec: 6, blockTime: 0.25, chunk: 200000 }
};
const TO_TOPIC = "0x000000000000000000000000" + SELLER.slice(2).toLowerCase();
const INIT_DAYS = 3; // 首次运行向前扫描的天数

async function rpc(url, method, params) {
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }) });
  const j = await r.json();
  if (j.error) throw new Error(j.error.message || "RPC error");
  return j.result;
}
function fmtUnits(v, dec) {
  let s = v.toString();
  if (s.length <= dec) s = "0".repeat(dec - s.length + 1) + s;
  const int = s.slice(0, s.length - dec), frac = s.slice(s.length - dec).replace(/0+$/, "").slice(0, 6);
  return frac ? int + "." + frac : int;
}
function fmtT(ts) { // 北京时间
  const d = new Date(ts + 8 * 3600 * 1000);
  const p = n => String(n).padStart(2, "0");
  return d.getUTCFullYear() + "-" + p(d.getUTCMonth() + 1) + "-" + p(d.getUTCDate()) + " " + p(d.getUTCHours()) + ":" + p(d.getUTCMinutes());
}

const products = JSON.parse(readFileSync("products.json", "utf8"));
const orders = existsSync("orders.json") ? JSON.parse(readFileSync("orders.json", "utf8")) : [];
const cursor = existsSync(".order-sync.json") ? JSON.parse(readFileSync(".order-sync.json", "utf8")) : {};
const known = new Set(orders.map(o => (o.chain + "|" + String(o.tx || o.id)).toLowerCase()));

let added = 0;
for (const [key, net] of Object.entries(NETS)) {
  const latest = parseInt(await rpc(net.rpc, "eth_blockNumber", []), 16);
  let from = cursor[key] ? cursor[key] + 1 : latest - Math.ceil(INIT_DAYS * 86400 / net.blockTime);
  if (from < 0) from = 0;
  if (from > latest) { cursor[key] = latest; continue; }
  const found = [];
  // 从最新向最旧扫描，遇到归档限制即停止（公共节点只允许查最近一段）
  for (let b = latest; b > from; ) {
    const a = Math.max(from, b - net.chunk);
    let logs = [];
    try {
      logs = await rpc(net.rpc, "eth_getLogs", [{ fromBlock: "0x" + a.toString(16), toBlock: "0x" + b.toString(16), address: net.token, topics: [TRANSFER, null, TO_TOPIC] }]);
    } catch (e) {
      if (/archive/i.test(e.message)) break;
      console.log("chunk failed", key, a, b, e.message);
      b = a - 1;
      continue;
    }
    for (const l of logs) {
      const id = (key + "|" + l.transactionHash).toLowerCase();
      if (known.has(id) || found.some(f => f.id === id)) continue;
      if (BigInt(l.data) <= 0n) continue;
      found.push({ id, key, net, tx: String(l.transactionHash).toLowerCase(), value: BigInt(l.data), block: l.blockNumber, fromAddr: "0x" + l.topics[1].slice(26) });
    }
    b = a - 1;
  }
  const tmap = {};
  for (const blk of [...new Set(found.map(f => f.block))]) {
    try { const b = await rpc(net.rpc, "eth_getBlockByNumber", [blk, false]); tmap[blk] = parseInt(b.timestamp, 16) * 1000; }
    catch (e) { tmap[blk] = Date.now(); }
  }
  found.sort((x, y) => tmap[x.block] - tmap[y.block]);
  for (const f of found) {
    const amount = fmtUnits(f.value, net.dec);
    const matches = products.filter(p => parseFloat(p.price) === parseFloat(amount));
    const p = matches.length === 1 ? matches[0] : null;
    orders.unshift({
      id: f.tx, tx: f.tx,
      productId: p ? p.id : null,
      productName: p ? p.name : "未知商品（" + amount + " USDT，待确认）",
      price: p ? p.price : amount,
      chain: key, chainLabel: net.label,
      from: f.fromAddr, time: fmtT(tmap[f.block]),
      status: "pending", auto: true
    });
    known.add(f.id);
    added++;
    console.log("new order:", f.tx, amount, net.label, p ? p.name : "待确认");
  }
  cursor[key] = latest;
}
writeFileSync("orders.json", JSON.stringify(orders));
writeFileSync(".order-sync.json", JSON.stringify(cursor));
console.log("done, added " + added + " orders");
