from flask import Flask, request

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
    
    nbPoints = params["nbPoints"]

    allPositions = [(x,x) for x in range(nbPoints)]
    print(allPositions)
    return {
        "data": allPositions
    }
    