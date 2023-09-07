export default interface CurrentEpoch {
    number: number;
    last_block_number: number;
    progress: number;
    blocks_remaining: number;
    leading_zeroes: number;
    difficulty: number;
}