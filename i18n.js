/* 多语言：简体中文 / 繁體中文 / English
 * 用法：t("key") 或 t("key", {x: 123})
 * 静态元素加 data-i18n="key" / data-i18n-ph="key"(placeholder) /
 * data-i18n-aria="key"(aria-label) / data-i18n-alt="key"(alt) /
 * data-i18n-html="key"(innerHTML)，
 * <title> 加 data-i18n-title="key"。
 * 语言偏好存在 localStorage "blog-lang"。 */
(function(){
var LANGS = [
  { code: "zh-CN", label: "简体中文" },
  { code: "zh-TW", label: "繁體中文" },
  { code: "en", label: "English" }
];
var DICT = {
"zh-CN": {
  nav_posts: "文章", nav_shop: "购物",
  aria_search: "搜索", aria_theme: "切换深色模式", aria_user: "用户菜单", aria_lang: "语言",
  search_ph_posts: "搜索文章标题、内容…", search_ph_products: "搜索商品名称…",
  auth_login: "登录", auth_signup: "注册",
  auth_email_ph: "邮箱", auth_pwd_ph: "密码（至少 6 位）", auth_cancel: "取消",
  auth_no_account: "没有账号？去注册", auth_has_account: "已有账号？去登录",
  auth_fill_both: "请填写邮箱和密码。", auth_pwd_short: "密码至少 6 位。",
  auth_bad_cred: "邮箱或密码不对。", auth_error_prefix: "出错了：",
  menu_myorders: "我的订单", menu_logout: "退出", menu_logged_in: "已登录",
  gate_title: "请输入后台密码", gate_pwd_ph: "密码", gate_wrong: "密码不对，再试试",
  gate_cancel: "取消", gate_enter: "进入",
  doc_title_blog: "祁萧远的博客", doc_title_shop: "购物 · 祁萧远的博客",
  latest_posts: "最新文章", empty_search: "没有找到相关文章，换个关键词试试。",
  back_to_posts: "← 返回文章列表", loading: "加载中…",
  load_fail: "文章加载失败，请稍后重试。", list_fail: "文章列表加载失败。",
  cat_all: "全部", demo_prefix: "示例 · ",
  demo_note: "这是示例文章，发布前记得替换成你自己的内容。",
  about_title: "关于",
  about_p1: "你好，这里是祁萧远的博客。",
  about_p2: "这是一个记录生活、阅读与思考的地方。把稍纵即逝的念头，整理成可以慢慢阅读的文字。",
  about_p3: "（这段介绍是示例，换成你自己的介绍吧。）",
  shop_products: "商品", shop_empty: "店主还未上架商品，敬请期待。",
  back_to_products: "← 返回商品列表", order_confirm: "确认订单",
  pay_warn_a: "⚠️ 请确保店主实际收到 ",
  pay_warn_b: " USDT：从交易所提币时手续费是另外扣的，请把手续费算进去、足额转出；少到账（比如只到 5.98）系统检测不到付款。",
  pay_pay: "请支付", pay_network: "支付网络：", pay_qr_alt: "收款二维码",
  copy_addr: "复制地址", copied: "已复制 ✓", check_paid: "我已付款，立即检测",
  pay_note: "请务必使用上方选择的网络转账，转错网络资产可能丢失。检测到付款后会自动显示成功。",
  cancel_order_btn: "取消订单", pay_success: "支付成功！",
  success_note: "订单状态由店主在后台更新，本页面每分钟自动刷新，无需重复付款。",
  my_orders: "我的订单", refresh: "刷新",
  claim_title: "补登订单",
  claim_desc: "如果付款后页面没检测到（比如中途关掉了页面），在这里粘贴交易哈希手动补登，系统会到链上核验这笔转账确实到了店主地址。",
  claim_ph: "交易哈希（SOL 链请粘贴交易签名）", claim_btn: "核验并补登",
  claim_need_login: "请先登录。",
  claim_bad_sig_sol: "Solana 交易签名格式不对，请粘贴完整的交易签名。",
  claim_bad_hash_tron: "TRON 交易哈希格式不对，应为 64 位十六进制（可带 0x）。",
  claim_bad_hash_evm: "交易哈希格式不对，应为 0x 开头的 64 位十六进制。",
  claim_need_product: "请先选择商品（商品列表加载失败时无法补登）。",
  claim_verifying: "正在链上核验这笔转账…",
  claim_dup: "这笔交易已经登记过了，无需重复补登。",
  claim_no_transfer: "核验失败：这笔交易里没有给店主地址转 {x} USDT 的记录，请检查哈希和网络是否选对。",
  claim_dup_account: "这笔交易已经被登记过了（一笔交易只能绑定一个账号），无需重复补登。",
  claim_fail: "登记失败：{x}", claim_ok: "补登成功！订单状态为「待发货」。",
  order_status_pending: "⏳ 等待发货", order_status_shipped: "📦 卖家已发货",
  order_status_completed: "🎉 订单已完成",
  badge_unpaid: "待支付", badge_pending: "待发货",
  badge_shipped: "已发货", badge_completed: "订单已完成",
  buy: "购买", sold_count: "已售出 {x} 件", sold_out: "已售罄", stock_left: "剩余 {x} 件",
  pm_choose: "选择支付方式", pm_usdt: "USDT支付", pm_other: "其他支付",
  pm_cancel: "取消", pm_choose_net: "选择支付网络", pm_back: "← 返回",
  pm_other_soon: "其他支付即将上线，敬请期待",
  alert_soldout: "这个商品已经售罄了。",
  auth_need_login: "进入付款需要先登录 / 注册，浏览商品不用登录。",
  err_unknown: "未知错误", auth_expired: "登录已过期，请重新登录后再试。",
  order_create_fail: "创建待支付订单失败：{x}",
  status_connecting: "正在连接网络…",
  status_net_fail: "网络连接失败，请检查网络后点「{btn}」重试。",
  status_waiting: "<span class=\"spin\">⏳</span> 等待付款…（每 15 秒自动检测一次）",
  confirm_cancel: "确定取消这笔待支付订单吗？",
  cancel_fail: "取消失败：{x}",
  order_timeout: "订单已超时（30 分钟）。如已付款请联系店主确认，或重新下单。",
  status_retry: "检测遇到网络波动，正在重试…（{x}）",
  auth_invalid_check: "登录已失效，请重新登录后再点「{btn}」。",
  status_found: "<span class=\"spin\">⏳</span> 已检测到付款，正在登记订单…",
  tx_used_other: "这笔交易已被其他订单登记，请确认是你本人的付款后再试。",
  order_reg_fail: "订单登记失败：{x}。请点「{btn}」重试。",
  row_order_id: "订单号", row_product: "商品", row_amount: "金额",
  row_pay_time: "付款时间", row_tx: "交易哈希",
  myorders_loading: "加载中…", myorders_empty: "还没有订单",
  tx_link: "交易 {x}…", go_pay: "去支付",
  status_choose_net: "请先选择支付网络。",
  order_row_line: "订单号 {id} · {time} · {net} · "
},
"zh-TW": {
  nav_posts: "文章", nav_shop: "購物",
  aria_search: "搜尋", aria_theme: "切換深色模式", aria_user: "用戶菜單", aria_lang: "語言",
  search_ph_posts: "搜尋文章標題、內容…", search_ph_products: "搜尋商品名稱…",
  auth_login: "登入", auth_signup: "註冊",
  auth_email_ph: "郵箱", auth_pwd_ph: "密碼（至少 6 位）", auth_cancel: "取消",
  auth_no_account: "沒有帳號？去註冊", auth_has_account: "已有帳號？去登入",
  auth_fill_both: "請填寫郵箱和密碼。", auth_pwd_short: "密碼至少 6 位。",
  auth_bad_cred: "郵箱或密碼不對。", auth_error_prefix: "出錯了：",
  menu_myorders: "我的訂單", menu_logout: "登出", menu_logged_in: "已登入",
  gate_title: "請輸入後台密碼", gate_pwd_ph: "密碼", gate_wrong: "密碼不對，再試試",
  gate_cancel: "取消", gate_enter: "進入",
  doc_title_blog: "祁蕭遠的博客", doc_title_shop: "購物 · 祁蕭遠的博客",
  latest_posts: "最新文章", empty_search: "沒有找到相關文章，換個關鍵詞試試。",
  back_to_posts: "← 返回文章列表", loading: "載入中…",
  load_fail: "文章載入失敗，請稍後重試。", list_fail: "文章列表載入失敗。",
  cat_all: "全部", demo_prefix: "示例 · ",
  demo_note: "這是示例文章，發佈前記得替換成你自己的內容。",
  about_title: "關於",
  about_p1: "你好，這裡是祁蕭遠的博客。",
  about_p2: "這是一個記錄生活、閱讀與思考的地方。把稍縱即逝的念頭，整理成可以慢慢閱讀的文字。",
  about_p3: "（這段介紹是示例，換成你自己的介紹吧。）",
  shop_products: "商品", shop_empty: "店主還未上架商品，敬請期待。",
  back_to_products: "← 返回商品列表", order_confirm: "確認訂單",
  pay_warn_a: "⚠️ 請確保店主實際收到 ",
  pay_warn_b: " USDT：從交易所提幣時手續費是另外扣的，請把手續費算進去、足額轉出；少到賬（比如只到 5.98）系統檢測不到付款。",
  pay_pay: "請支付", pay_network: "支付網絡：", pay_qr_alt: "收款二維碼",
  copy_addr: "複製地址", copied: "已複製 ✓", check_paid: "我已付款，立即檢測",
  pay_note: "請務必使用上方選擇的網絡轉賬，轉錯網絡資產可能丟失。檢測到付款後會自動顯示成功。",
  cancel_order_btn: "取消訂單", pay_success: "支付成功！",
  success_note: "訂單狀態由店主在後台更新，本頁面每分鐘自動刷新，無需重複付款。",
  my_orders: "我的訂單", refresh: "重新整理",
  claim_title: "補登訂單",
  claim_desc: "如果付款後頁面沒檢測到（比如中途關掉了頁面），在這裡粘貼交易哈希手動補登，系統會到鏈上核驗這筆轉賬確實到了店主地址。",
  claim_ph: "交易哈希（SOL 鏈請粘貼交易簽名）", claim_btn: "核驗並補登",
  claim_need_login: "請先登入。",
  claim_bad_sig_sol: "Solana 交易簽名格式不對，請粘貼完整的交易簽名。",
  claim_bad_hash_tron: "TRON 交易哈希格式不對，應為 64 位十六進制（可帶 0x）。",
  claim_bad_hash_evm: "交易哈希格式不對，應為 0x 開頭的 64 位十六進制。",
  claim_need_product: "請先選擇商品（商品列表載入失敗時無法補登）。",
  claim_verifying: "正在鏈上核驗這筆轉賬…",
  claim_dup: "這筆交易已經登記過了，無需重複補登。",
  claim_no_transfer: "核驗失敗：這筆交易裡沒有給店主地址轉 {x} USDT 的記錄，請檢查哈希和網絡是否選對。",
  claim_dup_account: "這筆交易已經被登記過了（一筆交易只能綁定一個賬號），無需重複補登。",
  claim_fail: "登記失敗：{x}", claim_ok: "補登成功！訂單狀態為「待發貨」。",
  order_status_pending: "⏳ 等待發貨", order_status_shipped: "📦 賣家已發貨",
  order_status_completed: "🎉 訂單已完成",
  badge_unpaid: "待支付", badge_pending: "待發貨",
  badge_shipped: "已發貨", badge_completed: "訂單已完成",
  buy: "購買", sold_count: "已售出 {x} 件", sold_out: "已售罄", stock_left: "剩餘 {x} 件",
  pm_choose: "選擇支付方式", pm_usdt: "USDT支付", pm_other: "其他支付",
  pm_cancel: "取消", pm_choose_net: "選擇支付網絡", pm_back: "← 返回",
  pm_other_soon: "其他支付即將上線，敬請期待",
  alert_soldout: "這個商品已經售罄了。",
  auth_need_login: "進入付款需要先登入 / 註冊，瀏覽商品不用登入。",
  err_unknown: "未知錯誤", auth_expired: "登入已過期，請重新登入後再試。",
  order_create_fail: "創建待支付訂單失敗：{x}",
  status_connecting: "正在連接網絡…",
  status_net_fail: "網絡連接失敗，請檢查網絡後點「{btn}」重試。",
  status_waiting: "<span class=\"spin\">⏳</span> 等待付款…（每 15 秒自動檢測一次）",
  confirm_cancel: "確定取消這筆待支付訂單嗎？",
  cancel_fail: "取消失敗：{x}",
  order_timeout: "訂單已超時（30 分鐘）。如已付款請聯繫店主確認，或重新下單。",
  status_retry: "檢測遇到網絡波動，正在重試…（{x}）",
  auth_invalid_check: "登入已失效，請重新登入後再點「{btn}」。",
  status_found: "<span class=\"spin\">⏳</span> 已檢測到付款，正在登記訂單…",
  tx_used_other: "這筆交易已被其他訂單登記，請確認是你本人的付款後再試。",
  order_reg_fail: "訂單登記失敗：{x}。請點「{btn}」重試。",
  row_order_id: "訂單號", row_product: "商品", row_amount: "金額",
  row_pay_time: "付款時間", row_tx: "交易哈希",
  myorders_loading: "載入中…", myorders_empty: "還沒有訂單",
  tx_link: "交易 {x}…", go_pay: "去支付",
  status_choose_net: "請先選擇支付網絡。",
  order_row_line: "訂單號 {id} · {time} · {net} · "
},
"en": {
  nav_posts: "Posts", nav_shop: "Shop",
  aria_search: "Search", aria_theme: "Toggle dark mode", aria_user: "User menu", aria_lang: "Language",
  search_ph_posts: "Search titles and content…", search_ph_products: "Search products…",
  auth_login: "Log in", auth_signup: "Sign up",
  auth_email_ph: "Email", auth_pwd_ph: "Password (min. 6 characters)", auth_cancel: "Cancel",
  auth_no_account: "No account? Sign up", auth_has_account: "Have an account? Log in",
  auth_fill_both: "Please enter your email and password.",
  auth_pwd_short: "Password must be at least 6 characters.",
  auth_bad_cred: "Incorrect email or password.", auth_error_prefix: "Error: ",
  menu_myorders: "My orders", menu_logout: "Log out", menu_logged_in: "Signed in",
  gate_title: "Enter admin password", gate_pwd_ph: "Password",
  gate_wrong: "Wrong password, try again",
  gate_cancel: "Cancel", gate_enter: "Enter",
  doc_title_blog: "Qixiaoyuan's Blog", doc_title_shop: "Shop · Qixiaoyuan's Blog",
  latest_posts: "Latest posts", empty_search: "No posts found. Try another keyword.",
  back_to_posts: "← Back to posts", loading: "Loading…",
  load_fail: "Failed to load the post. Please try again later.",
  list_fail: "Failed to load the post list.",
  cat_all: "All", demo_prefix: "Demo · ",
  demo_note: "This is a sample post. Replace it with your own content before publishing.",
  about_title: "About",
  about_p1: "Hi, this is Qixiaoyuan's blog.",
  about_p2: "A place to record life, reading and reflection — fleeting thoughts, written down to be read slowly.",
  about_p3: "(This intro is a placeholder — replace it with your own.)",
  shop_products: "Products", shop_empty: "No products yet — check back soon.",
  back_to_products: "← Back to products", order_confirm: "Confirm order",
  pay_warn_a: "⚠️ Make sure the seller actually receives ",
  pay_warn_b: " USDT: exchanges deduct withdrawal fees separately — include the fee and send the full amount. Underpayments (e.g. only 5.98 arriving) won't be detected.",
  pay_pay: "Please pay", pay_network: "Network:", pay_qr_alt: "Payment QR code",
  copy_addr: "Copy address", copied: "Copied ✓", check_paid: "I've paid — check now",
  pay_note: "Be sure to transfer on the selected network — assets sent on the wrong network may be lost. Success will show automatically once detected.",
  cancel_order_btn: "Cancel order", pay_success: "Payment successful!",
  success_note: "The seller updates the order status in the admin panel. This page refreshes every minute — no need to pay again.",
  my_orders: "My orders", refresh: "Refresh",
  claim_title: "Claim an order",
  claim_desc: "If the page didn't detect your payment (e.g. you closed it), paste the transaction hash here to claim it manually. The system will verify on-chain that the transfer reached the seller's address.",
  claim_ph: "Transaction hash (paste the signature for SOL)", claim_btn: "Verify & claim",
  claim_need_login: "Please log in first.",
  claim_bad_sig_sol: "Invalid Solana signature. Please paste the complete transaction signature.",
  claim_bad_hash_tron: "Invalid TRON hash. It should be 64 hex characters (0x prefix optional).",
  claim_bad_hash_evm: "Invalid hash. It should be 64 hex characters starting with 0x.",
  claim_need_product: "Please select a product first (unavailable if the product list failed to load).",
  claim_verifying: "Verifying the transaction on-chain…",
  claim_dup: "This transaction has already been claimed.",
  claim_no_transfer: "Verification failed: no transfer of {x} USDT to the seller's address found in this transaction. Check the hash and network.",
  claim_dup_account: "This transaction is already claimed (one transaction per account).",
  claim_fail: "Claim failed: {x}", claim_ok: "Claimed! Order status: \"Awaiting shipment\".",
  order_status_pending: "⏳ Awaiting shipment", order_status_shipped: "📦 Shipped",
  order_status_completed: "🎉 Completed",
  badge_unpaid: "Unpaid", badge_pending: "Awaiting shipment",
  badge_shipped: "Shipped", badge_completed: "Completed",
  buy: "Buy", sold_count: "{x} sold", sold_out: "Sold out", stock_left: "{x} left",
  pm_choose: "Choose payment method", pm_usdt: "Pay with USDT", pm_other: "Other payment",
  pm_cancel: "Cancel", pm_choose_net: "Choose network", pm_back: "← Back",
  pm_other_soon: "Other payment methods are coming soon",
  alert_soldout: "This product is sold out.",
  auth_need_login: "Log in / sign up to proceed to payment. Browsing doesn't require login.",
  err_unknown: "Unknown error", auth_expired: "Session expired. Please log in again.",
  order_create_fail: "Failed to create the unpaid order: {x}",
  status_connecting: "Connecting…",
  status_net_fail: "Connection failed. Check your network and tap \"{btn}\" to retry.",
  status_waiting: "<span class=\"spin\">⏳</span> Waiting for payment… (auto-checks every 15s)",
  confirm_cancel: "Cancel this unpaid order?",
  cancel_fail: "Cancel failed: {x}",
  order_timeout: "Order timed out (30 minutes). If you already paid, contact the seller or place a new order.",
  status_retry: "Network hiccup while checking — retrying… ({x})",
  auth_invalid_check: "Session expired. Log in again, then tap \"{btn}\".",
  status_found: "<span class=\"spin\">⏳</span> Payment detected — registering your order…",
  tx_used_other: "This transaction is already registered to another order. Make sure it's your own payment and try again.",
  order_reg_fail: "Order registration failed: {x}. Tap \"{btn}\" to retry.",
  row_order_id: "Order ID", row_product: "Product", row_amount: "Amount",
  row_pay_time: "Paid at", row_tx: "Tx hash",
  myorders_loading: "Loading…", myorders_empty: "No orders yet",
  tx_link: "Tx {x}…", go_pay: "Pay now",
  status_choose_net: "Please choose a network first.",
  order_row_line: "Order {id} · {time} · {net} · "
}
};
function getLang(){
  try {
    var l = localStorage.getItem("blog-lang");
    if(l && DICT[l]) return l;
  } catch(e){}
  return "zh-CN";
}
function t(key, params){
  var lang = getLang();
  var s = (DICT[lang] && DICT[lang][key] !== undefined) ? DICT[lang][key]
        : (DICT["zh-CN"][key] !== undefined ? DICT["zh-CN"][key] : key);
  if(params) Object.keys(params).forEach(function(k){
    s = String(s).split("{"+k+"}").join(params[k]);
  });
  return s;
}
function renderLangMenu(){
  var m = document.getElementById("langMenu");
  if(!m) return;
  var cur = getLang();
  m.innerHTML = "";
  LANGS.forEach(function(L){
    var b = document.createElement("button");
    b.textContent = (L.code === cur ? "✓ " : "") + L.label;
    b.onclick = function(){ setLang(L.code); toggleLangMenu(false); };
    m.appendChild(b);
  });
}
function toggleLangMenu(force){
  var m = document.getElementById("langMenu");
  if(!m) return;
  var showIt = (typeof force === "boolean") ? force : m.classList.contains("hidden");
  m.classList.toggle("hidden", !showIt);
}
var changeHandlers = [];
function onChange(fn){ changeHandlers.push(fn); }
function applyI18n(){
  document.querySelectorAll("[data-i18n]").forEach(function(el){
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-html]").forEach(function(el){
    el.innerHTML = t(el.getAttribute("data-i18n-html"));
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(function(el){
    el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph")));
  });
  document.querySelectorAll("[data-i18n-aria]").forEach(function(el){
    el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
  });
  document.querySelectorAll("[data-i18n-alt]").forEach(function(el){
    el.setAttribute("alt", t(el.getAttribute("data-i18n-alt")));
  });
  document.querySelectorAll("[data-i18n-title]").forEach(function(el){
    document.title = t(el.getAttribute("data-i18n-title"));
  });
  try{ document.documentElement.lang = getLang(); }catch(e){}
  renderLangMenu();
}
function setLang(code){
  if(!DICT[code]) return;
  try{ localStorage.setItem("blog-lang", code); }catch(e){}
  applyI18n();
  changeHandlers.forEach(function(fn){ try{ fn(code); }catch(e){} });
}
window.I18N = { t: t, getLang: getLang, setLang: setLang, applyI18n: applyI18n,
  toggleLangMenu: toggleLangMenu, onChange: onChange, LANGS: LANGS };
window.t = t;
document.addEventListener("DOMContentLoaded", function(){
  applyI18n();
  var btn = document.getElementById("langBtn");
  if(btn) btn.addEventListener("click", function(e){ e.stopPropagation(); if(window.toggleUserMenu) toggleUserMenu(false); toggleLangMenu(); });
  document.addEventListener("click", function(){ toggleLangMenu(false); });
});
})();
