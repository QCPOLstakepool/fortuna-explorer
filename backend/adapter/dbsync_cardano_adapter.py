from model.FortunaBlock import FortunaBlock
from adapter.cardano_adapter import CardanoAdapterInterface
from psycopg2 import sql

import psycopg2


class DbsyncCardanoAdapter(CardanoAdapterInterface):
    def __init__(self, host: str, port: int, user: str, password: str, database: str):
        self.host = host
        self.port = port
        self.user = user
        self.password = password
        self.database = database
        
    def get_latest_block(self):
        connection = self._open_connection()

        try:
            cursor = connection.cursor()

            cursor.execute("""select
                block.block_no, block.slot_no, datum.value
            from
                tx_out
            join
                datum on datum.id = tx_out.inline_datum_id
            join
                tx on tx.id = tx_out.tx_id
            join 
                block on block.id = tx.block_id
            where
                tx_out.address = 'addr1wynelppvx0hdjp2tnc78pnt28veznqjecf9h3wy4edqajxsg7hwsc' and
                tx_out.inline_datum_id is not null
            order by
                block.block_no desc
            limit 1""")

            rows = cursor.fetchall()

            if len(rows) != 1:
                return None

            return FortunaBlock(rows[0][2])
        finally:
            connection.close()

    def get_blocks(self, page: int, size: int, from_block: int, desc: bool) -> list[FortunaBlock]:
        connection = self._open_connection()

        try:
            cursor = connection.cursor()

            cursor.execute("""select
                block.block_no, block.slot_no, datum.value
            from
                tx_out
            join
                datum on datum.id = tx_out.inline_datum_id
            join
                tx on tx.id = tx_out.tx_id
            join 
                block on block.id = tx.block_id
            where
                tx_out.address = 'addr1wynelppvx0hdjp2tnc78pnt28veznqjecf9h3wy4edqajxsg7hwsc' and
                tx_out.inline_datum_id is not null
            order by
                block.block_no {} 
            limit %s 
            offset %s""".format(
                "desc" if desc else "asc"
            ), (size, (page - 1) * size))

            rows = cursor.fetchall()

            fortuna_blocks = []

            for row in rows:
                fortuna_blocks.append(FortunaBlock(row[2]))

            return fortuna_blocks
        finally:
            connection.close()
    
    def _open_connection(self):
        connection = psycopg2.connect(user=self.user, password=self.password, host=self.host, port=self.port, database=self.database)

        return connection
