import json
import math
import sqlite3

from flask import Flask, request

with open("../backend/config.json") as config_file:
    config = json.load(config_file)

app = Flask(__name__)


@app.route("/api/blocks", methods=["POST"])
def post_tx():
    connection = None
    data = request.json

    try:
        if "transaction" not in data:  # Not what we're looking for
            return "", 200

        if data["transaction"]["hash"] == "f3d2e04e0391f7c95a1aeb6b3f35e33ffd6a060ac36a9ecb64af7f06ae0aa907":  # Genesis TX
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
            mined_block_number = output_contract["inline_datum"]["plutus_data"]["fields"][0]["int"] - 1
            rewards = calculate_rewards(mined_block_number)

            cursor.execute("update block set hash = ?, epoch_time = ?, posix_time = ?, miner = ?, rewards = ?, cardano_block_no = ?, cardano_tx_hash = ? where number = ?", (
                output_contract["inline_datum"]["plutus_data"]["fields"][1]["bytes"],     # hash
                output_contract["inline_datum"]["plutus_data"]["fields"][4]["int"],       # epoch_time
                output_contract["inline_datum"]["plutus_data"]["fields"][5]["int"],       # posix_time
                miner_output["address"],                                                  # miner
                rewards,                                                                  # rewards
                data["context"]["block_number"],                                          # cardano block
                data["transaction"]["hash"],                                              # cardano tx hash
                mined_block_number                                                        # number
            ))

            if cursor.rowcount != 1:
                raise Exception("Unable to update block {} (not found).".format(mined_block_number))

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


def calculate_rewards(block_number) -> int:
    initial_payout = 5000000000
    halving_number = 210000
    halving_exponent = math.floor(block_number / halving_number)

    return 0 if halving_exponent > 29 else math.floor(initial_payout / (2 ** halving_exponent))
