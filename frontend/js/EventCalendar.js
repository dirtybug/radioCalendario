class EventCalendar {
    constructor(eventList, events) {
        this.eventList = eventList;
        this.events = events;
        this.today = new Date();
        this.oneYearFromToday = new Date(this.today);
        this.oneYearFromToday.setFullYear(this.today.getFullYear() + 1);
    }

    // Function to format dates
    formatDate(date) {
        return new Date(date).toLocaleDateString(undefined, {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    // Function to group events by month-year
    groupEventsByMonth() {
        const eventsByMonth = {};
        this.events.forEach(event => {
            const eventDate = new Date(event.date);
            if (eventDate >= this.today && eventDate <= this.oneYearFromToday) {
                const monthYear = eventDate.toLocaleDateString(undefined, {
                    month: 'long',
                    year: 'numeric'
                });

                if (!eventsByMonth[monthYear]) {
                    eventsByMonth[monthYear] = [];
                }
                eventsByMonth[monthYear].push(event);
            }
        });
        return eventsByMonth;
    }

    // Function to display the calendar
    render() {
        // Clear the event list before appending new events
        this.eventList.innerHTML = '';

        // Create a calendar header
        const calendarHeader = document.createElement('h2');
        calendarHeader.textContent = `Eventos de ${this.formatDate(this.today)} a ${this.formatDate(this.oneYearFromToday)}`;
        this.eventList.appendChild(calendarHeader);

        // Get grouped events by month-year
        const eventsByMonth = this.groupEventsByMonth();

        if (Object.keys(eventsByMonth).length === 0) {
            const noEventsMessage = document.createElement('p');
            noEventsMessage.textContent = 'Nenhum evento encontrado neste período.';
            this.eventList.appendChild(noEventsMessage);
        } else {
            // Display events by month
            Object.keys(eventsByMonth).forEach(monthYear => {
                const monthHeader = document.createElement('h3');
                monthHeader.textContent = monthYear;
                this.eventList.appendChild(monthHeader);

                const ul = document.createElement('ul');
                eventsByMonth[monthYear].forEach(event => {
                    const li = document.createElement('li');
                    li.textContent = `${event.name} (${event.type}) - ${this.formatDate(event.date)} (${event.mode}, Freq: ${event.frequency}, DMR: ${event.dmrChannel})`;
                    ul.appendChild(li);
                });
                this.eventList.appendChild(ul);
            });
        }
    }
}
