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
                        <div className="p-0">---</div>
                    </>)}
                </div>
                <div className="current-epoch-stats wide-label d-flex flex-column flex-grow-1">
                    {getCurrentEpochStat(t('LeadingZeroes'), currentEpoch.leading_zeroes)}
                    {getCurrentEpochStat(t('Difficulty'), currentEpoch.difficulty)}
                    {getCurrentEpochStat(t('AverageBlockTimeEpoch'), "---")}
                    {getCurrentEpochStat(t('AverageBlockTimeLast100Blocks'), "---")}
                    {getCurrentEpochStat(t('EstimatedHashPower'), "---")}
                </div>
            </div>

            <h1 className="mt-4">{t('RecentBlocks')}</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>{t('Epoch')}</th>
                        <th>{t('Block')}</th>
                        <th>{t('LeadingZeroes')}</th>
                        <th>{t('Difficulty')}</th>
                        <th className="d-none d-xxl-table-cell">{t('Hash')}</th>
                        <th>{t('Time')}</th>
                        <th>{t('Miner')}</th>
                    </tr>
                </thead>
                <tbody>
                {
                    recentBlocks.map((block: Block) => <tr key={block.number}>
                        <td>{block.epoch}</td>
                        <td>{block.number}</td>
                        <td>{block.leading_zeroes}</td>
                        <td>{block.difficulty}</td>
                        <td className="d-none d-xxl-table-cell">{formatHash(block.hash, block.leading_zeroes)}</td>
                        <td>{new Date(block.posix_time).toLocaleString()}</td>
                        <td>{`${block.miner.substring(0, 6)}\u2026${block.miner.substring(block.miner.length - 6)}`}</td>
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
}

export default Home;