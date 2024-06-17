const symbolButton = document.getElementById('symbolButton');
const elementToShow = document.getElementById('elementToShow');
const container = document.getElementById('container');
const moreInfos = document.getElementById('Details');
const playButton = document.getElementById('play-button');
const stopButton = document.getElementById('stop-button');
let wurdeVorangestelltWiederholungen = false;
let wurdeVorangestelltIntervall = false;

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

function details(button) {
    let parent = button.parentNode.parentNode.querySelector('.details');
   
    if (parent.classList.contains('hidden')) {
        parent.classList.remove('hidden');
        
    } else {
        parent.classList.add('hidden');
   
    }
}

function changeButton(button){
    var playButton = button.parentNode.querySelector("#play-button");
    var stopButton = button.parentNode.querySelector("#stop-button");
    
    
    if(playButton.classList.contains('hidden')){
        playButton.classList.remove('hidden');
        stopButton.classList.add('hidden');
        
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


  function startTimeBlocking(element){
    const playTime = element.querySelector("#start-time").value;
    const endTime = element.querySelector("#end-time").value;
    const playButton = element.querySelector("#play-button");
    const nameZeitplanung = element.querySelector('#nameZeitplanung');
    const checkbox = element.querySelector('.checkboxTimeBlocking')
    if (!playTime || !endTime) {
        alert('Bitte geben Sie eine gültige Uhrzeit.');
        changeButton(playButton);
        return;
    }
    const [startHours, startMinutes] = playTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    setInterval(() => {
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();

        const currentTime = currentHours * 60 + currentMinutes;
        const startTotalMinutes = startHours * 60 + startMinutes;
        const endTotalMinutes = endHours * 60 + endMinutes
        if ((endTotalMinutes - startTotalMinutes) < 20) {
            alert('Die Differenz zwischen Start- und Endzeit muss mindestens 20 Minuten betragen.');
            changeButton(playButton);
            return;
        }
    

        
        if (currentTime === startTotalMinutes) {
            if (Notification.permission === 'granted') {
                new Notification('Bestätigen sie, dass sie angefangen haben!');}
        }
        setTimeout(() => {
            if (!checkbox.checked) {
                alert('Die Checkbox wurde nicht abgehakt, obwohl 10 Minuten nach der Startzeit vergangen sind.');
               
            }
        }, 10 * 60 * 1000); 

        if (currentTime === endTotalMinutes) {
            if (Notification.permission === 'granted') {
                new Notification(`Ihre eingeplante Zeit ${nameZeitplanung} ist abgelaufen`);
                checkbox.checked = false; 
                changeButton(playButton);
        }}
    }, 60000);
   
    }

    
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }
  
function changeButtons(button){
    var playButton = button.parentNode.querySelector("#play-button");
    var stopButton = button.parentNode.querySelector("#stop-button");
    
    
    if(playButton.classList.contains('hidden')){
        playButton.classList.remove('hidden');
        stopButton.classList.add('hidden');
        
    } else if (stopButton.classList.contains('hidden')) {
        stopButton.classList.remove('hidden');
        playButton.classList.add('hidden');
        startTimer(button.parentNode.parentNode);
    }
  }

  
  
  function dropDownMenu(button) {
    var dropdownMenu = button.parentNode.querySelector(".dropdown-content");
    if (dropdownMenu.classList.contains("hidden")) {
      dropdownMenu.classList.remove("hidden");
    } else {
      dropdownMenu.classList.add("hidden");
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

function startTimer(element) {
    let myVar;
    let isRunning = false;  
    let Wiederholungencounter = 0;
    
    function stopTimer() {
        clearInterval(myVar);
        isRunning = false;  // Update the flag
        alert(`Timer wurde gestoppt.`);
    }
   
    const stopButton = element.querySelector("#stop-button");
    stopButton.addEventListener("click", function() {
        stopTimer();
         
    });
    
    const playButton = element.querySelector("#play-button");
   
    if (!("Notification" in window)) {
        alert("Dieser Browser unterstützt keine Benachrichtigungen");
    } else {
        alert("Benachrichtigungen sind aktiviert");
    }
    
    const intervalInput = element.querySelector("#Intervall");
    const Wiederholungen = element.querySelector("#Wiederholungen");
    const timerName = element.querySelector("#timerName");

    const TimerNameValue = timerName.value;
    const WiederholungenValue = parseInt(Wiederholungen.value);
    const intervalValue = intervalInput.value * 60000;
    
    
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


   
document.addEventListener('DOMContentLoaded', function() {
    // Load saved data when the page loads
    loadData();

    // Add event listeners to save data automatically on input change
    document.getElementById('erinnerungListe').addEventListener('input', function(event) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') {
            saveData();
        }
    });
});

// Function to save data to localStorage
function saveData() {
    const container = document.getElementById('erinnerungListe');
    const erinnerungElements = container.querySelectorAll('.erinnerungContainer');

    const data = Array.from(erinnerungElements).map((element, index) => {
        const dateTime = element.querySelector('#inputDateTime').value;
        const endDate = element.querySelector('#inputEndDate').value;
        const name = element.querySelector('.erinnerungName').value;
        const interval = element.querySelector('select[name="Intervall"]').value;

        return {
            id: index,
            dateTime: dateTime,
            endDate: endDate,
            name: name,
            interval: interval
        };
    });

    localStorage.setItem('erinnerungen', JSON.stringify(data));
}

// Function to load data from localStorage
function loadData() {
    const data = JSON.parse(localStorage.getItem('erinnerungen'));
    if (data) {
        data.forEach(item => {
            createNewElementWithData(item);
        });
    }
}

// Function to create a new element and populate it with data
function createNewElementWithData(data) {
    const container = document.getElementById('erinnerungListe');
    const originalDiv = document.createElement('div');
    originalDiv.className = 'erinnerungContainer';
    
    originalDiv.innerHTML = `
        <div class="erinnerungÜbersicht">
            <input type="checkbox" class="checkbox" id="checkboxErinnerung" name="placeholder">
            <input class="erinnerungName" placeholder="Name der Erinnerung" type="text" value="${data.name}">
            <div class="container">
        <svg onclick="dropDownMenu(this)" class="menu" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g clip-path="url(#clip0_105_1893)"> <circle cx="12" cy="12" r="9

            " stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 12.01 12)" width="0.01" x="12.01" y="12"></rect> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 16.51 12)" width="0.01" x="16.51" y="12"></rect> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 7.51001 12)" width="0.01" x="7.51001" y="12"></rect> </g> <defs> <clipPath id="clip0_105_1893"> <rect fill="white" height="24" transform="translate(0 0.000976562)" width="24"></rect> </clipPath> </defs> </g></svg>
        
            <div id="dropdownMenu" class="dropdown-content hidden">
            
                <a onclick="löschen(this)" href="#">Löschen</a>
                <a onclick="fixieren(this)" href="#">Fixieren</a>
            </div>                                                                                                       
    </div> 
        </div>
        <div class="hidde">
            <div class="erinnerungDetails">
                <div class="datumContainer">
                    <input id="inputDateTime" class="inputErinnerungDetails" placeholder="Datum & Uhrzeit" type="text" value="${data.dateTime}">
                    <input id="inputEndDate" class="inputErinnerungDetails" placeholder="Enddatum (Optional)" type="text" value="${data.endDate}">
                </div>
                <div class="intervallContainer">
                    <select class="inputErinnerungDetails" name="Intervall">
                        <option ${data.interval === 'Stunde' ? 'selected' : ''}>Stunde</option>
                        <option ${data.interval === 'Tag' ? 'selected' : ''}>Tag</option>
                        <option ${data.interval === 'Woche' ? 'selected' : ''}>Woche</option>
                        <option ${data.interval === 'Monat' ? 'selected' : ''}>Monat</option>
                        <option ${data.interval === 'Jahr' ? 'selected' : ''}>Jahr</option>
                        <option ${data.interval === 'Minute' ? 'selected' : ''}>Minute</option>
                    </select>
                    <input class="inputErinnerungDetails" placeholder="Jede">
                </div>
            </div>
        </div>
    `;

    container.appendChild(originalDiv);
}

// Function to create a new element when the button is pressed
function createNewElement(id, containerId) {
    const container = document.getElementById(containerId);
    const originalDiv = document.createElement('div');
    originalDiv.className = 'erinnerungContainer';
    
    originalDiv.innerHTML = `
        <div class="erinnerungÜbersicht">
            <input type="checkbox" class="checkbox" id="checkboxErinnerung" name="placeholder">
            <input class="erinnerungName" placeholder="Name der Erinnerung" type="text">
            <div class="container">
        <svg onclick="dropDownMenu(this)" class="menu" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g clip-path="url(#clip0_105_1893)"> <circle cx="12" cy="12" r="9

            " stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 12.01 12)" width="0.01" x="12.01" y="12"></rect> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 16.51 12)" width="0.01" x="16.51" y="12"></rect> <rect height="0.01" stroke="#000000" stroke-linejoin="round" stroke-width="3" transform="rotate(90 7.51001 12)" width="0.01" x="7.51001" y="12"></rect> </g> <defs> <clipPath id="clip0_105_1893"> <rect fill="white" height="24" transform="translate(0 0.000976562)" width="24"></rect> </clipPath> </defs> </g></svg>
        
            <div id="dropdownMenu" class="dropdown-content hidden">
            
                <a onclick="löschen(this)" href="#">Löschen</a>
                <a onclick="fixieren(this)" href="#">Fixieren</a>
            </div>                                                                                                       
    </div> 
        </div>
        <div class="hidde">
            <div class="erinnerungDetails">
                <div class="datumContainer">
                    <input id="inputDateTime" class="inputErinnerungDetails" placeholder="Datum & Uhrzeit" type="text">
                    <input id="inputEndDate" class="inputErinnerungDetails" placeholder="Enddatum (Optional)" type="text">
                </div>
                <div class="intervallContainer">
                    <select class="inputErinnerungDetails" name="Intervall">
                        <option>Stunde</option>
                        <option>Tag</option>
                        <option>Woche</option>
                        <option>Monat</option>
                        <option>Jahr</option>
                        <option>Minute</option>
                    </select>
                    <input class="inputErinnerungDetails" placeholder="Jede">
                </div>
            </div>
        </div>
    `;

    container.appendChild(originalDiv);
    saveData();  // Save the state immediately after creating a new element
}





