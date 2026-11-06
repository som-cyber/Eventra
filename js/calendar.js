document.addEventListener('DOMContentLoaded', () => {
    const panel = document.getElementById('calendarPanel');
    const grid = document.getElementById('calendarGrid');
    const eventGrid = document.getElementById('eventsGrid');
    const viewToggle = document.getElementById('calendarViewToggle');
    const previousButton = document.getElementById('calendarPrevious');
    const nextButton = document.getElementById('calendarNext');
    const monthLabel = document.getElementById('calendarMonthLabel');
    const selectedDayEvents = document.getElementById('calendarDayEvents');
    if (!panel || !grid || !eventGrid || !viewToggle || !previousButton || !nextButton || !monthLabel) return;

    const eventDates = new Map();
    events.forEach(event => {
        const scheduled = eventDates.get(event.date) || [];
        scheduled.push(event);
        eventDates.set(event.date, scheduled);
    });

    const today = new Date();
    let visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const todayKey = toDateKey(today);
    const upcoming = events.filter(event => event.date >= todayKey).sort((a, b) => a.date.localeCompare(b.date));
    const monthHasUpcoming = upcoming.some(event => event.date.slice(0, 7) === todayKey.slice(0, 7));
    if (!monthHasUpcoming && upcoming.length) {
        const [year, month] = upcoming[0].date.split('-').map(Number);
        visibleMonth = new Date(year, month - 1, 1);
    }

    let selectedDate = upcoming.find(event => event.date.slice(0, 7) === toMonthKey(visibleMonth))?.date || todayKey;

    function toDateKey(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    function toMonthKey(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }

    function showDateEvents(dateKey) {
        if (!selectedDayEvents) return;
        const scheduled = (eventDates.get(dateKey) || []).filter(event => event.date >= todayKey);
        if (!scheduled.length) {
            selectedDayEvents.innerHTML = `<p class="calendar-empty">No upcoming experiences on ${new Date(`${dateKey}T12:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}. Choose a highlighted date to explore.</p>`;
            return;
        }
        selectedDayEvents.innerHTML = `<h4>${new Date(`${dateKey}T12:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h4>
            <div class="calendar-event-list">${scheduled.map(event => `
                <a class="calendar-event" href="event-details.html?id=${event.id}">
                    <span class="calendar-event-time">${formatTime(event.time)}</span>
                    <span><strong>${event.title}</strong><small>${event.venue}</small></span>
                    <span class="calendar-event-arrow" aria-hidden="true">→</span>
                </a>
            `).join('')}</div>`;
    }

    function renderCalendar() {
        const year = visibleMonth.getFullYear();
        const month = visibleMonth.getMonth();
        monthLabel.textContent = visibleMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        const firstWeekday = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const cells = [];

        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
            cells.push(`<span class="calendar-weekday" role="columnheader">${day}</span>`);
        });
        for (let blank = 0; blank < firstWeekday; blank += 1) {
            cells.push('<span class="calendar-day is-outside" aria-hidden="true"></span>');
        }
        for (let day = 1; day <= daysInMonth; day += 1) {
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const hasEvents = (eventDates.get(dateKey) || []).some(event => event.date >= todayKey);
            const isPast = dateKey < todayKey;
            const isSelected = dateKey === selectedDate;
            cells.push(`<button type="button" class="calendar-day${hasEvents ? ' has-events' : ''}${isSelected ? ' is-selected' : ''}${isPast ? ' is-past' : ''}"
                role="gridcell" data-calendar-date="${dateKey}" aria-label="${new Date(`${dateKey}T12:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}${hasEvents ? ', events scheduled' : ''}"
                aria-pressed="${isSelected}" ${isPast ? 'disabled' : ''}>
                <span>${day}</span>${hasEvents ? '<i class="calendar-event-dot" aria-hidden="true"></i>' : ''}
            </button>`);
        }
        grid.innerHTML = cells.join('');
        grid.querySelectorAll('[data-calendar-date]').forEach(button => {
            button.addEventListener('click', () => {
                selectedDate = button.dataset.calendarDate;
                renderCalendar();
                showDateEvents(selectedDate);
            });
        });
        showDateEvents(selectedDate);
    }

    viewToggle.addEventListener('click', () => {
        const showCalendar = panel.hidden;
        panel.hidden = !showCalendar;
        eventGrid.hidden = showCalendar;
        viewToggle.setAttribute('aria-pressed', String(showCalendar));
        viewToggle.textContent = showCalendar ? 'Grid View' : 'Calendar View';
        if (showCalendar) renderCalendar();
    });

    previousButton.addEventListener('click', () => {
        visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
        selectedDate = upcoming.find(event => event.date.slice(0, 7) === toMonthKey(visibleMonth))?.date ||
            (toMonthKey(visibleMonth) === todayKey.slice(0, 7) ? todayKey : `${toMonthKey(visibleMonth)}-01`);
        renderCalendar();
    });
    nextButton.addEventListener('click', () => {
        visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
        selectedDate = upcoming.find(event => event.date.slice(0, 7) === toMonthKey(visibleMonth))?.date ||
            (toMonthKey(visibleMonth) === todayKey.slice(0, 7) ? todayKey : `${toMonthKey(visibleMonth)}-01`);
        renderCalendar();
    });

    renderCalendar();
});
