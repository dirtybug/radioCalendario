class Event {
    constructor() {
        this.nameInput = document.getElementById('name');
        this.typeInput = document.getElementById('type');
        this.dateInput = document.getElementById('date');
        this.entityInput = document.getElementById('entity');
        this.descriptionInput = document.getElementById('description');
        this.eventForm = document.getElementById('newEventForm');
        this.canalInput=document.getElementById('canal');
        this.freqInput=document.getElementById('frequencia');
        this.modeInput=document.getElementById('modulacao');
        this.timeInput = document.getElementById('time'); // Novo campo de hora



        this.eventForm.addEventListener('submit', (e) => this.createEvent(e));
            // Mostrar o formulário de adicionar evento após o login


        // Load events when the page loads
        this.loadEvents();
    }

    createEvent(event) {
        event.preventDefault();
        const name = this.nameInput.value;
        const type = this.typeInput.value;
        const mmdy = this.dateInput.value;
        const entity = this.entityInput.value;
        const description = this.descriptionInput.value;

        const time = this.timeInput.value; // Captura da hora

       const  mode=this.modeInput.value;
       const  frequency=this.freqInput.value;
       const  dmrChannel=this.canalInput.value;

        const token = localStorage.getItem('token');
        
        const date = new Date(`${mmdy}T${time}`);



        const eventData = {
            name,
            type,
            mode,
            frequency,
            dmrChannel,
            date,
            entity,
            description
        };

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "api/events", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 201) {
                console.log('Evento criado:', JSON.parse(xhr.responseText));
                this.loadEvents();  // Load events after creation
            } else if (xhr.readyState === 4) {
                console.error('Erro ao criar evento');
            }
        };

        xhr.onerror = () => {
            console.error('Erro ao criar evento');
        };

        xhr.send(JSON.stringify(eventData));
    }
    loadEvents() {
        const xhr = new XMLHttpRequest();
    
        // First, try loading from the JSON cache
        xhr.open("GET", "/cache/events.json", true);
    
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // Successfully loaded from cache
                    const events = JSON.parse(xhr.responseText);
                    const eventList = document.getElementById('events');
                    const calendar = new EventCalendar(eventList, events);
                    calendar.render(); // Render the calendar
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
    
    loadEventsFromAPI() {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "api/events", true);
    
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const events = JSON.parse(xhr.responseText);
                const eventList = document.getElementById('events');
                const calendar = new EventCalendar(eventList, events);
                calendar.render(); // Render the calendar
            } else if (xhr.readyState === 4) {
                console.error('Erro ao carregar eventos');
            }
        };
    
        xhr.onerror = () => {
            console.error('Erro ao carregar eventos');
        };
    
        xhr.send();
    }
    
}
