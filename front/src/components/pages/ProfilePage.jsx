import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { useUser } from '../../hooks/useUser.js';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

import { settingsContext } from '../../context/SettingsProvider.jsx';

import Placeholder from '/images/placeholder.webp'
import './ProfilePage.css'
import Banner from '../structure/Banner.jsx';
import Loading from '../Loading.jsx';
import Match from '../Match.jsx';
import { filter } from 'lodash';
import DeleteIcon from '/images/delete-icon.svg'

const ProfilePage = () => {
    const navigate = useNavigate();
    const { startButtonSound } = useContext(settingsContext)

    const { user, getUsuario, logout, isLoading, isError, error, update, deleteProfilePhoto, isDeletingProfilePhoto } = useUser();
    const { nick } = useParams();
    const [canEdit, setEdit] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [isGettingUser, setIsGettingUser] = useState(true)
    const [userMatchs, setUserMatchs] = useState([]);

    const [filter, setFilter] = useState('all');

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
    }, [isLoading, nick])




    const checking = async () => {
        //Comprueba si es el dueño de este perfil.
        user.nick == nick ? setEdit(true) : setEdit(false)

        //Comprobamos si el nick de los parámetros es distintos de `undefined`.
        if (nick !== undefined) {
            let temp = await getUsuario(nick)
            setUserInfo(temp[0])
            setIsGettingUser(false)
        }
        //Si nick es undefined, le mandamos a su perfil 
        else if (user !== undefined) {
            navigate(`/perfil/${user.nick}`)
        }
        else {
            navigate('/')
        }
    }
    const [showMatches, setShowMatches] = useState(true)

    const handleDelete = () => {
        deleteProfilePhoto(nick);
    }
    useEffect(() => {
        if (!isDeletingProfilePhoto) {
            checking();
        }
    }, [isDeletingProfilePhoto])


    const handleOrderChange = (e) => {
        setShowMatches(false)
        let temp = userMatchs
        let temp_final = []
        temp_final = temp.reverse()
        setUserMatchs(temp_final)
    }
    const handleFilterChange = (e) => {
        setShowMatches(false)
        console.log(e)
        setFilter(e)
    }
    useEffect(() => {
        if (!showMatches) {
            setShowMatches(true)
        }
    }, [showMatches])
    useEffect(() => {
        if (!isLoading) {
            checking()
        }
    }, [isLoading, nick]);

    useEffect(() => {
        if (userInfo.tiene_jugadas) {
            setUserMatchs(userInfo.tiene_jugadas.reverse())
        }
    }, [userInfo])

    if (isLoading | isGettingUser) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loading />
            </div>
        );
    }

    return (
        <Fragment>
            <div style={{ display: "flex", justifyContent: 'center' }}>
                <div className='user-background'>
                    <div className='userInfo'>
                        <div className='user-profile'>
                            <div style={{position:'relative'}}>
                                <img className='user-avatar' style={{ borderColor: userInfo.color }} src={userInfo.avatar !== "" && userInfo.avatar ? userInfo.avatar : Placeholder} alt={`Avatar de ${userInfo.nick}`} />
                                {user.es_admin ? <button className="delete-button" onClick={() => { confirm("Se eliminará la foto de perfil") ? handleDelete() : null }}><img className="delete-icon" src={DeleteIcon} alt="" /></button> : <></>}
                            </div>
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
                                {userMatchs?.length > 0 && showMatches ?
                                    userMatchs?.map((match, index) => {
                                        if (filter === "all") {
                                            return <div key={index + crypto.randomUUID()} onClick={() => { navigate(`/partida/${match.id}`) }}><Match key={index + crypto.randomUUID()} match={match} /></div>
                                        } else if (filter === "victory" && match.victoria == 1) {
                                            return <div key={index + crypto.randomUUID()} onClick={() => { navigate(`/partida/${match.id}`) }}><Match key={index + crypto.randomUUID()} match={match} /></div>
                                        } else if (filter === "lose" && match.victoria == 0) {
                                            return <div key={index + crypto.randomUUID()} onClick={() => { navigate(`/partida/${match.id}`) }}><Match key={index + crypto.randomUUID()} match={match} /></div>
                                        }
                                    })
                                    : <h1>Sin partidas jugadas</h1>}
                            </section>
                            <form style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                                <select name="show" id="show" onChange={(e) => { handleFilterChange(e.currentTarget.value) }}>
                                    <option value="all">Todas</option>
                                    <option style={{ color: 'var(--main-gold)' }} value="victory">Victorias</option>
                                    <option style={{ color: 'var(--main-red)' }} value="lose">Derrotas</option>
                                </select>
                                <select defaultValue={0} name="order" id="order" onChange={(e) => { handleOrderChange(e.currentTarget.value) }}>
                                    <option value="1-0">Más reciente a más antigua</option>
                                    <option value="0-1">Más antigua a más reciente</option>

                                </select>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default ProfilePage;