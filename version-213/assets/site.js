const ready = (callback) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
};

const normalize = (value) => (value || "").toString().trim().toLowerCase();

const setActive = (items, activeItem) => {
  items.forEach((item) => item.classList.toggle("is-active", item === activeItem));
};

const setupMenu = () => {
  const button = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-mobile-nav]");
  if (!button || !menu) {
    return;
  }
  button.addEventListener("click", () => {
    menu.classList.toggle("is-open");
  });
};

const applySearch = (zone) => {
  const input = zone.querySelector("[data-search-input]");
  const cards = Array.from(zone.querySelectorAll("[data-card]"));
  const empty = zone.querySelector("[data-empty]");
  const query = normalize(input ? input.value : "");
  const filter = normalize(zone.dataset.filter || "all");
  let visible = 0;

  cards.forEach((card) => {
    const text = normalize(`${card.textContent} ${card.dataset.meta || ""}`);
    const matchesQuery = !query || text.includes(query);
    const matchesFilter = filter === "all" || text.includes(filter);
    const show = matchesQuery && matchesFilter;
    card.classList.toggle("is-hidden", !show);
    if (show) {
      visible += 1;
    }
  });

  if (empty) {
    empty.classList.toggle("is-visible", visible === 0);
  }
};

const setupSearch = () => {
  document.querySelectorAll(".search-zone").forEach((zone) => {
    zone.dataset.filter = zone.dataset.filter || "all";
    const input = zone.querySelector("[data-search-input]");
    if (input) {
      input.addEventListener("input", () => applySearch(zone));
    }

    const buttons = Array.from(zone.querySelectorAll("[data-filter]"));
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        zone.dataset.filter = button.dataset.filter || "all";
        setActive(buttons, button);
        applySearch(zone);
      });
    });
  });
};

const setupHero = () => {
  const hero = document.querySelector("[data-hero]");
  if (!hero) {
    return;
  }

  const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
  const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
  if (!slides.length) {
    return;
  }

  let index = 0;
  const show = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === index);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === index);
    });
  };

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => show(dotIndex));
  });

  show(0);

  if (slides.length > 1) {
    window.setInterval(() => show(index + 1), 5200);
  }
};

const startPlayer = async (panel) => {
  const video = panel.querySelector("video");
  const stream = panel.getAttribute("data-stream");
  if (!video || !stream || panel.dataset.started === "1") {
    return;
  }

  panel.dataset.started = "1";
  panel.classList.add("is-active");
  video.controls = true;
  video.playsInline = true;

  try {
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = stream;
      await video.play();
      return;
    }

    const module = await import("./hls.js");
    const Hls = module.H;
    if (Hls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
      return;
    }

    video.src = stream;
    await video.play();
  } catch (error) {
    video.src = stream;
    video.play().catch(() => {});
  }
};

const setupPlayers = () => {
  document.querySelectorAll(".watch-panel[data-stream]").forEach((panel) => {
    const trigger = panel.querySelector("[data-play]");
    if (trigger) {
      trigger.addEventListener("click", () => startPlayer(panel));
    }
    panel.addEventListener("click", (event) => {
      if (event.target.tagName.toLowerCase() !== "video") {
        startPlayer(panel);
      }
    });
  });
};

ready(() => {
  setupMenu();
  setupSearch();
  setupHero();
  setupPlayers();
});
