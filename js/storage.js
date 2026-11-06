// ÉVENTRA - Local Storage Management for Registrations

const REGISTRATIONS_STORAGE_KEY = 'eventraRegistrations';

// Get all registrations from Local Storage
function getRegistrations() {
    try {
        const stored = localStorage.getItem(REGISTRATIONS_STORAGE_KEY);
        const registrations = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(registrations)) {
            console.error('Registration data in Local Storage is not an array.');
            return [];
        }
        return registrations.filter(registration =>
            registration && typeof registration === 'object' && !Array.isArray(registration)
        );
    } catch (error) {
        console.error('Error reading from Local Storage:', error);
        return [];
    }
}

// Save registrations to Local Storage
function saveRegistrationsToStorage(registrations) {
    try {
        localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(registrations));
        return true;
    } catch (error) {
        console.error('Error saving to Local Storage:', error);
        return false;
    }
}

// Save a new registration
function saveRegistration(formData) {
    const registrations = getRegistrations();
    const eventId = Number(formData.eventId);
    const event = events.find(item => item.id === eventId);
    if (!event) return false;
    const uniqueRegistrationId = () => {
        const suffix = typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID().toUpperCase()
            : Math.random().toString(36).slice(2, 12).toUpperCase();
        return `EVT-${Date.now().toString(36).toUpperCase()}-${suffix}`;
    };
    let registrationId = uniqueRegistrationId();
    while (registrations.some(registration => registration.registrationId === registrationId)) {
        registrationId = uniqueRegistrationId();
    }

    const newRegistration = {
        registrationId,
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        eventId,
        registeredAt: new Date().toISOString(),
        payment: formData.payment ? {
            status: formData.payment.status,
            method: formData.payment.method,
            methodLabel: formData.payment.methodLabel,
            amount: formData.payment.amount,
            reference: formData.payment.reference,
            simulatedAt: formData.payment.simulatedAt,
            isDemo: true
        } : null,
        pass: {
            registrationId: null,
            participantName: formData.fullName,
            eventId,
            eventTitle: event.title,
            eventDate: event.date,
            eventTime: event.time,
            eventVenue: event.venue,
            disclaimer: 'Demonstration pass only. This QR code is not a verified entry credential.'
        }
    };
    newRegistration.pass.registrationId = newRegistration.registrationId;

    registrations.push(newRegistration);
    const saved = saveRegistrationsToStorage(registrations);

    if (saved) {
        console.log('Registration saved successfully:', newRegistration);
    } else {
        console.error('Failed to save registration');
    }

    return saved ? newRegistration : false;
}

// Check for duplicate registration
function checkDuplicateRegistration(email, eventId) {
    const registrations = getRegistrations();
    return registrations.some(
        reg => reg.email === email && reg.eventId === parseInt(eventId)
    );
}

// Cancel a registration
function cancelRegistration(registrationId) {
    const registrations = getRegistrations();
    const filtered = registrations.filter(reg => reg.registrationId !== registrationId);
    return saveRegistrationsToStorage(filtered);
}

// Get registrations by email
function getRegistrationsByEmail(email) {
    const registrations = getRegistrations();
    return registrations.filter(reg => reg.email === email);
}

// Get registration details with event information
function getRegistrationDetails() {
    const registrations = getRegistrations();
    return registrations.map(reg => {
        const event = events.find(e => e.id === reg.eventId);
        return {
            ...reg,
            pass: reg.pass || {
                registrationId: reg.registrationId,
                participantName: reg.name,
                eventId: reg.eventId,
                eventTitle: event ? event.title : 'Unknown Event',
                eventDate: event ? event.date : 'Unknown Date',
                eventTime: event ? event.time : 'Unknown Time',
                eventVenue: event ? event.venue : 'Unknown Venue',
                disclaimer: 'Demonstration pass only. This QR code is not a verified entry credential.'
            },
            eventTitle: event ? event.title : 'Unknown Event',
            eventDate: event ? event.date : 'Unknown Date',
            eventTime: event ? event.time : 'Unknown Time',
            eventVenue: event ? event.venue : 'Unknown Venue'
        };
    });
}

// Export functions for use in other files
window.saveRegistration = saveRegistration;
window.checkDuplicateRegistration = checkDuplicateRegistration;
window.cancelRegistration = cancelRegistration;
window.getRegistrations = getRegistrations;
window.getRegistrationDetails = getRegistrationDetails;
