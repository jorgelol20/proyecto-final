import React, { Fragment, useContext } from "react";

import { matchContext } from "../context/MatchProvider.jsx";
import {  settingsContext } from "../context/SettingsProvider.jsx";

import './Character.css';

const Character = ({characterInfo}) => {
    const {setNewCharacter} = useContext(matchContext)
    const {startButtonSound} = useContext( settingsContext)
    return (
        <Fragment>
            <div>
                <div className="character-container">
                    <div className="character-info">
                        <img className="character-image" src={characterInfo.imagen}/>
                        <h1>{characterInfo.nombre}</h1>
                        <button onClick={(event)=>{startButtonSound(event);setNewCharacter(characterInfo)}}>Seleccionar</button>
                    </div>
                    <div>
                        <div className="character-abilitie">
                            <img className="abilitie-icon" src={characterInfo.habilidad_personaje.icono}/>
                            <div className="abilitie-text">
                                <p>{characterInfo.habilidad_personaje.descripcion}</p>
                            </div>
                        </div>
                        <div className="character-description">
                            <p>{characterInfo.descripcion}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
export default Character;