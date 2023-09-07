import json
import sqlite3

from flask import Flask, request

with open("config.json") as config_file:
    config = json.load(config_file)

app = Flask(__name__)


@app.route("/api/blocks", methods=["POST"])
def post_tx():
    connection = None
    data = request.json

    try:
        if "transaction" not in data:  # Not what we're looking for
            return "", 200

        output_contract = get_output_contract(data)

        if output_contract is None:
            return "Not a mint transaction.", 200

        miner_output = get_miner_output(data)

        if miner_output is None:
            raise Exception("Miner output not found.")

        connection = sqlite3.connect(config["sqlite"])
        cursor = connection.cursor()

        cursor.execute("insert into block(number, leading_zeroes, difficulty) values(?, ?, ?)", (
            output_contract["inline_datum"]["plutus_data"]["fields"][0]["int"],  # number
            output_contract["inline_datum"]["plutus_data"]["fields"][2]["int"],  # leading_zeroes
            output_contract["inline_datum"]["plutus_data"]["fields"][3]["int"]   # difficulty
        ))

        if cursor.rowcount != 1:
            raise Exception("Unable to insert block {}.".format(output_contract["inline_datum"]["plutus_data"]["fields"][0]["int"]))

        if output_contract["inline_datum"]["plutus_data"]["fields"][0]["int"] > 0:
            rewards = list(filter(lambda asset: asset["policy"] == "279f842c33eed9054b9e3c70cd6a3b32298259c24b78b895cb41d91a" and asset["asset"] == "54554e41", miner_output["assets"]))[0]["amount"]

            cursor.execute("update block set hash = ?, epoch_time = ?, posix_time = ?, miner = ?, rewards = ?, cardano_block_no = ?, cardano_tx_hash = ? where number = ?", (
                output_contract["inline_datum"]["plutus_data"]["fields"][1]["bytes"],     # hash
                output_contract["inline_datum"]["plutus_data"]["fields"][4]["int"],       # epoch_time
                output_contract["inline_datum"]["plutus_data"]["fields"][5]["int"],       # posix_time
                miner_output["address"],                                                  # miner
                rewards,                                                                  # rewards
                data["context"]["block_number"],                                          # cardano block
                data["transaction"]["hash"],                                              # cardano tx hash
                output_contract["inline_datum"]["plutus_data"]["fields"][0]["int"] - 1    # number
            ))

            if cursor.rowcount != 1:
                raise Exception("Unable to update block {} (not found).".format(output_contract["inline_datum"]["plutus_data"]["fields"][0]["int"] - 1))

        connection.commit()
        cursor.close()

        return "", 200
    except Exception as err:
        print(data)
        print(err)

        return "", 500
    finally:
        if connection is not None:
            connection.close()


def get_output_contract(data):
    for output in data["transaction"]["outputs"]:
        if output["address"] == "addr1wynelppvx0hdjp2tnc78pnt28veznqjecf9h3wy4edqajxsg7hwsc" and len(list(filter(lambda asset: asset["policy"] == "279f842c33eed9054b9e3c70cd6a3b32298259c24b78b895cb41d91a" and asset["asset"] == "6c6f72642074756e61", output["assets"]))) == 1:
            return output

    return None


def get_miner_output(data):
    for output in data["transaction"]["outputs"]:
        if len(list(filter(lambda asset: asset["policy"] == "279f842c33eed9054b9e3c70cd6a3b32298259c24b78b895cb41d91a" and asset["asset"] == "54554e41", output["assets"]))) == 1:
            return output

    return None
