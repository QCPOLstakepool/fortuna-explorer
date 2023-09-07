import json
import os.path
import sqlite3

if __name__ == "__main__":
    with open("config.json") as config_file:
        config = json.load(config_file)

    if os.path.exists(config["sqlite"]):
        print("Database {} already exists!", config["sqlite"])
    else:
        connection = sqlite3.connect(config["sqlite"])
        cursor = connection.cursor()

        cursor.execute("""
            create table version
            (
                number integer not null primary key
            )
        """)

        cursor.execute("insert into version(number) values(1)")

        cursor.execute("""
            CREATE TABLE block
            (
                number integer not null primary key,
                leading_zeroes integer not null,
                difficulty integer not null,
                hash char(64) not null,
                epoch_time integer not null,
                posix_time integer not null,
                miner text not null,
                cardano_block_no integer,
                cardano_tx_hash char(64)
            )
        """)

        cursor.execute("insert into block(number, leading_zeroes, difficulty, hash, epoch_time, posix_time, miner, cardano_block_no, cardano_tx_hash) values(0, 5, 65535, 'e4390b57fd759b5961107b931dca6d826cb2c272f0f711e266df48d0afc3a441', 0, 1693078039000, 'genesis', 9210120, 'f3d2e04e0391f7c95a1aeb6b3f35e33ffd6a060ac36a9ecb64af7f06ae0aa907')")

        connection.close()

        print("Database {} initialized!", config["sqlite"])
