export default interface Block {
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