from flask import Flask, request, send_file, current_app as app
import calcul
import json
import os

app = Flask(__name__,
            static_url_path='', 
            static_folder='wwwroot')

@app.route("/")
def hello_world():
    return app.send_static_file('index.html')

@app.route("/ajaxRunSimulation", methods=['POST'])
def runSimulation():
    params = request.get_json()

    result = calcul.Fire_Railgun(params)
    
    print(result)
    
    return {
        "data": result
    }
    
@app.route('/doc')
def show_static_pdf():
    static_file = open('Hackathon_2021-3_1.pdf', 'rb')
    return send_file(static_file, attachment_filename='file.pdf')