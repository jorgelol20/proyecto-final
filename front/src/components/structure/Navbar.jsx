import React, { Fragment, useContext, useEffect, useState } from "react";
import './Navbar.css';
import { useUser } from '../../hooks/useUser.js';
import Placeholder from './../../images/placeholder.webp'
import { NavLink } from "react-router-dom";

import { matchContext } from "../../context/MatchProvider.jsx";

import { settingsContext } from "../../context/SettingsProvider.jsx";

import FPSCounter from "./FPSCounter.jsx";

const Navbar = () => {
    const { user, isLoading } = useUser();
    const {showFPS} = useContext(settingsContext)
    const [userAvatar, setUserAvatar] = useState('')
    const [userColor, setUserColor] = useState('')
    //const {activeGame} = useContext(matchContext);

    useEffect(() => {
        if (!isLoading && user) {
            setUserAvatar(user.avatar)
            setUserColor(user.color)
        }
    }, [user, isLoading])

    return (
        <Fragment>
            <nav>
                {showFPS?<FPSCounter/>:<></>}
                <div className="navbar-items">
                    <NavLink to="/" className={({ isActive }) => isActive ? 'menu_link menu_link--active' : 'menu_link'} >Inicio</NavLink>
                    {
                        !isLoading ?
                            user ? <>
                                <NavLink to={`/perfil/${user.nick}`} className={({ isActive }) => isActive ? 'menu_link menu_link--active' : 'menu_link'} ><img className="navbar-avatar" src={userAvatar ?? Placeholder} alt="" onError={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = Placeholder;
                                }}
                                    style={{ borderColor: userColor }} /></NavLink>
                            </>
                                : <>
                                    <NavLink to="/login" className={({ isActive }) => isActive ? 'menu_link menu_link--active' : 'menu_link'} >Iniciar sesión</NavLink>
                                    <NavLink to="/signup" className={({ isActive }) => isActive ? 'menu_link menu_link--active' : 'menu_link'} >Registrarse</NavLink>
                                </>
                            : <>
                                <NavLink to="/login" className={({ isActive }) => isActive ? 'menu_link menu_link--active' : 'menu_link'} >Iniciar sesión</NavLink>
                                <NavLink to="/signup" className={({ isActive }) => isActive ? 'menu_link menu_link--active' : 'menu_link'} >Registrarse</NavLink>
                            </>
                    }
                </div>
            </nav>
        </Fragment>
    )
}
export default Navbar;