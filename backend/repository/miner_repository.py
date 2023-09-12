from repository.sqlite_repository import SqliteRepository
from model.miner import Miner


class MinerRepository(SqliteRepository):
    def get_miners(self, page: int, size: int, order_by: str, desc: bool) -> list[Miner]:
        connection = self._open_connection()

        try:
            cursor = connection.cursor()
            cursor.execute("""
                select
                    miner, count(number), sum(rewards), min(posix_time), max(posix_time)
                from
                    block
                where
                    hash is not null
                group by
                    miner
                order by
                    {} {}
                limit ? 
                offset ?
            """.format(
                "sum(block.rewards)" if order_by == "rewards" else "block.miner",
                "desc" if desc else "asc"
            ), [size + 1, (page - 1) * size])
            rows = cursor.fetchall()

            miners = []

            for row in rows:
                miners.append(Miner(row[0], row[1], row[2], row[3], row[4]))

            return miners
        finally:
            connection.close()
