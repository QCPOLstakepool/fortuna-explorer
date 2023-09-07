import json
import os.path
import sqlite3

if __name__ == "__main__":
    with open("config.json") as config_file:
        config = json.load(config_file)

    if os.path.exists(config["sqlite"]):
        print("Database {} already exists!".format(config["sqlite"]))
    else:
        connection = sqlite3.connect(config["sqlite"])

        connection.execute("""
            create table version
            (
                number integer not null primary key
            )
        """)

        connection.execute("insert into version(number) values(1)")

        connection.execute("""
            create table block
            (
                number integer not null primary key,
                leading_zeroes integer not null,
                difficulty integer not null,
                hash char(64) null,
                epoch_time integer null,
                posix_time integer null,
                miner text null,
                rewards integer,
                cardano_block_no integer,
                cardano_tx_hash char(64)
            )
        """)

        connection.execute("insert into block(number, leading_zeroes, difficulty, hash, epoch_time, posix_time, miner, rewards, cardano_block_no, cardano_tx_hash) values(-1, 5, 65535, 'e4390b57fd759b5961107b931dca6d826cb2c272f0f711e266df48d0afc3a441', 0, 1693078039000, 'genesis', 0, 9210120, 'f3d2e04e0391f7c95a1aeb6b3f35e33ffd6a060ac36a9ecb64af7f06ae0aa907')")

        connection.commit()
        connection.close()

        print("Database {} initialized!".format(config["sqlite"]))
