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
        startTimeBlocking(button.parentNode.parentNode);
    }
  }

  function startTimeBlocking(element){
    const playTime = element.querySelector("#start-time").value;
    const endTime = element.querySelector("#end-time").value;
   
    if (!playTime || !endTime) {
        alert('Bitte geben Sie eine gültige Uhrzeit.');
        return;
    }
    const [startHours, startMinutes] = playTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

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