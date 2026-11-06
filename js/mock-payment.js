const DEMO_PAYMENT_METHODS = {
    upi: 'UPI demo',
    card: 'Card demo',
    wallet: 'Wallet demo'
};

function getSelectedDemoPaymentMethod() {
    const selected = document.querySelector('input[name="paymentMethod"]:checked');
    return selected && DEMO_PAYMENT_METHODS[selected.value] ? selected.value : null;
}

function setDemoPaymentStatus(message, state = '') {
    const status = document.getElementById('paymentStatus');
    if (!status) return;
    status.textContent = message;
    status.dataset.state = state;
}

function updateCheckoutSummary() {
    const eventSelect = document.getElementById('eventSelect');
    const eventName = document.getElementById('checkoutEventName');
    const amount = document.getElementById('checkoutAmount');
    if (!eventSelect || !eventName || !amount) return;

    const event = events.find(item => item.id === Number(eventSelect.value));
    eventName.textContent = event ? event.title : 'Choose an event to see the total';
    amount.textContent = event ? formatPrice(event.price || 0) : '—';
}

function setDemoPaymentProcessing(isProcessing) {
    document.querySelectorAll('button[name="demoOutcome"]').forEach(button => {
        button.disabled = isProcessing;
        button.setAttribute('aria-busy', String(isProcessing));
    });
}

function simulateDemoPayment({ amount, method, outcome }) {
    if (!Number.isFinite(amount) || amount < 0 || !DEMO_PAYMENT_METHODS[method]) {
        return Promise.reject(new Error('A valid demo payment amount and method are required.'));
    }
    if (!['success', 'failure'].includes(outcome)) {
        return Promise.reject(new Error('Choose a supported demo payment outcome.'));
    }

    setDemoPaymentStatus('Running the payment simulation…', 'processing');
    setDemoPaymentProcessing(true);

    return new Promise(resolve => {
        window.setTimeout(() => {
            const result = {
                status: outcome === 'success' ? 'demo-paid' : 'demo-declined',
                method,
                methodLabel: DEMO_PAYMENT_METHODS[method],
                amount,
                reference: `DEMO-${Date.now().toString(36).toUpperCase()}`,
                simulatedAt: new Date().toISOString(),
                isDemo: true
            };
            const message = outcome === 'success'
                ? `Demo payment successful for ${formatPrice(amount)}. No money was charged.`
                : 'Demo payment declined. No registration was created and no money was charged.';
            setDemoPaymentStatus(message, outcome);
            setDemoPaymentProcessing(false);
            resolve(result);
        }, 650);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const eventSelect = document.getElementById('eventSelect');
    if (!eventSelect) return;
    eventSelect.addEventListener('change', updateCheckoutSummary);
    document.querySelectorAll('input[name="paymentMethod"]').forEach(input => {
        input.addEventListener('change', () => setDemoPaymentStatus(''));
    });
    updateCheckoutSummary();
});

window.getSelectedDemoPaymentMethod = getSelectedDemoPaymentMethod;
window.setDemoPaymentStatus = setDemoPaymentStatus;
window.setDemoPaymentProcessing = setDemoPaymentProcessing;
window.simulateDemoPayment = simulateDemoPayment;
