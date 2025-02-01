const symbolButton = document.getElementById('symbolButton');
const elementToShow = document.getElementById('elementToShow');
const container = document.getElementById('container');
const moreInfos = document.getElementById('Details');
const playButton = document.getElementById('play-button');
const stopButton = document.getElementById('stop-button');


let deferredPrompt;  // Speichert das beforeinstallprompt-Ereignis, um es später auszulösen.

// Überprüfen, ob die App bereits installiert wurde
function isAppInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches;
}

// Funktion, um zu prüfen, ob der Browser das beforeinstallprompt-Ereignis unterstützt
function isBeforeInstallPromptSupported() {
    return 'beforeinstallprompt' in window;
}

// Funktion zum Anzeigen einer Benachrichtigung, wenn die App installiert werden kann
function showInstallNotification() {
    if (!('Notification' in window)) {
        console.warn('Notifications werden in diesem Browser nicht unterstützt.');
        return;
    }
    if (Notification.permission === "granted") {
        // Nachricht in einer Variablen definieren
        const notification = {
            title: 'Installiere unsere App!',
            body: 'Installieren Sie unsere Web-App für ein optimiertes Nutzungserlebnis!',
            icon: '/Unprocrastinate/icons/192x192.png', // Optional: Icon hinzufügen
            vibrate: [200, 100, 200], // Optional: Vibrationsmuster
            requireInteraction: true, // Benachrichtigung bleibt sichtbar
        };

        // Nachricht an den Service Worker senden
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(() => {
                if (navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage({
                        type: 'show-notification',
                        ...notification // Alle Eigenschaften der Benachrichtigung übergeben
                    });
                } else {
                    console.warn('Service Worker ist aktiv, hat aber noch keine Kontrolle. Ein Neuladen ist notwendig.');
                    alert('Bitte laden Sie die Seite neu, um Benachrichtigungen zu aktivieren.');
                
                }
            });
        }
    } else {
        // Berechtigung für Benachrichtigungen anfordern
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                showInstallNotification();
            }
        });
    }
}

// beforeinstallprompt-Event lauschen
if (isBeforeInstallPromptSupported()) {
    window.addEventListener('beforeinstallprompt', (e) => {
        // Verhindert das automatische Anzeigen des Installations-Popups
        e.preventDefault();
        
        // Speichern des Events für späteren Gebrauch
        deferredPrompt = e;
        
        // Wenn die App noch nicht installiert ist, zeige die Benachrichtigung an
        if (!isAppInstalled()  && 'Notification' in window) {
            showInstallNotification();  // Zeigt eine Benachrichtigung an
        }
    });
} else {
    // Wenn der Browser das beforeinstallprompt nicht unterstützt, zeige die Benachrichtigung direkt an
    if (!isAppInstalled()  && 'Notification' in window) {
        showInstallNotification();  // Zeige die Benachrichtigung an
    }
}

// Event, wenn die App installiert wurde
addEventListener('appinstalled', () => {
    console.log('App wurde installiert');
});

// Funktion zum Prüfen, ob die App bereits installiert wurde
document.addEventListener('DOMContentLoaded', function() {
    // Wenn die PWA noch nicht installiert ist und das deferredPrompt vorhanden ist
    if (deferredPrompt && !isAppInstalled()  && 'Notification' in window) {
        showInstallNotification();  // Zeige die Benachrichtigung an
    }
});
// Service Worker für irgendwas
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/Unprocrastinate/service-worker.js')
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
    console.log("Sending Notification");
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        // Send a message to the Service Worker
        console.log("Notification send to the service worker.");
        navigator.serviceWorker.controller.postMessage({
            type: 'show-notification',
            title: title,
            body: body,
        });
    } else {
        console.error('Service Worker not controlling the page.');
    }
}


function showTool(toolId) {
    const tools = document.querySelectorAll('.tool');
    tools.forEach(tool => tool.style.display = 'none');
  
    document.getElementById(toolId).style.display = 'block';
  
    // Update the browser history
    history.pushState({tool: toolId}, toolId, `#${toolId}`);
}
  

// Initialize the first tool as visible on page load
if (location.hash) {
showTool(location.hash.substring(1));
} else {
showTool('tool1');
}
  

function schließeAlleDropdownMenues(containerListe){
    document.addEventListener('click', function(){
        let dropdownMenus = containerListe.querySelectorAll('.dropdown-content');
        dropdownMenus.forEach(menu => {
        menu.classList.add('hidden');
        });
    }, true)
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
    var parentElement = button.closest('.timerContainer, .blockingContainer, .erinnerungContainer');
    parentElement.remove();
}

  
  
function fixieren(button) {

    var dropdownMenus = document.querySelectorAll('.dropdown-content');
    dropdownMenus.forEach(function(menu) {
        menu.classList.add('hidden');
    });

   
    var container = button.closest('.erinnerungListe, #timer-list, #blockingListe');
   
    
    var containerOfButton =  button.closest('.timerContainer, .blockingContainer, .erinnerungContainer');

    if (containerOfButton !== container.firstElementChild) {
        container.insertBefore(containerOfButton, container.firstElementChild);
    }
}



  
//Erinnerung und Zeitplanung Benachrichtigungen ohne Play Button. 

// Ruft die Funktionen jede Minute auf. 
function checkElements() {
    const now = Date.now(); //Momentaner Zeitpunkt wird gespeichert, verhindert kleine Verschiebungen der Zeitpunkte durch Verzögerungen des Codes. In Upix Epoch
    erinnerungCheck(now);
    timeBlockingCheck(now);
    console.log("Check", new Date().toLocaleTimeString());
}

function checkTimer(){
    const now = Date.now(); //Momentaner Zeitpunkt wird gespeichert, verhindert kleine Verschiebungen der Zeitpunkte durch Verzögerungen des Codes. In Upix Epoch
    timerCheck(now);
    //console.log("checkTimer() ausgeführt.")
}

// Start das Intervall, wenn die App geöffnet wird. 
window.addEventListener("load", () => {
    const now = new Date();
    console.log("App geladen, Intervall gestartet.");  
    const millisecondsToNextMinute = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());
    checkElements();

    setTimeout(()=> {
        checkTimer();
        checkElements();
        setInterval(checkTimer, 1000);
    }, 4001)  //Wartet 4 Sekunden und 1 Millisekunde vor der ersten Ausführung. Der Nutzer soll keine Benachrichtigung bekommen, während die App noch nicht voll geladen hat. 

    setTimeout(() => {   //Überprüft Erinnerung und Zeitplanung jede ganze Minute. 
        checkElements();
        setInterval(checkElements, 60000);
    }, millisecondsToNextMinute + 1); //+1 Millisekunde, um Bugs beim Vergleichen von Zeitpunkten zu verhindern. 
});


const millisekundenBisAusrede = 600 * 1000;   //Die Zeit die nach der Startzeit vergeht, bis eine Ausrede erstellt wird.

//Hauptfunktion Erinnerung, steuert den Rest. 
function erinnerungCheck(now){                          
    const data = JSON.parse(localStorage.getItem('erinnerung'));
    if (data) {
        data.forEach(item => {
            erinnerungCheckTime(item, now);
        });
    }
}

//Hauptfunktion Blocking, steuert den Rest. 
function timeBlockingCheck(now){                          
    const data = JSON.parse(localStorage.getItem('blocking'));
    if (data) {
        data.forEach(item => {
            timeBlockingCheckTime(item, now);
        });
    }
}

function timerCheck(now){                          
    const data = JSON.parse(localStorage.getItem('timer'));
    if (data) {
        data.forEach(item => {
            timerCheckTime(item, now);
        });
    }
}

//Konvertiert Datum und Zeit in Millisekunden seit 1970. 
function convertToMilliseconds(datum, zeit){
    if (datum && zeit) {
        const datumZeitString = `${datum}T${zeit}:00`;
        const datumZeit = new Date(datumZeitString);
        return Math.floor(datumZeit.getTime());
    }
}  

//Wird verwendet um Werte im Local Storage zu ändern. 
function updateStringInLocalStorage(key, id, newValue) {      
    const data = JSON.parse(localStorage.getItem(key));
    data.forEach(item => {
        if (item.id === id) {
            Object.assign(item, newValue);
        }
    });
    localStorage.setItem(key, JSON.stringify(data));
}


//Überprüft ob eine Benachrichtigung gesendet werden muss und ruft eine Funktion auf, um diese zu senden. 
function erinnerungCheckTime(data, now){
    if(data.date && data.time){           
        const startTime = unixToCheck(convertToMilliseconds(data.date, data.time), data.intervallWert, data.intervallEinheit, now);
        //Überprüft ob das Enddatum überschritten wurde. Wenn ja, wird die Funktion beendet. 
        if(data.EndDate){
            if(convertToMilliseconds(data.endDate, data.time) < startTime){
                console.log("End Datum überschritten." + data);
                return;
            }
        }
        const checkbox = document.getElementById(data.id).querySelector('.erinnerungÜbersicht').querySelector('#checkboxErinnerung')  //Die Checkbox des Elements (der Erinnerung).
        
        //Nachdem eine Benachrichtigung gesendet wird, wird im Local Storage gespeichert, das für die jeweilige startTime oder Ausrede (startTime + 10 Minuten) eine Benachrichtigung gesendet wurde. Wird in Unix Code (Millisekunden seit 1970) gespeichert. 
        //Falls die im Local Storage gepeicherte Zeit mit der momentanen übereinstimmt, wird keine Benachrichtigung gesendet. 
        //Könnte als einziges Problem dazu führen, dass nur eine Ausrede erstellt wird, auch wenn  man die Erinnerung mehrere Tage am Stück verpasst hat, ohne die App zu öffnen. Das wäre aber sogar gut, da man somit nicht mit Ausreden zugespammt wird. Diese dienen ja schließlich nicht zu Dokumentation, sondern zur Selbstreflektion in dem Moment und zur Überredung doch noch anzufangen.
        if(now > startTime && (data.startNotificationSend < startTime || data.startNotificationSend == undefined)){    
            sendNotification('Ihre Erinnerung ist fällig!', `Bestätigen Sie, dass Sie mit Ihrer Erinnerung „${data.name}“ angefangen haben!`); 
            console.log("Erinnerung wurde gesendet.");
            updateStringInLocalStorage("erinnerung", data.id, {startNotificationSend: startTime});        //Speichert im LocalStorage das bereits eine startNotification für diesen Zeitblock gesendet wurde.
        }
        if(now > startTime + millisekundenBisAusrede && data.checkboxErinnerung == false && (data.ausredeErstellt < startTime + millisekundenBisAusrede || data.ausredeErstellt == undefined)){  //10 Minuten sind seit beginn des Zeitblocks vergangen und der Nutzer hat die Checkbox nicht abgehagt. Wird auch gesendet, wenn der Zeitblock bereits um ist. 
            console.log("Checkbox wurde innerhalb von 10 Minuten nicht abgehackt.");
            updateStringInLocalStorage("erinnerung", data.id, {ausredeErstellt: startTime + millisekundenBisAusrede});             //Speichert im LocalStorage das bereits eine Ausrede für diese Zeitplanung erstellt wurde. 
            const date = new Date(startTime); 
            const startTimeString = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            const dateString = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`; //padStart(2, '0') sorgt dafür, dass der Tag und Monat immer zweistellig ist. Also 01.07.2024 anstatt 1.7.2024.
            showTool('tool4');
            sendNotification('Ermahnung',`Die Checkbox wurde nicht abgehakt, obwohl 10 Minuten nach Ablauf des Startes der Erinnerung „${data.name}“ vergangen sind.`); 
            createNewElementOffeneAusrede(data.name, `${startTimeString}`,dateString);
        }
        
        //Leer die Checkbox einmal wenn durch ein Intervall eine Erinnerung das nächste mal beginnt. Speichert sich den Zeitpunkt, für den es die Checkbox geleert hat und setzt sie nur noch für einen späteren Zeitpunkt zürck.
        if((data.checkboxZuletztGeleert < startTime || data.checkboxZuletztGeleert == undefined)){ //Falls die Checkbox ausgewählt ist, wird sie geleert, sofern die nächste Erinnerung bereits begonnen hat.
            updateStringInLocalStorage("erinnerung", data.id, {checkboxZuletztGeleert: startTime});
            checkbox.checked = false;
        }

        //Falls der Beginn der Erinnerung weniger als 10 Minuten her ist und sie noch nicht angeklickt wurde, wird die Checkbox aktiviert. Falls nicht, wird sie deaktiviert.
        if(now > startTime && now < startTime + millisekundenBisAusrede){   
            if(checkbox.disabled){ //Aktiviert die Checkbox, falls sie deaktiviert ist.
                checkbox.disabled = false;
                console.log("Checkbox wurde aktiviert.")
            }
        }
        //Deaktiviert die Checkbox falls der beginn der Erinnerung mehr als 10 Minuten her ist und sie aktiviert ist.
        else if(!checkbox.disabled){ 
                checkbox.disabled = true;
                console.log("Checkbox wurde deaktiviert.")
            }
    }
}


//Überprüft ob eine Benachrichtigung gesendet werden muss und ruft eine Funktion auf um diese zu senden. 
function timeBlockingCheckTime(data, now){
    if(data.startDate && data.startTime && data.endTime){           
        const startTime = unixToCheck(convertToMilliseconds(data.startDate, data.startTime), data.intervallWert, data.intervallEinheit, now);
        const endTime = startTime + calculateTimeDiff(data.startTime, data.endTime); //Die Endzeit wird mithilfe der Startzeit + die Differenz der Start und Endzeit berechnet. Wenn man die Endzeit auch mit unixToCheck() berechnet, kommt es bei Intervallen zu Problemen, da die Startzeit erreicht ist, aber die Endzeit noch nicht und es deshalb für die Endzeit den Zeitpunkt von einem Intervall zuvor nimmt. 
        //Überprüft ob das Enddatum überschritten wurde. Wenn ja, wird die Funktion beendet. 
        if(data.EndDate){
            if(convertToMilliseconds(data.endDatum, data.endTime) < startTime){
                console.log("End Datum überschritten." + data);
                return;
            }
        }
        const checkbox = document.getElementById(data.id).querySelector('.inputTimeBlocking-container').querySelector('.datumContainer2').querySelector('.checkboxTimeBlocking')  //Die Checkbox des Elements (der Zeitplanung).

        //Nachdem eine Benachrichtigung gesendet wird, wird im Local Storage gespeichert, das für die jeweilige startTime, endTime oder Ausrede (startTime + 10 Minuten) eine Benachrichtigung gesendet wurde. Wird in Millisekunden seit 1970 gespeichert. 
        //Falls die im Local Storage gepeicherte Zeit mit der momentanen übereinstimmt, wird keine Benachrichtigung gesendet. 
        //Könnte als einziges Problem dazu führen, dass nur eine Ausrede erstellt wird, auch wenn  man den Zeitblock mehrere Tage am Stück verpasst hat, ohne die App zu öffnen. Das wäre aber sogar gut, da man somit nicht mit Ausreden zugespammt wird. Diese dienen ja schließlich nicht zu Dokumentation, sondern zur Selbstreflektion in dem Moment und zur Überredung doch noch anzufangen.
        if(now > startTime && now < endTime && (data.startNotificationSend < startTime || data.startNotificationSend == undefined)){           //Der Zeitblock (die geblockte Zeit) hat begonnen und ist noch nicht zuende. 
            sendNotification('Start Zeitplanung', `Bestätigen Sie, dass Sie mit ihrer Zeitplanung „${data.nameBlocking}“ angefangen haben!`);
            console.log("Zeitblock hat begonnen.");
            updateStringInLocalStorage("blocking", data.id, { startNotificationSend: startTime});        //Speichert im LocalStorage das bereits eine startNotification für diesen Zeitblock gesendet wurde.
        }
        if(now > endTime && now < endTime + 600 * 1000 && (data.endNotificationSend < endTime || data.endNotificationSend == undefined)){     //Der Zeitblock ist um und es sind nicht mehr als 10 Minuten vergangen. Auch wenn man die Checkbox nicht angeklickt hat und auch nicht nachträglich angefangen hat, bekommt man dennoch die Nachricht, dass die Zeit um ist. Dies hilft auch der Reflexion, da es einen dazu anregt zu bedenken, was man den jetzt sonst so in dieser Zeit getan hat. 
            sendNotification('Ende Zeitplanung', `Ihre eingeplante Zeit „${data.nameBlocking} “ ist um!`);
            console.log("Zeitblock ist um.");
            updateStringInLocalStorage("blocking", data.id, { endNotificationSend: endTime}) ;        //Speichert im LocalStorage das bereits eine endNotification für diesen Zeitblock gesendet wurde.
        }
        if(now > startTime + millisekundenBisAusrede && data.checkboxBlocking == false && (data.ausredeErstellt < startTime + millisekundenBisAusrede || data.ausredeErstellt == undefined)){  //10 Minuten sind seit beginn des Zeitblocks vergangen und der Nutzer hat die Checkbox nicht abgehagt. Wird auch gesendet, wenn der Zeitblock bereits um ist. 
            console.log("Checkbox wurde innerhalb von 10 Minuten nicht abgehackt.");
            updateStringInLocalStorage("blocking", data.id, {ausredeErstellt: startTime + millisekundenBisAusrede});             //Speichert im LocalStorage das bereits eine Ausrede für diese Zeitplanung erstellt wurde. 
            const date = new Date(startTime); 
            const dateEndTime = new Date(endTime);
            const startTimeString = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            const endTimeString = `${dateEndTime.getHours().toString().padStart(2, '0')}:${dateEndTime.getMinutes().toString().padStart(2, '0')}`;
            const dateString = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`; //padStart(2, '0') sorgt dafür, dass der Tag und Monat immer zweistellig ist. Also 01.07.2024 anstatt 1.7.2024.
            showTool('tool4');
            sendNotification('Ermahnung',`Die Checkbox wurde nicht abgehakt, obwohl 10 Minuten nach Ablauf des Startes der Zeitplanung „${data.nameBlocking}“ vergangen sind.`); 
            createNewElementOffeneAusrede(data.nameBlocking, `${startTimeString} - ${endTimeString}`,dateString);
        }


        //Leer die Checkbox einmal wenn durch ein Intervall eine Erinnerung das nächste mal beginnt. Speichert sich den Zeitpunkt, für den es die Checkbox geleert hat und setzt sie nur noch für einen späteren Zeitpunkt zürck.
        if((data.checkboxZuletztGeleert < startTime || data.checkboxZuletztGeleert == undefined)){ //Falls die Checkbox ausgewählt ist, wird sie geleert, sofern die nächste Erinnerung bereits begonnen hat.
            updateStringInLocalStorage("blocking", data.id, {checkboxZuletztGeleert: startTime});
            checkbox.checked = false;
        }

        //Falls die Zeitplanung begonnen hat und noch nicht geendet hat, wird die Checkbox aktiviert. Falls nicht, wird sie deaktiviert.
        if(now > startTime && now < endTime){   
            if(checkbox.disabled){ //Aktiviert die Checkbox, falls sie deaktiviert. 
                checkbox.disabled = false;
                console.log("Checkbox wurde aktiviert.")
            }
        }
        //Deaktiviert die Checkbox falls die Zeitplanung gerade nicht im gange ist.
        else if(!checkbox.disabled){ 
                checkbox.disabled = true;
                console.log("Checkbox wurde deaktiviert.")
            }
    }
}


//Überprüft ob eine Benachrichtigung gesendet werden muss und ruft eine Funktion auf, um diese zu senden. 
function timerCheckTime(data, now){ //now ist in unix Epoch. 
    if(data.intervall && data.timerGestartet && data.wiederholungen){

        console.log("1");

        const wiederholungen = Math.floor((now - data.timerGestartet) / (60 * 1000 * data.intervall));
        if(wiederholungen < data.wiederholungen){   //Überprüft, ob die Anzahl der Wiederholungen des Timers überschritten wurde. 
            timerNextUnix = data.timerGestartet + wiederholungen * 60 * 1000 * data.intervall;  //Immer kleiner oder gleich now. 
            
            console.log("2");

            if(timerNextUnix > now - 5 * 1000 && (data.timerNotificationSend < timerNextUnix || data.timerNotificationSend == undefined)){   //Falls der momentane Zeitpunkt maximal 5 Sekunden größer ist, als der Zeitpunkt für die Benachrichtigung des Timers, wird  für die Benachrichtigung gesendet. Durch timerNotificationSend, wird sichergestellt, dass eine Benachrichtigung nicht zweimal gesendet wird. 
                updateStringInLocalStorage("timer", data.id, {timerNotificationSend: timerNextUnix});
                sendNotification('Timer abgelaufen!',`Ihr Timer  „${data.nameTimer}“ ist abgelaufen`);
                console.log(`Timer Benachrichtigung für "${data.nameTimer}" wurde gesendet.`);
            }
        }
    }
    console.log("now " + now);
    console.log(data);
}

// Berechnet und gibt den Unix Timestamp zurück, für die späteste Wiederholung, für die es bei Intervallen eine Benachrichtigung senden muss. Falls kein Intervall existiert oder nicht richtig definiert ist, gibt es die Startzeit, die man als ersten Parameter als Unix Timestamp angeben muss, zurück. 
function unixToCheck(unix, intervallWert, intervallEinheit, now){    
    if(!intervallEinheit || intervallEinheit == "Keine Wiederholung" || !intervallWert || now <= unix){   //Überprüft alle notwendigen Kriterien für ein Intervall. Falls nicht alle vorhanden sind, wird die Funktion abgebrochen und unix zurückgegeben. 
        return unix; 
    }
    else {     
        const numberMatch = intervallWert.match(/\d+/);
        const intervallWertZahl = numberMatch ? parseInt(numberMatch[0], 10) : null;

        if(intervallEinheit == "Täglich"){
            const wiederholungen = Math.floor((now - unix) / (60 * 60 * 24 * 1000 * intervallWertZahl));
            return unix + wiederholungen * 60 * 60 * 24 * 1000 * intervallWertZahl; 
        }
        if(intervallEinheit == "Wöchentlich"){
            const wiederholungen = Math.floor((now - unix) / (60 * 60 * 24 * 1000 * intervallWertZahl * 7));
            return unix + wiederholungen * 60 * 60 * 24 * 1000 * intervallWertZahl * 7;
        }
        if(intervallEinheit == "Monatlich"){   //Der momentane Zeitpunkt wird so lange um das Intervall erhöht, bis er größer ist, als das momentane Datum. Danach wird er um 1 Intervall reduziert, damit es wieder die späteste zu sendene Nachricht ist.
            letzteWiederholung = new Date(unix);
            const dateNow = new Date(now);
            while(letzteWiederholung < dateNow){     
                letzteWiederholung.setMonth(letzteWiederholung.getMonth() + intervallWertZahl);
            }
            letzteWiederholung.setMonth(letzteWiederholung.getMonth() - intervallWertZahl)
            return letzteWiederholung.getTime();
        }
        if(intervallEinheit == "Jährlich"){
            letzteWiederholung = new Date(unix);
            const dateNow = new Date(now);
            while(letzteWiederholung < dateNow){
                letzteWiederholung.setFullYear(letzteWiederholung.getFullYear() + intervallWertZahl);
            }
            letzteWiederholung.setFullYear(letzteWiederholung.getFullYear() - intervallWertZahl)
            return letzteWiederholung.getTime();
        }
    }
    console.log("unixToCheck() Fallback ausgelöst! Es existiert ein Bug im Code.");
    return unix; //Fallback zur Sicherheit. Sollte nie ausgelöst werden. 
}



//Berechnet die Difference in Millisekunden zwischen 2 Zeitpunkten. (Wird nur für Zeitplanung und nicht für Erinnerung benötig.)  
function calculateTimeDiff(time1, time2){
    const [hours1, minutes1] = time1.split(":").map(Number);
    const [hours2, minutes2] = time2.split(":").map(Number);

    milliseconds1 = (hours1 * 60 * 60 * 1000 + minutes1 * 60 * 1000)
    milliseconds2 = (hours2 * 60 * 60 * 1000 + minutes2 * 60 * 1000)

    if(milliseconds1 < milliseconds2){       // Erste Zeit ist kleiner als Zweite. Mitternacht wird nicht überschritten. 
        return milliseconds2 - milliseconds1;  
    }
    else{                                    // Erste Zeit ist größer als Zweite. Mitternacht wird überschritten
        return (24 * 60 * 60 * 1000) - milliseconds1 + milliseconds2;     // 24 Stunden - erste Zei + zweite Zeit. Beispiel: 24:00 - 23:00 + 02:00 = 3 Stunden Differenz.
    }
}


document.addEventListener('input', function (event) {
    // Überprüfen, ob das Event von einem Input-Feld stammt
    if (event.target.tagName === 'INPUT') {
        // Den spezifischen Erinnerungs-containe finden
        const container = event.target.closest('.erinnerungContainer');
        if (container) {
            const erinnerungDatum = container.querySelector('#inputDate');
            const time = container.querySelector('#inputTime');
            const Intervall = container.querySelector('#intervallEinheit').value;
            if(erinnerungDatum?.value && Intervall == 'Keine Wiederholung' && time?.value){
                 // Kombinieren von Datum und Zeit
    const combinedDateTime = new Date(`${erinnerungDatum.value}T${time.value}:00`);
    
    // Aktuelles Datum und Zeit abrufen
    const now = new Date();
    
    // Überprüfung: Ist das kombinierte Datum in der Vergangenheit?
    if (combinedDateTime < now) {
        alert("Das Startdatum liegt in der Vergangenheit.");
                }
            }
        
        }}});



//timeBlocking check von differenz zwischen start und Endzeit und ob das Startdatum in der Vergangeheit ist
document.addEventListener('input', function (event) {
    // Überprüfen, ob das Event von einem Input-Feld stammt
    if (event.target.tagName === 'INPUT') {
        // Den spezifischen `time-blocking-container` finden
        const container = event.target.closest('.blockingContainer');
        if (container) {
            // Start- und Endzeit innerhalb dieses Containers suchen
            const startTimeInput = container.querySelector('#startTime');
            const endTimeInput = container.querySelector('#endTime');
            const zeitplanungDatum = container.querySelector('#timeBlockingDatum');
            const Intervall = container.querySelector('#intervallEinheit').value;
            // Wenn beide Felder existieren, weiterarbeiten
            if (startTimeInput?.value && endTimeInput?.value) {
                console.log('Startzeit:', startTimeInput.value);
                console.log('Endzeit:', endTimeInput.value);
                if (startTimeInput.value && endTimeInput.value) {
                    const startTime = new Date(`1970-01-01T${startTimeInput.value}`);
                    const endTime = new Date(`1970-01-01T${endTimeInput.value}`);
                    if (endTime < startTime) {
                        endTime.setDate(endTime.getDate() + 1);
                    }
                    const diffInMinutes = (endTime - startTime) / (1000 * 60);
                    if (diffInMinutes < 20) {
                        alert('Die Zeitdifferenz muss mindestens 20 Minuten betragen!');
                    }
                }
            }
            if(zeitplanungDatum?.value && Intervall == 'Keine Wiederholung' && startTimeInput?.value){
                
// Kombinieren von Datum und Zeit
const combinedDateTime = new Date(`${zeitplanungDatum.value}T${startTimeInput.value}:00`);

// Aktuelles Datum und Zeit abrufen
const now = new Date();

// Überprüfung: Ist das kombinierte Datum in der Vergangenheit?
if (combinedDateTime < now) {
    alert("Das Startdatum liegt in der Vergangenheit.");
            }
        }}
    }
});


//Timer Start
function changeButtons(button){
    const playButton = button.parentNode.querySelector("#play-buttonTimer");
    const stopButton = button.parentNode.querySelector("#stop-buttonTimer");
    const timerID =  button.closest('timerContainer');
    const now = new Date();

    if(playButton.classList.contains('hidden')){  //Der Timer wurde nicht gestartet. 
        playButton.classList.remove('hidden');
        stopButton.classList.add('hidden');
        updateStringInLocalStorage("timer", timerID, {timerGestartet: now});
        
    } else if (stopButton.classList.contains('hidden')) {  //Der Timer wurde gestartet. 
        stopButton.classList.remove('hidden');
        playButton.classList.add('hidden');
        startTimer(button.parentNode.parentNode);
        updateStringInLocalStorage("timer", timerID, {timerGestartet: undefined});
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
    if (!stopButton.classList.contains("listener-added")) {
        stopButton.addEventListener("click", stopTimer);
        stopButton.classList.add("listener-added"); // Verhindere mehrfaches Hinzufügen
    }
    
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
    
        isRunning = true;  
        myVar = setInterval(myTimer, intervalValue);

        function myTimer() {
            while (!isRunning) {
            clearInterval(myVar);
                return; }
            
            sendNotification('Timer abgelaufen!',`Ihr Timer  „${TimerNameValue}“ ist abgelaufen`);
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

let uniqueIdCounter = parseInt(localStorage.getItem('uniqueIdCounter')) || 0;  //ID counter für alle Elemente 

//Add Eventlisteners when loading the page. For DropdownMenues and Loading and Saving Data
document.addEventListener('DOMContentLoaded', function() {
    
    // Add event listener to close all dropdownMenues when user clicks somewhere on the page.
    document.addEventListener('click', function() {
        schließeAlleDropdownMenues(document.querySelector('#erinnerungListe'));
    },true);
    
    // Load saved data when the page loads
    loadDataErinnerung();
    loadDataTimer();
    loadDataBlocking();
    loadDataOffeneAusrede();
    
    // Add event listeners to save data automatically on input change
    document.getElementById('erinnerungListe').addEventListener('input', function(event) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') {
            if(event.target.id == "inputDate" || event.target.id == "inputTime"){  //Verhindert, dass eine Benachrichtigung oder Ausrede für die Vergangenheit erstellt wird, falls der Startzeitpunkt in der Vergangenheit liegt. Hierfür wird, sobald man etwas am startDatum oder der startUhrzeit ändert, im LocalStorage für die Benachrichtigung und Ausrede, der momentanen Zeitpunkt gespeichert. Somit kann nichts für einen Vorherigen Zeitpunkt erstellt werden.
                const parentId = event.target.closest('.erinnerungContainer').id;
                updateStringInLocalStorage("erinnerung", parentId, {startNotificationSend: Date.now()});
                updateStringInLocalStorage("erinnerung", parentId, {ausredeErstellt: Date.now()});
            }
            saveDataErinnerung();
        }
    });
    document.getElementById('timer-list').addEventListener('input', function(event) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') {
            saveDataTimer();
        }
    });
    document.getElementById('blockingListe').addEventListener('input', function(event) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') {
            if(event.target.id == "timeBlockingDatum" || event.target.id == "startTime" || event.target.id == "endTime"){  //Verhindert, dass eine Benachrichtigung oder Ausrede für die Vergangenheit erstellt wird, falls der Startzeitpunkt in der Vergangenheit liegt. Hierfür wird, sobald man etwas am startDatum oder der startUhrzeit ändert, im LocalStorage für die Benachrichtigung und Ausrede, der momentanen Zeitpunkt gespeichert. Somit kann nichts für einen Vorherigen Zeitpunkt erstellt werden.
                const parentId = event.target.closest('.blockingContainer').id;
                updateStringInLocalStorage("blocking", parentId, {startNotificationSend: Date.now()});
                updateStringInLocalStorage("blocking", parentId, {endNotificationSend: Date.now()});
                updateStringInLocalStorage("blocking", parentId, {ausredeErstellt: Date.now()});
            }
            saveDataBlocking();
        }
    });
    document.getElementById('offeneAusredeListe').addEventListener('input', function(event) {
        if (event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT') {
            saveDataOffeneAusrede();
        }
    });

    // Speichert die Daten wenn Löschen oder Fixieren benutzt wird. 
    document.addEventListener('click', function(event) {
        if (event.target.closest('.change')) {
            saveDataErinnerung();
            saveDataTimer();
            saveDataBlocking();
            saveDataOffeneAusrede();
        }
    });
});


// Function to save data to localStorage 

function saveDataErinnerung() {   //Erinnerung
    const container = document.getElementById('erinnerungListe');
    const erinnerungElements = container.querySelectorAll('.erinnerungContainer');

    const existingData = JSON.parse(localStorage.getItem('erinnerung')) || [];

    const data = Array.from(erinnerungElements).map((element) => {
        const name = element.querySelector('.erinnerungName').value;
        const checkboxErinnerung = element.querySelector('#checkboxErinnerung').checked;
        const date = element.querySelector('#inputDate').value;
        const time = element.querySelector('#inputTime').value;
        const intervallEinheit = element. querySelector('#intervallEinheit').value;
        const endDate = element.querySelector('#endDate').value;

        const existingDataSet = existingData.find(item => item.id === element.id);

        return {
            id: element.id,
            checkboxErinnerung: checkboxErinnerung,
            name: name,
            date: date,
            time: time,
            intervallEinheit: intervallEinheit,
            endDate: endDate, 

            //Diese Daten werden ohne sie zu ändern vom voherigen Arry übernommen, damit sie nicht verloren gehen. Falls kein vorheriger Arry existiert, werden sie als undefined definiert. 
            intervallWert: existingDataSet?.intervallWert || undefined,
            startNotificationSend: existingDataSet?.startNotificationSend || undefined,        
            ausredeErstellt: existingDataSet?.ausredeErstellt || undefined,
            checkboxZuletztGeleert: existingDataSet?.checkboxZuletztGeleert || undefined,
        };
    });
    localStorage.setItem('erinnerung', JSON.stringify(data));
    console.log(data);
}

function saveDataTimer() {  //Timer 
    const container = document.getElementById('timer-list');
    const timerElements = container.querySelectorAll('.timerContainer');

    const existingData = JSON.parse(localStorage.getItem('timer')) || [];
    
    const data = Array.from(timerElements).map((element) => {
        const intervall = element.querySelector('#Intervall').value;
        const wiederholungen = element.querySelector('#wiederholungen').value;
        const nameTimer = element.querySelector('.timerName').value;

        const existingDataSet = existingData.find(item => item.id === element.id);
        
        return {
            id: element.id,
            intervall: intervall,
            wiederholungen: wiederholungen,
            nameTimer: nameTimer,

            //Diese Daten werden ohne sie zu ändern vom voherigen Arry übernommen, damit sie nicht verloren gehen. Falls kein vorheriger Arry existiert, werden sie als undefined definiert. 
            timerGestartet: existingDataSet?.timerGestartet || undefined,
            timerNotificationSend: existingDataSet?.timerNotificationSend || undefined,
        };
    });
    localStorage.setItem('timer', JSON.stringify(data));
    console.log(data);
}

function saveDataBlocking() {   //Blocking
    const container = document.getElementById('blockingListe');
    const blockingElements = container.querySelectorAll('.blockingContainer');

    const existingData = JSON.parse(localStorage.getItem('blocking')) || [];
    
    const data = Array.from(blockingElements).map((element) => {
        const nameBlocking = element.querySelector('#nameZeitplanung').value;
        const checkboxBlocking = element.querySelector('.checkboxTimeBlocking').checked;
        const startDate = element.querySelector('#timeBlockingDatum').value;
        const startTime = element.querySelector('#startTime').value;
        const endTime = element.querySelector('#endTime').value;
        const intervallEinheit = element.querySelector('#intervallEinheit').value;
        const endDatum = element.querySelector('#endDate').value;
        
        const existingDataSet = existingData.find(item => item.id === element.id);

        return {
            id: element.id,   //Die ID wird dem Element entnommen und kann dort nicht geändert werden. Jedes Element hat eine eigene ID, die sich nie ändert. 
            nameBlocking: nameBlocking,
            checkboxBlocking: checkboxBlocking,
            startDate: startDate,
            startTime: startTime,
            endTime: endTime,
            intervallEinheit: intervallEinheit,
            endDatum: endDatum,

            //Diese Daten werden ohne sie zu ändern vom voherigen Arry übernommen, damit sie nicht verloren gehen. Falls kein vorheriger Arry existiert, werden sie als undefined definiert. 
            intervallWert: existingDataSet?.intervallWert || undefined,
            startNotificationSend: existingDataSet?.startNotificationSend || undefined,        
            endNotificationSend: existingDataSet?.endNotificationSend || undefined,
            ausredeErstellt: existingDataSet?.ausredeErstellt || undefined,
            checkboxZuletztGeleert: existingDataSet?.checkboxZuletztGeleert || undefined,
        };
    });
    localStorage.setItem('blocking', JSON.stringify(data));
    console.log(data);
}


function saveDataOffeneAusrede() {   //offeneAusrede
    const container = document.getElementById('offeneAusredeListe');
    const ausredeElements = container.querySelectorAll('.offeneAusredeContainer');

    const existingData = JSON.parse(localStorage.getItem('ausrede')) || [];

    const data = Array.from(ausredeElements).map((element) => {
        const ausredeDetailsInput = element.querySelector('.ausredeDetailsContainer').querySelector('#ausredeDetailsInput').value;
        const ausredeCheckbox = element.querySelector('.ausredeÜbersicht').querySelector('.checkboxAusrede').checked;

        const existingDataSet = existingData.find(item => item.id === element.id);

        return {
            id: element.id,
            ausredeDetailsInput: ausredeDetailsInput,
            ausredeCheckbox: ausredeCheckbox,

            //Diese Daten werden ohne sie zu ändern vom voherigen Arry übernommen, damit sie nicht verloren gehen. Falls kein vorheriger Arry existiert, werden sie als undefined definiert. 
            ausredeName: existingDataSet?.ausredeName || undefined,
            ausredeDate: existingDataSet?.ausredeDate || undefined,
            ausredeTime: existingDataSet?.ausredeTime || undefined,
        };
    });
    localStorage.setItem('offeneAusrede', JSON.stringify(data));
    console.log(data);
}


// Function to load data from localStorage

function loadDataErinnerung() {   //Erinnerung
    const data = JSON.parse(localStorage.getItem('erinnerung'));
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
    const data = JSON.parse(localStorage.getItem('offeneAusrede'));
    if (data) {
        data.forEach(item => {
            createNewElementWithDataOffeneAusrede(item);
        });
    }
}



// Function to create a new element and populate it with data
//Erinnerung
function createNewElementWithDataErinnerung(data) {  
    const container = document.getElementById('erinnerungListe');
    const originalDivErinnerung = document.createElement('div');
    originalDivErinnerung.className = 'erinnerungContainer';
    originalDivErinnerung.id = `${data.id}` 
    
    originalDivErinnerung.innerHTML = `
        <div class="erinnerungÜbersicht">
            <input type="checkbox" class="checkboxErinnerung" id="checkboxErinnerung" name="placeholder" disabled ${data.checkboxErinnerung ? 'checked' : ''}>
            <input class="erinnerungName" placeholder="Name der Erinnerung" type="text" value="${data.name}" required>
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
                <input id="inputDate" class="inputErinnerungDetails" placeholder="Datum" type="date" value="${data.date}" required>
                <label  class="labelErinnerung"  id="labelTime" for="inputTime">Uhrzeit:</label>
                <input id="inputTime"   class="inputErinnerungDetails" placeholder="Uhrzeit" type="time" value="${data.time}" required>
            </div>

            <div id="ErinnerungsDropDown">
                <label class="labelErinnerung" for="intervallEinheit">Intervall:</label>
                <div id="blockErinnerung">
                    <select class="inputErinnerungDetails" id="intervallEinheit" onclick="call(this, 'erinnerung')" value="${data.intervallEinheit}">
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

    const idNumber = parseInt(data.id.split('-')[1]);
    uniqueIdCounter = Math.max(uniqueIdCounter, idNumber + 1); //Verhindert Probleme durch korrupte Daten. Kann man das +1 aber nicht weglassen, da vor dem erstellen eines neuen Elementes der Counter ja auch um +1 erhöht wird? Macht aber dennoch keine Probleme. 
}

//Timer
function createNewElementWithDataTimer(data) {          
    const container = document.getElementById('timer-list');
    const originalDivTimer = document.createElement('div');
    originalDivTimer.className = 'timerContainer';
    originalDivTimer.id = `${data.id}`
    const isRunning = data.timerGestartet + data.intervall * 60 * 1000 * wiederholungen> Date.now();
    
    originalDivTimer.innerHTML = `
        <div class="timerHeadline">
            <svg class="${isRunning ? '' : 'hidden'}" onclick="changeButtons(this)"  id="play-buttonTimer" class="play-button" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z" fill="#000000"></path> <path d="M16 12L10 16.3301V7.66987L16 12Z" fill="#000000"></path> </g></svg>
            <svg class="${!isRunning ? '' : 'hidden'}"  id="stop-buttonTimer" onclick="changeButtons(this)"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="10"></circle> <line x1="10" y1="15" x2="10" y2="9"></line> <line x1="14" y1="15" x2="14" y2="9"></line> </g></svg>
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

    const idNumber = parseInt(data.id.split('-')[1]);
    uniqueIdCounter = Math.max(uniqueIdCounter, idNumber + 1); //Verhindert Probleme durch korrupte Daten. 
}

//Blocking
function createNewElementWithDataBlocking(data) {  
    const container = document.getElementById('blockingListe');
    const originalDivBlocking = document.createElement('div');
    originalDivBlocking.className = 'blockingContainer';
    originalDivBlocking.id = `${data.id}`
    
    originalDivBlocking.innerHTML = `
    <div class="newTimeBlockingHeadline" id=${data.id}>
         <input class="input-name" placeholder="Name Zeitplanung" type="text" id="nameZeitplanung" value="${data.nameBlocking}" required>                           
    </div>                                                                                                                                                                                                                                              
    <div class="inputTimeBlocking-container"> 
    <div class="datumContainer2">
        <input type="checkbox" class="checkboxTimeBlocking" disabled ${data.checkboxBlocking ? 'checked' : ''}>
        <label class="labelZeitplanung" id="labelZeitplanungDatum" for="timeBlockingDatum">Datum:</label>
        <input class="inputTimeBlocking"  type="date" id="timeBlockingDatum" name="Datum" value="${data.startDate}" required>
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
            <input class="inputTimeBlocking"  type="time" id="startTime" name="start-time" value="${data.startTime}" required>
            <label  class="labelZeitplanung" id="labelEndTime" for="end-time">Ende:</label>
            <input  class="inputTimeBlocking"   type="time" id="endTime" name="end-time" value="${data.endTime}" required>
        </div>
        <div class="BlockingDropDown">
            <label class="labelZeitplanung" for="intervallEinheit">Intervall:</label>
            <div id="block">
                <select class="inputTimeBlocking" id="intervallEinheit" onclick="call(this, 'blocking')" value="${data.intervallEinheit}">
                        <option value="Keine Wiederholung" ${data.intervallEinheit === 'Keine Wiederholung' ? 'selected' : ''}>Keine Wiederholung</option>
                        <option value="Täglich" ${data.intervallEinheit === 'Täglich' ? 'selected' : ''}>Täglich</option>
                        <option value="Wöchentlich" ${data.intervallEinheit === 'Wöchentlich' ? 'selected' : ''}>Wöchentlich</option>
                        <option value="Monatlich" ${data.intervallEinheit === 'Monatlich' ? 'selected' : ''}>Monatlich</option>
                        <option value="Jährlich" ${data.intervallEinheit === 'Jährlich' ? 'selected' : ''}>Jährlich</option>
                </select>

                <div id="intervallWert" style=" margin-top: 10px; display:none;">
                    <select id="intervallWertSelect">
                         
                    </select>
                </div>
            </div>
            <label  class="labelZeitplanung" id="labelEndDate" for="endDate">Enddatum:</label>
            <input id="endDate" type="date" class="inputTimeBlocking" value="${data.endDatum}">
        </div>    
    </div>

    `;
    container.appendChild(originalDivBlocking);

    const idNumber = parseInt(data.id.split('-')[1]);
    uniqueIdCounter = Math.max(uniqueIdCounter, idNumber + 1); //Verhindert Probleme durch korrupte Daten. 
}

//offeneAusrede
function createNewElementWithDataOffeneAusrede(data) {  
    const container = document.getElementById('offeneAusredeListe');
    const originalDivOffeneAusrede = document.createElement('div');
    originalDivOffeneAusrede.className = 'offeneAusredeContainer';
    originalDivOffeneAusrede.id = `${data.id}`
    
    originalDivOffeneAusrede.innerHTML = `
       <div class="ausredeÜbersicht">   
            <h3 id="ausredeName">${data.ausredeName}</h3>
            <div class ="ausredeDatesContainer">
                <div class="ausredeDates">${data.ausredeDate}</div>
                <div class="ausredeDates">${data.ausredeTime}</div> 
            </div>
            <label class="labelAusrede" for="checkboxAusrede">Später erledigt:</label>
            <input type="checkbox" class="checkboxAusrede" ${data.ausredeCheckbox ? 'checked' : ''}>
        </div>  
        <div class="ausredeDetailsContainer">             
            <textarea onclick="autoResize(this)" oninput="autoResize(this)" onblur="resizeBackToNormal(this)" class="ausredeDetailsInput" placeholder="Bitte Versäumnis begründen." id="ausredeDetailsInput">${data.ausredeDetailsInput}</textarea>
        </div>
    `;
    container.appendChild(originalDivOffeneAusrede);

    const idNumber = parseInt(data.id.split('-')[1]);
    uniqueIdCounter = Math.max(uniqueIdCounter, idNumber + 1); //Verhindert Probleme durch korrupte Daten. 
}


// Function to create a new element when the button is pressed
//Erinnerung
function createNewElementErinnerung(containerId) {   
    const container = document.getElementById(containerId);
    const originalDivErinnerung = document.createElement('div');
    originalDivErinnerung.className = 'erinnerungContainer';

    originalDivErinnerung.id = `erinnerung-${uniqueIdCounter++}`; // Increment the counter
    // Save the updated counter value in localStorage
    localStorage.setItem('uniqueIdCounter', uniqueIdCounter);
    
    originalDivErinnerung.innerHTML = `
        <div class="erinnerungÜbersicht">
            <input type="checkbox" class="checkboxErinnerung" id="checkboxErinnerung" name="placeholder" disabled>
            <input class="erinnerungName" placeholder="Name der Erinnerung" type="text" required>
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
            <input id="inputDate" class="inputErinnerungDetails" placeholder="Datum" type="date" required>
                    <label  class="labelErinnerung" id="labelTime" for="inputTime">Uhrzeit:</label>
            <input id="inputTime" class="inputErinnerungDetails" placeholder="Uhrzeit" type="time" required>
         
            </div>
       
     <div id="ErinnerungsDropDown">
     
      <label class="labelErinnerung" for="intervallEinheit">Intervall:</label>
      <div id="blockErinnerung">
        <select class="inputErinnerungDetails" id="intervallEinheit" onclick="call(this, 'erinnerung')">
        <option value="Keine Wiederholung" selected>Keine Wiederholung</option>
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
    container.insertBefore(originalDivErinnerung, container.firstChild);
    saveDataErinnerung();  
}
 //Timer
function createNewElementTimer(containerId) {      
    const container = document.getElementById(containerId);
    const originalDivTimer = document.createElement('div');
    originalDivTimer.className = 'timerContainer';
    
    originalDivTimer.id = `timer-${uniqueIdCounter++}`; // Increment the counter
    // Save the updated counter value in localStorage
    localStorage.setItem('uniqueIdCounter', uniqueIdCounter);

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
    container.insertBefore(originalDivTimer, container.firstChild);
    saveDataTimer();  // Save the state immediately after creating a new element
}
//Blocking
function createNewElementBlocking(containerId) {   
    const container = document.getElementById(containerId);
    const originalDivBlocking = document.createElement('div');
    originalDivBlocking.className = 'blockingContainer';
    
    originalDivBlocking.id = `blocking-${uniqueIdCounter++}`; // Increment the counter
    // Save the updated counter value in localStorage
    localStorage.setItem('uniqueIdCounter', uniqueIdCounter);
    
    originalDivBlocking.innerHTML = `
        <div class="newTimeBlockingHeadline" >
            <input class="input-name" placeholder="Name Zeitplanung" type="text" id="nameZeitplanung" required>
        </div>                                                                                                                                                                                                                                             
        <div class="inputTimeBlocking-container"> 
        <div class="datumContainer2">
            <input type="checkbox" class="checkboxTimeBlocking" disabled>
        <label class="labelZeitplanung" id="labelZeitplanungDatum" for="timeBlockingDatum">Datum:</label>
                <input class="inputTimeBlocking"  type="date" id="timeBlockingDatum" name="Datum" required>
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
                <input class="inputTimeBlocking"  type="time" id="startTime" name="start-time" required>
                <label  class="labelZeitplanung"  id="labelEndTime" for="endTime">Ende:</label>
                <input  class="inputTimeBlocking"   type="time" id="endTime" name="end-time" required>
          </div>
        
          <div class="BlockingDropDown">
         
      <label class="labelZeitplanung" for="intervallEinheit">Intervall:</label>
      <div id="block">
        <select class="inputTimeBlocking" id="intervallEinheit" onclick="call(this, 'blocking')">
       <option value="Keine Wiederholung" selected>Keine Wiederholung</option>
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
    container.insertBefore(originalDivBlocking, container.firstChild);
    saveDataBlocking();  // Save the state immediately after creating a new element
    
}

//offeneAusrede
function createNewElementOffeneAusrede(ausredeName, ausredeTime, ausredeDate) {   
    const container = document.getElementById("offeneAusredeListe");
    const originalDivOffeneAusrede = document.createElement('div');
    originalDivOffeneAusrede.className = 'offeneAusredeContainer';

    originalDivOffeneAusrede.id = `ausrede-${uniqueIdCounter++}`; // Increment the counter
    localStorage.setItem('uniqueIdCounter', uniqueIdCounter); // Save the updated counter value in localStorage
    
    //Speichert die festen Daten der Ausrede im LocalStorage. Diese werden beim ersten Erstellen der Ausrede definiert und können sich später nicht mehr ändern. 
    const neuesElement = {
        "id": `ausrede-${uniqueIdCounter - 1}`,
        "ausredeName": ausredeName,
        "ausredeDate": ausredeDate,
        "ausredeTime": ausredeTime,
    }
    const existingData = JSON.parse(localStorage.getItem('ausrede')) || [];
    existingData.push(neuesElement);
    localStorage.setItem('ausrede', JSON.stringify(existingData));

    originalDivOffeneAusrede.innerHTML = `
        <div class="ausredeÜbersicht">   
            <h3 id="ausredeName">${ausredeName}</h3>
            <div class ="ausredeDatesContainer">
                <div class="ausredeDates">${ausredeDate}</div>
                <div class="ausredeDates">${ausredeTime}</div>
            </div>
            <label class="labelAusrede" for="checkboxAusrede">Später erledigt:</label>
            <input type="checkbox" class="checkboxAusrede">
        </div>  
         <div class="ausredeDetailsContainer">             
            <textarea onclick="autoResize(this)" oninput="autoResize(this)" onblur="resizeBackToNormal(this)" class="ausredeDetailsInput" placeholder="Bitte Versäumnis begründen." id="ausredeDetailsInput"></textarea>
        </div>
    `;
    container.insertBefore(originalDivOffeneAusrede, container.firstChild);
    saveDataOffeneAusrede();  // Save the state immediately after creating a new element 
}


//Intervall Select 

function call(button, klasse) {
    let repeatSelect = button.parentNode.parentNode.querySelector("#intervallEinheit");
    let intervallWertDiv = button.parentNode.parentNode.querySelector("#intervallWert");
    let detailsSelect = button.parentNode.parentNode.querySelector("#intervallWertSelect");
    const parentElement = button.closest('.timerContainer, .blockingContainer, .erinnerungContainer');

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
        
        const existingData = JSON.parse(localStorage.getItem(klasse)) || [];
        const existingDataSet = existingData.find(item => item.id === parentElement.id);

        updateStringInLocalStorage(klasse, parentElement.id, {intervallWert: lastSelectedDetail });
    });
}    

//autoResize 
function autoResize(textarea) {
    textarea.style.setProperty('height', textarea.scrollHeight + 'px', 'important');
  }

function resizeBackToNormal(textarea) {
    // Überprüfe die Bildschirmorientierung
    if (window.innerHeight > window.innerWidth) {
        // Hochformat
        textarea.style.setProperty('height', '5vh', 'important');
    } else {
        // Querformat
        textarea.style.setProperty('height', '10vh', 'important');
    }
}