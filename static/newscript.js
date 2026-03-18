document.addEventListener('keydown', onKeydown);
document.addEventListener('keyup', onKeyup);


const viKeys = ['W','w','S','s','A','a','D','d','Q','q','E','e','J','j','I','i','K','k','L','l',' '];

const allList = ["upBtn", "closeBtn","openBtn","downBtn","fwdBtn","revBtn","lBtn","rBtn","fwdlBtn","fwdrBtn","revlBtn","revrBtn","ccw","cw","fast","upBtn","downBtn","openBtn","closeBtn"]
const btnList = ["fwdBtn","revBtn","lBtn","rBtn","fwdlBtn","fwdrBtn","revlBtn","revrBtn","ccw","cw","fast","upBtn","downBtn","openBtn","closeBtn"]
const forkList = ["upBtn", "downBtn"];
const gripperList = ["openBtn", "closeBtn"];

let currentClick = undefined;
let currentKeys = [];

let currentData = {
    fast: true,
    move: undefined,
    fork: undefined,
    gripper: undefined,
    keys: []
}

let previousData = {
    fast: false,
    move: undefined,
    fork: undefined,
    gripper: undefined,
    keys: []
}


let speedToggle = document.getElementById("fast");
speedToggle.addEventListener("click", toggleSpeed);

setInterval(handleControls, 50);


// change the speed
function toggleSpeed() {
    if (speedToggle.innerText == "FAST") {
        speedToggle.innerText = "SLOW";
        speedToggle.style.backgroundColor = "#7d5ca2";
        speedToggle.style.borderColor = "#7d5ca2";
        previousData.fast = true;
        currentData.fast = false;
    } else {
        speedToggle.innerText = "FAST";
        speedToggle.style.backgroundColor = "#7DA253";
        speedToggle.style.borderColor = "#7DA253";
        previousData.fast = false;
        currentData.fast = true;
    }
}


// Does the main thing
function handleControls() {

    if(currentData.keys.length == 0) {
        removeActive("dsd", allList);
    }

    // if space bar is pressed toggle the speed control
    if (currentData.keys.includes(' ') && !previousData.keys.includes(' ')) {
        currentData.fast = !currentData.fast;
        speedToggle.click();
    }

    if (currentData.keys.includes('w') && currentData.keys.includes('a')) {
        currentData.move = ("Forward Left");
        document.getElementById('fwdlBtn').classList.add('active');
        removeActive('fwdlBtn',btnList)
    } else if (currentData.keys.includes('w') && currentData.keys.includes('d')) {
        currentData.move = ("Forward Right");
        document.getElementById('fwdrBtn').classList.add('active');
        removeActive('fwdrBtn',btnList)
    } else if (currentData.keys.includes('s') && currentData.keys.includes('a')) {
        currentData.move = ("Backward Left");
        document.getElementById('revlBtn').classList.add('active');
        removeActive('revlBtn',btnList)
    } else if (currentData.keys.includes('s') && currentData.keys.includes('d')) {
        currentData.move = ('Backward Right');
        document.getElementById('revrBtn').classList.add('active');
        removeActive('revrBtn',btnList)
    }  else if (currentData.keys.includes('q')) {
        currentData.move = ('CW');
        document.getElementById('ccw').classList.add('active');
        removeActive('ccw',btnList)
    }  else if (currentData.keys.includes('e')) {
        currentData.move = ('CCW');
        document.getElementById('cw').classList.add('active');
        removeActive('cw',btnList)
    } else if (currentData.keys.includes('w')) {
        currentData.move = ('Forward');
        document.getElementById('fwdBtn').classList.add('active');
        removeActive('fwdBtn',btnList)
    }  else if (currentData.keys.includes('s')) {
        currentData.move = ('Backward');
        document.getElementById('revBtn').classList.add('active');
        removeActive('revBtn',btnList)
    }  else if (currentData.keys.includes('a')) {
        currentData.move = ('Left');
        document.getElementById('lBtn').classList.add('active');
        removeActive('lBtn',btnList)
    }  else if (currentData.keys.includes('d')) {
        currentData.move = ('Right');
        document.getElementById('rBtn').classList.add('active');
        removeActive('rBtn',btnList)
    } else {
        currentData.move = ('None');
        removeActive("quark", btnList)
    }

    if (currentData.keys.includes('i')) {
        currentData.fork = 'Up';
        document.getElementById('upBtn').classList.add('active');;
        removeActive('upBtn',forkList);
    } else if (currentData.keys.includes('k')) {
        currentData.fork = 'Down';
        document.getElementById('downBtn').classList.add('active');;
        removeActive('downBtn',forkList);
    } else {
        currentData.fork = 'None';
        removeActive("ff", forkList);
    }


    if (currentData.keys.includes('j')) {
        currentData.gripper = "Open";
        document.getElementById('openBtn').classList.add('active');
        removeActive("openBtn", gripperList)
    } else if (currentData.keys.includes('l')) {
        currentData.gripper = "Close";
        document.getElementById('closeBtn').classList.add('active');
        removeActive("closeBtn", gripperList)
    } else {
        currentData.gripper = "None";
        removeActive("ff", gripperList);
    }


    

    if(currentData.move != previousData.move) sendToServer("Move", currentData.move)

    if (currentData.fast != previousData.fast) sendToServer("Fast", currentData.fast)
    if (currentData.fork != previousData.fork) sendToServer("Fork", currentData.fork);
    if (currentData.gripper != previousData.gripper) sendToServer("Gripper", currentData.gripper);


    previousData = structuredClone(currentData);
}



// removes the active class from buttons
function removeActive(except, list) {
    list = list.filter(val => val != except);
    list.forEach(val => {
        document.getElementById(val).classList.remove('active')
    })
}


// adds key to keylist
function onKeydown(event) {
    if (event.code === "Space") {
        event.preventDefault();
    } 
    if (viKeys.includes(event.key) && !currentData.keys.includes(event.key)) {
        previousData = structuredClone(currentData);
        currentData.keys.push(event.key)
        
    }
}


// removes key from keylist
function onKeyup(event) {
    if (viKeys.includes(event.key) && currentData.keys.includes(event.key)) {
        previousData = structuredClone(currentData);
        currentData.keys = currentData.keys.filter(item => item != event.key);
    }
}


// triggers keydown when button is pressed
function onPress(btn, key=btn) {
    const event = new KeyboardEvent('keydown', {
        key: key,
        code: btn,
        bubbles: true,
        cancelable: true
    });

    document.getElementById(btn).classList.add('active');
    document.dispatchEvent(event);
    currentClick = btn;
    currentKeys.push(key);
}


// removes active coloring from buttons
function onRelease() {
    currentData.keys = currentData.keys.filter(item => !currentKeys.includes(item));
    document.getElementById(currentClick).classList.remove('active');
    currentClick = undefined;
}


// Send the info to the server on the pi
function sendToServer(type, info) {
    console.log(type, info);
    fetch('/control', {method:'Post',headers:{'Content-Type':'application/json'},body:JSON.stringify({type: type, info: info})})
}