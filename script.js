const symbolButton = document.getElementById('symbolButton');
const elementToShow = document.getElementById('elementToShow');
const container = document.getElementById('container');
const moreInfos = document.getElementById('Details');
const playButton = document.getElementById('play-button');
const stopButton = document.getElementById('stop-button');



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
 

function createNewElement(id, containerId){
    let originalDiv = document.getElementById(id); 
let clonedDiv = originalDiv.cloneNode(true)
let container = document.getElementById(containerId);
let firstChild = container.firstChild;
let inputElements = clonedDiv.querySelectorAll('input');
let dropdownMenus = container.querySelectorAll('.dropdown-content');
dropdownMenus.forEach(menu => {
    menu.classList.add('hidden');
});

inputElements.forEach(input => {
        input.value = '';
    });

 



container.insertBefore(clonedDiv, firstChild);
let newDropdownMenu = clonedDiv.querySelector('.dropdown-content');
newDropdownMenu.classList.add('hidden');
let playButton = clonedDiv.querySelector('#play-button');
let stopButton = clonedDiv.querySelector('#stop-button');
if (playButton && stopButton) {
    playButton.classList.remove('hidden');
    stopButton.classList.add('hidden');
}



}

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
    } else {
      dropdownMenu.classList.add('hidden');
    }
}

  


function löschen(button) {
    
    var parentElement = button.parentNode.parentNode.parentNode.parentNode;

    if (parentElement.parentNode.children.length > 1) {
       
        parentElement.remove();
    } else {
       
        createNewElement('newTimeBlocking', 'timeBlockingList');
        parentElement.remove();
    }
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
    var playButton = button.parentNode.querySelector("#play-button");
    var stopButton = button.parentNode.querySelector("#stop-button");
    
    
    if(playButton.classList.contains('hidden')){
        playButton.classList.remove('hidden');
        stopButton.classList.add('hidden');
        stopTimeBlocking();
        
    } else if (stopButton.classList.contains('hidden')) {
        stopButton.classList.remove('hidden');
        playButton.classList.add('hidden');
        NotificatioPermission(button.parentNode.parentNode);
        
    }
  }

  function NotificatioPermission(element) {

    if (!("Notification" in window)) {
        alert("Dieser Browser unterstützt keine Benachrichtigungen");
    } else {
        alert("Benachrichtigungen sind aktiviert");
    }
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
    let  repeat = false;
    let checkboxx = false;
    let neueAusredenZwischenspeicher = [];
    function startTimeBlocking(element) {
        isRunningTimeBlocking = true;
        console.log(element.querySelector(".newTimeBlockingHeadline").querySelector("#nameZeitplanung").value);  //Name der Zeitplanung
       
        
        const playTime = element.querySelector("#startTime").value;
        const endTime = element.querySelector("#endTime").value;
        const playButton = element.querySelector("#play-button");
        const nameZeitplanung = element.querySelector('#nameZeitplanung').value;
        const checkbox = element.querySelector('.checkboxTimeBlocking');
        const repeatInput = element.querySelector('#repeatInput').value; // Das ausgewählte Intervall (Täglich, Wöchentlich...)
        const detailsInput = element.querySelector('#details').value; // Die genauere Auswahl (Jeden 2. Tag, Jede 2. Woche...)
        const endDateInput = element.querySelector('#endDate').value; // Das Enddatum der Erinnerung
        const endDate = new Date(endDateInput); // Umwandlung in ein Date-Objekt

    
        if (!playTime || !endTime || !repeatInput || !nameZeitplanung) {
            alert('Bitte alle Felder ausfüllen.');
            changeButton(playButton);
            return;
        }
    
        const [startHours, startMinutes] = playTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
     
        if ((endHours * 60 + endMinutes) - (startHours * 60 + startMinutes) < 1) {
            alert('Die Differenz zwischen Start- und Endzeit muss mindestens 20 Minuten betragen.');
            changeButton(playButton);
            return;
        }
    
        
        let timeBlockingInterval = setInterval(() => {
            if (!isRunningTimeBlocking) {
                
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
                    new Notification('Bestätigen Sie, dass Sie angefangen haben!');
                }
            }
    
           let timeoutCheckbox = setTimeout(() => {
                if (!isRunningTimeBlocking) return;
                if (!checkbox.checked) {
                    if(!checkboxx){
                    alert('Die Checkbox wurde nicht abgehakt, obwohl 10 Minuten seit der Startzeit vergangen sind.'); //Ausrede muss hier erstellt werden
                    neueAusredenZwischenspeicher.push(element.querySelector(".newTimeBlockingHeadline").querySelector("#nameZeitplanung").value);

                   checkboxx =true;
                    clearTimeout(timeoutCheckbox);}
                }
            }, 10 * 60 * 1000);
        
            if (currentTime === endTotalMinutes) {
                if (Notification.permission === 'granted') {
                    new Notification(`Ihre eingeplante Zeit ${nameZeitplanung} ist abgelaufen`);}
                    checkbox.checked = false; 
                    if(repeatInput === 'Keine Wiederholung'){
                    changeButton(playButton);
                    stopTimeBlocking();
                }
                if (repeatInput !== 'Keine Wiederholung') {
                    handleRepeats(repeatInput, detailsInput, now, endDate, playButton, element);
                    
                }
        
            }
           

        }, 60000);
    
    
    
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }}
    function handleRepeats(repeatInput, detailsInput, now, endDateInput, playButton, element) {
        let repeatInterval = 0;
        // Bestimmen des Wiederholungsintervalls
        if (repeatInput === 'Täglich') {
            repeatInterval =  1000 * 60 * 60 *24; 
        } else if (repeatInput === 'Wöchentlich') {
            repeatInterval = 7 * 24 * 60 * 60 * 1000; 
        } else if (repeatInput === 'Monatlich') {
            repeatInterval = 30 * 24 * 60 * 1000 * 60; 
        } else if (repeatInput === 'Jährlich') {
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
            const delayUntilNextRepeat = nextRepeatDate - now;
            setTimeout(() => {
                
                startTimeBlocking(element); // Start der Hauptfunktion erneut
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
   
    if (!("Notification" in window)) {
        alert("Dieser Browser unterstützt keine Benachrichtigungen");
    } else {
        alert("Benachrichtigungen sind aktiviert");
    }
    
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
            
            new Notification(`Ihr Timer ${TimerNameValue} ist abgelaufen`);
            Wiederholungencounter++;
            if (Wiederholungencounter >= WiederholungenValue) {
                clearInterval(myVar);
                isRunning = false;  
                changeButtons(playButton);
                new Notification(`Timer hat angehalten nach ${Wiederholungencounter} Wiederholungen.`);
            }
        }
    }
} 



//Speichern: 

document.addEventListener('DOMContentLoaded', function() {
    if (document.body.class === "bodyErinnerungen") {     //Erinnerung
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
    
    if (document.body.class === "bodyTimer") {      //Timer 
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

    if (document.body.class === "bodyTimeBlocking") {     //Blocking
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

    if (document.body.class === "bodyHallofShame") {     //offeneAusrede
        // Load saved data when the page loads
        loadDataOffeneAusrede();
        iterate_neueAusredenZwischenspeicher();  //Erstellt alle bisher nur in "neueAusredenZwischenspeicher" speicherten offenen Ausreden. Entfernt dabei sämtliche Ausreden aus "neueAusredenZwischenspeicher".
        saveDataOffeneAusrede();                 //Speichert die neu erstellten Ausreden. Diese sind nun bei den anderen offenen Ausreden gespeichert.  

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
        const date = element.querySelector('#inputDate').value;
        const time = element.querySelector('#inputTime').value;
        const name = element.querySelector('.erinnerungName').value;

        return {
            id: index,
            date: date,
            time: time,
            name: name,
        };
    });
    localStorage.setItem('erinnerungen', JSON.stringify(data));
    console.log(data);
}

function saveDataTimer() {  //Timer 
    const container = document.getElementById('timer-list');
    const timerElements = container.querySelectorAll('.timerContainer');
    
    const data = Array.from(timerElements).map((element, index) => {
        const intervall = element.querySelector('#Intervall').value;
        const wiederholungen = element.querySelector('#wiederholungen').value;
        const nameTimer = element.querySelector('.input-name').value;
        
        return {
            id: index,
            intervall: intervall,
            wiederholungen: wiederholungen,
            nameTimer: nameTimer,
        };
    });
    localStorage.setItem('timer', JSON.stringify(data));
}

function saveDataBlocking() {   //Blocking
    const container = document.getElementById('blockingListe');
    const blockingElements = container.querySelectorAll('.blockingContainer');
    
    const data = Array.from(blockingElements).map((element, index) => {
      
        const startTime = element.querySelector('#start-time').value;
        const endTime = element.querySelector('#end-time').value;
        const nameBlocking = element.querySelector('#nameZeitplanung').value;

        return {
            id: index,
            startTime: startTime,
            endTime: endTime,
            nameBlocking: nameBlocking,
        };
    });
    localStorage.setItem('blocking', JSON.stringify(data));
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
            <svg class="hidden"  id="stop-button" onclick="changeButtons(this)"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="10"></circle> <line x1="10" y1="15" x2="10" y2="9"></line> <line x1="14" y1="15" x2="14" y2="9"></line> </g></svg>
            <input type="checkbox" class="checkboxErinnerung" id="checkboxErinnerung" name="placeholder">
            <input class="input-nameErinnerung" placeholder="Name der Erinnerung" type="text" value="${data.name}">
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
     
      <label class="labelErinnerung" for="repeatInput">Intervall:</label>
      <div id="block">
        <select class="inputErinnerungDetails" id="repeatInput" onclick="call(this)">
     <option value="" disabled selected>Bitte wählen...</option>
      <option value="nichts">Keine Wiederholung</option>
      <option value="Täglich">Täglich</option>
      <option value="Wöchentlich">Wöchentlich</option>
      <option value="Monatlich">Monatlich</option>
      <option value="Jährlich">Jährlich</option>
    </select>

    <div id="extraOptions" style=" margin-top: 10px; display:none;">
      <select id="details"></select>
        </div>
         </div>
        <label  class="labelErinnerung" id="labelEndDate" for="endDate">Ende:</label>
        <input id="endDate" type="date" class="inputErinnerungDetails">
    
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
            <input class="input-nameTimer" placeholder="Name Timer" type="text" id="timerName" value="${data.nameTimer}">
            
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
     <div class="newTimeBlockingHeadline" >
            <svg onclick="changeButton(this)"  id="play-button" class="play-button" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z" fill="#000000"></path> <path d="M16 12L10 16.3301V7.66987L16 12Z" fill="#000000"></path> </g></svg>
            <svg class="hidden"  id="stop-button" onclick="changeButton(this)"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="10"></circle> <line x1="10" y1="15" x2="10" y2="9"></line> <line x1="14" y1="15" x2="14" y2="9"></line> </g></svg>
             <input type="checkbox" class="checkboxTimeBlocking">
            <input class="input-name" placeholder="Name Zeitplanung" type="text" id="nameZeitplanung">
           
            <div class="container">
                <svg onclick="dropDownMenu(this)" class="menuBlocking" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g clip-path="url(#clip0_105_1893)"> <circle cx="12" cy="12" r="9" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 12.01 12)" width="0.01" x="12.01" y="12"></rect> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 16.51 12)" width="0.01" x="16.51" y="12"></rect> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 7.51001 12)" width="0.01" x="7.51001" y="12"></rect> </g> <defs> <clipPath id="clip0_105_1893"> <rect fill="white" height="24" transform="translate(0 0.000976562)" width="24"></rect> </clipPath> </defs> </g></svg>
                <div id="dropdownMenu" class="dropdown-content hidden">
                    <a onclick="löschen(this)" href="#" class="change">Löschen</a>
                    <a onclick="fixieren(this)" href="#" class="change">Fixieren</a>
                </div>                                                                                                       
            </div>                                  
        </div>                                                                                                                                                                                                                                              
        <div class="inputTimeBlocking-container"> 
          <div class="datumContainer">
            
           
                <label class="labelZeitplanung" for="start-time">Start:</label>
                <input class="inputTimeBlocking"  type="time" id="startTime" name="start-time" value="${data.startTime}">
                <label  class="labelZeitplanung" id="labelEndTime" for="end-time">Ende:</label>
                <input  class="inputTimeBlocking"   type="time" id="endTime" name="end-time" value="${data.endTime}">
          </div>
          <div class="BlockingDropDown">
          
          
      <label class="labelZeitplanung" for="repeatInput">Intervall:</label>
      <div id="block">
        <select class="inputTimeBlocking" id="repeatInput" onclick="call(this)" value="${data.repeatInput}">
     <option value="" disabled selected>Bitte wählen...</option>
       <option value="nichts">Keine Wiederholung</option>
      <option value="Täglich">Täglich</option>
      <option value="Wöchentlich">Wöchentlich</option>
      <option value="Monatlich">Monatlich</option>
      <option value="Jährlich">Jährlich</option>
    </select>

    <div id="extraOptions" style=" margin-top: 10px; display:none;">
      <select id="details"></select>
        </div>
         </div>
        <label  class="labelZeitplanung" id="labelEndDate" for="endDate">Enddatum:</label>
        <input id="endDate" type="date" class="inputTimeBlocking">
    
        </div> 
            
                
    </div>

    </div>
    `;
    container.appendChild(originalDivBlocking);
}


function createNewElementWithDataOffeneAusrede(data) {  //offeneAusrede
    console.log("erstelle offeneAusrede mit Daten.");
    const container = document.getElementById('offeneAusredeListe');
    const originalDivOffeneAusrede = document.createElement('div');
    originalDivOffeneAusrede.className = 'offeneAusredeContainer';
    
    originalDivOffeneAusrede.innerHTML = `
        <div class="ausredeÜbersicht">
            <h3 id="ausredeName">${data.ausredeName}</h3>
        </div>                
        <textarea class="ausredeDetailsInput" placeholder="Bitte Versäumnis begründen." id="ausredeDetailsInput" rows="7" cols="50">${data.ausredeDetailsInput}</textarea>
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
            <svg class="hidden"  id="stop-button" onclick="changeButtons(this)"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="10"></circle> <line x1="10" y1="15" x2="10" y2="9"></line> <line x1="14" y1="15" x2="14" y2="9"></line> </g></svg>
            <input type="checkbox" class="checkboxErinnerung" id="checkboxErinnerung" name="placeholder">
            <input class="input-nameErinnerung erinnerungName" placeholder="Name der Erinnerung" type="text">
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
     
      <label class="labelErinnerung" for="repeatInput">Intervall:</label>
      <div id="block">
        <select class="inputErinnerungDetails" id="repeatInput" onclick="call(this)">
     <option value="" disabled selected>Bitte wählen...</option>
       <option value="nichts">Keine Wiederholung</option>
      <option value="Täglich">Täglich</option>
      <option value="Wöchentlich">Wöchentlich</option>
      <option value="Monatlich">Monatlich</option>
      <option value="Jährlich">Jährlich</option>
    </select>

    <div id="extraOptions" style=" margin-top: 10px; display:none;">
      <select id="details"></select>
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
            <svg onclick="changeButtons(this)"  id="play-button" class="play-button" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z" fill="#000000"></path> <path d="M16 12L10 16.3301V7.66987L16 12Z" fill="#000000"></path> </g></svg>
            <svg class="hidden"  id="stop-button" onclick="changeButtons(this)"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="10"></circle> <line x1="10" y1="15" x2="10" y2="9"></line> <line x1="14" y1="15" x2="14" y2="9"></line> </g></svg>
            <input class="input-name" placeholder="Name Timer" type="text" id="timerName">
            
            <div class="container">
                <svg onclick="dropDownMenu(this)" class="menuBlocking" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g clip-path="url(#clip0_105_1893)"> <circle cx="12" cy="12" r="9" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 12.01 12)" width="0.01" x="12.01" y="12"></rect> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 16.51 12)" width="0.01" x="16.51" y="12"></rect> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 7.51001 12)" width="0.01" x="7.51001" y="12"></rect> </g> <defs> <clipPath id="clip0_105_1893"> <rect fill="white" height="24" transform="translate(0 0.000976562)" width="24"></rect> </clipPath> </defs> </g></svg>
                <div id="dropdownMenu" class="dropdown-content hidden">
                    <a onclick="löschen(this)" href="#" class="change">Löschen</a>
                    <a onclick="fixieren(this)" href="#" class="change">Fixieren</a>
                </div>                                                                                                       
            </div>      
        </div>
        <div class="details">
            <div class="input-container"> 
                <span class="intervall">Intervall(min):</span>
                <input class="input-timer" type="number"  id="Intervall" min="1"  >
                <span class="wiederholungen">Wiederholungen:</span>
                <input class="input-timer" type="number"  id="wiederholungen" min="1" >
            </div>
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
            <svg onclick="changeButton(this)"  id="play-button" class="play-button" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z" fill="#000000"></path> <path d="M16 12L10 16.3301V7.66987L16 12Z" fill="#000000"></path> </g></svg>
            <svg class="hidden"  id="stop-button" onclick="changeButton(this)"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="10"></circle> <line x1="10" y1="15" x2="10" y2="9"></line> <line x1="14" y1="15" x2="14" y2="9"></line> </g></svg>
            <input type="checkbox" class="checkboxTimeBlocking">
            <input class="input-name" placeholder="Name Zeitplanung" type="text" id="nameZeitplanung">
            
            <div class="container">
                <svg onclick="dropDownMenu(this)" class="menuBlocking" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g clip-path="url(#clip0_105_1893)"> <circle cx="12" cy="12" r="9" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 12.01 12)" width="0.01" x="12.01" y="12"></rect> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 16.51 12)" width="0.01" x="16.51" y="12"></rect> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 7.51001 12)" width="0.01" x="7.51001" y="12"></rect> </g> <defs> <clipPath id="clip0_105_1893"> <rect fill="white" height="24" transform="translate(0 0.000976562)" width="24"></rect> </clipPath> </defs> </g></svg>
                <div id="dropdownMenu" class="dropdown-content hidden">
                    <a onclick="löschen(this)" href="#" class="change">Löschen</a>
                    <a onclick="fixieren(this)" href="#" class="change">Fixieren</a>
                </div>                                                                                                       
            </div>                                  
        </div>                                                                                                                                                                                                                                             
        <div class="inputTimeBlocking-container"> 
          <div class="datumContainer">
            <label class="labelZeitplanung" for="starTime">Start:</label>
                <input class="inputTimeBlocking"  type="time" id="startTime" name="start-time">
                <label  class="labelZeitplanung" for="endTime">Ende:</label>
                <input  class="inputTimeBlocking"   type="time" id="endTime" name="end-time">
          </div>
        
          <div class="BlockingDropDown">
         
      <label class="labelZeitplanung" for="repeatInput">Intervall:</label>
      <div id="block">
        <select class="inputTimeBlocking" id="repeatInput" onclick="call(this)">
     <option value="" disabled selected>Bitte wählen...</option>
       <option value="nichts">Keine Wiederholung</option>
      <option value="Täglich">Täglich</option>
      <option value="Wöchentlich">Wöchentlich</option>
      <option value="Monatlich">Monatlich</option>
      <option value="Jährlich">Jährlich</option>
    </select>

    <div id="extraOptions" style=" margin-top: 10px; display:none;">
      <select id="details"></select>
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

        
// Funktionen zum erstellen sämtlicher in der Liste "neueAusredenzwischenSpeichern" zwischen gespeicherten neuen Ausreden. Wird ausgeführt, sobald HallOfShame geöffnet wird. 

//erstellt neue Ausreden
function createNewElementOffeneAusrede(containerId, ausredeName) {   //offeneAusrede
    console.log(containerId) 
    const container = document.getElementById(containerId);
    const originalDivOffeneAusrede = document.createElement('div');
    originalDivOffeneAusrede.className = 'offeneAusredeContainer';
    console.log(container);
    
    originalDivOffeneAusrede.innerHTML = `
        <div class="ausredeÜbersicht">   
                <h3 id="ausredeName">${ausredeName}</h3>
            </div>                
            <textarea class="ausredeDetailsInput" placeholder="Bitte Versäumnis begründen." id="ausredeDetailsInput" rows="7" cols="50"></textarea>
        </div>
    `;
    container.appendChild(originalDivOffeneAusrede);
    saveDataOffeneAusrede();  // Save the state immediately after creating a new element
    
}

function iterate_neueAusredenZwischenspeicher(){  // Erstellt nacheinander für jedes Element (den Namen der Ausrede mit Datum) der Liste eine Ausrede. 
    while(neueAusredenZwischenspeicher.length>0){
        console.log(neueAusredenZwischenspeicher[0]);
        createNewElementOffeneAusrede("offeneAusredeListe", neueAusredenZwischenspeicher[0]);
        neueAusredenZwischenspeicher.shift();
    };
}



// errinnerung
let stopped = false;
let timerId = null;

function changeButto(button) {
    const playButton = button.parentNode.querySelector("#play-button");
    const stopButton = button.parentNode.querySelector("#stop-button");

    if (playButton.classList.contains('hidden')) {
        // Stoppen des Timers und Umschalten auf Play-Button
        stopped = true;
        clearTimeout(timerId); // Timer stoppen, falls er läuft
        playButton.classList.remove('hidden');
        stopButton.classList.add('hidden');
       
    } else {
        // Starten der Erinnerung und Umschalten auf Stop-Button
        stopped = false;
        stopButton.classList.remove('hidden');
        playButton.classList.add('hidden');
        
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        } else {
            startReminder(button.parentNode.parentNode.parentNode.parentNode);
        }

        // EventListener hinzufügen, um auf das Stoppen zu reagieren
        stopButton.addEventListener('click', stopReminder);
    }
}

function stopReminder() {
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
    const repeatInput = einheit.querySelector('#repeatInput').value; // Das ausgewählte Intervall (Täglich, Wöchentlich...)
    const detailsInput = einheit.querySelector('#details').value; // Die genauere Auswahl (Jeden 2. Tag, Jede 2. Woche...)
    const endDateInput = einheit.querySelector('#endDate').value; // Das Enddatum der Erinnerung

    if (!dateInput.value || !timeInput.value || !reminderName || !repeatInput) {
        alert("Bitte alle Felder ausfüllen.");
        stopped = true;
        changeButto(playButton);
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
        if (repeatInput === 'Täglich') {
            repeatInterval =  24 * 60 * 60 * 1000; // 1 Tag
        } else if (repeatInput === 'Wöchentlich') {
            repeatInterval = 7 * 24 * 60 * 60 * 1000; // 1 Woche
        } else if (repeatInput === 'Monatlich') {
            repeatInterval = 30 * 24 * 60 * 60 * 1000; // 1 Monat
        } else if (repeatInput === 'Jährlich') {
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
        new Notification(`Es ist Zeit für deine Erinnerung: ${reminderName}`);
    }

    if (repeatInput !== 'Keine Wiederholung') {
        
  startReminder(einheit, true); 
    }
       
       
            setTimeout(() => {
            if (!checkboxx.checked) {
                alert('Die Checkbox wurde nicht abgehakt, obwohl 10 Minuten nach Ablauf der Erinnerung vergangen sind.');
            }
        }, 10 * 60 * 1000);
        checkIntervalId = setInterval(() => {
            let now = new Date(); // Aktualisiere die Zeit bei jeder Wiederholung
            let endDateTime = endDateInput ? new Date(`${endDateInput}T23:59:59`) : null;
            console.log(now);
            console.log(endDateTime);
    
            if (repeatInput === 'Keine Wiederholung' || (endDateTime && now >= endDateTime)) {
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
    let repeatSelect = button.parentNode.parentNode.querySelector("#repeatInput");
    let extraOptionsDiv = button.parentNode.parentNode.querySelector("#extraOptions");
    let detailsSelect = button.parentNode.parentNode.querySelector("#details");
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
        } else if (type === 'nichts') {
            extraOptionsDiv.style.display = 'none';
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
            extraOptionsDiv.style.display = 'block'; // Zeige das zweite Dropdown
            updateDetailsOptions(selectedValue); // Aktualisiere die Optionen im zweiten Dropdown
            lastSelectedRepeat = selectedValue; // Speichere die Auswahl
        } else {
            extraOptionsDiv.style.display = 'none'; // Verstecke das zweite Dropdown
        }
    });
    
    let lastSelectedDetail = '';
    detailsSelect.addEventListener('change', function() {
        lastSelectedDetail = detailsSelect.value;
        extraOptionsDiv.style.display = 'none'; // Verstecke das zweite Dropdown nach der Auswahl
    });
}    

 