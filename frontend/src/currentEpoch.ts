export default interface CurrentEpoch {
    number: number;
    next_block_number: number;
    progress: number;
    blocks_remaining: number;
    leading_zeroes: number;
    target: number;
    average_block_time: number;
    estimated_hash_rate: number;
}