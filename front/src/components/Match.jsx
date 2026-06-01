import React, { Fragment, useContext, useEffect, useState } from "react";
import { useCharacters } from "../hooks/useCharacter";
import Placeholder from '/images/placeholder.webp'
import './Match.css'
import Modifier from "./Modifier";
import { matchContext } from "../context/MatchProvider";
const Match = ({ match, showUser }) => {
    const { characters, isLoading } = useCharacters()
    if (!isLoading) {
        return (
            
            <Fragment>
                <article className="match-row">
                    <div style={{display:'flex',flexDirection:'column',
                        alignItems:'center',justifyContent:'center', textAlign:'center'
                    }}>
                        <p>ID partida:</p>
                        <h1 className="match-id">{match.id}</h1>
                    </div>
                    <img className="character-image" src={match.personaje.imagen} alt={match.personaje.nombre} />
                    <div className="match-info">
                        <div style={{ display: 'flex', textAlign: 'center', justifyContent: 'center' }}>
                            <h2 className={match.victoria ? 'win' : 'lose'}>{match.victoria ? 'Victoria' : 'Derrota'}</h2>
                            <p>Jugada el {new Date(match.created_at).toLocaleDateString('es-ES')}</p>
                        </div>
                        <div className="match-modifiers">
                            {match.modificadores?.length > 0 ? match.modificadores.map((modifierInfo) => {
                                return <Modifier key={crypto.randomUUID()} modifierInfo={modifierInfo} />
                            }) : <></>}
                        </div>
                    </div>
                    {showUser ?
                        <div className="player-info">
                            <img className='user-avatar' style={{ borderColor: match.jugador.color }} src={match.jugador.avatar !== "" && match.jugador.avatar ? match.jugador.avatar : Placeholder} alt={`Avatar de ${match.jugador.nick}`} />
                            <p className={match.jugador.es_admin?"admin":"user"}>{match.jugador.nick}</p>
                        </div>
                        : <></>}
                </article>
            </Fragment>
        )
    }
}
export default Match;