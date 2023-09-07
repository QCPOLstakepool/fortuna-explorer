import math

from model.current_epoch import CurrentEpoch
from repository.sqlite_repository import SqliteRepository


class EpochRepository(SqliteRepository):
    def get_current_epoch(self):
        connection = self._open_connection()

        try:
            cursor = connection.cursor()
            cursor.execute("""
                select
                    number, leading_zeroes, difficulty
                from
                    block
                order by
                    number desc
                limit 
                    1
            """)
            rows = cursor.fetchall()

            return CurrentEpoch(math.floor(rows[0][0] / 2016) + 1, rows[0][0], rows[0][1], rows[0][2])
        finally:
            connection.close()
