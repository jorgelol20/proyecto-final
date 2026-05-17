import React, { Fragment, useContext, useEffect, useRef, useState } from "react";

import './SelectCharacter.css';

import { matchContext } from "../context/MatchProvider";
import Character from "./Character";

const SelectCharacter = ({availableCharacters}) => {

    const fastSelector = useRef(false);

    const handleFastSelectorChange = (checked) => {
        localStorage.setItem('fastSelector', checked);
        fastSelector.current = (checked);
        setShowCharacters(false)
    }

    const [showCharacters, setShowCharacters] = useState(true);

    useEffect(() => {
        if(!showCharacters){
            setShowCharacters(true)
        }
    },[showCharacters])

    

    useEffect(() => {
        const savedFastSelector = (localStorage.getItem('fastSelector'))
        if (savedFastSelector !== null && savedFastSelector !== undefined) fastSelector.current = (savedFastSelector);
    },[])

    return (
        <Fragment>
            <div className="container">
                <div className="character-selection">
                    {showCharacters && availableCharacters?.map((characterInfo)=>{
                        return <Character key={characterInfo.id} characterInfo={characterInfo} fastSelector={fastSelector.current}/>
                    })}
                </div>
                <div className="character-menu">
                    <div className="character-menu-input">
                        <label htmlFor="checkbox-setting">Selector rápido</label>
                        <input className="checkbox-setting" defaultChecked={fastSelector} type="checkbox" onChange={(e) => {handleFastSelectorChange(e.target.checked)}} />
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
export default SelectCharacter;