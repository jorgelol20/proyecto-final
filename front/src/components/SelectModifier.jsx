import React, { Fragment, useContext, useEffect, useState } from "react";
import './SelectModifier.css'
import { matchContext } from "../context/MatchProvider";
import Modifier from "./Modifier.jsx";

const SelectModifier = ({setSelectModifier, rounds}) => {
    const { getRandomsModifier } = useContext(matchContext)
    const [modifiersList, setModifiersList] = useState([])
    useEffect(() => {
        setModifiersList(getRandomsModifier(3, rounds))
    }, [getRandomsModifier])
    if (undefined in modifiersList) {
        return (<></>)
    }
    return (

        <Fragment>
            <div className="select-modifier">
                <div className="modifiers-list">
                    {modifiersList.map((modifierInfo) => (
                        modifierInfo == null ? <></> : 
                            <Modifier key={crypto.randomUUID()} modifierInfo={modifierInfo} setSelectModifier={setSelectModifier} />
                    ))}
                </div>
            </div>
        </Fragment>
    )
}
export default SelectModifier;