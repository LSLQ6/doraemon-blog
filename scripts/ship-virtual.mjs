// 虚拟商品发货邮件：由后台「发货」触发 repository_dispatch。
// 邮件是附加服务：发送失败不抛错（发货内容已记入订单，买家可在订单页查看）。
// 需要 Secrets: RESEND_API_KEY；可选 RESEND_FROM（已验证的发件域名，未配置时用 Resend 默认地址，
// 此时只能发到 Resend 注册邮箱——买家邮箱投递需先在 Resend 验证自有域名）。
// 可选 SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY：回写 ship.emailed 标记。

const payload = JSON.parse(process.env.PAYLOAD || "{}");
const { buyer_email, product_name, price, content, order_id} = payload;
const apiKey = process.env.RESEND_API_KEY;

async function markEmailed(ok) {
const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url ||!key ||!order_id) return;
try {
const get = await fetch(`${url}/rest/v1/orders?select=ship&id=eq.${order_id}`, {
headers: { apikey: key, Authorization: "Bearer " + key}
});
const rows = await get.json();
const ship = (rows[0] && rows[0].ship) || {};
ship.emailed = ok;
await fetch(`${url}/rest/v1/orders?id=eq.${order_id}`, {
method: "PATCH",
headers: { apikey: key, Authorization: "Bearer " + key, "Content-Type": "application/json"},
body: JSON.stringify({ ship})
});
console.log("已回写 emailed =", ok);
} catch (e) {
console.log("回写 emailed 失败:", e.message);
}
}

if (!buyer_email ||!content) {
console.log("缺少 buyer_email 或 content，跳过。");
process.exit(0);
}
if (!apiKey) {
console.log("未配置 RESEND_API_KEY，跳过邮件发送。");
await markEmailed(false);
process.exit(0);
}

const from = process.env.RESEND_FROM || "哆啦A梦小店 <onboarding@resend.dev>";
const shortId = order_id? String(order_id).replace(/-/g, "").slice(0, 8).toUpperCase(): "";
const esc = s => String(s == null? "": s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const html = `
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:20px">
<h2>🎉 你的商品已发货</h2>
<p>订单号：<b>${esc(shortId)}</b></p>
<p>商品：${esc(product_name)}（${esc(price)} USD）</p>
<p>以下是你的虚拟商品交付内容，请妥善保管：</p>
<pre style="background:#f6f6f6;border:1px dashed #ccc;border-radius:8px;padding:14px;white-space:pre-wrap;word-break:break-all">${esc(content)}</pre>
<p style="color:#888;font-size:12px">也可以随时在商城「我的订单」里查看该订单的发货信息。</p>
</div>`;

try {
const r = await fetch("https://api.resend.com/emails", {
method: "POST",
headers: { "Authorization": "Bearer " + apiKey, "Content-Type": "application/json"},
body: JSON.stringify({
from,
to: [buyer_email],
subject: `${product_name} · 订单 ${shortId}`,
html
})
});
const data = await r.json();
if (!r.ok) {
console.log("邮件发送失败（发货已记录，买家可在订单页查看）:", JSON.stringify(data));
await markEmailed(false);
} else {
console.log("邮件已发送:", data.id);
await markEmailed(true);
}
} catch (e) {
console.log("邮件发送异常（发货已记录）:", e.message);
await markEmailed(false);
}
