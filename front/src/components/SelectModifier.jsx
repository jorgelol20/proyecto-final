import React, { Fragment, useContext } from "react";

import { matchContext } from "../context/MatchProvider";

const SelectModifier = () => {
    const {getRandomsModifier} = useContext(matchContext)
    return (
        <Fragment>
            {console.log(getRandomsModifier())}
        </Fragment>
    )
}
export default SelectModifier;