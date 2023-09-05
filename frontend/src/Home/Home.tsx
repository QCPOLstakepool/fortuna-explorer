import {useEffect, useState} from "react";
import FortunaBlock from "../fortuna_block";
import {useTranslation} from "react-i18next";

function Home(): JSX.Element {
    const {t} = useTranslation();
    const [latestBlock, setLatestBlock] = useState<FortunaBlock | null>(null);

    useEffect(() => {
        fetch('api/blocks/latest').then(response => response.json()).then(response => {
            setLatestBlock(response);
        });
    }, [])

    return <div className="Home">
        <div className="container mt-4">
            <div>{t('block_number_value', {block_number: latestBlock?.block_no})}</div>
            <div>{t('blocks_left_until_next_epoch_value', {blocks: 2016 - ((latestBlock?.block_no ?? 0) % 2016)})}</div>
            <div>{t('hash', {hash: latestBlock?.hash})}</div>
            <div>{t('leading_zero_value', {leading_zero: latestBlock?.leading_zero})}</div>
            <div>{t('difficulty_value', {difficulty: latestBlock?.difficulty})}</div>
            <div>{t('epoch_time_value', {epoch_time: latestBlock?.epoch_time})}</div>
            <div>{t('current_posix_time_value', {current_posix_time: latestBlock?.current_posix_time})}</div>
            <div>{t('datum_value', {datum: JSON.stringify(latestBlock?.datum)})}</div>
        </div>

    </div>
}

export default Home;