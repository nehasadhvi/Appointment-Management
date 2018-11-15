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
        console.log('Successfll !!!');

        //save the data into the database
        DB = AppointmentDB.result;
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

        console.log(newAppointment);
    }
});