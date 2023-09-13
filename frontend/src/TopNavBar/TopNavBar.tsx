import React from "react";
import "./TopNavBar.scss";
import {NavLink} from "react-router-dom";
import {useTranslation} from "react-i18next";

export default function TopNavBar(): JSX.Element {
    const {t} = useTranslation();

    return <div className="TopNavBar">
        <NavLink to="/home" end={true}>{t('Home')}</NavLink>
        <NavLink to="/blocks" end={true}>{t('Blocks')}</NavLink>
        <NavLink to="/miners">{t('Miners')}</NavLink>
    </div>
}