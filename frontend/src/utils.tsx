export function formatHash(hash: string, leading_zero: number): JSX.Element {
    return <>
        0<sub>{leading_zero}</sub>{hash.substring(leading_zero)}
    </>;
}

export function getHumanDuration(seconds: number): string {
    const weeks = Math.floor(seconds / (60 * 60 * 24 * 7));
    seconds -= weeks * (60 * 60 * 24 * 7);
    const days = Math.floor(seconds / (60 * 60 * 24));
    seconds -= days * (60 * 60 * 24);
    const hours = Math.floor(seconds / (60 * 60));
    seconds -= hours * (60 * 60);
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    if (weeks > 0)
        return `${weeks}w ${days}d ${hours}h`;
    else if (days > 0)
        return `${days}d ${hours}h ${minutes}m`;
    else if (hours > 0)
        return `${hours}h ${minutes}m ${seconds}s`;
    else if (minutes > 0)
        return `${minutes}m ${seconds}s`;
    else
        return `${seconds}s`;
}

export function getHumanHashRate(hashRate: number): string {
    if (hashRate >= 1_000_000_000_000_000)
        return `${(hashRate / 1_000_000_000_000_000).toFixed(2)} EH/s`
    else if (hashRate >= 1_000_000_000_000)
        return `${(hashRate / 1_000_000_000_000).toFixed(2)} TH/s`
    else if (hashRate >= 1_000_000_000)
        return `${(hashRate / 1_000_000_000).toFixed(2)} GH/s`
    else if (hashRate >= 1_000_000)
        return `${(hashRate / 1_000_000).toFixed(2)} MH/s`
    else if (hashRate >= 1_000)
        return `${(hashRate / 1_000).toFixed(2)} KH/s`
    else
        return `${(hashRate).toFixed(2)} H/s`
}

export function getHumanPosixDateTime(posix: number): string {
    return new Date(posix).toLocaleString();
}