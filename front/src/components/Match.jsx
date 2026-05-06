import React, { Fragment, useEffect, useState } from "react";
import { useCharacters } from "../hooks/useCharacter";
import Placeholder from '/images/placeholder.webp'
import './Match.css'
const Match = ({match,showUser}) => {
    const [character, setCharacter] = useState(false)
    const {getCharacterById, isLoading} = useCharacters()
    const loadCharacter = async () => {
        const tempCharacter = await getCharacterById(match.personaje_id);
        setCharacter(tempCharacter)
    }
    useEffect(()=>{
        loadCharacter()
    },[])
    if(!isLoading){
        return (
        <Fragment>
            <article className="match-row">
                <h1>{match.id}</h1>
                <img className="character-image" src={character.imagen} alt={character.nombre} />
                <div className="match-info">
                    <p>Jugada el {new Date(match.created_at).toLocaleDateString('es-ES')}</p>
                    <h2 className={match.victoria?'win':'lose'}>{match.victoria?'Victoria':'Derrota'}</h2>
                </div>
                {showUser?
                <div className="player-info">
                    <img className='user-avatar' style={{ borderColor: match.jugador.color }} src={match.jugador.avatar !== "" && match.jugador.avatar ? match.jugador.avatar : Placeholder} alt={`Avatar de ${match.jugador.nick}`} />
                    <p>{match.jugador.nick}</p>
                </div>
                :<></>}
                
            </article>
        </Fragment>
    )
    }
}
export default Match;