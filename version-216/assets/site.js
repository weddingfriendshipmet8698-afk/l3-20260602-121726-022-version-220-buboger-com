(function () {
    var menuButton = document.querySelector('.menu-toggle');
    var mobilePanel = document.querySelector('.mobile-panel');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            var isOpen = menuButton.getAttribute('aria-expanded') === 'true';
            menuButton.setAttribute('aria-expanded', String(!isOpen));
            mobilePanel.hidden = isOpen;
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dots button'));
        var index = 0;

        function showSlide(next) {
            index = next % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === index);
            });
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                showSlide(i);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(index + 1);
            }, 5200);
        }
    }

    var filterForm = document.querySelector('[data-filter-form]');
    var filterInput = document.querySelector('[data-filter-input]');
    var filterScope = document.querySelector('[data-filter-scope]');

    if (filterInput && filterScope) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';

        if (query) {
            filterInput.value = query;
        }

        var cards = Array.prototype.slice.call(filterScope.querySelectorAll('.movie-card'));

        function applyFilter() {
            var keyword = filterInput.value.trim().toLowerCase();
            cards.forEach(function (card) {
                var source = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-tags'),
                    card.textContent
                ].join(' ').toLowerCase();
                card.classList.toggle('is-filtered-out', keyword && source.indexOf(keyword) === -1);
            });
        }

        filterInput.addEventListener('input', applyFilter);

        if (filterForm) {
            filterForm.addEventListener('submit', function (event) {
                event.preventDefault();
                applyFilter();
            });
        }

        applyFilter();
    }

    var playButtons = Array.prototype.slice.call(document.querySelectorAll('[data-play-target]'));

    playButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            var id = button.getAttribute('data-play-target');
            var video = document.getElementById(id);

            if (!video) {
                return;
            }

            var stream = video.getAttribute('data-stream');

            function start() {
                button.classList.add('is-hidden');
                var promise = video.play();

                if (promise && typeof promise.catch === 'function') {
                    promise.catch(function () {
                        button.classList.remove('is-hidden');
                    });
                }
            }

            if (stream && window.Hls && window.Hls.isSupported()) {
                if (!video.dataset.ready) {
                    var hls = new window.Hls();
                    hls.loadSource(stream);
                    hls.attachMedia(video);
                    video.dataset.ready = '1';
                    hls.on(window.Hls.Events.MANIFEST_PARSED, start);
                } else {
                    start();
                }
            } else if (stream && video.canPlayType('application/vnd.apple.mpegurl')) {
                if (!video.src) {
                    video.src = stream;
                }
                start();
            } else if (stream) {
                if (!video.src) {
                    video.src = stream;
                }
                start();
            }
        });
    });
}());
