import React, {useEffect, useState} from 'react';
import {BrowserRouter, Navigate, NavLink, Route, Routes} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import './FortunaExplorer.scss';
import Home from '../Home/Home';


function FortunaExplorer(): JSX.Element {
    return <BrowserRouter>
        <div className='FortunaExplorer'>
            <div id='content'>
                <Routes>
                    <Route path='/home' element={<Home/>}></Route>
                    <Route path='*' element={<Navigate to="/home" replace />}></Route>
                </Routes>
            </div>
        </div>
    </BrowserRouter>;
}

export default FortunaExplorer;
