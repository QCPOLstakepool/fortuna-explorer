import {useEffect, useState} from "react";
import "./Home.scss";
import { Block, CurrentEpoch, TunaStats } from "../backend";
import {useTranslation} from "react-i18next";
import {formatHash, getHumanDuration, getHumanHashRate, getHumanPosixDateTime} from "../utils";

function Home(): JSX.Element {
    const {t} = useTranslation();

    const [tunaStats, setTunaStats] = useState<TunaStats | undefined>(undefined);
    const [currentEpoch, setCurrentEpoch] = useState<CurrentEpoch | undefined>(undefined);
    const [recentBlocks, setRecentBlocks] = useState<Block[] | undefined>(undefined);

    useEffect(() => {
        const refreshInterval = setInterval(() => {
            updateData();
        }, 60000);

        updateData();

        return () => {
            clearInterval(refreshInterval);
        }
    }, []);

    if (tunaStats === undefined || currentEpoch === undefined || recentBlocks === undefined)
        return <>Loading</>;

    return <div className="Home">
        <div className="container-fluid mt-4">
            <div className="row">
                <div className="col-12 col-xl-4 tuna-stats">
                    <h2>$TUNA</h2>
                    <div className="d-flex flex-column flex-grow-1">
                        {getTunaStats(t('CirculatingSupply'), (tunaStats.circulating_supply / 100000000).toLocaleString(undefined, { minimumFractionDigits: 8, useGrouping: true }))}
                        {getTunaStats(t('IssuanceRate'), `${((tunaStats.issuance_rate * 60 * 60 * 24) / 100000000).toLocaleString(undefined, { minimumFractionDigits: 8, useGrouping: true })} / day`)}
                        {getTunaStats(t('MaximumSupply'), (21000000).toLocaleString(undefined, { minimumFractionDigits: 8, useGrouping: true }))}
                        {getTunaStats(t('Price'), `${tunaStats.price.toLocaleString(undefined, { maximumFractionDigits: 6, minimumFractionDigits: 6, minimumIntegerDigits: 1 })} ₳`)}
                    </div>
                </div>
                <div className="col-12 col-xl-8 mt-3 mt-xl-0">
                    <h2>{t('CurrentEpoch')}</h2>
                    <div className="current-epoch d-flex flex-column flex-lg-row justify-content-between">
                        <div className="current-epoch-stats d-flex flex-column flex-grow-1">
                            {getCurrentEpochStat(t('Number'), currentEpoch.number)}
                            {getCurrentEpochStat(t('Progress'), `${(currentEpoch.progress * 100).toFixed(2)}%`)}
                            {getCurrentEpochStat(t('NextEpochIn'), <>
                                <div className="p-0">{t('ValueBlocks', {blocks: currentEpoch.blocks_remaining})}</div>
                                <div className="p-0">{`~${getHumanDuration(currentEpoch.blocks_remaining * currentEpoch.average_block_time)}`}</div>
                            </>)}
                        </div>
                        <div className="current-epoch-stats d-flex flex-column flex-grow-1">
                            {getCurrentEpochStat(t('LeadingZeroes'), currentEpoch.leading_zeroes)}
                            {getCurrentEpochStat(t('Target'), currentEpoch.target)}
                            {getCurrentEpochStat(t('AverageBlockTime'), getHumanDuration(currentEpoch.average_block_time))}
                            {getCurrentEpochStat(t('EstimatedHashPower'), getHumanHashRate(currentEpoch.estimated_hash_rate))}
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="mt-4">{t('RecentBlocks')}</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th className="d-none d-lg-table-cell">{t('Epoch')}</th>
                        <th>{t('Block')}</th>
                        <th className="d-none d-md-table-cell">{t('LeadingZeroes')}</th>
                        <th className="d-none d-lg-table-cell">{t('Target')}</th>
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
                        <td className="d-none d-lg-table-cell">{block.target}</td>
                        <td className="d-none d-xxl-table-cell">{formatHash(block.hash, block.leading_zeroes)}</td>
                        <td><span className="d-none d-md-inline">{`${block.miner.substring(0, 6)}\u2026`}</span><span>{`${block.miner.substring(block.miner.length - 6)}`}</span></td>
                        <td>{(block.rewards / 100000000).toFixed(8)}</td>
                        <td>{getHumanPosixDateTime(block.posix_time)}</td>
                    </tr>)
                }
                </tbody>
            </table>
        </div>
    </div>;

    function updateData(): void {
        fetch('api/tuna').then(response => response.json()).then(response => {
            setTunaStats(response);
        });

        fetch('api/epochs/current').then(response => response.json()).then(response => {
            setCurrentEpoch(response);
        });

        fetch('api/blocks').then(response => response.json()).then(response => {
            setRecentBlocks(response);
        });
    }

    function getTunaStats(label: string, value: JSX.Element | string | number): JSX.Element {
       return <div className="d-flex">
            <div className="label">{label}</div>
            <div className="value">{value}</div>
        </div>
    }

    function getCurrentEpochStat(label: string, value: JSX.Element | string | number): JSX.Element {
       return <div className="current-epoch-stat d-flex">
            <div className="label">{label}</div>
            <div className="value">{value}</div>
        </div>
    }
}

export default Home;