import json

from flask import Flask, jsonify, request
from repository.miner_repository import MinerRepository
from repository.block_repository import BlockRepository
from repository.epoch_repository import EpochRepository
from repository.tuna_repository import TunaRepository

with open("config.json") as config_file:
    config = json.load(config_file)

app = Flask(__name__)


@app.route("/api/tuna")
def get_tuna_stats():
    tuna_repository = TunaRepository(config["sqlite"])

    return jsonify(tuna_repository.get_stats().__dict__)


@app.route("/api/epochs/current")
def get_current_epoch():
    epoch_repository = EpochRepository(config["sqlite"])

    return jsonify(epoch_repository.get_current_epoch().__dict__)


@app.route("/api/blocks")
def get_blocks():
    order = request.args.get("order", "desc")
    from_block = request.args.get("block", "999999999" if order == "desc" else "0")
    size = request.args.get("size", "20")
    page = request.args.get("page", "1")

    if (order != "desc" and order != "asc") or not size.isnumeric() or 0 >= int(size) > 100 or not page.isnumeric() or 0 >= int(page) or not from_block.isnumeric():
        return "Bad request", 400

    block_repository = BlockRepository(config["sqlite"])

    return jsonify([fortuna_block.__dict__ for fortuna_block in block_repository.get_blocks(int(page), int(size), int(from_block), order == "desc")])


@app.route("/api/miners")
def get_miners():
    order_by = request.args.get("order_by", "rewards")
    order = request.args.get("order", "desc")
    size = request.args.get("size", "1000")
    page = request.args.get("page", "1")

    if (order_by != "rewards" and order_by != "address") or (order != "desc" and order != "asc") or not size.isnumeric() or 0 >= int(size) > 1000 or not page.isnumeric() or 0 >= int(page):
        return "Bad request", 400

    miner_repository = MinerRepository(config["sqlite"])

    return jsonify([fortuna_block.__dict__ for fortuna_block in miner_repository.get_miners(int(page), int(size), order_by, order == "desc")])
