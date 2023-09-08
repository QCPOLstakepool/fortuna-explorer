import {useEffect, useState} from "react";
import "./Home.scss";
import Block from "../block";
import {useTranslation} from "react-i18next";
import CurrentEpoch from "../currentEpoch";

function Home(): JSX.Element {
    const {t} = useTranslation();
    const [currentEpoch, setCurrentEpoch] = useState<CurrentEpoch | undefined>(undefined);
    const [recentBlocks, setRecentBlocks] = useState<Block[] | undefined>(undefined);

    useEffect(() => {
        fetch('api/epochs/current').then(response => response.json()).then(response => {
            setCurrentEpoch(response);
        });

        fetch('api/blocks').then(response => response.json()).then(response => {
            setRecentBlocks(response);
        });
    }, []);

    if (currentEpoch === undefined || recentBlocks === undefined)
        return <>Loading</>;

    return <div className="Home">
        <div className="container-fluid mt-4">
            <h1>{t('CurrentEpoch')}</h1>

            <div className="current-epoch d-flex flex-column flex-lg-row justify-content-between">
                <div className="current-epoch-stats narrow-label d-flex flex-column flex-grow-1">
                    {getCurrentEpochStat(t('Number'), currentEpoch.number)}
                    {getCurrentEpochStat(t('Progress'), `${(currentEpoch.progress * 100).toFixed(2)}%`)}
                    {getCurrentEpochStat(t('NextEpochIn'), <>
                        <div className="p-0">{t('ValueBlocks', {blocks: currentEpoch.blocks_remaining})}</div>
                        <div className="p-0">{`~${getHumanFormatTime(currentEpoch.blocks_remaining * currentEpoch.average_block_time)}`}</div>
                    </>)}
                </div>
                <div className="current-epoch-stats wide-label d-flex flex-column flex-grow-1">
                    {getCurrentEpochStat(t('LeadingZeroes'), currentEpoch.leading_zeroes)}
                    {getCurrentEpochStat(t('Difficulty'), currentEpoch.difficulty)}
                    {getCurrentEpochStat(t('AverageBlockTimeEpoch'), getHumanFormatTime(currentEpoch.average_block_time))}
                    {getCurrentEpochStat(t('EstimatedHashPower'), "---")}
                </div>
            </div>

            <h1 className="mt-4">{t('RecentBlocks')}</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th className="d-none d-lg-table-cell">{t('Epoch')}</th>
                        <th>{t('Block')}</th>
                        <th className="d-none d-md-table-cell">{t('LeadingZeroes')}</th>
                        <th className="d-none d-lg-table-cell">{t('Difficulty')}</th>
                        <th className="d-none d-xxl-table-cell">{t('Hash')}</th>
                        <th>{t('Miner')}</th>
                        <th>{t('Rewards')}</th>
                        <th>{t('Time')}</th>
                    </tr>
                </thead>
                <tbody>
                {
                    recentBlocks.map((block: Block) => <tr key={block.number}>
                        <td className="d-none d-lg-table-cell">{block.epoch}</td>
                        <td>{block.number}</td>
                        <td className="d-none d-md-table-cell">{block.leading_zeroes}</td>
                        <td className="d-none d-lg-table-cell">{block.difficulty}</td>
                        <td className="d-none d-xxl-table-cell">{formatHash(block.hash, block.leading_zeroes)}</td>
                        <td><span className="d-none d-md-inline">{`${block.miner.substring(0, 6)}\u2026$`}</span><span>{`${block.miner.substring(block.miner.length - 6)}`}</span></td>
                        <td>50.00000000</td>
                        <td>{new Date(block.posix_time).toLocaleString()}</td>
                    </tr>)
                }
                </tbody>
            </table>
        </div>
    </div>;

    function getCurrentEpochStat(label: string, value: JSX.Element | string | number): JSX.Element {
       return <div className="current-epoch-stat d-flex">
            <div className="label">{label}</div>
            <div className="value">{value}</div>
        </div>
    }

    function formatHash(hash: string, leading_zero: number): JSX.Element {
        return <>
            0<sub>{leading_zero}</sub>{hash.substring(leading_zero)}
        </>;
    }

    function getHumanFormatTime(seconds: number): string {
        const weeks = Math.floor(seconds / (60 * 60 * 24 * 7));
        seconds -= weeks * (60 * 60 * 24 * 7);
        const days = Math.floor(seconds / (60 * 60 * 24));
        seconds -= days * (60 * 60 * 24);
        const hours = Math.floor(seconds / (60 * 60));
        seconds -= hours * (60 * 60);
        const minutes = Math.floor(seconds / 60);
        seconds -= minutes * 60;

        if (weeks > 0)
            return `${weeks}w ${days}d ${hours}h ${minutes}m ${seconds}s`;
        else if (days > 0)
            return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        else if (hours > 0)
            return `${hours}h ${minutes}m ${seconds}s`;
        else if (minutes > 0)
            return `${minutes}m ${seconds}s`;
        else
            return `${seconds}s`;
    }
}

export default Home;