(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function normalize(value) {
        return (value || "").toString().trim().toLowerCase();
    }

    function initNavigation() {
        var toggle = document.querySelector(".nav-toggle");
        var menu = document.querySelector(".mobile-menu");
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener("click", function () {
            var opened = toggle.classList.toggle("is-open");
            menu.classList.toggle("is-open", opened);
            toggle.setAttribute("aria-expanded", opened ? "true" : "false");
        });
        menu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                toggle.classList.remove("is-open");
                menu.classList.remove("is-open");
                toggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    function initSearchAndFilters() {
        var input = document.querySelector("[data-search-input]");
        var cards = Array.prototype.slice.call(document.querySelectorAll(".search-scope .movie-card"));
        var empty = document.querySelector("[data-search-empty]");
        var chips = Array.prototype.slice.call(document.querySelectorAll("[data-filter-chip]"));
        if (!cards.length) {
            return;
        }
        var currentFilter = "all";
        function apply() {
            var keyword = normalize(input ? input.value : "");
            var visibleCount = 0;
            cards.forEach(function (card) {
                var searchable = normalize([
                    card.dataset.title,
                    card.dataset.genre,
                    card.dataset.tags,
                    card.dataset.region,
                    card.dataset.type,
                    card.dataset.year
                ].join(" "));
                var typeValue = normalize(card.dataset.type);
                var passKeyword = !keyword || searchable.indexOf(keyword) !== -1;
                var passFilter = currentFilter === "all" || typeValue.indexOf(normalize(currentFilter)) !== -1;
                var visible = passKeyword && passFilter;
                card.style.display = visible ? "" : "none";
                if (visible) {
                    visibleCount += 1;
                }
            });
            if (empty) {
                empty.classList.toggle("is-visible", visibleCount === 0);
            }
        }
        if (input) {
            input.addEventListener("input", apply);
        }
        chips.forEach(function (chip) {
            chip.addEventListener("click", function () {
                chips.forEach(function (item) {
                    item.classList.remove("is-active");
                });
                chip.classList.add("is-active");
                currentFilter = chip.getAttribute("data-filter-chip") || "all";
                apply();
            });
        });
        apply();
    }

    window.startMoviePlayer = function (streamUrl) {
        var video = document.getElementById("video-player");
        var overlay = document.querySelector("[data-player-overlay]");
        if (!video || !streamUrl) {
            return;
        }
        var loaded = false;
        var hlsInstance = null;
        function attachStream() {
            if (loaded) {
                return;
            }
            loaded = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
            video.setAttribute("controls", "controls");
        }
        function play() {
            attachStream();
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
            var promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {});
            }
        }
        if (overlay) {
            overlay.addEventListener("click", play);
        }
        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            }
        });
        window.addEventListener("beforeunload", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    };

    ready(function () {
        initNavigation();
        initSearchAndFilters();
    });
})();
