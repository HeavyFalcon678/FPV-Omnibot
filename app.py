from flask import Flask, render_template, request

import gpiozero


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('test.html')


@app.route('/control', methods=['POST'])
def handle_info():
    json = request.get_json()
    print("Type:", json["type"], "Info:", json["info"])



    if (json["type"] == "Move"):
        print("Move")






    return "OK"


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
