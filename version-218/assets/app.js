document.addEventListener('DOMContentLoaded', function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var prev = document.querySelector('[data-hero-prev]');
  var next = document.querySelector('[data-hero-next]');
  var slideIndex = 0;
  var slideTimer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    slideIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, current) {
      slide.classList.toggle('is-active', current === slideIndex);
    });

    dots.forEach(function (dot, current) {
      dot.classList.toggle('is-active', current === slideIndex);
    });
  }

  function startSlider() {
    if (slideTimer) {
      window.clearInterval(slideTimer);
    }

    if (slides.length > 1) {
      slideTimer = window.setInterval(function () {
        showSlide(slideIndex + 1);
      }, 5200);
    }
  }

  if (slides.length) {
    showSlide(0);
    startSlider();
  }

  if (prev) {
    prev.addEventListener('click', function () {
      showSlide(slideIndex - 1);
      startSlider();
    });
  }

  if (next) {
    next.addEventListener('click', function () {
      showSlide(slideIndex + 1);
      startSlider();
    });
  }

  dots.forEach(function (dot, current) {
    dot.addEventListener('click', function () {
      showSlide(current);
      startSlider();
    });
  });

  var filterInput = document.querySelector('[data-filter-input]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));

  if (filterInput && cards.length) {
    filterInput.addEventListener('input', function () {
      var keyword = filterInput.value.trim().toLowerCase();

      cards.forEach(function (card) {
        var text = card.getAttribute('data-search') || card.textContent.toLowerCase();
        card.style.display = text.indexOf(keyword) === -1 ? 'none' : '';
      });
    });
  }

  var searchForm = document.querySelector('[data-search-form]');
  var searchInput = document.querySelector('[data-search-query]');

  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var value = searchInput.value.trim();
      var target = './search.html';

      if (value) {
        target += '?q=' + encodeURIComponent(value);
      }

      window.location.href = target;
    });
  }

  var resultBox = document.querySelector('[data-search-results]');
  var searchPageInput = document.querySelector('[data-search-page-input]');

  function resultTemplate(item) {
    return [
      '<article class="movie-card search-item">',
      '<a class="movie-cover" href="' + item.url + '">',
      '<img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
      '<span class="play-badge">▶</span>',
      '<span class="year-badge">' + escapeHtml(item.year || '精选') + '</span>',
      '</a>',
      '<div class="movie-card-body">',
      '<a class="movie-title" href="' + item.url + '">' + escapeHtml(item.title) + '</a>',
      '<p class="movie-desc">' + escapeHtml(item.oneLine) + '</p>',
      '<div class="movie-meta">',
      '<span>' + escapeHtml(item.region) + '</span>',
      '<span>' + escapeHtml(item.type) + '</span>',
      '<span>' + escapeHtml(item.genre) + '</span>',
      '</div>',
      '</div>',
      '</article>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderSearch() {
    if (!resultBox || !window.SEARCH_INDEX) {
      return;
    }

    var keyword = searchPageInput ? searchPageInput.value.trim().toLowerCase() : '';
    var items = window.SEARCH_INDEX;

    if (keyword) {
      items = items.filter(function (item) {
        return item.searchText.indexOf(keyword) !== -1;
      });
    } else {
      items = items.slice(0, 36);
    }

    if (!items.length) {
      resultBox.innerHTML = '<div class="empty-state">未找到匹配内容</div>';
      return;
    }

    resultBox.innerHTML = items.slice(0, 120).map(resultTemplate).join('');
  }

  if (resultBox && searchPageInput) {
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';

    if (initial) {
      searchPageInput.value = initial;
    }

    searchPageInput.addEventListener('input', renderSearch);
    renderSearch();
  }
});
