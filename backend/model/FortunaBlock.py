from dataclasses import dataclass


@dataclass
class FortunaBlock:
    def __init__(self, datum: dict):
        self.datum = datum
        self.block_no = datum["fields"][0]["int"]
        self.hash = datum["fields"][1]["bytes"]
        self.leading_zero = datum["fields"][2]["int"]
        self.difficulty = datum["fields"][3]["int"]
        self.epoch_time = datum["fields"][4]["int"]
        self.current_posix_time = datum["fields"][5]["int"]
