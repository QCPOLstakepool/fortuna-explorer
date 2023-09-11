export interface Block {
    epoch: number;
    number: number;
    leading_zeroes: number;
    target: number;
    hash: string;
    epoch_time: number;
    posix_time: number;
    miner: string;
    rewards: number;
}

export interface CurrentEpoch {
    number: number;
    next_block_number: number;
    progress: number;
    blocks_remaining: number;
    leading_zeroes: number;
    target: number;
    average_block_time: number;
    estimated_hash_rate: number;
}

export interface TunaStats {
    circulating_supply: number;
    issuance_rate: number;
}