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
            </div>
        </div>
    </BrowserRouter>;
}

export default FortunaExplorer;
