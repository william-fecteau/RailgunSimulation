from flask import Flask, request
import calcul

app = Flask(__name__,
            static_url_path='', 
            static_folder='wwwroot')

@app.route("/")
def hello_world():
    return app.send_static_file('index.html')

@app.route("/ajaxRunSimulation", methods=['POST'])
def runSimulation():

    params = request.get_json()
    print(params)

    return {
        "data": allPositions
    }
    