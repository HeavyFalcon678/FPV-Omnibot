document.addEventListener('keydown', onKeypress);


let currentMove = undefined;



function onKeypress(event) {
    console.log(event.key)
    if (event.key == "w" || event.key == "W") {
        document.getElementById("fwd").classList.add("active");
        setTimeout(() => {fwd.classList.remove("active");}, 200);
        onForward();
    } else if (event.key == "s" || event.key == "S") {
        document.getElementById("rev").classList.add("active");
        setTimeout(() => {rev.classList.remove("active");}, 200);
        onBackward();
    } else if (event.key == "a" || event.key == "A") {
        document.getElementById("left").classList.add("active");
        setTimeout(() => {left.classList.remove("active");}, 200);
        onLeft();
    } else if (event.key == "d" || event.key == "D") {
        document.getElementById("right").classList.add("active");
        setTimeout(() => {right.classList.remove("active");}, 200);
        onRight();
    } else if (event.key == "q" || event.key == "Q") {
        document.getElementById("rl").classList.add("active");
        setTimeout(() => {rl.classList.remove("active");}, 200);
        onRotateLeft();
    } else if (event.key == "e" || event.key == "E") {
        document.getElementById("rr").classList.add("active");
        setTimeout(() => {rr.classList.remove("active");}, 200);
        onRotateRight();
    }
}




function onForward() {
    console.log("Forward");
    sendToServer("Forward");
}

function onBackward() {
    console.log("Backward");
    sendToServer("Backward");
}

function onLeft() {
    console.log("Left");
    sendToServer("Left");
}

function onRight() {
    console.log("Right");
    sendToServer("Right");
}

function onRotateLeft() {
    console.log("Rotate Left");
    sendToServer("Rotate Left");
}

function onRotateRight() {
    console.log("Rotate Right");
    sendToServer("Rotate Right");
}

function liftFork() {
    console.log("Lift Fork");
    sendToServer("Lift Fork");
}

function lowerFork() {
    console.log("Lower Fork");
    sendToServer("Lower Fork");
}


function sendToServer(info) {
    fetch('/control', {method:'Post',headers:{'Content-Type':'application/json'},body:JSON.stringify({info: info})})
}
