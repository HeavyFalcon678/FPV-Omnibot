from flask import Flask, render_template, request

from gpiozero import Device, OutputDevice
from gpiozero.pins.mock import MockFactory


Device.pin_factory = MockFactory()

rf1 = OutputDevice(4)
rf2 = OutputDevice(17)
rf3 = OutputDevice(27)
rf4 = OutputDevice(22)
rf5 = OutputDevice(10)
rf6 = OutputDevice(9)
rf7 = OutputDevice(11)
rf8 = OutputDevice(5)

rf1.value = 1
rf2.value = 1
rf3.value = 1
rf4.value = 1
rf5.value = 1
rf6.value = 1
rf7.value = 1
rf8.value = 1


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('test.html')


@app.route('/control', methods=['POST'])
def handle_info():
    json = request.get_json()
    print("Type:", json["type"], "Info:", json["info"])

    if (json["type"] == "Move"):
        if (json["info"] == "Forward"):
            sendToArduino("1, 1, 0, 1, 1, 0, 1, 1")
        elif json["info"] == "Backward":
            sendToArduino("1, 1, 1, 0, 0, 1, 1, 1")
        elif json["info"] == "Left":
            sendToArduino("0, 0, 0, 0, 1, 1, 1, 1")
        elif json["info"] == "Right":
            sendToArduino("1, 1, 1, 1, 0, 0, 0, 0")
        elif json["info"] == "Forward Left":
            sendToArduino("0, 1, 0, 1, 1, 0, 1, 1")
        elif json["info"] == "Forward Right":
            sendToArduino("1, 0, 0, 1, 1, 0, 1, 1")
        elif json["info"] == "Backward Left":
            sendToArduino("0, 1, 1, 0, 0, 1, 1, 1")
        elif json["info"] == "Backward Right":
            sendToArduino("1, 0, 1, 0, 0, 1, 1, 1")
        elif json["info"] == "CW":
            sendToArduino("1, 0, 1, 0, 1, 0, 1, 1")
        elif json["info"] == "CCW":
            sendToArduino("0, 1, 0, 1, 0, 1, 1, 1")
        elif json["info"] == "None":
            sendToArduino("1, 1, 1, 1, 1, 1, 1, 1")

    elif json["type"] == "Fast":
        if json["info"] == True:
            sendToArduino("0, 1, 0, 1, 0, 1, 0, 1")
        elif json["info"] == False:
            sendToArduino("0, 1, 1, 0, 0, 0, 1, 1")

    elif json["type"] == "Fork":
        if json["info"] == "Up":
            sendToArduino("1, 1, 1, 1, 1, 1, 1, 0")
        elif json["info"] == "Down":
            sendToArduino("1, 1, 1, 1, 1, 1, 0, 1")
        elif json["info"] == "None":
            sendToArduino("1, 1, 1, 1, 1, 1, 1, 1")
        

    elif json["type"] == "Gripper":
        if json["info"] == "Open":
            sendToArduino("0, 1, 0, 1, 0, 1, 1, 0")
        elif json["info"] == "Close":
            sendToArduino("1, 0, 1, 0, 1, 0, 1, 0")
        elif json["info"] == "None":
            sendToArduino("1, 1, 1, 1, 1, 1, 1, 1")
    





    return "OK"


def sendToArduino(signal):
    signals = signal.split(", ")

    print(signals)
    rf1.value = int(signals[0])
    rf2.value = int(signals[1])
    rf3.value = int(signals[2])
    rf4.value = int(signals[3])
    rf5.value = int(signals[4])
    rf6.value = int(signals[5])
    rf7.value = int(signals[6])
    rf8.value = int(signals[7])



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)