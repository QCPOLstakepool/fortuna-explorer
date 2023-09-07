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

        if "transaction" not in json:  # Not what we're looking for
            return "", 200

        output_contract = get_output_contract(json)

        if output_contract is None:
            return "Contract output not found.", 500

        if output_contract["inline_datum"]["plutus_data"]["fields"][0]["int"] == 0:
            return "Genesis block.", 200

        miner_output = get_miner_output(json)

        if miner_output is None:
            return "Miner output not found.", 500

        connection = sqlite3.connect(config["sqlite"])
        cursor = connection.cursor()

        cursor.execute("insert into block(number, leading_zeroes, difficulty, hash, epoch_time, posix_time, miner, cardano_block_no, cardano_tx_hash) values(?, ?, ?, ?, ?, ?, ?, ?, ?)", (
            output_contract["inline_datum"]["plutus_data"]["fields"][0]["int"] - 1,
            output_contract["inline_datum"]["plutus_data"]["fields"][2]["int"],
            output_contract["inline_datum"]["plutus_data"]["fields"][3]["int"],
            output_contract["inline_datum"]["plutus_data"]["fields"][1]["bytes"],
            output_contract["inline_datum"]["plutus_data"]["fields"][4]["int"],
            output_contract["inline_datum"]["plutus_data"]["fields"][5]["int"],
            miner_output["address"],
            json["context"]["block_number"],
            json["transaction"]["hash"],
        ))

        return "", 200
    except Exception as err:
        print(request.json)
        print(err)

        return "", 500


def get_output_contract(json):
    for output in json["transaction"]["outputs"]:
        if output["address"] == "addr1wynelppvx0hdjp2tnc78pnt28veznqjecf9h3wy4edqajxsg7hwsc" and len(list(filter(lambda asset: asset["policy"] == "279f842c33eed9054b9e3c70cd6a3b32298259c24b78b895cb41d91a" and asset["asset"] == "6c6f72642074756e61", output["assets"]))) == 1:
            return output

    return None


def get_miner_output(json):
    for output in json["transaction"]["outputs"]:
        if len(list(filter(lambda asset: asset["policy"] == "279f842c33eed9054b9e3c70cd6a3b32298259c24b78b895cb41d91a" and asset["asset"] == "54554e41", output["assets"]))) == 1:
            return output

    return None
