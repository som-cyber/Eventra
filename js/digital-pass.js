function escapePassText(value) {
    return String(value || '').replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);
}

function getPassInformation(registration) {
    const pass = registration.pass || registration;
    return {
        registrationId: pass.registrationId || registration.registrationId,
        participantName: pass.participantName || registration.name || 'Guest',
        eventTitle: pass.eventTitle || registration.eventTitle || 'ÉVENTRA Event',
        eventDate: pass.eventDate || registration.eventDate || '',
        eventTime: pass.eventTime || registration.eventTime || '',
        eventVenue: pass.eventVenue || registration.eventVenue || '',
        disclaimer: pass.disclaimer || 'Demonstration pass only. This QR code is not a verified entry credential.'
    };
}

function renderDigitalPass(registration, container, { modal = false } = {}) {
    if (!container) return;
    const pass = getPassInformation(registration);
    if (!pass.registrationId) {
        console.error('Cannot generate an event pass without a registration ID.');
        return;
    }

    const host = modal
        ? `<div class="pass-dialog-backdrop" role="presentation"><section class="pass-dialog" role="dialog" aria-modal="true" aria-labelledby="digitalPassHeading"><button class="pass-dialog-close" type="button" data-pass-close aria-label="Close event pass">×</button><h2 class="sr-only" id="digitalPassHeading">Your digital event pass</h2>`
        : '';
    const footer = modal
        ? '</section></div>'
        : '';
    const qrId = `pass-qr-${pass.registrationId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

    container.innerHTML = `${host}
        <article class="digital-pass" data-pass-id="${escapePassText(pass.registrationId)}">
            <header class="digital-pass-brand">
                <span class="digital-pass-logo">É</span>
                <span><strong>ÉVENTRA</strong><small>Where Moments Become Memories.</small></span>
                <span class="digital-pass-label">EVENT PASS</span>
            </header>
            <div class="digital-pass-main">
                <div class="digital-pass-information">
                    <span class="eyebrow">Your next memory</span>
                    <h2>${escapePassText(pass.eventTitle)}</h2>
                    <div class="pass-detail"><span>Attendee</span><strong>${escapePassText(pass.participantName)}</strong></div>
                    <div class="pass-detail"><span>Date &amp; time</span><strong>${escapePassText(formatDate(pass.eventDate))} · ${escapePassText(formatTime(pass.eventTime))}</strong></div>
                    <div class="pass-detail"><span>Venue</span><strong>${escapePassText(pass.eventVenue)}</strong></div>
                    <div class="pass-detail"><span>Registration ID</span><strong class="pass-registration-id">${escapePassText(pass.registrationId)}</strong></div>
                </div>
                <div class="digital-pass-qr-wrap">
                    <div class="digital-pass-qr" id="${escapePassText(qrId)}" data-qr-value="${escapePassText(pass.registrationId)}"></div>
                    <span>Pass reference</span>
                </div>
            </div>
            <footer class="digital-pass-disclaimer">${escapePassText(pass.disclaimer)}</footer>
            <div class="digital-pass-actions">
                <button class="btn btn-primary" type="button" data-pass-print>Print / Save PDF</button>
                <button class="btn btn-secondary" type="button" data-pass-download>Download pass</button>
            </div>
        </article>
        ${footer}`;

    const qrContainer = container.querySelector(`#${CSS.escape(qrId)}`);
    if (typeof QRCode === 'undefined') {
        qrContainer.textContent = 'QR code unavailable';
        qrContainer.classList.add('qr-unavailable');
        console.error('The QR code library did not load. Check the connection and reload the page.');
        return;
    }
    new QRCode(qrContainer, {
        text: pass.registrationId,
        width: 144,
        height: 144,
        colorDark: '#0B0B0D',
        colorLight: '#FFFFFF',
        correctLevel: QRCode.CorrectLevel.M
    });

    if (modal) {
        container.querySelector('[data-pass-close]').addEventListener('click', () => container.replaceChildren());
        container.querySelector('.pass-dialog-backdrop').addEventListener('click', event => {
            if (event.target === event.currentTarget) container.replaceChildren();
        });
    }
}

function getPassQrImage(passElement) {
    const canvas = passElement.querySelector('.digital-pass-qr canvas');
    if (canvas) return canvas.toDataURL('image/png');
    const image = passElement.querySelector('.digital-pass-qr img');
    return image?.src || '';
}

function downloadDigitalPass(passElement) {
    const qrImage = getPassQrImage(passElement);
    if (!qrImage) {
        alert('The pass QR code is not ready yet. Please try again in a moment.');
        return;
    }
    const downloadDocument = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>ÉVENTRA Digital Event Pass</title><style>body{font:16px Inter,Arial,sans-serif;background:#f4f1ea;padding:32px;color:#0b0b0d}.ticket{max-width:760px;margin:32px auto;background:#fff;border:1px solid #d8d0c0;border-radius:20px;padding:32px}.brand{color:#8f7040;font-size:14px;letter-spacing:.14em}.layout{display:flex;justify-content:space-between;gap:24px;align-items:center;margin-top:24px}.layout img{width:144px;height:144px}.label{color:#777;font-size:12px;text-transform:uppercase;letter-spacing:.12em}.notice{margin-top:24px;padding-top:16px;border-top:1px solid #ddd;color:#755e3f;font-size:12px}@media print{body{padding:0;background:#fff}.ticket{margin:0 auto}}</style><main class="ticket"><div class="brand">ÉVENTRA · WHERE MOMENTS BECOME MEMORIES.</div><div class="layout"><div>${[...passElement.querySelectorAll('.pass-detail')].map(detail => `<p><span class="label">${escapePassText(detail.querySelector('span')?.textContent)}</span><br><strong>${escapePassText(detail.querySelector('strong')?.textContent)}</strong></p>`).join('')}</div><img src="${qrImage}" alt="QR code for registration ${escapePassText(passElement.dataset.passId)}"></div><p class="notice">Demonstration pass only. This QR code is not a verified entry credential.</p></main></html>`;
    const blob = new Blob([downloadDocument], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `eventra-pass-${passElement.dataset.passId}.html`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

document.addEventListener('click', event => {
    const printButton = event.target.closest('[data-pass-print]');
    const downloadButton = event.target.closest('[data-pass-download]');
    if (printButton || downloadButton) {
        const passElement = event.target.closest('.digital-pass');
        if (!passElement) return;
        if (printButton) {
            document.body.classList.add('printing-pass');
            window.print();
        } else {
            downloadDigitalPass(passElement);
        }
    }
});

window.addEventListener('afterprint', () => document.body.classList.remove('printing-pass'));
document.addEventListener('keydown', event => {
    if (event.key === 'Escape') document.querySelectorAll('.pass-dialog-backdrop').forEach(backdrop => backdrop.remove());
});

window.renderDigitalPass = renderDigitalPass;
