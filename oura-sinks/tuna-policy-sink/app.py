import json
import sqlite3

from flask import Flask, request

with open("config.json") as config_file:
    config = json.load(config_file)

app = Flask(__name__)

@app.route("/api/tx", methods = ["POST"])
def post_tx():
    print("NEW REQUEST")
    print(request.json)


