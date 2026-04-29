import React, { Fragment, useContext } from "react";
import './MainPage.css';
import { useUser } from "../../hooks/useUser.js";
import Banner from "../structure/Banner";
import Loading from "../Loading";
import { NavLink, useNavigate } from "react-router-dom";
import {  settingsContext } from "../../context/SettingsProvider.jsx";


const MainPage = () => {
    const {user,isLoading} = useUser()
    const {startMusic,startButtonSound} = useContext( settingsContext)
    const navigate = useNavigate()
    if(isLoading){
        return (
            <Fragment>  
                <Loading/>
            </Fragment>
        )
    }
    return (
        <Fragment>
            <article className="menu">
                <img className="banner-menu" src="/images/banner_menu.webp"/>
                <div className="main-menu">
                    <button onClick={(event)=>{startButtonSound(event);user?navigate(`/jugar`):navigate('/login')}}>JUGAR</button>
                    <button onClick={(event)=>{startButtonSound(event);navigate('/ajustes')}}>AJUSTES</button>
                    <button onClick={(event)=>{startButtonSound(event);user?navigate(`/perfil/${user?user.nick:''}`):navigate('/login')}}>PERFIL</button>
                    {
                        navigator.userAgent.indexOf("Firefox") > -1 ? 
                        <div className="advise">
                            <h1>¡Advertencia!</h1>
                            <p>En navegadores Firefox pueden haber perdidas de rendimiento durante la experiencia de juego. <br />Recomendamos encarecidamente que se utilice un navegador en base <strong> Chrome.</strong><br />Disculpen las molestias.</p>
                        </div>
                        :<></>
                    }
                </div>
            </article>
        </Fragment>
    );
}
export default MainPage;