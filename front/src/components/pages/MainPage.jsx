import React, { Fragment, useContext, useEffect, useState } from "react";
import './MainPage.css';
import { useUser } from "../../hooks/useUser.js";
import Banner from "../structure/Banner";
import Loading from "../Loading";
import { NavLink, useNavigate } from "react-router-dom";
import { settingsContext } from "../../context/SettingsProvider.jsx";
import SelectModifier from "../SelectModifier.jsx";
import { useMatch } from "../../hooks/useMatch.js";
import Match from "../Match.jsx";
import UserShow from "../UserShow.jsx";
import UserRanking from "../UserRanking.jsx";


const MainPage = () => {
    const { user, isLoading, getRanking } = useUser()
    const { matches } = useMatch();
    const { startMusic, startButtonSound } = useContext(settingsContext)
    const navigate = useNavigate()

    
    if (isLoading) {
        return (
            <Fragment>
                <Loading />
            </Fragment>
        )
    }
    return (
        <Fragment>
            <article className="menu">
                <img className="banner-menu" src="/images/banner_menu.webp" />
                <div className="main-menu">
                    <button onClick={(event) => { startButtonSound(event); user ? navigate(`/jugar`) : navigate('/login') }}>JUGAR</button>
                    <button onClick={(event) => { startButtonSound(event); navigate('/ajustes') }}>AJUSTES</button>
                    <button onClick={(event) => { startButtonSound(event); user ? navigate(`/perfil/${user ? user.nick : ''}`) : navigate('/login') }}>PERFIL</button>
                    {
                        navigator.userAgent.indexOf("Firefox") > -1 ?
                            <div className="advise">
                                <h1>¡Advertencia!</h1>
                                <p>En navegadores Firefox pueden haber perdidas de rendimiento durante la experiencia de juego. <br />Recomendamos encarecidamente que se utilice un navegador en base <strong> Chrome.</strong><br />Disculpen las molestias.</p>
                            </div>
                            : <></>
                    }
                </div>
                <div>
                    <UserRanking/>
                </div>
            </article>
            <article>
                <div className="last-matches">
                    <h1>Últimas partidas ( Global )</h1>
                    <div className="match-history">
                        {matches?.map((match, index) => {
                            return <div key={match.id} onClick={() => { navigate(`/partida/${match.id}`) }}><Match key={match.id} match={match} showUser={true} /></div>
                        })}
                    </div>
                </div>
            </article>
        </Fragment>
    );
}
export default MainPage;