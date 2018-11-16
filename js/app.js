let DB;

const form =document.querySelector('form'),
    petname = document.getElementById('pet-name'),
    ownername = document.getElementById('owner-name'),
    phone = document.getElementById('phone'),
    date = document.getElementById('date'),
    hour = document.getElementById('hour'),
    symptoms = document.getElementById('symptoms'),
    appointments = document.getElementById('appointments'),
    appointmentTitle = document.getElementById('appointment-title');

document.addEventListener('DOMContentLoaded', () => {
    //Create a database
    let AppointmentDB = window.indexedDB.open('appointments', 1);

    //If there is an error while loading DB
    AppointmentDB.onerror = function() {
        console.log("Error Occured !");
    }

    //If evenrything is fine, assign the result to the instance
    AppointmentDB.onsuccess = function() {
        //save the data into the database
        DB = AppointmentDB.result;
        displayAppointments();
    }

    //Create a schema, it runsonly once to create the DB schema
    AppointmentDB.onupgradeneeded = function(e) {
        let db = e.target.result;
        
        let objectStore = db.createObjectStore('appointments', { keyPath: 'key', autoIncrement: true});

        objectStore.createIndex('petname', 'petname', { unique: false });
        objectStore.createIndex('ownername', 'ownername', { unique: false });
        objectStore.createIndex('phone', 'phone', { unique: false });
        objectStore.createIndex('date', 'date', { unique: false });
        objectStore.createIndex('hour', 'hour', { unique: false });
        objectStore.createIndex('symptoms', 'symptoms', { unique: false });

        console.log('DB Ready !');
    }

    form.addEventListener('submit', addAppointment);

    function addAppointment(e){
        e.preventDefault();

        let newAppointment = {
            petname: petname.value,
            ownername: ownername.value,
            phone: phone.value,
            date: date.value,
            hour: hour.value,
            symptoms: symptoms.value
        };

        //Insert data into the DB
        let transaction = DB.transaction(['appointments'], 'readwrite');
        let objectStore = transaction.objectStore('appointments');

        let request = objectStore.add(newAppointment);

        request.onsuccess = function() {
            form.reset();
        }
        transaction.oncomplete = function() {
            console.log('new appointment added')
            displayAppointments();
        }
        transaction.onerror = function() {
            console.log('Error while transacting !');
        }
     }

     function displayAppointments() {
         while(appointments.firstChild) {
            appointments.removeChild(appointments.firstChild);
         }
         let objectStore = DB.transaction('appointments').objectStore('appointments');

         objectStore.openCursor().onsuccess = function(e) {
             let cursor = e.target.result;

             if(cursor) {
                 let appointmentHTML = document.createElement('li');
                 appointmentHTML.setAttribute('data-appointment-id', cursor.value.key);
                 appointmentHTML.classList.add('list-group-item');

                 appointmentHTML.innerHTML = `

                    <p class="font-weight-bold">Pet Name: <span class="font-weight-normal">${cursor.value.petname}</span></p>
                    <p class="font-weight-bold">Owner Name:  <span class="font-weight-normal">${cursor.value.ownername}<span></p>
                    <p class="font-weight-bold">Phone:  <span class="font-weight-normal">${cursor.value.phone}<span></p>
                    <p class="font-weight-bold">Date:  <span class="font-weight-normal">${cursor.value.date}<span></p>
                    <p class="font-weight-bold">Time:  <span class="font-weight-normal">${cursor.value.hour}<span></p>
                    <p class="font-weight-bold">Symptoms:  <span class="font-weight-normal">${cursor.value.symptoms}<span></p>
                    
                `;

                appointments.appendChild(appointmentHTML);
                cursor.continue();
             } else {
                 if(!appointments.firstChild) {
                     appointmentTitle.innerHTML = 'Add a new appointment';
                     const noAppointment = document.createElement('p');
                     noAppointment.classList.add('text-center');
                     noAppointment.textContent = 'No prior appointments found';
                     appointments.appendChild(noAppointment);
                 } else {
                    appointmentTitle.innerHTML = 'Manage your appointment';
                 }
             }
         }
     }
});