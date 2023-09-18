from repository.sqlite_repository import SqliteRepository
from model.tuna_stats import TunaStats

import requests


class TunaRepository(SqliteRepository):
    def get_stats(self):
        connection = self._open_connection()

        try:
            circulating_supply = self._get_circulating_supply(connection)
            issuance_rate = self._get_issuance_rate(connection)
            price = self._get_price()

            return TunaStats(circulating_supply, issuance_rate, price)
        finally:
            connection.close()

    def _get_circulating_supply(self, connection) -> float:
        cursor = connection.cursor()
        cursor.execute("""
            select
                sum(rewards)
            from
                block
            where
                hash is not null
        """)
        rows = cursor.fetchall()

        return rows[0][0]

    def _get_issuance_rate(self, connection):
        cursor = connection.cursor()
        cursor.execute("""
            with _block as
            (
                select
                   rewards, posix_time as min_posix_time, posix_time as max_posix_time
               from
                   block
               where
                   hash is not null
               order by
                   number desc
               limit 
                   100
            )
            select
               sum(rewards), min(min_posix_time), max(max_posix_time)
           from
               _block
       """)
        rows = cursor.fetchall()

        rewards_100_blocks = rows[0][0]
        time_100_blocks = (rows[0][2] - rows[0][1]) / 1000

        return rewards_100_blocks / time_100_blocks

    def _get_price(self):
        ada_tuna_pool_response = requests.get("https://analytics.spectrum.fi/cardano/pool/info/dd061b480daddd9a833d2477c791356be4e134a433e19df7eb18be10.TUNA_ADA_NFT?after=1658379570")
        ada_tuna_pool_response_json = ada_tuna_pool_response.json()

        return (ada_tuna_pool_response_json["lockedX"]["amount"] / ada_tuna_pool_response_json["lockedY"]["amount"]) * 100
