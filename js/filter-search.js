// Filter and Search Functionality

let currentCategory = 'All';
let currentSearch = '';
let currentSort = 'date-asc';
let currentDate = '';

// Initialize filters
function initFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilters = document.getElementById('categoryFilters');
    const sortSelect = document.getElementById('sortSelect');
    const dateFilter = document.getElementById('dateFilter');
    const resetButton = document.getElementById('resetFilters');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase().trim();
            applyFilters();
        });
    }

    if (categoryFilters) {
        const filterButtons = categoryFilters.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                // Update current category
                currentCategory = btn.dataset.category;
                applyFilters();
            });
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            applyFilters();
        });
    }

    if (dateFilter) {
        dateFilter.addEventListener('change', (e) => {
            currentDate = e.target.value;
            applyFilters();
        });
    }

    if (resetButton) {
        resetButton.addEventListener('click', () => {
            // Reset all filters
            currentCategory = 'All';
            currentSearch = '';
            currentSort = 'date-asc';
            currentDate = '';

            // Reset UI
            if (searchInput) searchInput.value = '';
            if (categoryFilters) {
                categoryFilters.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.dataset.category === 'All') {
                        btn.classList.add('active');
                    }
                });
            }
            if (sortSelect) sortSelect.value = 'date-asc';
            if (dateFilter) dateFilter.value = '';

            applyFilters();
        });
    }
}

// Apply filters and sort
function applyFilters() {
    let filteredEvents = [...events];

    // Apply category filter
    if (currentCategory !== 'All') {
        filteredEvents = filteredEvents.filter(event => event.category === currentCategory);
    }

    if (currentDate) {
        filteredEvents = filteredEvents.filter(event => event.date === currentDate);
    }

    // Apply search filter
    if (currentSearch) {
        filteredEvents = filteredEvents.filter(event => {
            const searchIn = `
                ${event.title.toLowerCase()}
                ${event.venue.toLowerCase()}
                ${event.shortDescription.toLowerCase()}
                ${event.description.toLowerCase()}
                ${event.category.toLowerCase()}
            `;
            return searchIn.includes(currentSearch);
        });
    }

    // Apply sorting
    if (currentSort === 'date-asc') {
        filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (currentSort === 'date-desc') {
        filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Render filtered events
    renderAllEvents(filteredEvents);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initFilters();

    // Check for category in URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get('category');

    if (categoryFromUrl) {
        // Find and click the matching filter button
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            if (btn.dataset.category === categoryFromUrl) {
                btn.click();
            }
        });
    }

    // Add hover styles to filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            if (!btn.classList.contains('active')) {
                btn.style.borderColor = 'var(--accent-primary)';
                btn.style.color = 'var(--text-primary)';
            }
        });

        btn.addEventListener('mouseleave', () => {
            if (!btn.classList.contains('active')) {
                btn.style.borderColor = 'var(--border-color)';
                btn.style.color = 'var(--text-secondary)';
            }
        });
    });
});
