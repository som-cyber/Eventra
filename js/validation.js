// ÉVENTRA - Form Validation

const form = document.getElementById('registrationForm');
const fullName = document.getElementById('fullName');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const eventSelect = document.getElementById('eventSelect');

// Validation rules
const validators = {
    fullName: {
        validate: (value) => {
            const trimmed = value.trim();
            if (trimmed.length < 3) {
                return 'Name must be at least 3 characters long';
            }
            if (!/^[a-zA-Z\s]+$/.test(trimmed)) {
                return 'Name can only contain letters and spaces';
            }
            return '';
        },
        sanitize: (value) => value.trim()
    },
    email: {
        validate: (value) => {
            const trimmed = value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(trimmed)) {
                return 'Please enter a valid email address';
            }
            return '';
        },
        sanitize: (value) => value.trim().toLowerCase()
    },
    phone: {
        validate: (value) => {
            const trimmed = value.trim();
            if (!/^\d{10}$/.test(trimmed)) {
                return 'Please enter a valid 10-digit phone number';
            }
            return '';
        },
        sanitize: (value) => value.trim()
    },
    eventSelect: {
        validate: (value) => {
            if (!value || value === '') {
                return 'Please select an event';
            }
            return '';
        },
        sanitize: (value) => value
    }
};

// Show error message
function showError(input, message) {
    const errorElement = document.getElementById(`${input.id}Error`);
    if (errorElement) {
        errorElement.textContent = message;
    }
    input.style.borderColor = 'var(--accent-primary)';
}

// Show success state
function showSuccess(input) {
    const errorElement = document.getElementById(`${input.id}Error`);
    if (errorElement) {
        errorElement.textContent = '';
    }
    input.style.borderColor = 'var(--accent-primary)';
}

// Clear validation state
function clearValidation(input) {
    const errorElement = document.getElementById(`${input.id}Error`);
    if (errorElement) {
        errorElement.textContent = '';
    }
    input.style.borderColor = 'var(--border-color)';
}

// Validate single field
function validateField(input) {
    const validator = validators[input.name];
    if (!validator) return true;

    const error = validator.validate(input.value);
    if (error) {
        showError(input, error);
        return false;
    } else {
        showSuccess(input);
        return true;
    }
}

// Validate entire form
function validateForm() {
    let isValid = true;
    let firstInvalid = null;

    // Validate all fields
    [fullName, email, phone, eventSelect].forEach(input => {
        if (input) {
            const isFieldValid = validateField(input);
            if (!isFieldValid) {
                isValid = false;
                if (!firstInvalid) {
                    firstInvalid = input;
                }
            }
        }
    });

    // Focus on first invalid field
    if (firstInvalid) {
        firstInvalid.focus();
    }

    return isValid;
}

// Sanitize form data
function sanitizeFormData() {
    return {
        fullName: validators.fullName.sanitize(fullName.value),
        email: validators.email.sanitize(email.value),
        phone: validators.phone.sanitize(phone.value),
        eventId: validators.eventSelect.sanitize(eventSelect.value)
    };
}

// Add event listeners for real-time validation
if (form) {
    [fullName, email, phone, eventSelect].forEach(input => {
        if (input) {
            // Validate on blur
            input.addEventListener('blur', () => {
                if (input.value.trim() !== '') {
                    validateField(input);
                }
            });

            // Validate on input (after user has interacted)
            input.addEventListener('input', () => {
                if (input.style.borderColor !== 'var(--border-color)') {
                    validateField(input);
                }
            });
        }
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Sanitize data
        const formData = sanitizeFormData();

        // Check for duplicate registration
        if (typeof checkDuplicateRegistration === 'function') {
            const isDuplicate = checkDuplicateRegistration(formData.email, formData.eventId);
            if (isDuplicate) {
                const event = events.find(e => e.id === parseInt(formData.eventId));
                alert(`You have already registered for ${event ? event.title : 'this event'} with this email address.`);
                return;
            }
        }

        const demoOutcome = e.submitter?.value;
        const paymentMethod = getSelectedDemoPaymentMethod();
        const event = events.find(item => item.id === Number(formData.eventId));
        if (!event || !paymentMethod || !['success', 'failure'].includes(demoOutcome)) {
            setDemoPaymentStatus('Choose an event and payment option to continue.', 'failure');
            return;
        }

        let payment;
        try {
            payment = await simulateDemoPayment({
                amount: event.price || 0,
                method: paymentMethod,
                outcome: demoOutcome
            });
        } catch (error) {
            console.error('Demo payment simulation failed.', error);
            setDemoPaymentStatus('The demo payment could not be simulated. Please try again.', 'failure');
            setDemoPaymentProcessing(false);
            return;
        }
        if (payment.status !== 'demo-paid') return;

        formData.payment = payment;

        // Save registration
        const registration = typeof saveRegistration === 'function' ? saveRegistration(formData) : false;
        if (!registration) {
            setDemoPaymentStatus('The payment simulation succeeded, but the registration could not be saved. Try again; no real charge was made.', 'failure');
            return;
        }

        // Show confirmation modal
        showConfirmationModal(formData, registration, payment);

        // Reset form
        form.reset();
        [fullName, email, phone, eventSelect].forEach(input => {
            if (input) {
                clearValidation(input);
            }
        });
        updateCheckoutSummary();
        setDemoPaymentStatus('Registration saved with a demo payment. No money was charged.', 'success');
    });
}

// Show confirmation modal
function showConfirmationModal(formData, registration, payment) {
    const modal = document.getElementById('confirmationModal');
    const event = events.find(e => e.id === parseInt(formData.eventId));

    if (modal && event) {
        document.getElementById('confirmName').textContent = formData.fullName;
        document.getElementById('confirmEvent').textContent = event.title;
        document.getElementById('confirmDate').textContent = formatDate(event.date) + ' at ' + formatTime(event.time);
        document.getElementById('confirmVenue').textContent = event.venue;
        document.getElementById('confirmPayment').textContent = `${formatPrice(payment.amount)} · ${payment.methodLabel} · DEMO`;
        document.getElementById('confirmPaymentReference').textContent = payment.reference;
        const passHost = document.getElementById('confirmationPassHost');
        if (passHost && typeof renderDigitalPass === 'function') {
            renderDigitalPass(registration, passHost, { modal: false });
        }

        modal.style.display = 'flex';

        // Close modal on button click
        const closeBtn = document.getElementById('closeModal');
        closeBtn?.addEventListener('click', () => {
            modal.style.display = 'none';
        }, { once: true });

        modal.onclick = (event) => {
            if (event.target === modal) modal.style.display = 'none';
        };
    }
}

document.addEventListener('keydown', (event) => {
    const modal = document.getElementById('confirmationModal');
    if (event.key === 'Escape' && modal?.style.display === 'flex') {
        modal.style.display = 'none';
    }
});
