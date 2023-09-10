from dataclasses import dataclass


@dataclass
class CurrentEpoch:
    def __init__(self, number: int, next_block_number: int, leading_zeroes: int, target: int, average_block_time: int, estimated_hash_rate: int):
        self.number = number
        self.next_block_number = next_block_number
        self.progress = ((next_block_number % 2016) - 1) / 2016
        self.blocks_remaining = 2016 - (next_block_number % 2016) + 1
        self.leading_zeroes = leading_zeroes
        self.target = target
        self.average_block_time = average_block_time
        self.estimated_hash_rate = estimated_hash_rate
