import React, { Fragment, useContext, useEffect, useRef, useState } from "react";
import './Navbar.css';
import { useUser } from '../../hooks/useUser.js';
import Placeholder from './../../images/placeholder.webp'
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { matchContext } from "../../context/MatchProvider.jsx";

import { settingsContext } from "../../context/SettingsProvider.jsx";

import FPSCounter from "./FPSCounter.jsx";
import UserShow from "../UserShow.jsx";

const Navbar = () => {
    const { user, searchUsuario, isLoading, activePlayers } = useUser();
    const { showFPS } = useContext(settingsContext);
    const [userAvatar, setUserAvatar] = useState('');
    const [userColor, setUserColor] = useState('');

    const [userList, setUserList] = useState([]);
    const [isActiveSearch, setIsActiveSearch] = useState(false);
    const searchRef = useRef(null);

    const location = useLocation()
    const navigate = useNavigate()

    const handleNavClick = (e, to) => {
        // Cambia '/juego' por la URL exacta de tu pantalla de juego
        if (location.pathname === '/jugar') {
            e.preventDefault(); // Frena la navegación inmediata

            const proceder = window.confirm("¿Estás seguro de que quieres salir de la partida? Tu progreso actual se guardará y la partida finalizará.");

            if (proceder) {
                // 1. Despachamos un evento global para que la pantalla de juego reaccione
                const eventoSalir = new CustomEvent('interrumpirPartida');
                window.dispatchEvent(eventoSalir);

                // 2. Redirigimos al usuario a donde quería ir originalmente
                navigate(to);
            }
        }
    };

    useEffect(() => {
        if (!isLoading && user) {
            setUserAvatar(user.avatar);
            setUserColor(user.color);
        }
    }, [user, isLoading]);

    const handleSearchUser = async (search) => {
        if (search.trim() === "") {
            setUserList([]);
            return;
        }
        const users = await searchUsuario(search);
        setUserList(users);
    };

    // Función para resetear todo tras el clic
    const handleResultClick = () => {
        setIsActiveSearch(false);
        setUserList([]);
        if (searchRef.current) {
            searchRef.current.value = "";
        }
    };

    return (
        <Fragment>
            <nav>
                {showFPS && <FPSCounter />}
                <div className="navbar-items">
                    {!isLoading && user && (
                        <div className="navbar-active-players" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#aaa', fontSize: '14px' }}>
                            <span style={{ width: '8px', height: '8px', backgroundColor: '#2ecc71', borderRadius: '50%' }}></span>
                            {activePlayers} activos
                        </div>
                    )}
                    {!isLoading && user && (
                        <div className="search">
                            <input
                                ref={searchRef}
                                type="search"
                                className="search-input"
                                placeholder="Buscar usuario"
                                onFocus={() => setIsActiveSearch(true)}
                                onChange={(e) => handleSearchUser(e.target.value)}
                            />

                            {/* 2. Ahora React sí reaccionará a este cambio */}
                            {isActiveSearch && userList.length > 0 && (
                                <div className="searc-list">
                                    {userList.map((userInfo) => (
                                        <NavLink
                                            key={userInfo.nick}
                                            to={`/perfil/${userInfo.nick}`}
                                            onClick={(e) => {
                                                handleNavClick(e, `/perfil/${userInfo.nick}`);
                                                if (!e.defaultPrevented) handleResultClick();
                                            }}
                                        >
                                            <UserShow userInfo={userInfo} />
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <NavLink
                        to="/"
                        className={({ isActive }) => isActive ? 'menu_link menu_link--active' : 'menu_link'}
                        onClick={(e) => handleNavClick(e, '/')}
                    >
                        Inicio
                    </NavLink>

                    {!isLoading ? (
                        user ? (
                            <NavLink
                                onClick={(e) => handleNavClick(e, `/perfil/${user.nick}`)}
                                to={`/perfil/${user.nick}`}
                                className={({ isActive }) => isActive ? 'menu_link menu_link--active' : 'menu_link'}
                            >
                                <img
                                    className="navbar-avatar"
                                    src={userAvatar || Placeholder}
                                    alt="avatar"
                                    style={{ borderColor: userColor }}
                                    onError={(e) => {
                                        e.currentTarget.src = Placeholder;
                                    }}
                                />
                            </NavLink>
                        ) : (
                            <>
                                <NavLink to="/login" className={({ isActive }) => isActive ? 'menu_link menu_link--active' : 'menu_link'}>Iniciar sesión</NavLink>
                                <NavLink to="/signup" className={({ isActive }) => isActive ? 'menu_link menu_link--active' : 'menu_link'}>Registrarse</NavLink>
                            </>
                        )
                    ) : null}
                </div>
            </nav>
        </Fragment>
    );
};
export default Navbar