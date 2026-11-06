// Countdown Timer Functionality

let countdownInterval;

// Initialize countdown timer
function initCountdown() {
    const countdownTimer = document.getElementById('countdownTimer');
    if (!countdownTimer) return;
    clearInterval(countdownInterval);

    const eventDateStr = countdownTimer.dataset.date;
    if (!eventDateStr) return;

    const eventDate = new Date(eventDateStr);
    const now = new Date();

    // If event has already passed
    if (eventDate < now) {
        displayEventEnded();
        return;
    }

    // Start countdown
    updateCountdown(eventDate);
    countdownInterval = setInterval(() => {
        updateCountdown(eventDate);
    }, 1000);
}

// Update countdown display
function updateCountdown(eventDate) {
    const now = new Date();
    const diff = eventDate - now;

    // If event has ended
    if (diff <= 0) {
        clearInterval(countdownInterval);
        displayEventEnded();
        return;
    }

    // Calculate time components
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Update display
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
}

// Display event ended message
function displayEventEnded() {
    const countdownTimer = document.getElementById('countdownTimer');
    if (countdownTimer) {
        countdownTimer.innerHTML = `
            <div class="countdown-item">
                <div class="countdown-value" style="color: var(--danger-color);">Event Ended</div>
            </div>
        `;
    }
}

// Initialize countdown on page load
document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
});

// Cleanup interval when page is unloaded
window.addEventListener('beforeunload', () => {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
});
