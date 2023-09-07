import sqlite3


class SqliteRepository():
    def __init__(self, database: str):
        self.database = database

    def _open_connection(self):
        return sqlite3.connect("file:{}?mode=ro".format(self.database), uri=True)
