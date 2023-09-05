import json

from flask import Flask, jsonify

from adapter.dbsync_cardano_adapter import DbsyncCardanoAdapter


with open("config.json") as config_file:
    config = json.load(config_file)

app = Flask(__name__)


@app.route("/api/blocks/latest")
def get_latest_block():
    cardano_adapter = DbsyncCardanoAdapter(config["dbsync"]["host"], config["dbsync"]["port"], config["dbsync"]["user"], config["dbsync"]["password"], config["dbsync"]["database"])

    return jsonify(cardano_adapter.get_latest_block().__dict__)
