// ÉVENTRA - Main JavaScript

// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        const isOpen = hamburger.classList.contains('active');
        hamburger.setAttribute('aria-expanded', String(isOpen));
        hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Open menu');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Open menu');
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Open menu');
        }
    });
}

// Active Link Highlighting
function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const currentDestination = `${currentPage}${window.location.hash}`;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href');
        if (
            linkPage === currentPage ||
            linkPage === currentDestination ||
            (currentPage === 'index.html' && !window.location.hash && linkPage === 'index.html#home')
        ) {
            link.classList.add('active');
        }
    });
}

setActiveLink();

// Format Date
function formatDate(dateString) {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Format Time
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
}

// Format Price
function formatPrice(price) {
    return `₹${price.toLocaleString()}`;
}

// Create Event Card HTML
function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.dataset.eventId = event.id;
    const favorites = JSON.parse(localStorage.getItem('eventraFavorites') || '[]');
    const isFavorite = favorites.includes(event.id);
    card.innerHTML = `
        <button class="favorite-btn${isFavorite ? ' active' : ''}" data-event-id="${event.id}" aria-label="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}" aria-pressed="${isFavorite}">${isFavorite ? '♥' : '♡'}</button>
        <img src="${event.image}" alt="${event.title}" class="event-card-image" loading="lazy">
        <div class="event-card-content">
            <span class="event-card-category">${event.category}</span>
            <h3 class="event-card-title">${event.title}</h3>
            <div class="event-card-meta">
                <div class="event-card-date">📅 ${formatDate(event.date)} at ${formatTime(event.time)}</div>
                <div class="event-card-venue">📍 ${event.venue}</div>
            </div>
            <div class="event-card-price">${formatPrice(event.price || 999)}</div>
            <div class="event-card-compatibility" data-compatibility-event="${event.id}">${getEventCompatibilityMarkup(event)}</div>
            <p class="event-card-description">${event.shortDescription}</p>
            <div class="event-card-actions">
                <a href="event-details.html?id=${event.id}" class="btn btn-secondary">View Details</a>
                <a href="register.html?eventId=${event.id}" class="btn btn-primary">Register</a>
            </div>
        </div>
    `;

    // Add favorite functionality
    const favoriteBtn = card.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(event.id, favoriteBtn);
    });

    return card;
}

// Toggle Favorite
function toggleFavorite(eventId, btn) {
    let favorites = JSON.parse(localStorage.getItem('eventraFavorites') || '[]');

    if (favorites.includes(eventId)) {
        favorites = favorites.filter(id => id !== eventId);
        btn.classList.remove('active');
        btn.textContent = '♡';
        btn.setAttribute('aria-label', 'Add to favorites');
        btn.setAttribute('aria-pressed', 'false');
    } else {
        favorites.push(eventId);
        btn.classList.add('active');
        btn.textContent = '♥';
        btn.setAttribute('aria-label', 'Remove from favorites');
        btn.setAttribute('aria-pressed', 'true');
        btn.classList.add('animating');
        setTimeout(() => btn.classList.remove('animating'), 600);
    }

    localStorage.setItem('eventraFavorites', JSON.stringify(favorites));
}

// Render Featured Events on Homepage
function renderFeaturedEvents() {
    const featuredGrid = document.getElementById('featuredEventsGrid');
    if (!featuredGrid) return;

    const featuredEvents = events.filter(event => event.featured).slice(0, 3);
    featuredGrid.innerHTML = '';

    featuredEvents.forEach((event, index) => {
        const card = createEventCard(event);
        card.style.animationDelay = `${index * 0.1}s`;
        featuredGrid.appendChild(card);
    });
}

// Render All Events
function renderAllEvents(eventsToRender = events) {
    const eventsGrid = document.getElementById('eventsGrid');
    if (!eventsGrid) return;

    eventsGrid.innerHTML = '';

    if (eventsToRender.length === 0) {
        const noEvents = document.getElementById('noEvents');
        if (noEvents) {
            noEvents.style.display = 'block';
        }
        return;
    }

    const noEvents = document.getElementById('noEvents');
    if (noEvents) {
        noEvents.style.display = 'none';
    }

    eventsToRender.forEach((event, index) => {
        const card = createEventCard(event);
        card.style.animationDelay = `${index * 0.1}s`;
        eventsGrid.appendChild(card);
    });
}

// Render Event Details
function renderEventDetails() {
    const eventDetailsContainer = document.getElementById('eventDetails');
    if (!eventDetailsContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const eventId = parseInt(urlParams.get('id'));

    const event = events.find(e => e.id === eventId);

    if (!event) {
        eventDetailsContainer.innerHTML = `
            <div style="text-align: center; padding: var(--space-3xl);">
                <div style="font-size: 4rem; margin-bottom: var(--space-lg);">🔍</div>
                <h3 style="font-size: var(--text-2xl); margin-bottom: var(--space-sm); color: var(--text-primary);">Event Not Found</h3>
                <p style="color: var(--text-secondary); margin-bottom: var(--space-lg);">The event you're looking for doesn't exist.</p>
                <a href="events.html" class="btn btn-primary">Browse All Events</a>
            </div>
        `;
        return;
    }

    const eventDate = new Date(event.date + 'T' + event.time);
    const isPast = eventDate < new Date();

    eventDetailsContainer.innerHTML = `
        <div style="background: var(--bg-card); border-radius: var(--radius-2xl); overflow: hidden; border: 1px solid var(--border-color);">
            <img src="${event.image}" alt="${event.title}" class="event-details-image">
            <div style="padding: var(--space-2xl);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-xl); flex-wrap: wrap; gap: var(--space-md);">
                    <div>
                        <span class="event-card-category">${event.category}</span>
                        <h1 style="font-size: var(--text-5xl); margin-top: var(--space-md);">${event.title}</h1>
                        <div class="event-details-compatibility" data-compatibility-event="${event.id}">${getEventCompatibilityMarkup(event)}</div>
                    </div>
                    ${isPast ? '<span style="padding: var(--space-xs) var(--space-md); background: var(--accent-primary); color: var(--text-inverse); border-radius: var(--radius-full); font-size: var(--text-sm); font-weight: 600;">Event Ended</span>' : ''}
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-lg); margin-bottom: var(--space-xl); padding: var(--space-xl); background: var(--bg-tertiary); border-radius: var(--radius-lg);">
                    <div>
                        <div style="font-size: var(--text-sm); color: var(--text-muted); margin-bottom: var(--space-xs);">Date</div>
                        <div style="font-size: var(--text-lg); font-weight: 600; color: var(--text-primary);">${formatDate(event.date)}</div>
                    </div>
                    <div>
                        <div style="font-size: var(--text-sm); color: var(--text-muted); margin-bottom: var(--space-xs);">Time</div>
                        <div style="font-size: var(--text-lg); font-weight: 600; color: var(--text-primary);">${formatTime(event.time)}</div>
                    </div>
                    <div>
                        <div style="font-size: var(--text-sm); color: var(--text-muted); margin-bottom: var(--space-xs);">Venue</div>
                        <div style="font-size: var(--text-lg); font-weight: 600; color: var(--text-primary);">${event.venue}</div>
                    </div>
                    <div>
                        <div style="font-size: var(--text-sm); color: var(--text-muted); margin-bottom: var(--space-xs);">Price</div>
                        <div style="font-size: var(--text-lg); font-weight: 600; color: var(--accent-primary);">${formatPrice(event.price || 999)}</div>
                    </div>
                    <div>
                        <div style="font-size: var(--text-sm); color: var(--text-muted); margin-bottom: var(--space-xs);">Seats</div>
                        <div style="font-size: var(--text-lg); font-weight: 600; color: var(--text-primary);">${event.seats} Available</div>
                    </div>
                </div>

                ${!isPast ? `
                <div style="display: flex; gap: var(--space-lg); justify-content: center; margin-bottom: var(--space-xl); padding: var(--space-xl); background: var(--bg-tertiary); border-radius: var(--radius-lg);" id="countdownTimer" data-date="${event.date} ${event.time}">
                    <div style="text-align: center;">
                        <div style="font-size: var(--text-3xl); font-weight: 700; color: var(--accent-primary);" id="days">00</div>
                        <div style="font-size: var(--text-sm); color: var(--text-muted); text-transform: uppercase;">Days</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: var(--text-3xl); font-weight: 700; color: var(--accent-primary);" id="hours">00</div>
                        <div style="font-size: var(--text-sm); color: var(--text-muted); text-transform: uppercase;">Hours</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: var(--text-3xl); font-weight: 700; color: var(--accent-primary);" id="minutes">00</div>
                        <div style="font-size: var(--text-sm); color: var(--text-muted); text-transform: uppercase;">Minutes</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: var(--text-3xl); font-weight: 700; color: var(--accent-primary);" id="seconds">00</div>
                        <div style="font-size: var(--text-sm); color: var(--text-muted); text-transform: uppercase;">Seconds</div>
                    </div>
                </div>
                ` : ''}

                <div style="margin-bottom: var(--space-xl);">
                    <h2 style="font-size: var(--text-3xl); margin-bottom: var(--space-lg);">About This Event</h2>
                    <p style="font-size: var(--text-lg); line-height: 1.8; color: var(--text-secondary);">${event.description}</p>
                </div>

                ${event.agenda ? `
                <div style="margin-bottom: var(--space-xl);">
                    <h3 style="font-size: var(--text-2xl); margin-bottom: var(--space-lg);">Event Agenda</h3>
                    <ul style="list-style: disc; padding-left: var(--space-xl);">
                        ${event.agenda.map(item => `<li style="margin-bottom: var(--space-sm); color: var(--text-secondary);">${item}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}

                <div style="display: flex; gap: var(--space-md); flex-wrap: wrap;">
                    ${!isPast ? `
                    <a href="register.html?eventId=${event.id}" class="btn btn-primary btn-large">Register Now</a>
                    ` : ''}
                    <a href="events.html" class="btn btn-secondary btn-large">Back to Events</a>
                </div>
            </div>
        </div>
    `;

    // Initialize countdown if event is in the future
    if (!isPast && typeof initCountdown === 'function') {
        initCountdown();
    }
}

// Populate Event Select in Registration Form
function populateEventSelect() {
    const eventSelect = document.getElementById('eventSelect');
    if (!eventSelect) return;

    const urlParams = new URLSearchParams(window.location.search);
    const preselectedEventId = urlParams.get('eventId');

    events.forEach(event => {
        const option = document.createElement('option');
        option.value = event.id;
        option.textContent = `${event.title} - ${formatDate(event.date)}`;
        eventSelect.appendChild(option);
    });

    if (preselectedEventId) {
        eventSelect.value = preselectedEventId;
    }
}

// Render Category Cards
function renderCategoryCards() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) return;

    const categories = [
        { name: 'Music & Concerts', eventCategory: 'Music', icon: '🎵' },
        { name: 'Technology', eventCategory: 'Technology', icon: '💻' },
        { name: 'Business & Networking', eventCategory: 'Business', icon: '💼' },
        { name: 'Art & Culture', eventCategory: 'Cultural', icon: '🎭' },
        { name: 'Food & Lifestyle', eventCategory: 'Food', icon: '🍽️' },
        { name: 'Sports', eventCategory: 'Sports', icon: '⚽' },
        { name: 'Workshops', eventCategory: 'Workshop', icon: '🛠️' },
        { name: 'Entertainment', eventCategory: 'Entertainment', icon: '🎪' }
    ];

    categoriesGrid.innerHTML = '';

    categories.forEach((category, index) => {
        const card = document.createElement('a');
        card.className = 'category-card';
        card.href = `events.html?category=${encodeURIComponent(category.eventCategory)}`;
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <div class="category-icon">${category.icon}</div>
            <h3 class="category-name">${category.name}</h3>
        `;

        categoriesGrid.appendChild(card);
    });
}

// Initialize based on current page
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'index.html' || currentPage === '') {
        renderFeaturedEvents();
        renderCategoryCards();
        initNewsletterForm();
    } else if (currentPage === 'events.html') {
        renderAllEvents();
    } else if (currentPage === 'event-details.html') {
        renderEventDetails();
    } else if (currentPage === 'register.html') {
        populateEventSelect();
    }

    // Initialize favorites from localStorage
    const favorites = JSON.parse(localStorage.getItem('eventraFavorites') || '[]');
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const eventId = parseInt(btn.dataset.eventId);
        if (favorites.includes(eventId)) {
            btn.classList.add('active');
        }
    });
});

// Newsletter Form Validation
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value.trim();

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Save to localStorage
        const subscribers = JSON.parse(localStorage.getItem('eventraNewsletter') || '[]');
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('eventraNewsletter', JSON.stringify(subscribers));
        }

        // Show success message
        alert('Thank you for subscribing! You will receive updates about extraordinary experiences.');
        newsletterForm.reset();
    });
}
