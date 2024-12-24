const symbolButton = document.getElementById('symbolButton');
const elementToShow = document.getElementById('elementToShow');
const container = document.getElementById('container');
const moreInfos = document.getElementById('Details');
const playButton = document.getElementById('play-button');
const stopButton = document.getElementById('stop-button');

// App installieren 
let deferredPrompt;
const installButton = document.getElementById('install-button');

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the default prompt
    e.preventDefault();
    
    // Save the event for later use
    deferredPrompt = e;

    // When the button is clicked, trigger the install prompt
    installButton.addEventListener('click', () => {
      // Show the install prompt
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }

        // Reset the deferred prompt variable
        deferredPrompt = null;
      });
    });
  });




// Service Worker für irgendwas
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/Niklas-Nils-new/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);

                // Trigger an update for the Service Worker
                registration.update();

                // Request notification permission
                if (Notification.permission !== 'granted') {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            console.log('Notification permission granted.');
                        } else {
                            console.log('Notification permission denied.');
                        }
                    });
                }
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// Function to send a notification
function sendNotification(title, body) {
    console.log("g");
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        // Send a message to the Service Worker
        console.log("h");
        navigator.serviceWorker.controller.postMessage({
            type: 'show-notification',
            title: title,
            body: body,
        });
    } else {
        console.error('Service Worker not controlling the page.');
    }
}





function openErinnerungen() {
   window.location.href = 'Erinnerungen.html';
}

function openTimer(){
window.location.href='Timer.html';
}

function openTimeBlocking(){
window.location.href='TimeBlocking.html';
}

function openHallofShame(){
window.location.href='HallofShame.html';
}
function backHomepage(){
window.location.href='index.html';
}
 

function schließeAlleDropdownMenues(containerListe){
   // document.addEventListener('click', function(){
    let dropdownMenus = containerListe.querySelectorAll('.dropdown-content');
    dropdownMenus.forEach(menu => {
    menu.classList.add('hidden');
    });}


function details(button){
    let parent = button.parentNode.parentNode.querySelector('.details');
  if (parent.classList.contains('hidden')){
    parent.classList.remove('hidden');
  }
  else{
    parent.classList.add('hidden');
  }


}
  
function dropDownMenu(button) {
    var dropdownMenu = button.parentNode.querySelector('.dropdown-content');
    if (dropdownMenu.classList.contains('hidden')) {
      dropdownMenu.classList.remove('hidden');
     // schließeAlleDropdownMenues(button.parentNode.parentNode.parentNode.parentNode);
      
    } else {
      dropdownMenu.classList.add('hidden');
    }
}

  


function löschen(button) {
    var parentElement = button.parentNode.parentNode.parentNode.parentNode;
    parentElement.remove();
}

  
  
function fixieren(button) {

    var dropdownMenus = document.querySelectorAll('.dropdown-content');
    dropdownMenus.forEach(function(menu) {
        menu.classList.add('hidden');
    });

   
    var container = button.parentNode.parentNode.parentNode.parentNode.parentNode;
   

    
    var containerOfButton = button.parentNode.parentNode.parentNode.parentNode;
   

    if (containerOfButton !== container.firstElementChild) {
        container.insertBefore(containerOfButton, container.firstElementChild);
    }
}


// Zeitplanung
function stopTimeBlocking() {
    isRunningTimeBlocking = false;
    alert('Zeitplanung wurde gestoppt.');
    
}


function changeButton(button){
    var playButton = button.parentNode.querySelector("#play-buttonZeitplanung");
    var stopButton = button.parentNode.querySelector("#stop-buttonZeitplanung");
    
    
    if(playButton.classList.contains('hidden')){
        playButton.classList.remove('hidden');
        stopButton.classList.add('hidden');
        stopTimeBlocking();
        
    } else if (stopButton.classList.contains('hidden')) {
        stopButton.classList.remove('hidden');
        playButton.classList.add('hidden');
        NotificatioPermission(button.parentNode.parentNode.parentNode);
        
    }
  }

  function NotificatioPermission(element) {
  if (Notification.permission === "default") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
               
                startTimeBlocking(element);
            } else {
                alert("Benachrichtigungen sind blockiert. Bitte aktivieren Sie die Benachrichtigungen.");
            }
        });
    } else if (Notification.permission === "granted") {
        startTimeBlocking(element);
    } else {
        alert("Benachrichtigungen sind blockiert. Bitte aktivieren Sie die Benachrichtigungen.");
    }
    }

    let isRunningTimeBlocking = false;
    let checkboxx = false;
    function startTimeBlocking(element, repeat = false) {
        isRunningTimeBlocking = true;
        console.log(element.querySelector(".newTimeBlockingHeadline").querySelector("#nameZeitplanung").value);  //Name der Zeitplanung
       
        const playTime = element.querySelector("#startTime").value;
        const endTime = element.querySelector("#endTime").value;
        const playButton = element.querySelector("#play-buttonZeitplanung");
        const nameZeitplanung = element.querySelector('#nameZeitplanung').value;
        const checkbox = element.querySelector('.checkboxTimeBlocking');
        const intervallEinheit = element.querySelector('#intervallEinheit').value; // Das ausgewählte Intervall (Täglich, Wöchentlich...)
        const detailsInput = element.querySelector('#intervallWertSelect').value; // Die genauere Auswahl (Jeden 2. Tag, Jede 2. Woche...)
        const endDateInput = element.querySelector('#endDate').value; // Das Enddatum der Erinnerung
        const endDate = new Date(endDateInput); // Umwandlung in ein Date-Objekt
        const timeBlockingDatum = element.querySelector('#timeBlockingDatum').value;
        const now = new Date();
        const DatumBlocking = new Date(timeBlockingDatum) - now;
        console.log(DatumBlocking);
    
        if (!playTime || !endTime || !intervallEinheit || !nameZeitplanung || !timeBlockingDatum) {
            alert('Bitte alle Felder ausfüllen.');
            changeButton(playButton);
            return;
        }
    
        const [startHours, startMinutes] = playTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
     
        console.log(startMinutes, endMinutes);
        const Differenz = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
        if ((endHours * 60 + endMinutes) - (startHours * 60 + startMinutes) < 1) {
            alert('Die Differenz zwischen Start- und Endzeit muss mindestens 20 Minuten betragen.');
            changeButton(playButton);
            return;
        }
        console.log(repeat);
       if(repeat === true){
        DateBlocking = 1;
        startMinutes = startMinutes + 3;
        endMinutes = endMinutes + 3;
        console.log(startMinutes, endMinutes);

       }
        let DateBlocking = setInterval(() =>{
        let timeBlockingInterval = setInterval(() => {
            if (!isRunningTimeBlocking) {
            clearInterval(DateBlocking);
             clearInterval(timeBlockingInterval);
                return;
          
         }
            const now = new Date();
            const currentHours = now.getHours();
            const currentMinutes = now.getMinutes();
    
            const currentTime = currentHours * 60 + currentMinutes;
            const startTotalMinutes = startHours * 60 + startMinutes;
            const endTotalMinutes = endHours * 60 + endMinutes;
           
            if (currentTime === startTotalMinutes) {
                if (Notification.permission === 'granted') {  
                    sendNotification('Beginn bestätigen!','Bestätigen Sie, dass Sie angefangen haben!');
                    console.log("Zeitplanung hat begonnen, Benachrichtigung wurde gesendet.");
                }
            }
        
           let timeoutCheckbox = setTimeout(() => {
            if (!isRunningTimeBlocking) return;
                if (!checkbox.checked) {
                    console.log(checkboxx);
                    if(!checkboxx){
                    alert('Die Checkbox wurde nicht abgehakt, obwohl 10 Minuten seit der Startzeit vergangen sind.'); //Ausrede muss hier erstellt werden
                    
                    neueOffeneAusrede(element.querySelector(".newTimeBlockingHeadline").querySelector("#nameZeitplanung").value);

                    checkboxx =true;
                    clearTimeout(timeoutCheckbox);}
                }
            }, 1 * 60 * 100);
        
            if (currentTime === endTotalMinutes) {
                if (Notification.permission === 'granted') {
                    sendNotification('Ende der geplanten Zeit',`Ihre eingeplante Zeit ${nameZeitplanung} ist abgelaufen`);}
                    checkbox.checked = false; 
                    if(intervallEinheit === 'Keine Wiederholung'){
                    changeButton(playButton);
                    stopTimeBlocking();
                }
                if (intervallEinheit !== 'Keine Wiederholung') {
                    handleRepeats(intervallEinheit, detailsInput, now, endDate, playButton, element, Differenz);
                    
                }
        
            }
           

        }, 60000);
    
        },DatumBlocking);
    
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }}
    function handleRepeats(intervallEinheit, detailsInput, now, endDateInput, playButton, element, Differenz) {
        let repeatInterval = 0;
        // Bestimmen des Wiederholungsintervalls
        if (intervallEinheit === 'Täglich') {
            repeatInterval =  1000 * 20; 
        } else if (intervallEinheit === 'Wöchentlich') {
            repeatInterval = 7 * 24 * 60 * 60 * 1000; 
        } else if (intervallEinheit === 'Monatlich') {
            repeatInterval = 30 * 24 * 60 * 1000 * 60; 
        } else if (intervallEinheit === 'Jährlich') {
            repeatInterval = 365 * 24 * 60 * 60 * 1000; 
        }
    
        if (detailsInput) {
            const detailsNumber = parseInt(detailsInput.match(/\d+/)[0]); // Extrahiere die Zahl
            repeatInterval *= detailsNumber;
            
        }
        let nextRepeatDate = new Date(now.getTime() + repeatInterval);

    // Startzeit für `nextRepeatDate` festlegen
    const [startHours, startMinutes] = element.querySelector("#startTime").value.split(':').map(Number);
    nextRepeatDate.setHours(startHours, startMinutes, 0, 0);

    // Eine Minute abziehen, um sicherzustellen, dass die Wiederholung pünktlich startet
    nextRepeatDate = new Date(nextRepeatDate.getTime() - 60000);

    console.log("Next Repeat Date:", nextRepeatDate);
    console.log("End Date:", endDateInput);

    

        if (nextRepeatDate <= endDateInput) {
            const delayUntilNextRepeat = nextRepeatDate - now - Differenz;
            setTimeout(() => {
                
                startTimeBlocking(element,true); // Start der Hauptfunktion erneut
            }, delayUntilNextRepeat);
        }else{
            changeButton(playButton);
            stopTimeBlocking();
            return;
        }
    }
  
  


//Timer Start
function changeButtons(button){
    var playButton = button.parentNode.querySelector("#play-buttonTimer");
    var stopButton = button.parentNode.querySelector("#stop-buttonTimer");

    if(playButton.classList.contains('hidden')){
        playButton.classList.remove('hidden');
        stopButton.classList.add('hidden');
        
    } else if (stopButton.classList.contains('hidden')) {
        stopButton.classList.remove('hidden');
        playButton.classList.add('hidden');
        startTimer(button.parentNode.parentNode);
    }
  }

function startTimer(element) {
    let myVar;
    let isRunning = false;  
    let Wiederholungencounter = 0;
    
    function stopTimer() {
        clearInterval(myVar);
        isRunning = false;  
        alert(`Timer wurde gestoppt.`);
    }
   
    const stopButton = element.querySelector("#stop-buttonTimer");
    stopButton.addEventListener("click", function() {
        stopTimer();
         
    });
    
    const playButton = element.querySelector("#play-buttonTimer");
    const intervalInput = element.querySelector("#Intervall");
    const Wiederholungen = element.querySelector("#wiederholungen");
    const timerName = element.querySelector("#timerName");
    const TimerNameValue = timerName.value;
    const WiederholungenValue = parseInt(Wiederholungen.value);
    const intervalValue = intervalInput.value * 60000;
    
    console.log(TimerNameValue);
    console.log(WiederholungenValue);
    console.log(intervalValue);
    if (WiederholungenValue < 1 || intervalValue <= 0) {
        alert("Bitte geben Sie gültige Werte ein für Intervall sowie Wiederholungen!");
        changeButtons(playButton);
        return;
    }
    
    if (Notification.permission === "default") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                startInterval();
            } else {
                alert("Benachrichtigungen sind blockiert. Bitte aktivieren Sie die Benachrichtigungen.");
            }
        });
    } else if (Notification.permission === "granted") {
        startInterval();
    } else {
        alert("Benachrichtigungen sind blockiert. Bitte aktivieren Sie die Benachrichtigungen.");
    }
  
    function startInterval() {
        alert("Timer hat gestartet.");
        isRunning = true;  
        myVar = setInterval(myTimer, intervalValue);

        function myTimer() {
            while (!isRunning) {
            clearInterval(myVar);
                return; }
            
            sendNotification('Timer abgelaufen!',`Ihr Timer ${TimerNameValue} ist abgelaufen`);
            Wiederholungencounter++;
            if (Wiederholungencounter >= WiederholungenValue) {
                clearInterval(myVar);
                isRunning = false;  
                changeButtons(playButton);
                console.log(`Timer hat angehalten nach ${Wiederholungencounter} Wiederholungen.`);
            }
        }
    }
} 



//Speichern: 



document.addEventListener('DOMContentLoaded', function() {
    if (document.body.classList.contains("bodyErinnerungen")) {    //Erinnerung
        document.addEventListener('click', function() {
            schließeAlleDropdownMenues(document.querySelector('#erinnerungListe'));
        },true);
        // Load saved data when the page loads
        loadDataErinnerung();
     
        
        // Add event listeners to save data automatically on input change
        document.getElementById('erinnerungListe').addEventListener('input', function(event) {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') {
                saveDataErinnerung();
            }
        });

        // Speichert die Daten wenn Löschen oder Fixieren benutzt wird. 
        document.addEventListener('click', function(event) {
            if (event.target.closest('.change')) {
                saveDataErinnerung();
            }
        });
    };
    
    if (document.body.classList.contains("bodyTimer")) { //timer 
        document.addEventListener('click', function() {
            schließeAlleDropdownMenues(document.querySelector('#timer-list'));
        },true);   
        // Load saved data when the page loads
        loadDataTimer();
        
        // Add event listeners to save data automatically on input change
        document.getElementById('timer-list').addEventListener('input', function(event) {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') {
                
                saveDataTimer();
            }
        });
        
        // Speichert die Daten wenn Löschen oder Fixieren benutzt wird. 
        document.addEventListener('click', function(event) {
            if (event.target.closest('.change')) {
                saveDataTimer();
            }
        });
    };

    if (document.body.classList.contains("bodyTimeBlocking")) {    //Blocking
        document.addEventListener('click', function() {
            schließeAlleDropdownMenues(document.querySelector('#blockingListe'));
        },true);
        // Load saved data when the page loads
        loadDataBlocking();
        
        // Add event listeners to save data automatically on input change
        document.getElementById('blockingListe').addEventListener('input', function(event) {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') {
                saveDataBlocking();
            }
        });

        // Speichert die Daten wenn Löschen oder Fixieren benutzt wird. 
        document.addEventListener('click', function(event) {
            if (event.target.closest('.change')) {
                saveDataBlocking();
            }
        });
    };

    if (document.body.classList.contains("bodyHallOfShame")) { //offeneAusrede
        document.addEventListener('click', function() {
            schließeAlleDropdownMenues(document.querySelector('#offeneAusredeListe'));
        },true);    
        // Load saved data when the page loads
        loadDataOffeneAusrede();

        // Add event listeners to save data automatically on input change
        document.getElementById('offeneAusredeListe').addEventListener('input', function(event) {
            if (event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT') {
                saveDataOffeneAusrede();
            }
        });

        // Speichert die Daten wenn Löschen oder Fixieren benutzt wird. 
        document.addEventListener('click', function(event) {
            if (event.target.closest('.change')) {
                saveDataOffeneAusrede();
            }
    })
    }
});


// Function to save data to localStorage 

function saveDataErinnerung() {   //Erinnerung

    const container = document.getElementById('erinnerungListe');
    const erinnerungElements = container.querySelectorAll('.erinnerungContainer');

    const data = Array.from(erinnerungElements).map((element, index) => {
        const name = element.querySelector('.erinnerungName').value;
        const checkboxErinnerung = element.querySelector('#checkboxErinnerung').checked;
        const date = element.querySelector('#inputDate').value;
        const time = element.querySelector('#inputTime').value;
        const intervallEinheit = element. querySelector('#intervallEinheit').value;
        const intervallWert = element. querySelector('#intervallWertSelect').value;
        const endDate = element.querySelector('#endDate').value;

        return {
            id: index,
            checkboxErinnerung: checkboxErinnerung,
            name: name,
            date: date,
            time: time,
            intervallEinheit: intervallEinheit,
            intervallWert: intervallWert, 
            endDate: endDate, 
        };
    });
    localStorage.setItem('erinnerungen', JSON.stringify(data));
    console.log(data);
}

function saveDataTimer() {  //Timer 
    const container = document.getElementById('timer-list');
    const timerElements = container.querySelectorAll('.timerContainer');
    console.log(timerElements)
    
    const data = Array.from(timerElements).map((element, index) => {
        console.log(element)
        const intervall = element.querySelector('#Intervall').value;
        const wiederholungen = element.querySelector('#wiederholungen').value;
        const nameTimer = element.querySelector('.timerName').value;
        
        return {
            id: index,
            intervall: intervall,
            wiederholungen: wiederholungen,
            nameTimer: nameTimer,
        };
    });
    localStorage.setItem('timer', JSON.stringify(data));
    console.log(data);
}

function saveDataBlocking() {   //Blocking
    const container = document.getElementById('blockingListe');
    const blockingElements = container.querySelectorAll('.blockingContainer');
    
    const data = Array.from(blockingElements).map((element, index) => {
        const nameBlocking = element.querySelector('#nameZeitplanung').value;
        const checkboxBlocking = element.querySelector('.checkboxTimeBlocking').checked;
        const startTime = element.querySelector('#startTime').value;
        const endTime = element.querySelector('#endTime').value;
        const intervallEinheit = element.querySelector('#intervallEinheit').value;
        const intervallWert = element.querySelector('#intervallWertSelect').value;
        const endDatum = element.querySelector('#endDate').value;

        return {
            id: index,
            nameBlocking: nameBlocking,
            checkboxBlocking: checkboxBlocking,
            startTime: startTime,
            endTime: endTime,
            intervallEinheit: intervallEinheit,
            intervallWert: intervallWert,
            endDatum: endDatum,
        };
    });
    localStorage.setItem('blocking', JSON.stringify(data));
    console.log(data);
}


function saveDataOffeneAusrede() {   //offeneAusrede
    const container = document.getElementById('offeneAusredeListe');
    const ausredeElements = container.querySelectorAll('.offeneAusredeContainer');
    console.log(ausredeElements);

    const data = Array.from(ausredeElements).map((element, index) => {
        console.log("element" + element + "index" + index);
        const ausredeDetailsInput = element.querySelector('#ausredeDetailsInput').value;
        console.log("ausredeDetailsInput " + ausredeDetailsInput);
        const ausredeName = element.querySelector('#ausredeName').innerText;

        return {
            id: index,
            ausredeDetailsInput: ausredeDetailsInput,
            ausredeName: ausredeName,
        };
    });
    localStorage.setItem('offeneAusrede', JSON.stringify(data));
    console.log(data);
}


// Function to load data from localStorage

function loadDataErinnerung() {   //Erinnerung
    const data = JSON.parse(localStorage.getItem('erinnerungen'));
    if (data) {
        data.forEach(item => {
            createNewElementWithDataErinnerung(item);
        });
    }
}

function loadDataTimer() {          //Timer
    const data = JSON.parse(localStorage.getItem('timer'));
    if (data) {
        data.forEach(item => {
            createNewElementWithDataTimer(item);
        });
    }
}

function loadDataBlocking() {   //Blocking
    const data = JSON.parse(localStorage.getItem('blocking'));
    if (data) {
        data.forEach(item => {
            createNewElementWithDataBlocking(item);
        });
    }
}

function loadDataOffeneAusrede() {   //offeneAusrede
    console.log("Lade offeneAusreden")
    const data = JSON.parse(localStorage.getItem('offeneAusrede'));
    console.log(data);
    if (data) {
        console.log("Data zum laden vorhanden.")
        data.forEach(item => {
            createNewElementWithDataOffeneAusrede(item);
        });
    }
}



// Function to create a new element and populate it with data

function createNewElementWithDataErinnerung(data) {  //Erinnerung
    const container = document.getElementById('erinnerungListe');
    const originalDivErinnerung = document.createElement('div');
    originalDivErinnerung.className = 'erinnerungContainer';
    
    originalDivErinnerung.innerHTML = `
        <div class="erinnerungÜbersicht">
            <svg onclick="changeButto(this)"  id="play-button" class="play-button" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z" fill="#000000"></path> <path d="M16 12L10 16.3301V7.66987L16 12Z" fill="#000000"></path> </g></svg>
            <svg class="hidden"  id="stop-button" onclick="changeButto(this)"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="10"></circle> <line x1="10" y1="15" x2="10" y2="9"></line> <line x1="14" y1="15" x2="14" y2="9"></line> </g></svg>
            <input type="checkbox" class="checkboxErinnerung" id="checkboxErinnerung" name="placeholder" value="true" ${data.checkboxErinnerung ? 'checked' : ''}>
            <input class="erinnerungName" placeholder="Name der Erinnerung" type="text" value="${data.name}">
            <div class="container">
                <svg onclick="dropDownMenu(this)" class="menuErinnerung" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g clip-path="url(#clip0_105_1893)"> <circle cx="12" cy="12" r="9" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 12.01 12)" width="0.01" x="12.01" y="12"></rect> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 16.51 12)" width="0.01" x="16.51" y="12"></rect> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 7.51001 12)" width="0.01" x="7.51001" y="12"></rect> </g> <defs> <clipPath id="clip0_105_1893"> <rect fill="white" height="24" transform="translate(0 0.000976562)" width="24"></rect> </clipPath> </defs> </g></svg>
                <div id="dropdownMenu" class="dropdown-content hidden">
                    <a onclick="löschen(this)" href="#" class="change">Löschen</a>
                    <a onclick="fixieren(this)" href="#" class="change">Fixieren</a>
                </div>                                                                                                       
            </div>     
        </div>
        <div class="erinnerungDetails">
            <div class="datumContainer">
                <label  class="labelErinnerung"  for="inputDate">Datum:</label>
                <input id="inputDate" class="inputErinnerungDetails" placeholder="Datum" type="date" value="${data.date}">
                <label  class="labelErinnerung"  id="labelTime" for="inputTime">Uhrzeit:</label>
                <input id="inputTime"   class="inputErinnerungDetails" placeholder="Uhrzeit" type="time" value="${data.time}">
            </div>

            <div id="ErinnerungsDropDown">
                <label class="labelErinnerung" for="intervallEinheit">Intervall:</label>
                <div id="block">
                    <select class="inputErinnerungDetails" id="intervallEinheit" onclick="call(this)">
                        <option value="" disabled ${data.intervallEinheit === '' ? 'selected' : ''}>Bitte wählen...</option>
                        <option value="Keine Wiederholung" ${data.intervallEinheit === 'Keine Wiederholung' ? 'selected' : ''}>Keine Wiederholung</option>
                        <option value="Täglich" ${data.intervallEinheit === 'Täglich' ? 'selected' : ''}>Täglich</option>
                        <option value="Wöchentlich" ${data.intervallEinheit === 'Wöchentlich' ? 'selected' : ''}>Wöchentlich</option>
                        <option value="Monatlich" ${data.intervallEinheit === 'Monatlich' ? 'selected' : ''}>Monatlich</option>
                        <option value="Jährlich" ${data.intervallEinheit === 'Jährlich' ? 'selected' : ''}>Jährlich</option>
                    </select>

                    <div id="intervallWert" style=" margin-top: 10px; display:none;">
                        <select id="intervallWertSelect" value="${data.intervallWert}"></select>
                    </div>
                </div>
                <label  class="labelErinnerung" id="labelEndDate" for="endDate">Ende:</label>
                <input id="endDate" type="date" class="inputErinnerungDetails" value="${data.endDate}">
            </div> 
        </div>
    `;
    container.appendChild(originalDivErinnerung);
    
}

function createNewElementWithDataTimer(data) {          //Timer
    const container = document.getElementById('timer-list');
    const originalDivTimer = document.createElement('div');
    originalDivTimer.className = 'timerContainer';
    
    originalDivTimer.innerHTML = `
        <div class="timerHeadline">
            <svg onclick="changeButtons(this)"  id="play-buttonTimer" class="play-button" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z" fill="#000000"></path> <path d="M16 12L10 16.3301V7.66987L16 12Z" fill="#000000"></path> </g></svg>
            <svg class="hidden"  id="stop-buttonTimer" onclick="changeButtons(this)"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="10"></circle> <line x1="10" y1="15" x2="10" y2="9"></line> <line x1="14" y1="15" x2="14" y2="9"></line> </g></svg>
            <input class="input-nameTimer timerName" placeholder="Name Timer" type="text" id="timerName" value="${data.nameTimer}">
            
            <div class="container">
                <svg onclick="dropDownMenu(this)" class="Timermenu" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g clip-path="url(#clip0_105_1893)"> <circle cx="12" cy="12" r="9" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 12.01 12)" width="0.01" x="12.01" y="12"></rect> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 16.51 12)" width="0.01" x="16.51" y="12"></rect> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 7.51001 12)" width="0.01" x="7.51001" y="12"></rect> </g> <defs> <clipPath id="clip0_105_1893"> <rect fill="white" height="24" transform="translate(0 0.000976562)" width="24"></rect> </clipPath> </defs> </g></svg>
                <div id="dropdownMenu" class="dropdown-content hidden">
                    <a onclick="löschen(this)" href="#" class="change">Löschen</a>
                    <a onclick="fixieren(this)" href="#" class="change">Fixieren</a>
                </div>                                                                                                       
            </div>      
        </div>
        <div class="detailsTimer">
                <label class="intervall" for="Intervall">Intervall(min):</label>
                <input class="input-timer" type="number" name="Intervall" id="Intervall" min="1" value="${data.intervall}">
                <label class="wiederholungen" for="wiederholungen">Wiederholungen:</label>
                <input class="input-timer" type="number" name="Wiederholungen" id="wiederholungen" min="1" value="${data.wiederholungen}">
            </div>             
    `;
    container.appendChild(originalDivTimer);

}

function createNewElementWithDataBlocking(data) {  //Blocking
    const container = document.getElementById('blockingListe');
    const originalDivBlocking = document.createElement('div');
    originalDivBlocking.className = 'blockingContainer';
    
    originalDivBlocking.innerHTML = `
    <div class="newTimeBlockingHeadline" id=${data.id}>
         <input class="input-name" placeholder="Name Zeitplanung" type="text" id="nameZeitplanung" value="${data.nameBlocking}">                           
    </div>                                                                                                                                                                                                                                              
    <div class="inputTimeBlocking-container"> 
    <div class="datumContainer2">
     <svg onclick="changeButton(this)"  id="play-buttonZeitplanung" class="play-button" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z" fill="#000000"></path> <path d="M16 12L10 16.3301V7.66987L16 12Z" fill="#000000"></path> </g></svg>
        <svg class="hidden"  id="stop-buttonZeitplanung" onclick="changeButton(this)"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="10"></circle> <line x1="10" y1="15" x2="10" y2="9"></line> <line x1="14" y1="15" x2="14" y2="9"></line> </g></svg>
        <input type="checkbox" class="checkboxTimeBlocking" value="true" ${data.checkboxBlocking ? 'checked' : ''}>
        <label class="labelZeitplanung" id="labelZeitplanungDatum" for="timeBlockingDatum">Datum:</label>
                <input class="inputTimeBlocking"  type="date" id="timeBlockingDatum" name="Datum">
         <div class="container">
            <svg onclick="dropDownMenu(this)" class="menuBlocking" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g clip-path="url(#clip0_105_1893)"> <circle cx="12" cy="12" r="9" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 12.01 12)" width="0.01" x="12.01" y="12"></rect> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 16.51 12)" width="0.01" x="16.51" y="12"></rect> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 7.51001 12)" width="0.01" x="7.51001" y="12"></rect> </g> <defs> <clipPath id="clip0_105_1893"> <rect fill="white" height="24" transform="translate(0 0.000976562)" width="24"></rect> </clipPath> </defs> </g></svg>
            <div id="dropdownMenu" class="dropdown-content hidden">
                <a onclick="löschen(this)" href="#" class="change">Löschen</a>
                <a onclick="fixieren(this)" href="#" class="change">Fixieren</a>
            </div>                                                                                                       
        </div>      
                </div>
        <div class="datumContainer">
            <label class="labelZeitplanung" for="start-time">Start:</label>
            <input class="inputTimeBlocking"  type="time" id="startTime" name="start-time" value="${data.startTime}">
            <label  class="labelZeitplanung" id="labelEndTime" for="end-time">Ende:</label>
            <input  class="inputTimeBlocking"   type="time" id="endTime" name="end-time" value="${data.endTime}">
        </div>
        <div class="BlockingDropDown">
            <label class="labelZeitplanung" for="intervallEinheit">Intervall:</label>
            <div id="block">
                <select class="inputTimeBlocking" id="intervallEinheit" onclick="call(this)" value="${data.intervallEinheit}">
                    <option value="" disabled ${data.intervallEinheit === '' ? 'selected' : ''}>Bitte wählen...</option>
                        <option value="Keine Wiederholung" ${data.intervallEinheit === 'Keine Wiederholung' ? 'selected' : ''}>Keine Wiederholung</option>
                        <option value="Täglich" ${data.intervallEinheit === 'Täglich' ? 'selected' : ''}>Täglich</option>
                        <option value="Wöchentlich" ${data.intervallEinheit === 'Wöchentlich' ? 'selected' : ''}>Wöchentlich</option>
                        <option value="Monatlich" ${data.intervallEinheit === 'Monatlich' ? 'selected' : ''}>Monatlich</option>
                        <option value="Jährlich" ${data.intervallEinheit === 'Jährlich' ? 'selected' : ''}>Jährlich</option>
                </select>

                <div id="intervallWert" style=" margin-top: 10px; display:none;">
                    <select id="intervallWertSelect"></select>
                </div>
            </div>
            <label  class="labelZeitplanung" id="labelEndDate" for="endDate">Enddatum:</label>
            <input id="endDate" type="date" class="inputTimeBlocking" value="${data.endDatum}">
        </div>    
    </div>

    `;
    container.appendChild(originalDivBlocking);
}


function createNewElementWithDataOffeneAusrede(data) {  //offeneAusrede
    console.log("erstelle offene Ausrede mit Daten.");
    const container = document.getElementById('offeneAusredeListe');
    const originalDivOffeneAusrede = document.createElement('div');
    originalDivOffeneAusrede.className = 'offeneAusredeContainer';
    
    originalDivOffeneAusrede.innerHTML = `
        <div class="ausredeÜbersicht">
            <h3 id="ausredeName">${data.ausredeName}</h3>
        </div> 
        <div class="ausredeDetailsContainer"> 
        <textarea onclick="autoResize(this)" oninput="autoResize(this)" onblur="resizeBackToNormal(this)" class="ausredeDetailsInput" placeholder="Bitte Versäumnis begründen." id="ausredeDetailsInput">${data.ausredeDetailsInput}</textarea>
        </div>   
    `;
    container.appendChild(originalDivOffeneAusrede);
}


// Function to create a new element when the button is pressed

function createNewElementErinnerung(containerId) {   //Erinnerung
    const container = document.getElementById(containerId);
    const originalDivErinnerung = document.createElement('div');
    originalDivErinnerung.className = 'erinnerungContainer';
    
    originalDivErinnerung.innerHTML = `
        <div class="erinnerungÜbersicht">
                        <svg onclick="changeButto(this)"  id="play-button" class="play-button" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z" fill="#000000"></path> <path d="M16 12L10 16.3301V7.66987L16 12Z" fill="#000000"></path> </g></svg>
            <svg class="hidden"  id="stop-button" onclick="changeButto(this)"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="10"></circle> <line x1="10" y1="15" x2="10" y2="9"></line> <line x1="14" y1="15" x2="14" y2="9"></line> </g></svg>
            <input type="checkbox" class="checkboxErinnerung" id="checkboxErinnerung" name="placeholder">
            <input class="erinnerungName" placeholder="Name der Erinnerung" type="text">
            <div class="container">
        <svg onclick="dropDownMenu(this)" class="menuErinnerung" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g clip-path="url(#clip0_105_1893)"> <circle cx="12" cy="12" r="9" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 12.01 12)" width="0.01" x="12.01" y="12"></rect> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 16.51 12)" width="0.01" x="16.51" y="12"></rect> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 7.51001 12)" width="0.01" x="7.51001" y="12"></rect> </g> <defs> <clipPath id="clip0_105_1893"> <rect fill="white" height="24" transform="translate(0 0.000976562)" width="24"></rect> </clipPath> </defs> </g></svg>
            <div id="dropdownMenu" class="dropdown-content hidden">
                <a onclick="löschen(this)" href="#" class="change">Löschen</a>
                <a onclick="fixieren(this)" href="#" class="change">Fixieren</a>
            </div>                                                                                                       
        </div> 
        </div>
         <div class="erinnerungDetails">
                <div class="datumContainer">
                
                   <label  class="labelErinnerung" for="inputDate">Datum:</label>
            <input id="inputDate" class="inputErinnerungDetails" placeholder="Datum" type="date">
                    <label  class="labelErinnerung" id="labelTime for="inputTime">Uhrzeit:</label>
            <input id="inputTime" class="inputErinnerungDetails" placeholder="Uhrzeit" type="time">
         
            </div>
       
     <div id="ErinnerungsDropDown">
     
      <label class="labelErinnerung" for="intervallEinheit">Intervall:</label>
      <div id="block">
        <select class="inputErinnerungDetails" id="intervallEinheit" onclick="call(this)">
     <option value="" disabled selected>Bitte wählen...</option>
        <option value="Keine Wiederholung">Keine Wiederholung</option>
        <option value="Täglich">Täglich</option>
        <option value="Wöchentlich">Wöchentlich</option>
        <option value="Monatlich">Monatlich</option>
        <option value="Jährlich">Jährlich</option>
    </select>

    <div id="intervallWert" style=" margin-top: 10px; display:none;">
      <select id="intervallWertSelect" ></select>
        </div>
         </div>
        <label  class="labelErinnerung" id="labelEndDate" for="endDate">Ende:</label>
        <input id="endDate" type="date" class="inputErinnerungDetails">
    
        </div> 
            
                
            </div>
        </div>
    `;
    container.appendChild(originalDivErinnerung);
    saveDataErinnerung();  
}

function createNewElementTimer(containerId) {       //Timer
    const container = document.getElementById(containerId);
    const originalDivTimer = document.createElement('div');
    originalDivTimer.className = 'timerContainer';
    
    originalDivTimer.innerHTML = `
        <div class="timerHeadline">
            <svg onclick="changeButtons(this)"  id="play-buttonTimer" class="play-button" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z" fill="#000000"></path> <path d="M16 12L10 16.3301V7.66987L16 12Z" fill="#000000"></path> </g></svg>
            <svg class="hidden"  id="stop-buttonTimer" onclick="changeButtons(this)"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="10"></circle> <line x1="10" y1="15" x2="10" y2="9"></line> <line x1="14" y1="15" x2="14" y2="9"></line> </g></svg>
            <input class="input-nameTimer timerName" placeholder="Name Timer" type="text" id="timerName">
            
            <div class="container">
                <svg onclick="dropDownMenu(this)" class="Timermenu" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g clip-path="url(#clip0_105_1893)"> <circle cx="12" cy="12" r="9" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 12.01 12)" width="0.01" x="12.01" y="12"></rect> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 16.51 12)" width="0.01" x="16.51" y="12"></rect> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 7.51001 12)" width="0.01" x="7.51001" y="12"></rect> </g> <defs> <clipPath id="clip0_105_1893"> <rect fill="white" height="24" transform="translate(0 0.000976562)" width="24"></rect> </clipPath> </defs> </g></svg>
                <div id="dropdownMenu" class="dropdown-content hidden">
                    <a onclick="löschen(this)" href="#" class="change">Löschen</a>
                    <a onclick="fixieren(this)" href="#" class="change">Fixieren</a>
                </div>                                                                                                       
            </div>      
        </div>
        <div class="detailsTimer">
             
                <label class="intervall" for="Intervall">Intervall(min):</label>
                <input class="input-timer" type="number"  id="Intervall" min="1"  >
                <label class="wiederholungen" for="wiederholungen">Wiederholungen:</label>
                <input class="input-timer" type="number"  id="wiederholungen" min="1" >
        </div>
    `;
    container.appendChild(originalDivTimer);
    saveDataTimer();  // Save the state immediately after creating a new element
}

function createNewElementBlocking(containerId) {   //Blocking
    const container = document.getElementById(containerId);
    const originalDivBlocking = document.createElement('div');
    originalDivBlocking.className = 'blockingContainer';
    
    originalDivBlocking.innerHTML = `
        <div class="newTimeBlockingHeadline" >
            <input class="input-name" placeholder="Name Zeitplanung" type="text" id="nameZeitplanung">
            </div>                                                                                                                                                                                                                                             
        <div class="inputTimeBlocking-container"> 
        <div class="datumContainer2">
         <svg onclick="changeButton(this)"  id="play-buttonZeitplanung" class="play-button" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z" fill="#000000"></path> <path d="M16 12L10 16.3301V7.66987L16 12Z" fill="#000000"></path> </g></svg>
            <svg class="hidden"  id="stop-buttonZeitplanung" onclick="changeButton(this)"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="10"></circle> <line x1="10" y1="15" x2="10" y2="9"></line> <line x1="14" y1="15" x2="14" y2="9"></line> </g></svg>
            <input type="checkbox" class="checkboxTimeBlocking">
        <label class="labelZeitplanung" id="labelZeitplanungDatum" for="timeBlockingDatum">Datum:</label>
                <input class="inputTimeBlocking"  type="date" id="timeBlockingDatum" name="Datum">
                 <div class="container">
                <svg onclick="dropDownMenu(this)" class="menuBlocking" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g clip-path="url(#clip0_105_1893)"> <circle cx="12" cy="12" r="9" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 12.01 12)" width="0.01" x="12.01" y="12"></rect> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 16.51 12)" width="0.01" x="16.51" y="12"></rect> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 7.51001 12)" width="0.01" x="7.51001" y="12"></rect> </g> <defs> <clipPath id="clip0_105_1893"> <rect fill="white" height="24" transform="translate(0 0.000976562)" width="24"></rect> </clipPath> </defs> </g></svg>
                <div id="dropdownMenu" class="dropdown-content hidden">
                    <a onclick="löschen(this)" href="#" class="change">Löschen</a>
                    <a onclick="fixieren(this)" href="#" class="change">Fixieren</a>
                </div>                                                                                                       
            </div>       
        </div>
          <div class="datumContainer">
            <label class="labelZeitplanung" for="starTime">Start:</label>
                <input class="inputTimeBlocking"  type="time" id="startTime" name="start-time">
                <label  class="labelZeitplanung" for="endTime">Ende:</label>
                <input  class="inputTimeBlocking"   type="time" id="endTime" name="end-time">
          </div>
        
          <div class="BlockingDropDown">
         
      <label class="labelZeitplanung" for="intervallEinheit">Intervall:</label>
      <div id="block">
        <select class="inputTimeBlocking" id="intervallEinheit" onclick="call(this)">
     <option value="" disabled selected>Bitte wählen...</option>
       <option value="Keine Wiederholung">Keine Wiederholung</option>
      <option value="Täglich">Täglich</option>
      <option value="Wöchentlich">Wöchentlich</option>
      <option value="Monatlich">Monatlich</option>
      <option value="Jährlich">Jährlich</option>
    </select>

    <div id="intervallWert" style=" margin-top: 10px; display:none;">
      <select id="intervallWertSelect"></select>
        </div>
         </div>
        <label  class="labelZeitplanung" id="labelEndDate" for="endDate">Enddatum:</label>
        <input id="endDate" type="date" class="inputTimeBlocking">
    
        </div> 
            
                
    </div>

    </div>
    `;
    container.appendChild(originalDivBlocking);
    saveDataBlocking();  // Save the state immediately after creating a new element
    
}

function neueOffeneAusrede(neueAusredeName){
    console.log("neueOffeneAusrede");
    
    // Retrieve the existing data from localStorage
    let existingData = localStorage.getItem('offeneAusrede');
    
    if (existingData) {
        // Parse the existing data into an array
        existingData = JSON.parse(existingData);
    } else {
        // If no data exists, initialize as an empty array
        existingData = [];
    }
    
    // New data to be added
    const newData = {
        id: existingData.length, // Incremental ID
        ausredeDetailsInput: '', // Blank value, as in the existing data
        ausredeName: neueAusredeName // New value
    };

    // Add the new data object to the array
    existingData.push(newData);
    
    // Save the updated array back to localStorage
    localStorage.setItem('offeneAusrede', JSON.stringify(existingData));
    
    console.log('Data saved successfully:', existingData);
}
        

//erstellt neue Ausreden nur zum Testen der App
function createNewElementOffeneAusrede(containerId, ausredeName) {   //offeneAusrede
    const container = document.getElementById(containerId);
    const originalDivOffeneAusrede = document.createElement('div');
    originalDivOffeneAusrede.className = 'offeneAusredeContainer';
    
    originalDivOffeneAusrede.innerHTML = `
        <div class="ausredeÜbersicht">   
                <h3 id="ausredeName">${ausredeName}</h3>
            </div>  
            <div class="ausredeDetailsContainer">             
            <textarea  onclick="autoResize(this)" oninput="autoResize(this)" onblur="resizeBackToNormal(this)" class="ausredeDetailsInput" placeholder="Bitte Versäumnis begründen." id="ausredeDetailsInput"></textarea>
            </div>
    `;
    container.appendChild(originalDivOffeneAusrede);
    saveDataOffeneAusrede();  // Save the state immediately after creating a new element 
}



// errinnerung
let stopped = false;
let timerId = null;

function changeButto(button) {
    const playButton = button.parentNode.querySelector("#play-button");
    const stopButton = button.parentNode.querySelector("#stop-button");
    console.log(button.parentNode);
    console.log(playButton);

    if (playButton.classList.contains('hidden')) {
        console.log("4");
        // Stoppen des Timers und Umschalten auf Play-Button
        stopped = true;
        clearTimeout(timerId); // Timer stoppen, falls er läuft
        playButton.classList.remove('hidden');
        stopButton.classList.add('hidden');
       
    } else {
        console.log("5");
        // Starten der Erinnerung und Umschalten auf Stop-Button
        stopped = false;
        stopButton.classList.remove('hidden');
        playButton.classList.add('hidden');
        
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        } else {
            console.log(button.parentNode.parentNode);
            startReminder(button.parentNode.parentNode);
        }

        // EventListener hinzufügen, um auf das Stoppen zu reagieren
        stopButton.addEventListener('click', stopReminder);
    }
}

function stopReminder() {
    console.log("3");
    stopped = true;
    clearTimeout(timerId); // Timer stoppen
    console.log("Die Erinnerung wurde angehalten.");
}
function startReminder(einheit, isRepeat = false) {
    const playButton = einheit.querySelector("#play-button");
    const dateInput = einheit.querySelector('#inputDate');
    const timeInput = einheit.querySelector('#inputTime');
    const reminderName = einheit.querySelector('.erinnerungName').value;
    const checkboxx = einheit.querySelector('#checkboxErinnerung');
    const intervallEinheit = einheit.querySelector('#intervallEinheit').value; // Das ausgewählte Intervall (Täglich, Wöchentlich...)
    const detailsInput = einheit.querySelector('#intervallWertSelect').value; // Die genauere Auswahl (Jeden 2. Tag, Jede 2. Woche...)
    const endDateInput = einheit.querySelector('#endDate').value; // Das Enddatum der Erinnerung
    
    console.log(dateInput.value, timeInput.value, reminderName, intervallEinheit);
    if (!dateInput.value || !timeInput.value || !reminderName || !intervallEinheit) {
        alert("Bitte alle Felder ausfüllen.");
        console.log("1");
        stopped = true;
        changeButto(playButton);
        console.log("2");
        return;
    }
    let reminderDateTime = new Date(`${dateInput.value}T${timeInput.value}`);
    let now = new Date();
    let timeToReminder = reminderDateTime - now;
    //Verhindert eine wiederholte Erinnerung, die in der Vergangenheit liegt
    if (timeToReminder <= 0 && !isRepeat) {
        alert('Die eingegebene Zeit liegt in der Vergangenheit.');
        stopped = true;
        changeButto(playButton);
        return;
    }
    // Adjust the time for repeated reminders if time is in the past
    if (timeToReminder <= 0 && isRepeat) {
        let repeatInterval = 0;
        if (intervallEinheit === 'Täglich') {
            repeatInterval =  24 * 60 * 60 * 1000; // 1 Tag
        } else if (intervallEinheit === 'Wöchentlich') {
            repeatInterval = 7 * 24 * 60 * 60 * 1000; // 1 Woche
        } else if (intervallEinheit === 'Monatlich') {
            repeatInterval = 30 * 24 * 60 * 60 * 1000; // 1 Monat
        } else if (intervallEinheit === 'Jährlich') {
            repeatInterval = 365 * 24 * 60 * 60 * 1000; // 1 Jahr
        }
        if (detailsInput) {
            const detailsNumber = parseInt(detailsInput.match(/\d+/)[0]); // Extrahiere die Zahl
            repeatInterval *= detailsNumber;
        }
        while (timeToReminder <= 0) {
            // Füge das Intervall hinzu, bis die Zeit in der Zukunft liegt
            reminderDateTime = new Date(reminderDateTime.getTime() + repeatInterval);
            timeToReminder = reminderDateTime - now;
        }
    }
    timerId = setTimeout(() => {

    if (!stopped) {
        console.log("Benachrichtigung: Es ist Zeit für deine Erinnerung:...");
        sendNotification('Erinnerung fällig!',`Es ist Zeit für deine Erinnerung: ${reminderName}`);
        console.log("Benachrichtigung: Es ist Zeit für deine Erinnerung:... wurde gesendet");
    }
    console.log(intervallEinheit);
    if (intervallEinheit !== 'Keine Wiederholung') {   
    startReminder(einheit, true); 
    }
       
            setTimeout(() => {
            if (!checkboxx.checked) {
                console.log("Checkbox wurde nicht abgehakt.");
                alert('Die Checkbox wurde nicht abgehakt, obwohl 10 Minuten nach Ablauf der Erinnerung vergangen sind.');  //Ausrede für Erinnerung muss hier erstellt werden. 
                neueOffeneAusrede(reminderName);
                console.log(reminderName);
            }
        }, 1 * 6 * 1000);
        checkIntervalId = setInterval(() => {
            let now = new Date(); // Aktualisiere die Zeit bei jeder Wiederholung
            let endDateTime = endDateInput ? new Date(`${endDateInput}T23:59:59`) : null;
    
            if (intervallEinheit === 'Keine Wiederholung' || (endDateTime && now >= endDateTime)) {
                console.log("Enddatum erreicht, Erinnerung wird gestoppt.");
                stopped = true;  // Automatisch stoppen nach der Benachrichtigung
                changeButto(einheit.querySelector("#stop-button"));
    
                // Stoppe das Intervall, wenn das Enddatum erreicht ist
                clearInterval(checkIntervalId);
            }
        }, 60 * 1000);

    }, timeToReminder);
}


function call(button) {
    let repeatSelect = button.parentNode.parentNode.querySelector("#intervallEinheit");
    let intervallWertDiv = button.parentNode.parentNode.querySelector("#intervallWert");
    let detailsSelect = button.parentNode.parentNode.querySelector("#intervallWertSelect");
    let lastSelectedRepeat = ''; // Hier speichern wir die letzte Auswahl im Repeat-Dropdown

    function updateDetailsOptions(type) {
        detailsSelect.innerHTML = ''; // Clear previous options
        let options = [];
        if (type === 'Täglich') {
            const defaultOption = document.createElement('option');
                defaultOption.textContent = 'Bitte wählen...';
                defaultOption.disabled = true; // Deaktiviert, damit sie nicht ausgewählt werden kann
                defaultOption.selected = true; // Wird standardmäßig ausgewählt
                detailsSelect.appendChild(defaultOption); 
            for (let i = 1; i <= 10; i++) {
                options.push(`Jeden ${i}. Tag`);
            }
        } else if (type === 'Wöchentlich') {
            const defaultOption = document.createElement('option');
                defaultOption.textContent = 'Bitte wählen...';
                defaultOption.disabled = true; // Deaktiviert, damit sie nicht ausgewählt werden kann
                defaultOption.selected = true; // Wird standardmäßig ausgewählt
                detailsSelect.appendChild(defaultOption); 
            for (let i = 1; i <= 10; i++) {
                options.push(`Jede ${i}. Woche`);
            }
        } else if (type === 'Monatlich') {
            const defaultOption = document.createElement('option');
            defaultOption.textContent = 'Bitte wählen...';
            defaultOption.disabled = true; // Deaktiviert, damit sie nicht ausgewählt werden kann
            defaultOption.selected = true; // Wird standardmäßig ausgewählt
            detailsSelect.appendChild(defaultOption); 
            for (let i = 1; i <= 12; i++) {
                options.push(`Jeden ${i}. Monat`);
            }
        } else if (type === 'Jährlich') {
            const defaultOption = document.createElement('option');
            defaultOption.textContent = 'Bitte wählen...';
            defaultOption.disabled = true; // Deaktiviert, damit sie nicht ausgewählt werden kann
            defaultOption.selected = true; // Wird standardmäßig ausgewählt
            detailsSelect.appendChild(defaultOption); 
            for (let i = 1; i <= 5; i++) {
                options.push(`Jedes Jahr ${i}`);
            }
        } else if (type === 'Keine Wiederholung') {
            intervallWertDiv.style.display = 'none';
        }

        // Add options to the second dropdown
        options.forEach(optionText => {
            const option = document.createElement('option');
            option.textContent = optionText;
            detailsSelect.appendChild(option);
        });
    }

    // Event listener for first dropdown
    repeatSelect.addEventListener('click', function() {
        const selectedValue = repeatSelect.value;
        lastSelectedDetail = '';
    
        // Unabhängig von der Auswahl wird die Funktion aufgerufen
        if (selectedValue) {
            intervallWertDiv.style.display = 'block'; // Zeige das zweite Dropdown
            updateDetailsOptions(selectedValue); // Aktualisiere die Optionen im zweiten Dropdown
            lastSelectedRepeat = selectedValue; // Speichere die Auswahl
        } else {
            intervallWertDiv.style.display = 'none'; // Verstecke das zweite Dropdown
        }
    });
    
    let lastSelectedDetail = '';
    detailsSelect.addEventListener('change', function() {
        lastSelectedDetail = detailsSelect.value;
        intervallWertDiv.style.display = 'none'; // Verstecke das zweite Dropdown nach der Auswahl
    });
}    

 



function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
  textarea.addEventListener('input', autoResize);
}

function resizeBackToNormal(textarea){
    textarea.style.height = '50px';
}