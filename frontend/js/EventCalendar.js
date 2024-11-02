class EventCalendar {
    constructor() {

        this.eventList = document.getElementById('events');
        
        this.today = new Date();
        this.oneYearFromToday = new Date(this.today);
        this.oneYearFromToday.setFullYear(this.today.getFullYear() + 1);
    }
    render() {
        const xhr = new XMLHttpRequest();
    
        // First, try loading from the JSON cache
        xhr.open("GET", "/cache/events.json", true);
    
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // Successfully loaded from cache

                    this.events =  JSON.parse(xhr.responseText);
                    this.loadEvents();

                } else if (xhr.status === 404) {
                    // If cache is not available, fall back to the main API endpoint
                    this.loadEventsFromAPI();
                } else {
                    console.error('Erro ao carregar eventos do cache');
                }
            }
        };
    
        xhr.onerror = () => {
            console.error('Erro ao carregar eventos do cache');
            this.loadEventsFromAPI(); // If an error occurs, fall back to the main API
        };
    
        xhr.send();
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
        const date = new Date(event.date);
        const start = date.toISOString().replace(/[-:.]/g, '');
        const end = new Date(date.getTime() + 60 * 60 * 1000).toISOString().replace(/[-:.]/g, '');

        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your App//Event Calendar//EN
BEGIN:VEVENT
UID:${event.name}@yourapp.com
DTSTAMP:${new Date().toISOString().replace(/[-:.]/g, '')}
DTSTART:${start}
DTEND:${end}
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
       // Função para exibir o calendário
       loadEvents() {
     
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
            const fragment = document.createDocumentFragment();
            Object.keys(eventsByMonth).forEach(monthYear => {
                const monthHeader = document.createElement('h3');
                monthHeader.textContent = monthYear;
                fragment.appendChild(monthHeader);

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

                    // Botão para excluir o evento (somente se o usuário estiver logado)
                    
                    if (Login.isLoggedIn) {
                        const deleteButton = document.createElement('button');
                        deleteButton.textContent = 'Excluir';
                        deleteButton.addEventListener('click', () => {
                            if (confirm('Tem certeza de que deseja excluir este evento?')) {
                                this.deleteEvent(event.id, li);
                            }
                        });
                        li.appendChild(deleteButton);
                    }

                    ul.appendChild(li);
                });
                fragment.appendChild(ul);
            });
            this.eventList.appendChild(fragment);
        }
    }

    // Função para excluir o evento
    async deleteEvent(eventId, eventElement) {

        if (!Login.isLoggedIn) {
            console.error('Usuário não está autenticado');
            return;
        }
    
        try {
            const xhr = new XMLHttpRequest();
            xhr.open('DELETE', '/api/events', true);
            xhr.setRequestHeader('Content-Type', 'application/json');

    
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        alert('Evento excluído com sucesso');
                        eventElement.remove(); // Remove the event element after deletion
                    } else {
                        console.error('Erro ao excluir o evento');
                    }
                }
            };
    
            xhr.onerror = () => {
                console.error('Erro ao excluir o evento');
            };
    
            xhr.send(JSON.stringify({ id: eventId })); // Send the event ID in the body
        } catch (error) {
            console.error('Erro ao excluir o evento', error);
        }
    }
}
