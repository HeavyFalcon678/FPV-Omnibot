from flask import Flask, render_template, request

from gpiozero import Device, OutputDevice
from gpiozero.pins.mock import MockFactory


Device.pin_factory = MockFactory()

rf1 = OutputDevice(2)
rf2 = OutputDevice(3)
rf3 = OutputDevice(4)
rf4 = OutputDevice(17)
rf5 = OutputDevice(27)
rf6 = OutputDevice(22)
rf7 = OutputDevice(10)
rf8 = OutputDevice(9)



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
    rf1.value = signals[0]
    rf2.value = signals[1]
    rf3.value = signals[2]
    rf4.value = signals[3]
    rf5.value = signals[4]
    rf6.value = signals[5]
    rf7.value = signals[6]
    rf8.value = signals[7]



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
