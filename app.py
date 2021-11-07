from flask import Flask, request
import calcul
import json

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
    
    params = {
        'mass'      : '10', 
        'volume'    : '10', 
        'length'    : '100', 
        'voltage'   : '100', 
        'interspace': '0.001', 
        'angle'     : '45', 
        'radius'    : '10',
        'metals'    : '0.00000000159',
        'planet'    : '-9.8', 
        'fluid'     : '0.000018'
    }
    result = calcul.Fire_Railgun(params)
    
    print(result)
    
    return {
        "data": result
    }
    