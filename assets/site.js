document.addEventListener("DOMContentLoaded", function () {
  var menuButton = document.querySelector("[data-menu-toggle]");
  var nav = document.querySelector("[data-site-nav]");
  if (menuButton && nav) {
    menuButton.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
  var prev = document.querySelector("[data-hero-prev]");
  var next = document.querySelector("[data-hero-next]");
  var index = 0;

  function showSlide(nextIndex) {
    if (!slides.length) {
      return;
    }
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle("is-active", i === index);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle("is-active", i === index);
    });
  }

  if (slides.length) {
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        showSlide(i);
      });
    });
    if (prev) {
      prev.addEventListener("click", function () {
        showSlide(index - 1);
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        showSlide(index + 1);
      });
    }
    window.setInterval(function () {
      showSlide(index + 1);
    }, 5200);
  }

  var input = document.querySelector("[data-search-input]");
  var yearSelect = document.querySelector("[data-filter-year]");
  var regionSelect = document.querySelector("[data-filter-region]");
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function applyFilters() {
    var keyword = normalize(input ? input.value : "");
    var year = normalize(yearSelect ? yearSelect.value : "");
    var region = normalize(regionSelect ? regionSelect.value : "");
    cards.forEach(function (card) {
      var text = normalize([
        card.getAttribute("data-title"),
        card.getAttribute("data-region"),
        card.getAttribute("data-year"),
        card.getAttribute("data-genre"),
        card.getAttribute("data-tags")
      ].join(" "));
      var cardYear = normalize(card.getAttribute("data-year"));
      var cardRegion = normalize(card.getAttribute("data-region"));
      var ok = true;
      if (keyword && text.indexOf(keyword) === -1) {
        ok = false;
      }
      if (year && cardYear !== year) {
        ok = false;
      }
      if (region && cardRegion !== region) {
        ok = false;
      }
      card.classList.toggle("is-hidden", !ok);
    });
  }

  [input, yearSelect, regionSelect].forEach(function (control) {
    if (control) {
      control.addEventListener("input", applyFilters);
      control.addEventListener("change", applyFilters);
    }
  });
});
