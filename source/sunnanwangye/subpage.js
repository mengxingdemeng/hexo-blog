(function () {
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const byId = (id) => document.getElementById(id);

  function mountUploader(root) {
    const input = root.querySelector(".uploader-input");
    const drop = root.querySelector(".uploader-drop");
    const gallery = root.querySelector(".gallery");
    const btn = root.querySelector(".btn-primary");
    const state = { files: [] };

    function render() {
      gallery.innerHTML = "";
      state.files.forEach((f, idx) => {
        const url = URL.createObjectURL(f);
        const item = document.createElement("div");
        item.className = "thumb";
        item.innerHTML = `<img alt="预览" src="${url}"><button class="del" title="删除">×</button>`;
        item.querySelector(".del").addEventListener("click", () => {
          state.files.splice(idx, 1);
          URL.revokeObjectURL(url);
          render();
        });
        gallery.appendChild(item);
      });
      if (state.files.length === 0) {
        const ph = document.createElement("div");
        ph.className = "thumb";
        ph.innerHTML = `<div class="cap">暂无图片，点击上方“选择图片”或拖放到此区域</div>`;
        gallery.appendChild(ph);
      }
    }

    function onFiles(files) {
      const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
      state.files.push(...arr);
      render();
    }

    drop.addEventListener("dragover", (e) => {
      e.preventDefault();
      drop.classList.add("is-over");
    });
    drop.addEventListener("dragleave", () => drop.classList.remove("is-over"));
    drop.addEventListener("drop", (e) => {
      e.preventDefault();
      drop.classList.remove("is-over");
      onFiles(e.dataTransfer.files);
    });
    btn?.addEventListener("click", () => input?.click());
    input?.addEventListener("change", () => onFiles(input.files));
    render();
  }

  $$(".uploader").forEach(mountUploader);

  // 封面页 -> 轮播页切换
  $$(".feature-strip").forEach((wrap) => {
    const cover = wrap.querySelector(".feature-cover");
    const carouselView = wrap.querySelector(".feature-carousel-view");
    const enterBtn = wrap.querySelector(".js-enter-carousel");
    const backBtn = wrap.querySelector(".js-back-cover");
    const showCarousel = () => {
      if (cover) cover.hidden = true;
      if (carouselView) carouselView.hidden = false;
    };
    const showCover = () => {
      if (cover) cover.hidden = false;
      if (carouselView) carouselView.hidden = true;
    };
    enterBtn?.addEventListener("click", showCarousel);
    backBtn?.addEventListener("click", showCover);
  });

  // 双图分屏轮播（每次翻页显示两张）
  $$(".split-carousel").forEach((root) => {
    const slides = $$(".split-slide", root);
    if (!slides.length) return;
    let idx = 0;
    const show = (i) => {
      idx = (i + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle("is-active", k === idx));
    };
    const section = root.closest(".feature-strip");
    const nextBtn = section?.querySelector(".js-next-page");
    nextBtn?.addEventListener("click", () => show(idx + 1));
    show(0);
  });

  $$(".split-carousel-full").forEach((root) => {
    const slides = $$(".split-slide", root);
    if (!slides.length) return;
    let idx = 0;
    const show = (i) => {
      idx = (i + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle("is-active", k === idx));
    };
    const nextBtn = root.querySelector(".js-next-page");
    nextBtn?.addEventListener("click", () => show(idx + 1));
    show(0);
  });

  // dance 页：三视频联动（一个播放，其他同步开始与结束）
  const danceVideos = $$(".dance-video");
  if (danceVideos.length >= 2) {
    let syncing = false;
    let master = null;

    // 默认全部静音，等用户点某个视频播放时仅该视频出声
    danceVideos.forEach((v) => {
      v.muted = true;
      v.volume = 1;
    });

    const syncAllToMaster = () => {
      if (!master || syncing) return;
      syncing = true;
      danceVideos.forEach((v) => {
        if (v === master) return;
        // 持续微调时间，避免跑偏
        if (Math.abs(v.currentTime - master.currentTime) > 0.18) {
          v.currentTime = master.currentTime;
        }
      });
      syncing = false;
    };

    danceVideos.forEach((v) => {
      v.addEventListener("play", () => {
        if (syncing) return;
        master = v;
        syncing = true;
        danceVideos.forEach((other) => {
          const isMaster = other === v;
          other.muted = !isMaster; // 仅主视频有声音
          if (!isMaster) {
            other.currentTime = v.currentTime;
            other.playbackRate = v.playbackRate;
            other.play().catch(() => {});
          }
        });
        v.muted = false;
        syncing = false;
      });

      v.addEventListener("pause", () => {
        if (syncing || master !== v) return;
        syncing = true;
        danceVideos.forEach((other) => {
          if (other !== v) other.pause();
        });
        syncing = false;
      });

      v.addEventListener("seeked", () => {
        if (master !== v || syncing) return;
        syncing = true;
        danceVideos.forEach((other) => {
          if (other !== v) other.currentTime = v.currentTime;
        });
        syncing = false;
      });

      v.addEventListener("ratechange", () => {
        if (master !== v || syncing) return;
        syncing = true;
        danceVideos.forEach((other) => {
          if (other !== v) other.playbackRate = v.playbackRate;
        });
        syncing = false;
      });

      v.addEventListener("timeupdate", () => {
        if (master === v) syncAllToMaster();
      });

      v.addEventListener("ended", () => {
        if (master !== v || syncing) return;
        syncing = true;
        danceVideos.forEach((other) => {
          if (other !== v) {
            other.pause();
            other.currentTime = other.duration || 0;
          }
        });
        syncing = false;
      });
    });
  }

  // 美女撒娇页：视频结束后切换为图片预留框
  $$(".cute-stage").forEach((stage) => {
    const videos = $$(".cute-video", stage);
    const videoGroup = stage.querySelector(".cute-video-group");
    const placeholder = stage.querySelector(".cute-grid-placeholder");
    if (!videos.length || !videoGroup || !placeholder) return;

    // 三分屏：点击任意一个开始，其余同步，且只有一个有声
    let master = null;
    let syncing = false;
    videos.forEach((v) => {
      v.muted = true;
      v.addEventListener("play", () => {
        if (syncing) return;
        master = v;
        syncing = true;
        videos.forEach((other) => {
          const isMaster = other === v;
          other.muted = !isMaster;
          if (!isMaster) {
            other.currentTime = v.currentTime;
            other.play().catch(() => {});
          }
        });
        syncing = false;
      });
      v.addEventListener("ended", () => {
        if (master && master !== v) return;
        videoGroup.hidden = true;
        videos.forEach((other) => {
          other.pause();
        });
        placeholder.hidden = false;
      });
    });
  });

  // footer years
  const ys = $$("#y1, #y2, #y3");
  ys.forEach((el) => (el.textContent = String(new Date().getFullYear())));

})();

