export default interface FortunaBlock {
    block_no: number;
    hash: string;
    leading_zero: number;
    difficulty: number;
    epoch_time: number;
    current_posix_time: number;
}