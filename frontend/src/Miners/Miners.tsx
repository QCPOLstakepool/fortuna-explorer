import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Miner} from "../backend";
import {getHumanPosixDateTime} from "../utils";

interface MinerSearchParam {
    order_by: "rewards" | "address";
    "order": "desc" | "asc";
    size: number;
    page: number;
}

export default function Miners(): JSX.Element {
    const {t} = useTranslation();

    const [miners, setMiners] = useState<Miner[] | undefined>(undefined);
    const [searchParams, setSearchParams] = useState<MinerSearchParam>({order_by: "rewards", "order": "desc", size: 1000, page: 1});

    useEffect(() => {
        search();
    }, []);

    if (miners === undefined)
        return <>Loading</>;

    return <div className="Miners">
        <div className="container-fluid mt-4">
            <h2 className="mt-4">{t('Miners')}</h2>

            <table className="table">
                <thead>
                    <tr>
                        <th>{t('Address')}</th>
                        <th>{t('TotalBlocks')}</th>
                        <th>{t('TotalRewards')}</th>
                        <th>{t('FirstBlock')}</th>
                        <th>{t('LastBlock')}</th>
                    </tr>
                </thead>
                <tbody>
                {
                    miners.map((miner: Miner) => <tr key={miner.address}>
                        <td>{miner.address}</td>
                        <td>{miner.total_blocks}</td>
                        <td>{(miner.total_rewards / 100000000).toFixed(8)}</td>
                        <td>{getHumanPosixDateTime(miner.first_block)}</td>
                        <td>{getHumanPosixDateTime(miner.last_block)}</td>
                    </tr>)
                }
                </tbody>
            </table>
        </div>
    </div>;


    function search(): void {
        fetch(`api/miners?order_by=${searchParams.order_by}&order=${searchParams.order}&page=${searchParams.page}&size=${searchParams.size}`).then(response => response.json()).then(response => {
            setMiners(response);
        });
    }
}