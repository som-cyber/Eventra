document.addEventListener('DOMContentLoaded', () => {
    const optionsContainer = document.getElementById('vibeOptions');
    const discoverButton = document.getElementById('discoverVibe');
    const clearButton = document.getElementById('clearVibe');
    const status = document.getElementById('vibeStatus');
    const recommendations = document.getElementById('vibeRecommendations');
    if (!optionsContainer || !discoverButton || !clearButton) return;

    let selected = getSelectedEventraInterests();

    function renderOptions() {
        optionsContainer.innerHTML = EVENTRA_VIBES.map(vibe => `
            <button type="button" class="vibe-option${selected.includes(vibe.id) ? ' is-selected' : ''}"
                data-vibe="${vibe.id}" aria-pressed="${selected.includes(vibe.id)}">
                <span class="vibe-icon" aria-hidden="true">${vibe.icon}</span>
                <span>${vibe.label}</span>
                <span class="vibe-check" aria-hidden="true">${selected.includes(vibe.id) ? '✓' : '+'}</span>
            </button>
        `).join('');
    }

    optionsContainer.addEventListener('click', event => {
        const button = event.target.closest('[data-vibe]');
        if (!button) return;
        const id = button.dataset.vibe;
        selected = selected.includes(id) ? selected.filter(value => value !== id) : [...selected, id];
        renderOptions();
        writeEventraStorage(EVENTRA_STORAGE_KEYS.interests, selected);
        refreshCompatibilityScores();
        if (recommendations) recommendations.replaceChildren();
        if (status) status.textContent = '';
    });

    discoverButton.addEventListener('click', () => {
        if (!selected.length) {
            status.textContent = 'Choose at least one interest and we’ll find a place to start.';
            if (recommendations) recommendations.replaceChildren();
            return;
        }
        const matches = getEventRecommendations({ interests: selected, limit: 6 });
        status.textContent = `${matches.length} experience${matches.length === 1 ? '' : 's'} picked for your vibe.`;
        renderEventRecommendations(recommendations, matches);
    });

    clearButton.addEventListener('click', () => {
        selected = [];
        writeEventraStorage(EVENTRA_STORAGE_KEYS.interests, selected);
        renderOptions();
        if (recommendations) recommendations.replaceChildren();
        if (status) status.textContent = 'Your selections are clear. Pick a new direction whenever you’re ready.';
        refreshCompatibilityScores();
    });

    renderOptions();
});
