import React from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import "./FortunaExplorer.scss";
import Home from "../Home/Home";

function FortunaExplorer(): JSX.Element {
    return <BrowserRouter>
        <div className="FortunaExplorer">
            <div className="d-flex justify-content-center align-items-center">
                <div><img src="/assets/fortuna_circle.png" width={100} alt="Fortuna"/></div>
                <div className="fortuna-title">Fortuna Explorer</div>
            </div>

            <div id="content">
                <Routes>
                    <Route path="/home" element={<Home/>}></Route>
                    <Route path="*" element={<Navigate to="/home" replace />}></Route>
                </Routes>

                <div className="d-flex flex-column align-items-center mt-4 mb-4">
                    <div className="mb-2">Made with ❤️ by <a href="https://qcpol.stakepool.quebec" target="_blank" rel="noreferrer">QCPOL Stake Pool</a>. Powered by <a href="https://github.com/txpipe/oura" target="_blank" rel="noreferrer">Oura</a>.</div>
                    <div>Find this helpful? 😊 Stake with QCPOL or send tip to <span style={{backgroundColor: "lightgray"}}>addr1qy54zzgykl3w9skx8r2vc78mudzqemak7sx63va5fljrslslfmvv46xeudh9rhsec76gr88lnv2jfqt76yw8zymnx9rse9evg9</span>.</div>
                </div>
            </div>
        </div>
    </BrowserRouter>;
}

export default FortunaExplorer;
