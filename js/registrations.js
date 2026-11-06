function renderMyRegistrations() {
    const registrationsList = document.getElementById('registrationsList');
    const noRegistrations = document.getElementById('noRegistrations');
    if (!registrationsList || !noRegistrations) return;

    const registrations = getRegistrationDetails();
    registrationsList.style.display = registrations.length ? 'block' : 'none';
    noRegistrations.style.display = registrations.length ? 'none' : 'block';

    registrationsList.innerHTML = registrations.map(registration => `
        <article class="registration-card">
            <div class="registration-card-header">
                <div>
                    <span class="registration-id">Registration ID: ${registration.registrationId}</span>
                    <h2>${registration.eventTitle}</h2>
                </div>
                <div class="registration-actions">
                    <button class="btn btn-secondary" type="button" data-pass-registration-id="${registration.registrationId}">View Digital Pass</button>
                    <button class="registration-cancel" type="button" data-registration-id="${registration.registrationId}">Cancel</button>
                </div>
            </div>
            <div class="registration-meta">
                <div><span>Date</span><strong>${formatDate(registration.eventDate)}</strong></div>
                <div><span>Time</span><strong>${formatTime(registration.eventTime)}</strong></div>
                <div><span>Venue</span><strong>${registration.eventVenue}</strong></div>
                ${registration.payment ? `<div><span>Payment (demo)</span><strong>${formatPrice(registration.payment.amount)} · ${registration.payment.methodLabel}</strong></div>` : ''}
            </div>
            <div class="registration-created">Registered on: ${new Date(registration.registeredAt).toLocaleDateString()}</div>
        </article>
    `).join('');
}

document.addEventListener('click', event => {
    const passButton = event.target.closest('[data-pass-registration-id]');
    if (passButton) {
        const registration = getRegistrationDetails().find(item => item.registrationId === passButton.dataset.passRegistrationId);
        if (registration) renderDigitalPass(registration, document.getElementById('passDialogHost'), { modal: true });
        return;
    }

    const cancelButton = event.target.closest('[data-registration-id]');
    if (!cancelButton || !confirm('Are you sure you want to cancel this registration?')) return;

    const saved = window.cancelRegistration(cancelButton.dataset.registrationId);
    if (!saved) {
        alert('Your registration could not be cancelled. Please try again.');
        return;
    }

    renderMyRegistrations();
    alert('Registration cancelled successfully.');
});

document.addEventListener('DOMContentLoaded', renderMyRegistrations);
