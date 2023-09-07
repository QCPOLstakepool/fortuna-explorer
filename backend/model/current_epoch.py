from dataclasses import dataclass


@dataclass
class CurrentEpoch:
    def __init__(self, number: int, last_block_number: int, leading_zeroes: int, difficulty: int):
        self.number = number
        self.last_block_number = last_block_number
        self.progress = ((last_block_number % 2016) + 1) / 2016
        self.blocks_remaining = 2016 - ((last_block_number % 2016) + 1)
        self.leading_zeroes = leading_zeroes
        self.difficulty = difficulty
