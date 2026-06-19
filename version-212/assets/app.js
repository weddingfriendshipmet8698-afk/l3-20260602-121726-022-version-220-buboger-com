import { H as Hls } from "./hls.js";

const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function setupMenu() {
  const button = qs(".menu-toggle");
  const menu = qs(".mobile-panel");
  if (!button || !menu) return;
  button.addEventListener("click", () => {
    menu.classList.toggle("is-open");
  });
}

function setupHero() {
  const hero = qs(".hero-carousel");
  if (!hero) return;
  const slides = qsa(".hero-slide", hero);
  const dots = qsa(".hero-dot", hero);
  let active = 0;
  const show = index => {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === active));
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === active));
  };
  dots.forEach((dot, index) => dot.addEventListener("click", () => show(index)));
  const prev = qs(".hero-prev", hero);
  const next = qs(".hero-next", hero);
  if (prev) prev.addEventListener("click", () => show(active - 1));
  if (next) next.addEventListener("click", () => show(active + 1));
  show(0);
  window.setInterval(() => show(active + 1), 5600);
}

function setupFilters() {
  const search = qs("[data-search-input]");
  const year = qs("[data-year-filter]");
  const type = qs("[data-type-filter]");
  const empty = qs("[data-empty-state]");
  const cards = qsa(".movie-card[data-search]");
  if (!cards.length) return;
  const apply = () => {
    const keyword = search ? search.value.trim().toLowerCase() : "";
    const yearValue = year ? year.value : "";
    const typeValue = type ? type.value : "";
    let shown = 0;
    cards.forEach(card => {
      const haystack = card.getAttribute("data-search").toLowerCase();
      const cardYear = card.getAttribute("data-year");
      const cardType = card.getAttribute("data-type");
      const passKeyword = !keyword || haystack.includes(keyword);
      const passYear = !yearValue || cardYear === yearValue;
      const passType = !typeValue || cardType === typeValue;
      const visible = passKeyword && passYear && passType;
      card.hidden = !visible;
      if (visible) shown += 1;
    });
    if (empty) empty.hidden = shown !== 0;
  };
  if (search) search.addEventListener("input", apply);
  if (year) year.addEventListener("change", apply);
  if (type) type.addEventListener("change", apply);
  apply();
}

function setupPlayers() {
  qsa(".player-box[data-stream]").forEach(box => {
    const video = qs("video", box);
    const button = qs(".play-overlay", box);
    const stream = box.getAttribute("data-stream");
    if (!video || !button || !stream) return;
    let attached = false;
    const attach = () => {
      if (attached) return;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
      } else if (Hls && Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }
      attached = true;
    };
    const start = () => {
      attach();
      box.classList.add("is-playing");
      video.controls = true;
      video.play().catch(() => {});
    };
    button.addEventListener("click", start);
    video.addEventListener("click", () => {
      if (!attached || video.paused) start();
    });
  });
}

setupMenu();
setupHero();
setupFilters();
setupPlayers();
