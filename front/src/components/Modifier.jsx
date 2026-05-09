import React, { Fragment, useContext, useState } from "react";
import { matchContext } from "../context/MatchProvider";
import './Modifier.css';
import { settingsContext } from "../context/SettingsProvider";
const Modifier = ({ modifierInfo, setSelectModifier, bigger }) => {
    const { addModifierToMatch, acti } = useContext(matchContext)
    const { startButtonSound } = useContext(settingsContext)
    const [showText, setShowText] = useState(false)
    if (setSelectModifier == null) {
        return (
            <Fragment>
                <div className="modifier-info-mini">
                    <img id={"nivel-" + modifierInfo.nivel} className={bigger?"bigger":""} onMouseOver={() => { setShowText(true) }} src={modifierInfo.imagen} popoverTarget="modifier-info" alt="" />
                    <div id="modifier-info" popover="auto" className="modifier-text" onMouseLeave={() => { setShowText(false) }}>
                        {console.log(bigger)}
                        <img id={"nivel-" + modifierInfo.nivel} src={modifierInfo.imagen} alt="" />
                        <h3 id={"nivel-" + modifierInfo.nivel}>{modifierInfo.nombre}</h3>
                        <p>{modifierInfo.descripcion}</p>
                        <p style={{textAlign:'start'}}>Lvl: <strong id={"nivel-" + modifierInfo.nivel}>{modifierInfo.nivel}</strong></p>
                    </div>
                </div>
            </Fragment>
        )
    }
    return (
        <Fragment>
            <div className="modifier-info">
                <h3 id={"nivel-" + modifierInfo.nivel}>{modifierInfo.nombre}</h3>
                <img id={"nivel-" + modifierInfo.nivel} src={modifierInfo.imagen} alt="" />
                <div>
                    <p>{modifierInfo.descripcion}</p>
                </div>
                <button onClick={(event) => { startButtonSound(event);; addModifierToMatch(modifierInfo); setSelectModifier(false) }}>Seleccionar</button>
            </div>
        </Fragment>
    )
}
export default Modifier;