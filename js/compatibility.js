const EVENTRA_STORAGE_KEYS = {
    interests: 'eventraInterests',
    quiz: 'eventraQuizResult',
    preferences: 'eventraPreferences'
};

const EVENTRA_VIBES = [
    { id: 'music', label: 'Music & Entertainment', icon: '♫', categories: ['Music'], tags: ['music', 'live', 'festival', 'nightlife', 'entertainment', 'performance'] },
    { id: 'technology', label: 'Technology & Innovation', icon: '✳', categories: ['Technology'], tags: ['technology', 'innovation', 'ai', 'digital', 'innovation'] },
    { id: 'business', label: 'Business & Networking', icon: '↗', categories: ['Business'], tags: ['business', 'networking', 'entrepreneurship', 'marketing', 'leadership'] },
    { id: 'art', label: 'Art & Creativity', icon: '✺', categories: ['Cultural'], tags: ['art', 'creativity', 'culture', 'dance', 'photography', 'heritage'] },
    { id: 'food', label: 'Food & Lifestyle', icon: '◌', categories: ['Food'], tags: ['food', 'dining', 'lifestyle', 'culinary', 'gourmet'] },
    { id: 'sports', label: 'Sports & Adventure', icon: '↗', categories: ['Sports'], tags: ['sports', 'adventure', 'fitness', 'cricket', 'marathon'] },
    { id: 'learning', label: 'Learning & Workshops', icon: '✎', categories: ['Workshop'], tags: ['learning', 'workshop', 'skills', 'masterclass', 'education'] }
];

const EVENTRA_PERSONALITIES = {
    Explorer: {
        description: 'You are drawn to new places, fresh perspectives, and the thrill of trying something different.',
        categories: ['Sports', 'Cultural'],
        tags: ['adventure', 'exploration', 'outdoor', 'experience']
    },
    'Creative Soul': {
        description: 'You notice the details, find inspiration in craft, and love experiences with a creative point of view.',
        categories: ['Cultural', 'Workshop'],
        tags: ['art', 'creativity', 'culture', 'dance', 'photography']
    },
    Networker: {
        description: 'The best experiences bring good people together. You find energy in conversation and shared ideas.',
        categories: ['Business'],
        tags: ['business', 'networking', 'community', 'entrepreneurship']
    },
    'Night Owl': {
        description: 'You come alive after dark, following a great set, a beautiful room, or a memorable evening.',
        categories: ['Music'],
        tags: ['music', 'nightlife', 'live', 'dining', 'gourmet']
    },
    'Knowledge Seeker': {
        description: 'Curiosity is your compass. You leave every good gathering with a new idea to explore.',
        categories: ['Technology', 'Workshop'],
        tags: ['learning', 'innovation', 'technology', 'workshop', 'skills', 'education']
    }
};

const EVENTRA_EVENT_TAGS = {
    1: ['technology', 'innovation', 'ai', 'networking', 'learning'],
    2: ['music', 'live', 'festival', 'entertainment', 'outdoor'],
    3: ['sports', 'adventure', 'fitness', 'marathon', 'outdoor'],
    4: ['technology', 'learning', 'workshop', 'skills', 'innovation'],
    5: ['art', 'creativity', 'culture', 'heritage', 'learning'],
    6: ['business', 'networking', 'entrepreneurship', 'community'],
    7: ['technology', 'innovation', 'ai', 'learning', 'workshop'],
    8: ['music', 'live', 'nightlife', 'dining', 'gourmet', 'entertainment'],
    9: ['sports', 'cricket', 'adventure', 'entertainment'],
    10: ['art', 'creativity', 'photography', 'learning', 'workshop', 'skills'],
    11: ['art', 'creativity', 'culture', 'dance', 'performance'],
    12: ['business', 'networking', 'marketing', 'learning', 'digital']
};

events.forEach(event => {
    event.tags = EVENTRA_EVENT_TAGS[event.id] || [];
});

function readEventraStorage(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
    } catch (error) {
        console.error(`Unable to read ${key} from Local Storage.`, error);
        return fallback;
    }
}

function writeEventraStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Unable to save ${key} to Local Storage.`, error);
        return false;
    }
}

function getSelectedEventraInterests() {
    const interests = readEventraStorage(EVENTRA_STORAGE_KEYS.interests, []);
    return Array.isArray(interests) ? interests.filter(id => EVENTRA_VIBES.some(vibe => vibe.id === id)) : [];
}

function getEventraQuizResult() {
    const result = readEventraStorage(EVENTRA_STORAGE_KEYS.quiz, null);
    const validAnswers = Array.isArray(result?.answers) &&
        result.answers.length === 5 &&
        result.answers.every((answer, index) =>
            Number.isInteger(answer) && answer >= 0 && answer < 5
        );
    return result && EVENTRA_PERSONALITIES[result.type] && validAnswers ? result : null;
}

function getEventraPreferences() {
    const preferences = readEventraStorage(EVENTRA_STORAGE_KEYS.preferences, {});
    return preferences && typeof preferences === 'object' && !Array.isArray(preferences) ? preferences : {};
}

function eventMatchesVibe(event, vibe) {
    const tags = Array.isArray(event.tags) ? event.tags : [];
    return vibe.categories.includes(event.category) || tags.some(tag => vibe.tags.includes(tag));
}

function getEventCompatibility(event) {
    const interests = getSelectedEventraInterests();
    const quiz = getEventraQuizResult();
    const preferences = getEventraPreferences();
    const signals = [];

    if (interests.length) {
        const matchedInterests = interests.filter(id => {
            const vibe = EVENTRA_VIBES.find(option => option.id === id);
            return vibe && eventMatchesVibe(event, vibe);
        });
        signals.push({ weight: 60, value: matchedInterests.length / interests.length });
    }

    if (quiz) {
        const personality = EVENTRA_PERSONALITIES[quiz.type];
        const matched = personality.categories.includes(event.category) ||
            event.tags.some(tag => personality.tags.includes(tag));
        signals.push({ weight: 25, value: matched ? 1 : 0 });
    }

    if (Number.isFinite(preferences.budgetMax)) {
        signals.push({ weight: 10, value: (event.price || 0) <= preferences.budgetMax ? 1 : 0 });
    }

    if (preferences.crowdPreference === 'small' || preferences.crowdPreference === 'large') {
        const fitsPreference = preferences.crowdPreference === 'small'
            ? event.seats <= 200
            : event.seats > 200;
        signals.push({ weight: 5, value: fitsPreference ? 1 : 0 });
    }

    if (!signals.length) return null;
    const totalWeight = signals.reduce((sum, signal) => sum + signal.weight, 0);
    const score = Math.round(signals.reduce((sum, signal) => sum + signal.weight * signal.value, 0) / totalWeight * 100);
    return { score, signals: signals.length };
}

function getEventCompatibilityMarkup(event) {
    const match = getEventCompatibility(event);
    if (!match) {
        return '<span class="compatibility-neutral">Discover your event match</span>';
    }

    const score = match.score;
    return `<span class="compatibility-score" role="img" aria-label="${score}% match for you">
        <span class="compatibility-ring" style="--match-score:${score}" aria-hidden="true"><span>${score}%</span></span>
        <span class="compatibility-copy"><strong>${score}% Match for You</strong><small>Based on your saved interests and quiz preferences</small></span>
    </span>`;
}

function refreshCompatibilityScores() {
    document.querySelectorAll('[data-compatibility-event]').forEach(element => {
        const event = events.find(item => item.id === Number(element.dataset.compatibilityEvent));
        if (event) element.innerHTML = getEventCompatibilityMarkup(event);
    });
}

function getEventRecommendations({ interests = [], personality = null, limit = 6 } = {}) {
    const selectedVibes = interests
        .map(id => EVENTRA_VIBES.find(vibe => vibe.id === id))
        .filter(Boolean);
    const profile = personality && EVENTRA_PERSONALITIES[personality]
        ? EVENTRA_PERSONALITIES[personality]
        : null;
    const matchingEvents = events.filter(event => {
        const matchesInterest = !selectedVibes.length || selectedVibes.some(vibe => eventMatchesVibe(event, vibe));
        const matchesPersonality = !profile || profile.categories.includes(event.category) ||
            event.tags.some(tag => profile.tags.includes(tag));
        return matchesInterest && matchesPersonality;
    });

    return matchingEvents
        .sort((a, b) => {
            const scoreA = getEventCompatibility(a)?.score ?? 0;
            const scoreB = getEventCompatibility(b)?.score ?? 0;
            return scoreB - scoreA || new Date(a.date) - new Date(b.date);
        })
        .slice(0, limit);
}

function renderEventRecommendations(container, recommendations) {
    if (!container) return;
    if (!recommendations.length) {
        container.innerHTML = '<p class="recommendation-empty">No events match this combination yet. Try another interest.</p>';
        return;
    }
    container.innerHTML = '';
    recommendations.forEach((event, index) => {
        const card = createEventCard(event);
        card.classList.add('recommendation-card');
        card.style.animationDelay = `${index * 0.08}s`;
        container.appendChild(card);
    });
    refreshCompatibilityScores();
}

window.EVENTRA_VIBES = EVENTRA_VIBES;
window.EVENTRA_PERSONALITIES = EVENTRA_PERSONALITIES;
window.getSelectedEventraInterests = getSelectedEventraInterests;
window.getEventraQuizResult = getEventraQuizResult;
window.getEventCompatibility = getEventCompatibility;
window.getEventRecommendations = getEventRecommendations;
window.renderEventRecommendations = renderEventRecommendations;
window.refreshCompatibilityScores = refreshCompatibilityScores;
