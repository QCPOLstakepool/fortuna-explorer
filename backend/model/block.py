import math
from dataclasses import dataclass


@dataclass
class Block:
    def __init__(self, number: int, leading_zeroes: int, difficulty: int, hash: str, epoch_time: int, posix_time: int, miner: str, rewards: int):
        self.epoch = math.floor((number - 1) / 2016) + 1
        self.number = number
        self.leading_zeroes = leading_zeroes
        self.difficulty = difficulty
        self.hash = hash
        self.epoch_time = epoch_time
        self.posix_time = posix_time
        self.miner = miner
        self.rewards = rewards
