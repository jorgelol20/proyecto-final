import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useUser } from '../../hooks/useUser.js';
import { useNavigate, useParams } from 'react-router-dom';

import {  settingsContext } from '../../context/SettingsProvider.jsx';

import Placeholder from '/images/placeholder.webp'
import './ProfilePage.css'
import Banner from '../structure/Banner.jsx';
import Loading from '../Loading.jsx';
import Match from '../Match.jsx';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { startButtonSound } = useContext( settingsContext)

    const { user, getUsuario, logout, isLoading, isError, error } = useUser();
    const { nick } = useParams();
    const [canEdit, setEdit] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [isGettingUser, setIsGettingUser] = useState(true)

    useEffect(() => {
        if (user == undefined && !isLoading) {
            navigate('/login');
        }
        if (isError) {
            if (error.response?.status === 401) {
                localStorage.removeItem('auth_token');
                navigate('/login');
            } else {
                return <p>Error al conectar con el servidor</p>
            }
        }
    }, [isLoading])


    const checking = async () => {
        //Comprueba si es el dueño de este perfil.
        user.nick == nick ? setEdit(true) : setEdit(false)

        //Comprobamos si el nick de los parámetros es distintos de `undefined`.
        if (nick !== undefined && nick !== user.nick) {
            let temp = await getUsuario(nick)
            setUserInfo(temp[0])
            setIsGettingUser(false)

        }
        //Si es undefined, le mandamos a su perfil 
        else if (user) {
            setUserInfo(user)
            setIsGettingUser(false)
        }
    }
    useEffect(() => {
        if (!isLoading) {
            checking()
        }
    }, [isLoading]);

    if (isLoading | isGettingUser) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loading />
            </div>
        );
    }

    return (
        <Fragment>
            <div style={{display:"flex", justifyContent: 'center'}}>
                <div className='user-background'>
                    <div className='userInfo'>
                        <div className='user-profile'>
                            <img className='user-avatar' style={{ borderColor: userInfo.color }} src={userInfo.avatar !== "" && userInfo.avatar ? userInfo.avatar : Placeholder} alt={`Avatar de ${userInfo.nick}`} />
                            <p>Desde: {new Date(userInfo.created_at).toLocaleDateString('es-ES')}</p>
                            <div className='user-buttons'>
                                {user.nick === userInfo.nick ?
                                    <>
                                        <button onClick={(event) => { startButtonSound(event); navigate(`/perfil/${userInfo.nick}/editar`) }}>Editar perfil</button>
                                        <button onClick={(event) => { startButtonSound(event); logout() }}>Cerrar sesión</button>
                                    </>
                                    : <></>}
                            </div>
                        </div>
                        <div className='user-history'>
                            <h1 className={userInfo.es_admin ? 'admin' : 'user'}>{userInfo.nick}</h1>
                            <section className='match-history'>
                                {userInfo.tiene_jugadas ? userInfo.tiene_jugadas?.map((match, index) => {
                                    return <><Match key={index} match={match} /></>
                                })
                                    : <h1>Sin partidas jugadas</h1>}
                            </section>
                        </div>
                    </div>
                </div>
            </div>

        </Fragment>
    );
};

export default ProfilePage;