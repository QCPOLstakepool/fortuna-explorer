export default interface CurrentEpoch {
    number: number;
    next_block_number: number;
    progress: number;
    blocks_remaining: number;
    leading_zeroes: number;
    difficulty: number;
    average_block_time: number;
}