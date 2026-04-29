import React, { Fragment, useContext } from "react";

import './SelectCharacter.css';

import { matchContext } from "../context/MatchProvider";
import Character from "./Character";

const SelectCharacter = ({availableCharacters}) => {

    return (
        <Fragment>
            <div className="container">
                <div className="character-selection">
                    {availableCharacters.map((characterInfo)=>{
                        return <Character key={characterInfo.id} characterInfo={characterInfo}/>
                    })}
                </div>
            </div>
        </Fragment>
    )
}
export default SelectCharacter;