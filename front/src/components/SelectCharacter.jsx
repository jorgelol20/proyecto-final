import React, { Fragment, useState } from "react";
import './SelectCharacter.css';
import Character from "./Character";

const SelectCharacter = ({ availableCharacters }) => {
    const [isFastSelector, setIsFastSelector] = useState(() => {
        return localStorage.getItem('fastSelector') === 'true';
    });


    const handleFastSelectorChange = (e) => {
        const isChecked = e.target.checked;
        setIsFastSelector(isChecked); 
        localStorage.setItem('fastSelector', isChecked);
    };

    return (
        <Fragment>
            <div className="container">
                <div className="character-selection">
                    {availableCharacters?.map((characterInfo) => {
                        return (
                            <Character
                                key={characterInfo.id}
                                characterInfo={characterInfo}
                                fastSelector={isFastSelector}
                            />
                        )
                    })}
                </div>
                <div className="character-menu">
                    <div className="character-menu-input">
                        <label htmlFor="checkbox-setting">Selector rápido</label>
                        <input
                            id="checkbox-setting"
                            className="checkbox-setting"
                            type="checkbox"
                            checked={isFastSelector}
                            onChange={handleFastSelectorChange}
                        />
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default SelectCharacter;