import {useEffect, useState} from "react";
import "./Home.scss";
import FortunaBlock from "../fortuna_block";
import {useTranslation} from "react-i18next";

function Home(): JSX.Element {
    const {t} = useTranslation();
    const [nextBlock, setNextBlock] = useState<FortunaBlock>({
        block_no: 0, hash: "00000000000000000000000000000000", leading_zero: 0, difficulty: 0, epoch_time: 0, current_posix_time: 0
    });
    const [recentBlocks, setRecentBlocks] = useState<FortunaBlock[]>([]);

    useEffect(() => {
        fetch('api/blocks/next').then(response => response.json()).then(response => {
            setNextBlock(response);
        });

        fetch('api/blocks').then(response => response.json()).then(response => {
            setRecentBlocks(response);
        });
    }, []);

    return <div className="Home">
        <div className="container-fluid mt-4">
            <h1>{t('CurrentEpoch')}</h1>

            <div className="current-epoch d-flex flex-column flex-lg-row justify-content-between">
                <div className="current-epoch-stats narrow-label d-flex flex-column flex-grow-1">
                    {getCurrentEpochStat(t('Number'), getEpochNumber(nextBlock?.block_no))}
                    {getCurrentEpochStat(t('Progress'), `${((((nextBlock?.block_no - 1) % 2016) / 2016) * 100).toFixed(2)}%`)}
                    {getCurrentEpochStat(t('NextEpochIn'), <>
                        <div className="p-0">{t('ValueBlocks', {blocks: 2016 - (((nextBlock?.block_no - 1) ?? 0) % 2016)})}</div>
                        <div className="p-0">---</div>
                    </>)}
                </div>
                <div className="current-epoch-stats wide-label d-flex flex-column flex-grow-1">
                    {getCurrentEpochStat(t('LeadingZeroes'), nextBlock?.leading_zero)}
                    {getCurrentEpochStat(t('Difficulty'), nextBlock?.difficulty)}
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
                    recentBlocks.map((block: FortunaBlock) => <tr key={block.block_no}>
                        <td>{getEpochNumber(block.block_no - 1)}</td>
                        <td>{block.block_no}</td>
                        <td>{block.leading_zero}</td>
                        <td>{block.difficulty}</td>
                        <td className="d-none d-xxl-table-cell">{formatHash(block.hash, block.leading_zero)}</td>
                        <td>{new Date(block.current_posix_time).toLocaleString()}</td>
                        <td>{`${block.miner?.substring(0, 6)}\u2026${block.miner?.substring(block.miner?.length - 6)}`}</td>
                    </tr>)
                }
                </tbody>
            </table>
        </div>
    </div>;

    function getEpochNumber(block: number): number {
        return Math.floor(block / 2016) + 1;
    }

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