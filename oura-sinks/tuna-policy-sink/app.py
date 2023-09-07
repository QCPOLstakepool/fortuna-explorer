import json
import sqlite3

from flask import Flask, request

with open("../config.json") as config_file:
    config = json.load(config_file)

app = Flask(__name__)

@app.route("/api/tx", methods = ["POST"])
def post_tx():
    try:
        json = request.json

        output_contract = get_output_contract(json)

        if output_contract is None:
            return "Outout to contract address not found.", 500

        if output_contract["inline_datum"]["plutus_data"]["fields"][0]["int"] == 0:
            return "Genesis block.", 200

        miner_output = get_miner_output(json)

        connection = sqlite3.connect(config["sqlite"])
        cursor = connection.cursor()

        cursor.execute("insert into block(number, leading_zeroes, difficulty, hash, epoch_time, posix_time, miner, cardano_block_no, cardano_tx_hash) values(?, ?, ?, ?, ?, ?, ?, ?, ?)", (
            output_contract["inline_datum"]["plutus_data"]["fields"][0]["int"] - 1,
            output_contract["inline_datum"]["plutus_data"]["fields"][2]["int"],
            output_contract["inline_datum"]["plutus_data"]["fields"][3]["int"],
            output_contract["inline_datum"]["plutus_data"]["fields"][1]["bytes"],
            output_contract["inline_datum"]["plutus_data"]["fields"][4]["int"],
            output_contract["inline_datum"]["plutus_data"]["fields"][5]["int"]

        ))

        return "", 200
    except:
        print(request.json)

        return "", 500


def get_output_contract(json):
    for output in json["transaction"]["outputs"]:
        if output["address"] == "addr1wynelppvx0hdjp2tnc78pnt28veznqjecf9h3wy4edqajxsg7hwsc":
            return output

    return None

def get_miner_output(json):
