import {useEffect, useState} from "react";
import "./Home.scss";
import FortunaBlock from "../fortuna_block";
import {useTranslation} from "react-i18next";

function Home(): JSX.Element {
    const {t} = useTranslation();
    const [latestBlock, setLatestBlock] = useState<FortunaBlock>({
        datum: "", block_no: 0, hash: "00000000000000000000000000000000", leading_zero: 0, difficulty: 0, epoch_time: 0, current_posix_time: 0
    });
    const [recentBlocks, setRecentBlocks] = useState<FortunaBlock[]>([]);

    useEffect(() => {
        fetch('api/blocks/latest').then(response => response.json()).then(response => {
            setLatestBlock(response);
        });

        fetch('api/blocks').then(response => response.json()).then(response => {
            setRecentBlocks(response);
        });
    }, [])

    return <div className="Home">
        <div className="container mt-4">
            <h1>{t('LatestBlockInformation')}</h1>

            <div className="latest-block row">
                <div className="col-6">
                    <table className="table">
                        <tr>
                            <td className="label">{t('Epoch')}</td>
                            <td className="value">{latestBlock?.block_no / 2016}</td>
                        </tr>
                        <tr>
                            <td className="label">{t('Block')}</td>
                            <td className="value">{latestBlock?.block_no}</td>
                        </tr>
                        <tr>
                            <td className="label">{t('NextEpochIn')}</td>
                            <td className="value">
                                <div className="p-0">{t('ValueBlocks', {blocks: 2016 - ((latestBlock?.block_no ?? 0) % 2016)})}</div>
                                <div className="p-0">---</div>
                            </td>
                        </tr>
                        <tr>
                            <td className="label">{t('Hash')}</td>
                            <td className="value">{latestBlock?.hash}</td>
                        </tr>
                    </table>
                </div>
                <div className="col-6">
                    <table className="table">
                        <tr>
                            <td className="label">{t('Leading Zeroes')}</td>
                            <td className="value">{latestBlock?.leading_zero}</td>
                        </tr>
                        <tr>
                            <td className="label">{t('Difficulty')}</td>
                            <td className="value">{latestBlock?.difficulty}</td>
                        </tr>
                        <tr>
                            <td className="label">{t('AverageBlockTimeEpoch')}</td>
                            <td className="value">---</td>
                        </tr>
                        <tr>
                            <td className="label">{t('AverageBlockTimeLast100Blocks')}</td>
                            <td className="value">---</td>
                        </tr>
                    </table>
                </div>
            </div>

            <h1>{t('RecentBlocks')}</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Epoch</th>
                        <th>Block</th>
                        <th>Hash</th>
                        <th>Leading Zeroes</th>
                        <th>Difficulty</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                {
                    recentBlocks.map((block: FortunaBlock) => <tr key={block.block_no}>
                        <td>{block.block_no / 2016}</td>
                        <td>{block.block_no}</td>
                        <td>{block.hash}</td>
                        <td>{block.leading_zero}</td>
                        <td>{block.difficulty}</td>
                        <td>{new Date(block.current_posix_time).toLocaleString()}</td>
                    </tr>)
                }
                </tbody>
            </table>
        </div>
    </div>
}

export default Home;