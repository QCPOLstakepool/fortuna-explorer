import json
import sqlite3

from flask import Flask, request

with open("../config.json") as config_file:
    config = json.load(config_file)

app = Flask(__name__)

@app.route("/api/tx", methods = ["POST"])
def post_tx():
    connection = None

    try:
        json = request.json

        if "transaction" not in json:  # Not what we're looking for
            return "", 200

        output_contract = get_output_contract(json)

        if output_contract is None:
            raise Exception("Contract output not found.")

        if output_contract["inline_datum"]["plutus_data"]["fields"][0]["int"] == 0:
            return "Genesis block.", 200

        miner_output = get_miner_output(json)

        if miner_output is None:
            raise Exception("Miner output not found.")

        print(request.json)

        connection = sqlite3.connect(config["sqlite"])

        connection.execute("insert into block(number, leading_zeroes, difficulty, hash, epoch_time, posix_time, miner, cardano_block_no, cardano_tx_hash) values(?, ?, ?, ?, ?, ?, ?, ?, ?)", (
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

        connection.commit()

        return "", 200
    except Exception as err:
        print(err)

        return "", 500
    finally:
        if connection is not None:
            connection.close()


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
