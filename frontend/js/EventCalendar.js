class EventCalendar {
    constructor(eventList, events) {
        this.eventList = eventList;
        this.events = events;
        this.today = new Date();
        this.oneYearFromToday = new Date(this.today);
        this.oneYearFromToday.setFullYear(this.today.getFullYear() + 1);
    }

    // Função para formatar datas e horas
    formatDate(date) {
        return new Date(date).toLocaleString(undefined, {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    // Função para formatar datas para .ics (YYYYMMDDTHHmmss)
    formatICSDate(date) {
        return new Date(date).toISOString().replace(/-|:|\.\d+/g, '');
    }

    // Função para agrupar eventos por mês-ano
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

    // Função para gerar o conteúdo do arquivo ICS
    generateICS(event) {
        const startDate = this.formatICSDate(event.date);
        const endDate = this.formatICSDate(new Date(new Date(event.date).getTime() + 60 * 60 * 1000)); // 1 hora de duração

        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your App//Event Calendar//EN
BEGIN:VEVENT
UID:${event.name}@yourapp.com
DTSTAMP:${this.formatICSDate(new Date())}
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${event.name}
DESCRIPTION:${event.description}
LOCATION:${event.type === 'online' ? 'Online' : 'Presencial'}
END:VEVENT
END:VCALENDAR`;

        return icsContent;
    }

    // Função para baixar o arquivo ICS
    downloadICS(event) {
        const icsContent = this.generateICS(event);
        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${event.name}.ics`;
        link.click();
    }

    // Função para exibir o calendário
    render() {
        // Limpar a lista de eventos antes de adicionar novos eventos
        this.eventList.innerHTML = '';

        // Criar um cabeçalho para o calendário
        const calendarHeader = document.createElement('h2');
        calendarHeader.textContent = `Eventos de ${this.formatDate(this.today)} a ${this.formatDate(this.oneYearFromToday)}`;
        this.eventList.appendChild(calendarHeader);

        // Obter eventos agrupados por mês-ano
        const eventsByMonth = this.groupEventsByMonth();

        if (Object.keys(eventsByMonth).length === 0) {
            const noEventsMessage = document.createElement('p');
            noEventsMessage.textContent = 'Nenhum evento encontrado neste período.';
            this.eventList.appendChild(noEventsMessage);
        } else {
            // Exibir eventos por mês
            Object.keys(eventsByMonth).forEach(monthYear => {
                const monthHeader = document.createElement('h3');
                monthHeader.textContent = monthYear;
                this.eventList.appendChild(monthHeader);

                const ul = document.createElement('ul');
                eventsByMonth[monthYear].forEach(event => {
                    const li = document.createElement('li');
                    li.textContent = `${event.name} (${event.type}) - ${this.formatDate(event.date)} (${event.mode}, Freq: ${event.frequency}, DMR: ${event.dmrChannel})`;

                    // Botão para adicionar ao calendário
                    const addToCalendarButton = document.createElement('button');
                    addToCalendarButton.textContent = 'Adicionar ao Calendário';
                    addToCalendarButton.addEventListener('click', () => {
                        if (confirm('Deseja adicionar este evento ao seu calendário?')) {
                            this.downloadICS(event); // Gera e baixa o arquivo ICS
                        }
                    });

                    li.appendChild(addToCalendarButton);
                    ul.appendChild(li);
                });
                this.eventList.appendChild(ul);
            });
        }
    }
}
