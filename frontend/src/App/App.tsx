import React from "react";
import {BrowserRouter, Navigate, NavLink, Route, Routes} from "react-router-dom";
import "./App.scss";
import Home from "../Home/Home";
import Miners from "../Miners/Miners";
import TopNavBar from "../TopNavBar/TopNavBar";
import Blocks from "../Blocks/Blocks";

export default function App(): JSX.Element {
    return <BrowserRouter>
        <TopNavBar/>

        <div className="App">
            <NavLink className="link-no-decoration" to="/">
                <div className="d-flex justify-content-center align-items-center">
                    <div><img src="/assets/fortuna_circle.png" width={100} alt="Fortuna"/></div>
                    <div className="fortuna-title">Fortuna Explorer</div>
                </div>
            </NavLink>

            <div id="content">
                <Routes>
                    <Route path="/home" element={<Home/>}></Route>
                    <Route path="/miners">
                        <Route path="" element={<Miners/>}></Route>
                        <Route path=":address" element={<div>Test 2</div>}></Route>
                    </Route>
                    <Route path="/blocks" element={<Blocks/>}></Route>
                    <Route path="*" element={<Navigate to="/home" replace />}></Route>
                </Routes>

                <div className="d-flex flex-column align-items-center mt-5 mb-4">
                    <div className="d-flex flex-column align-items-center mb-2">
                        <div>Made with ❤️ by <a href="https://qcpol.stakepool.quebec" target="_blank" rel="noreferrer">QCPOL Stake Pool</a>.</div>
                        <div>Powered by <a href="https://github.com/txpipe/oura" target="_blank" rel="noreferrer">Oura</a>.</div>
                    </div>
                    <div>Find this helpful? 😊 Stake with QCPOL or send tip to <span style={{backgroundColor: "lightgray", wordBreak: "break-all"}}>addr1qy54zzgykl3w9skx8r2vc78mudzqemak7sx63va5fljrslslfmvv46xeudh9rhsec76gr88lnv2jfqt76yw8zymnx9rse9evg9</span>.</div>
                </div>
            </div>
        </div>
    </BrowserRouter>;
}
