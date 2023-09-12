class Miner:
    def __init__(self, address: str, total_blocks: int, total_rewards: int, first_block: int, last_block: int):
        self.address = address
        self.total_blocks = total_blocks
        self.total_rewards = total_rewards
        self.first_block = first_block
        self.last_block = last_block
