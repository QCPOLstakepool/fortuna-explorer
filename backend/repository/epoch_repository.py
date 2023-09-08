import math
import time

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
                where
                    hash is null
            """)
            rows = cursor.fetchall()

            next_block_number = rows[0][0]
            epoch = math.floor(next_block_number / 2016) + 1
            leading_zeroes = rows[0][1]
            difficulty = rows[0][2]
            average_block_time = self._get_average_block_time(connection, epoch)

            return CurrentEpoch(epoch, next_block_number, leading_zeroes, difficulty, average_block_time)
        finally:
            connection.close()

    def _get_average_block_time(self, connection, epoch: int) -> int:
        upper_bound = epoch * 2016
        lower_bound = (epoch - 1) * 2016

        print("Upper bound = {}, lower bound = {}".format(upper_bound, lower_bound))

        upper_bound_block, upper_bound_posix_time = self._get_upper_bound_block_posix_time(connection, upper_bound)
        lower_bound_block, lower_bound_posix_time = self._get_lower_bound_block_posix_time(connection, lower_bound)

        if upper_bound_posix_time is None:
            upper_bound_posix_time = time.time() * 1000

        return int(((upper_bound_posix_time - lower_bound_posix_time) / 1000) / (upper_bound_block - lower_bound_block + 1))

    def _get_upper_bound_block_posix_time(self, connection, number: int) -> tuple[int, int]:
        cursor = connection.cursor()
        cursor.execute("select number, posix_time from block where number <= ? order by number desc limit 1", [number])
        rows = cursor.fetchall()

        return rows[0][0], rows[0][1]

    def _get_lower_bound_block_posix_time(self, connection, number: int) -> tuple[int, int]:
        cursor = connection.cursor()
        cursor.execute("select number, posix_time from block where number = ?", [number])
        rows = cursor.fetchall()

        return rows[0][0], rows[0][1]
