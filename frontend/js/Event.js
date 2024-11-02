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
        const calendar = new EventCalendar();
        calendar.render(); // Render the calendar
    }
    
    loadEventsFromAPI() {
        const calendar = new EventCalendar();
        calendar.render(); // Render the calendar
    }
    
}
