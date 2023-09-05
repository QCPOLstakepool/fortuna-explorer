import json

from flask import Flask, jsonify, request
from adapter.dbsync_cardano_adapter import DbsyncCardanoAdapter


with open("config.json") as config_file:
    config = json.load(config_file)

app = Flask(__name__)


@app.route("/api/blocks/latest")
def get_latest_block():
    cardano_adapter = DbsyncCardanoAdapter(config["dbsync"]["host"], config["dbsync"]["port"], config["dbsync"]["user"], config["dbsync"]["password"], config["dbsync"]["database"])

    return jsonify(cardano_adapter.get_latest_block().__dict__)


@app.route("/api/blocks")
def get_blocks():
    from_block = request.args.get("block", "0")
    order = request.args.get("order", "desc")
    size = request.args.get("size", "20")
    page = request.args.get("page", "1")

    if (order != "desc" and order != "asc") or not size.isnumeric() or 0 >= int(size) > 20 or not page.isnumeric() or 0 >= int(page) or not from_block.isnumeric():
        return "Bad request", 400

    cardano_adapter = DbsyncCardanoAdapter(config["dbsync"]["host"], config["dbsync"]["port"], config["dbsync"]["user"], config["dbsync"]["password"], config["dbsync"]["database"])

    return jsonify([fortuna_block.__dict__ for fortuna_block in cardano_adapter.get_blocks(int(page), int(size), int(from_block), order == "desc")])
