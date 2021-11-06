from flask import Flask, send_from_directory

app = Flask(__name__,
            static_url_path='', 
            static_folder='wwwroot')

@app.route("/")
def hello_world():
    return app.send_static_file('index.html')