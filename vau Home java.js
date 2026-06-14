document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       MOBILE NAVIGATION TRIGGER (HAMBURGER CONSOLE)
       ========================================================================== */
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.getElementById('primary-navigation');

    if (mobileToggle && primaryNav) {
        mobileToggle.addEventListener('click', () => {
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            mobileToggle.setAttribute('aria-expanded', !isExpanded);
            primaryNav.classList.toggle('active');
            
            // Hamburger layout interaction transformation
            mobileToggle.classList.toggle('open');
        });
    }

    /* ==========================================================================
       TOUCH-RESPONSIVE ACCESSIBLE DROPDOWN CONTROLS
       ========================================================================== */
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            // Act only during mobile views or via deliberate click actions
            if (window.innerWidth < 992) {
                e.preventDefault();
                const parentItem = toggle.closest('.dropdown-item');
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                
                // Toggle state
                toggle.setAttribute('aria-expanded', !isExpanded);
                parentItem.classList.toggle('active');
                
                // Close other sibling open structures for UI neatness
                dropdownToggles.forEach(sibling => {
                    if (sibling !== toggle) {
                        sibling.setAttribute('aria-expanded', 'false');
                        sibling.closest('.dropdown-item').classList.remove('active');
                    }
                });
            }
        });
    });

    /* ==========================================================================
       SMOOTH IN-PAGE ANCHOR SCROLLING
       ========================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Clean mobile navigation if overlay was open
                if (primaryNav && primaryNav.classList.contains('active')) {
                    primaryNav.classList.remove('active');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    /* ==========================================================================
       SEARCH FUNCTIONALITY EMULATION ENGINE
       ========================================================================== */
    const searchInput = document.getElementById('global-search');
    const searchButton = document.getElementById('search-submit');

    if (searchInput && searchButton) {
        const executeSearch = () => {
            const query = searchInput.value.trim();
            if (query !== "") {
                alert(`Search Execution: Fetching database results matching "${query}" using restricted Purple/White parameters.`);
            }
        };

        searchButton.addEventListener('click', executeSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                executeSearch();
            }
        });
    }

    /* ==========================================================================
       FILTERABLE FACULTY DIRECTORY MATRIX
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const profileCards = document.querySelectorAll('.profile-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Manage Active Button Typography Class
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            profileCards.forEach(card => {
                const facultyTarget = card.getAttribute('data-faculty');
                if (filterValue === 'all' || facultyTarget === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});