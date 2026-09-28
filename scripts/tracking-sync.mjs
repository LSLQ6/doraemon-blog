// 快递物流同步：每 30 分钟运行一次。
// 查出已发货、实物、有单号、未签收的订单，用快递鸟即时查询（RequestType=1002）拉取轨迹，写回 orders.ship。
// 需要 Secrets: SUPABASE_URL、SUPABASE_SERVICE_ROLE_KEY、KDNIAO_EBUSINESSID、KDNIAO_APPKEY。
// 缺任何一个都静默跳过，不报错。
import crypto from "node:crypto";

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, KDNIAO_EBUSINESSID, KDNIAO_APPKEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.log("缺少 Supabase 配置，跳过物流同步。");
  process.exit(0);
}
if (!KDNIAO_EBUSINESSID || !KDNIAO_APPKEY) {
  console.log("缺少快递鸟配置，跳过物流同步。");
  process.exit(0);
}

const sbHeaders = {
  apikey: SUPABASE_SERVICE_ROLE_KEY,
  Authorization: "Bearer " + SUPABASE_SERVICE_ROLE_KEY,
  "Content-Type": "application/json"
};
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function kdniaoQuery(shipperCode, logisticCode) {
  const requestData = JSON.stringify({ OrderCode: "", ShipperCode: shipperCode, LogisticCode: logisticCode });
  // 官方签名：把 (RequestData + AppKey) 做 MD5，再 Base64，最后 URL 编码
  const dataSign = encodeURIComponent(crypto.createHash("md5").update(requestData + KDNIAO_APPKEY, "utf8").digest("base64"));
  const body =
    "RequestData=" + encodeURIComponent(requestData) +
    "&EBusinessID=" + encodeURIComponent(KDNIAO_EBUSINESSID) +
    "&RequestType=1002&DataSign=" + dataSign + "&DataType=2";
  const r = await fetch("https://api.kdniao.com/Ebusiness/EbusinessOrderHandle.aspx", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
    body
  });
  const data = await r.json();
  if (!data || !data.Success) {
    console.log("  快递鸟查询失败:", (data && data.Reason) || JSON.stringify(data).slice(0, 200));
    return null;
  }
  const list = (data.Traces || [])
    .map(t => ({ t: t.AcceptTime || "", s: t.AcceptStation || "" }))
    .filter(x => x.t || x.s);
  const signed = String(data.State) === "3" || list.some(x => /签收/.test(x.s));
  return { list, signed };
}

const q = `${SUPABASE_URL}/rest/v1/orders?select=id,ship&status=eq.shipped`;
const rows = await (await fetch(q, { headers: sbHeaders })).json();
const targets = (Array.isArray(rows) ? rows : []).filter(o => {
  const s = o.ship || {};
  return s.type === "physical" && s.trackingNo && s.carrier && s.signed !== true;
});
console.log(`待查物流订单 ${targets.length} 笔`);

for (const o of targets) {
  const s = o.ship;
  try {
    const traces = await kdniaoQuery(s.carrier, s.trackingNo);
    if (traces) {
      s.tracking = traces.list;
      s.trackingUpdated = new Date().toISOString();
      if (traces.signed) s.signed = true;
      const up = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${o.id}`, {
        method: "PATCH",
        headers: sbHeaders,
        body: JSON.stringify({ ship: s })
      });
      if (!up.ok) console.log(`订单 ${o.id}: 写回失败 ${up.status}`);
      else console.log(`订单 ${o.id}: 更新 ${traces.list.length} 条轨迹${traces.signed ? "（已签收）" : ""}`);
    }
  } catch (e) {
    console.log(`订单 ${o.id}: 查询异常 ${e.message}`);
  }
  await sleep(1500); // 快递鸟免费版限频，慢一点
}
console.log("物流同步完成。");
