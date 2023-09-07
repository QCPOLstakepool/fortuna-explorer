from repository.sqlite_repository import SqliteRepository
from model.block import Block


class BlockRepository(SqliteRepository):
    def get_blocks(self, page: int, size: int, from_block: int, desc: bool) -> list[Block]:
        connection = self._open_connection()

        try:
            cursor = connection.cursor()

            cursor.execute("""select
                block.number, block.leading_zeroes, block.difficulty, block.hash, block.epoch_time, block.posix_time, block.miner, block.rewards
            from
                block
            where
                miner != 'genesis' and
                hash is not null
            order by
                block.number {} 
            limit ? 
            offset ?""".format(
                "desc" if desc else "asc"
            ), [size + 1, (page - 1) * size])

            rows = cursor.fetchall()

            blocks = []

            for row in rows:
                blocks.append(Block(row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7]))

            return blocks
        finally:
            connection.close()