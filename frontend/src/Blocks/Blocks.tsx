import {Block} from "../backend";
import {formatHash, getHumanPosixDateTime} from "../utils";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

interface BlocksSearchParams {
    page: number;
    size: number;
    order: "asc" | "desc";
}

export default function Blocks(): JSX.Element {
    const {t} = useTranslation();

    const searchParams: BlocksSearchParams = {page: 1, size: 50, order: "desc"};
    const [blocks, setBlocks] = useState<Block[] | undefined>(undefined);

    useEffect(() => {
        fetch(`api/blocks?page=${1}&size=${50}&order=desc`).then(response => response.json()).then(response => {
            setBlocks(response);
        });
    }, []);

    if (blocks === undefined)
        return <>Loading</>;

    return <div className="Blocks">
        <div className="container-fluid mt-4">
            <h2 className="mt-4">{t('Blocks')}</h2>

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
                    blocks.map((block: Block) => <tr key={block.number}>
                        <td className="d-none d-lg-table-cell">{block.epoch}</td>
                        <td className="clickable" onClick={() => onChangeOrder(searchParams.order === "asc" ? "desc" : "asc")}>{block.number}</td>
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

            <div key={searchParams.page} className="d-flex justify-content-lg-between mt-2">
                <div className="clickable" onClick={() => onChangePage(Math.max(1, searchParams.page - 1))}>&lt;&lt;&lt; {t('Previous')}</div>
                <div className="d-flex">{getPages()}</div>
                <div className="clickable" onClick={() => onChangePage(searchParams.page + 1)}>{t('Next')} &gt;&gt;&gt;</div>
            </div>
        </div>
    </div>;

    function getPages(): JSX.Element {
        const elements: JSX.Element[] = [];

        for (let i = Math.max(1, searchParams.page - 4); i <= searchParams.page + 4; i++) {
            if (i === searchParams.page)
                elements.push(<div className="clickable mx-2">{i}</div>);
            else
                elements.push(<div className="clickable mx-2" onClick={() => onChangePage(i)}>{i}</div>);
        }

        return <>{elements}</>;
    }

    function onChangeOrder(order: "asc" | "desc"): void {
        searchParams.page = 1;
        searchParams.order = order;

        search();
    }

    function onChangePage(page: number): void {
        searchParams.page = page;

        search();
    }

    function search(): void {
        fetch(`api/blocks?block=${(searchParams.order === "asc" ? blocks![blocks!.length - 1].number + 1 : blocks![0].number - 1)}&page=${searchParams.page}&size=${searchParams.size}&order=${searchParams.order}`).then(response => response.json()).then(response => {
            setBlocks(response);
        });
    }
}