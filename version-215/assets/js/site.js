(() => {
    const menuButton = document.querySelector('[data-menu-toggle]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('is-open');
        });
    }

    const carousel = document.querySelector('[data-hero-carousel]');

    if (carousel) {
        const slides = Array.from(carousel.querySelectorAll('[data-hero-slide]'));
        const dots = Array.from(carousel.querySelectorAll('[data-hero-dot]'));
        let currentIndex = 0;

        const showSlide = (nextIndex) => {
            currentIndex = (nextIndex + slides.length) % slides.length;

            slides.forEach((slide, index) => {
                slide.classList.toggle('is-active', index === currentIndex);
            });

            dots.forEach((dot, index) => {
                dot.classList.toggle('is-active', index === currentIndex);
            });
        };

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showSlide(index));
        });

        if (slides.length > 1) {
            window.setInterval(() => showSlide(currentIndex + 1), 5200);
        }
    }

    const getNormalizedText = (value) => String(value || '').trim().toLowerCase();

    const initializeFilters = (root) => {
        const textInput = root.querySelector('[data-text-filter]');
        const typeSelect = root.querySelector('[data-type-filter]');
        const yearSelect = root.querySelector('[data-year-filter]');
        const section = root.closest('section') || document;
        const cards = Array.from(section.querySelectorAll('.searchable-card'));
        const counter = root.querySelector('[data-result-count]');
        const emptyState = section.querySelector('[data-empty-state]');

        const params = new URLSearchParams(window.location.search);
        const queryFromUrl = params.get('q');

        if (queryFromUrl && textInput) {
            textInput.value = queryFromUrl;
        }

        const applyFilter = () => {
            const query = getNormalizedText(textInput ? textInput.value : '');
            const selectedType = getNormalizedText(typeSelect ? typeSelect.value : '');
            const selectedYear = getNormalizedText(yearSelect ? yearSelect.value : '');
            let visibleCount = 0;

            cards.forEach((card) => {
                const keywords = getNormalizedText(`${card.dataset.title} ${card.dataset.type} ${card.dataset.year} ${card.dataset.keywords}`);
                const cardType = getNormalizedText(card.dataset.type);
                const cardYear = getNormalizedText(card.dataset.year);
                const matchesText = !query || keywords.includes(query);
                const matchesType = !selectedType || cardType === selectedType;
                const matchesYear = !selectedYear || cardYear === selectedYear;
                const isVisible = matchesText && matchesType && matchesYear;

                card.classList.toggle('is-hidden-by-filter', !isVisible);

                if (isVisible) {
                    visibleCount += 1;
                }
            });

            if (counter) {
                counter.textContent = String(visibleCount);
            }

            if (emptyState) {
                emptyState.hidden = visibleCount !== 0;
            }
        };

        [textInput, typeSelect, yearSelect].forEach((control) => {
            if (!control) {
                return;
            }

            control.addEventListener('input', applyFilter);
            control.addEventListener('change', applyFilter);
        });

        applyFilter();
    };

    document.querySelectorAll('[data-filter-root]').forEach(initializeFilters);
})();
