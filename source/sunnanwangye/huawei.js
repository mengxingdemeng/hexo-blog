(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // 年份
  const y = $("#year_hw");
  if (y) y.textContent = String(new Date().getFullYear());

  // 移动端导航
  const navToggle = $(".hw-nav-toggle");
  const navList = $(".hw-nav-list");
  navToggle?.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // 轮播
  const carousel = $(".hw-carousel");
  if (carousel) {
    const track = $(".hw-carousel-track", carousel);
    const slides = $$(".hw-slide", track);
    const dotsWrap = $(".hw-carousel-dots", carousel);
    let index = 0;
    const go = (i) => {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle("is-active", k === index));
      if (dotsWrap) {
        const dots = $$(".is-dot", dotsWrap);
        dots.forEach((d, k) => d.classList.toggle("is-active", k === index));
      }
    };
    // dots
    if (dotsWrap) {
      slides.forEach((_, k) => {
        const b = document.createElement("button");
        b.className = "is-dot" + (k === 0 ? " is-active" : "");
        b.type = "button";
        b.setAttribute("aria-label", "切换到第 " + (k + 1) + " 张");
        b.addEventListener("click", () => go(k));
        dotsWrap.appendChild(b);
      });
    }
    // autoplay
    let timer = 0;
    const autoplay = carousel.dataset.autoplay === "true";
    const start = () => (timer = window.setInterval(() => go(index + 1), 4800));
    const stop = () => window.clearInterval(timer);
    if (autoplay && slides.length > 1) start();
    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", () => {
      if (autoplay) start();
    });
  }

  // Tabs
  const tabsRoot = $$("[data-tabs]");
  for (const root of tabsRoot) {
    const tabs = $$(".hw-tab", root);
    const panels = $$(".hw-tab-panel", root);
    const setActive = (name) => {
      tabs.forEach((t) => t.classList.toggle("is-active", t.dataset.tab === name));
      panels.forEach((p) => p.classList.toggle("is-active", p.dataset.panel === name));
    };
    tabs.forEach((t) => {
      t.addEventListener("click", () => setActive(t.dataset.tab));
    });
  }
})();

