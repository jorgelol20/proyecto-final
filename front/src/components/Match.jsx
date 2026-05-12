import React, { Fragment, useEffect, useState } from "react";
import { useCharacters } from "../hooks/useCharacter";
import Placeholder from '/images/placeholder.webp'
import './Match.css'
import Modifier from "./Modifier";
const Match = ({ match, showUser }) => {
    const [character, setCharacter] = useState(false)
    const { getCharacterById, isLoading } = useCharacters()
    const loadCharacter = async () => {
        const tempCharacter = await getCharacterById(match.personaje_id);
        setCharacter(tempCharacter)
    }
    useEffect(() => {
        loadCharacter()
    }, [])
    if (!isLoading) {
        return (
            <Fragment>
                <article className="match-row">
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <p style={{fontSize:'0.5cqw'}}>ID partida:</p>
                        <h1 className="match-id">{match.id}</h1>
                    </div>
                    <img className="character-image" src={character.imagen} alt={character.nombre} />
                    <div className="match-info">
                        <div style={{ display: 'flex', textAlign: 'end', justifyContent: 'center' }}>
                            <h2 className={match.victoria ? 'win' : 'lose'}>{match.victoria ? 'Victoria' : 'Derrota'}</h2>
                            <p>Jugada el {new Date(match.created_at).toLocaleDateString('es-ES')}</p>
                        </div>
                        <div className="match-modifiers">
                            {match.modificadores.length > 0 ? match.modificadores.map((modifierInfo) => {
                                return <Modifier key={modifierInfo.key + "-" + match.id} modifierInfo={modifierInfo} />
                            }) : <h1>Sin modificadores</h1>}
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