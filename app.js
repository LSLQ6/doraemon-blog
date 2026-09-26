/* ============================================================
 * 哆啦A梦的博客 —— 文章数据
 * ------------------------------------------------------------
 * 写新文章：在下面的 POSTS 数组最前面加一段，格式照抄：
 *
 *   {
 *     title: "文章标题",
 *     category: "分类名",
 *     date: "2026-09-27",
 *     excerpt: "一句话摘要，会显示在首页列表里。",
 *     body: `<p>第一段正文……</p><p>第二段正文……</p>`
 *   },
 *
 * body 里用 <p>…</p> 包裹每一段，保存后刷新页面即可。
 * ============================================================ */

const POSTS = [
  {
    title: "为什么我们需要保留一点“无用”的时间",
    category: "思考",
    date: "2026-09-20",
    excerpt: "效率至上的时代里，发呆、散步、什么都不做，反而成了一种奢侈。",
    demo: true,
    body: `<p>这是一篇示例文章，记得换成你自己的内容。</p><p>我们习惯了把每一分钟都填满：通勤时听播客，排队时刷手机，连睡前都要再看两页书。但大脑和肌肉一样，也需要放松的时间来恢复和整理。</p><p>试着每天留出二十分钟，什么都不做。散步、发呆、看云——你会发现，很多想不通的问题，会在这些“无用”的时间里自己找到答案。</p>`
  },
  {
    title: "我的书桌进化史：从堆满杂物到极简",
    category: "生活",
    date: "2026-09-12",
    excerpt: "一张干净的书桌，真的能让人更专注吗？我花了三个月验证这件事。",
    demo: true,
    body: `<p>这是一篇示例文章，记得换成你自己的内容。</p><p>三个月前，我的书桌上堆着：没喝完的咖啡杯、三本只看了开头的书、一堆充电线，以及一张写满待办事项却从没完成过的便利贴。</p><p>后来我做了三件事：只留每天真正会用的东西上桌，给每样物品固定一个位置，每周五下班前花十分钟复位。现在坐下来工作时，心里确实安静了不少。</p>`
  },
  {
    title: "重读《小王子》：大人世界的温柔提醒",
    category: "阅读",
    date: "2026-09-05",
    excerpt: "小时候读的是童话，长大后读的是自己。",
    demo: true,
    body: `<p>这是一篇示例文章，记得换成你自己的内容。</p><p>小时候读《小王子》，觉得狐狸的话有点啰嗦；长大后再读，才发现“驯养”两个字里藏着所有关系的真相——花时间、花心思，才让一个人、一件事变得独一无二。</p><p>有些书值得每隔几年重读一次，因为变的不是书，是读书的人。</p>`
  }
];

/* ---------- 以下为页面逻辑，一般不用改 ---------- */

const app = document.getElementById("app");
const views = {
  home: document.getElementById("view-home"),
  post: document.getElementById("view-post"),
  about: document.getElementById("view-about")
};
let activeCat = "全部";
let keyword = "";

function show(name) {
  Object.entries(views).forEach(([k, el]) => el.classList.toggle("hidden", k !== name));
  window.scrollTo(0, 0);
}

function categories() {
  return ["全部", ...new Set(POSTS.map(p => p.category))];
}

function renderCats() {
  const box = document.getElementById("catFilters");
  box.innerHTML = "";
  categories().forEach(c => {
    const b = document.createElement("button");
    b.className = "cat-btn" + (c === activeCat ? " active" : "");
    b.textContent = c;
    b.onclick = () => { activeCat = c; renderCats(); renderList(); };
    box.appendChild(b);
  });
}

function filtered() {
  return POSTS.filter(p => {
    const okCat = activeCat === "全部" || p.category === activeCat;
    const okKey = !keyword ||
      (p.title + p.excerpt + p.body).toLowerCase().includes(keyword.toLowerCase());
    return okCat && okKey;
  });
}

function renderList() {
  const list = document.getElementById("postList");
  const items = filtered();
  document.getElementById("emptyMsg").classList.toggle("hidden", items.length > 0);
  list.innerHTML = "";
  items.forEach((p, i) => {
    const a = document.createElement("a");
    a.className = "post-card";
    a.innerHTML = `
      <p class="post-card-cat">${p.demo ? "示例 · " : ""}${p.category}</p>
      <h3 class="post-card-title">${p.title}</h3>
      <p class="post-card-excerpt">${p.excerpt}</p>
      <p class="post-card-date">${p.date}</p>`;
    a.onclick = e => { e.preventDefault(); openPost(POSTS.indexOf(p)); };
    list.appendChild(a);
  });
}

function openPost(idx) {
  const p = POSTS[idx];
  document.getElementById("postMeta").textContent =
    `${p.demo ? "示例 · " : ""}${p.category} · ${p.date}`;
  document.getElementById("postTitle").textContent = p.title;
  document.getElementById("postBody").innerHTML =
    (p.demo ? `<p class="demo-note">这是示例文章，发布前记得替换成你自己的内容。</p>` : "") + p.body;
  show("post");
}

document.querySelectorAll("[data-nav]").forEach(el => {
  el.addEventListener("click", e => {
    e.preventDefault();
    show(el.dataset.nav);
  });
});

const searchBar = document.getElementById("searchBar");
const searchInput = document.getElementById("searchInput");
document.getElementById("searchToggle").onclick = () => {
  searchBar.classList.toggle("hidden");
  if (!searchBar.classList.contains("hidden")) searchInput.focus();
};
searchInput.oninput = () => { keyword = searchInput.value.trim(); renderList(); };

const themeBtn = document.getElementById("themeToggle");
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  themeBtn.textContent = t === "dark" ? "☀️" : "🌙";
  try { localStorage.setItem("blog-theme", t); } catch (e) {}
}
let saved = "light";
try { saved = localStorage.getItem("blog-theme") || "light"; } catch (e) {}
setTheme(saved);
themeBtn.onclick = () =>
  setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");

document.getElementById("year").textContent = new Date().getFullYear();
renderCats();
renderList();
show("home");
