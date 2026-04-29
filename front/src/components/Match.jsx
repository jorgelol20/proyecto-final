import React, { Fragment, useEffect, useState } from "react";
import { useCharacters } from "../hooks/useCharacter";
import './Match.css'
const Match = ({match}) => {
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
            </article>
        </Fragment>
    )
    }
}
export default Match;