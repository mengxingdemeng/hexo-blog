/* eslint-disable no-undef */
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ----- Stars background (canvas) -----
  const canvas = $("#stars");
  const ctx = canvas?.getContext?.("2d");
  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  const stars = [];
  let rafId = 0;

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { innerWidth: w, innerHeight: h } = window;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createStars() {
    if (!canvas || !ctx) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const count = Math.floor((w * h) / 28000); // scales with area
    stars.length = 0;
    for (let i = 0; i < count; i++) {
      const z = Math.random(); // pseudo-depth
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + z * 1.2,
        a: 0.1 + z * 0.6,
        vx: (0.05 + z * 0.18) * (Math.random() > 0.5 ? 1 : -1),
        vy: 0.15 + z * 0.35
      });
    }
  }

  function draw() {
    if (!canvas || !ctx) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    for (const s of stars) {
      s.x += s.vx;
      s.y += s.vy * (prefersReduced ? 0.35 : 1);
      if (s.y > h + 10) {
        s.y = -10;
        s.x = Math.random() * w;
      }
      if (s.x < -10) s.x = w + 10;
      if (s.x > w + 10) s.x = -10;

      ctx.beginPath();
      ctx.fillStyle = `rgba(210, 245, 255, ${s.a})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();

      // A tiny glow
      ctx.beginPath();
      ctx.fillStyle = `rgba(102, 230, 255, ${s.a * 0.18})`;
      ctx.arc(s.x, s.y, s.r * 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    rafId = window.requestAnimationFrame(draw);
  }

  function startStars() {
    if (!canvas || !ctx) return;
    resizeCanvas();
    createStars();
    if (prefersReduced) {
      // Draw once; keep it lightweight for reduced motion.
      draw();
      window.cancelAnimationFrame(rafId);
      return;
    }
    rafId = window.requestAnimationFrame(draw);
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
    createStars();
  });

  startStars();

  // ----- Nav active + smooth scroll -----
  const navLinks = $$(".nav-link");
  const sectionIds = navLinks.map((a) => a.dataset.section).filter(Boolean);
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

  function setActiveById(id) {
    navLinks.forEach((a) => {
      a.classList.toggle("active", a.dataset.section === id);
    });
  }

  const io = new IntersectionObserver(
    (entries) => {
      // pick the entry with largest intersection ratio
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
      if (visible?.target?.id) setActiveById(visible.target.id);
    },
    { root: null, threshold: [0.2, 0.35, 0.5, 0.65], rootMargin: "-10% 0px -70% 0px" }
  );
  sections.forEach((s) => io.observe(s));
  setActiveById("home");

  navLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href") || "";
      if (!href.startsWith("#")) return;
      e.preventDefault();
      const target = $(href);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveById(target?.id);

      // close mobile menu if open
      const nav = $(".nav");
      nav?.classList.remove("open");
      const btn = $(".nav-toggle");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  });

  // ----- Mobile nav toggle -----
  const navToggle = $(".nav-toggle");
  navToggle?.addEventListener("click", () => {
    const nav = $(".nav");
    if (!nav) return;
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // ----- Scroll progress bar -----
  const scrollBar = $(".scroll-bar");
  function updateProgress() {
    if (!scrollBar) return;
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    const p = Math.min(1, Math.max(0, window.scrollY / max));
    scrollBar.style.width = `${p * 100}%`;
  }
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });

  // ----- Back to top button -----
  const toTopBtn = $("#toTopBtn");
  const onTop = () => {
    if (!toTopBtn) return;
    toTopBtn.classList.toggle("show", window.scrollY > 600);
  };
  onTop();
  window.addEventListener("scroll", onTop, { passive: true });
  toTopBtn?.addEventListener("click", () => {
    document.documentElement.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // ----- Copy email -----
  const email = "weitinting@demo.com";
  const emailValue = $("#emailValue");
  if (emailValue) emailValue.textContent = email;

  function copyText(text) {
    if (!text) return Promise.resolve(false);
    if (navigator.clipboard?.writeText) {
      return navigator.clipboard
        .writeText(text)
        .then(() => true)
        .catch(() => false);
    }
    // Fallback: best-effort
    return new Promise((resolve) => {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        ta.style.top = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        resolve(ok);
      } catch {
        resolve(false);
      }
    });
  }

  async function onCopy(btn) {
    if (!btn) return;
    const formHint = $("#formHint");
    const ok = await copyText(email);
    if (formHint) {
      formHint.textContent = ok ? "已复制邮箱到剪贴板。" : "复制失败，请手动复制邮箱。";
      window.setTimeout(() => {
        formHint.textContent = "";
      }, 2200);
    }
    btn.textContent = ok ? "已复制" : "复制邮箱";
    window.setTimeout(() => {
      btn.textContent = "复制邮箱";
    }, 1600);
  }

  $("#copyEmailBtn")?.addEventListener("click", (e) => onCopy(e.currentTarget));
  $("#copyEmailBtn2")?.addEventListener("click", (e) => onCopy(e.currentTarget));

  // ----- Contact form demo -----
  const contactForm = $("#contactForm");
  const formHint = $("#formHint");
  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (formHint) {
      formHint.textContent = "已在本地模拟提交（无后端）。你可以接入自己的接口。";
      window.setTimeout(() => (formHint.textContent = ""), 2600);
    }
    contactForm.reset();
  });

  // ----- Footer year -----
  $("#year").textContent = String(new Date().getFullYear());
})();

