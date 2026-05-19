import React, { Fragment } from "react";
import './CreditPage.css';
const CreditPage = () => {
    return (
        <Fragment>
            <div className="credits">
                <h1>Programador: <span className="span-1">Jorge Colomer</span></h1>
                <h1>Artista: <span className="span-2">Adrian Cutillas</span></h1>
                <h2>Testers: <span className="span-3">Lina Caldón</span> y <span className="span-4">Kenai Rivero</span></h2>
                <h3>Idea base del juego: <a href="http://stfj.net/art/2011/Scoundrel.pdf">Scoundrel by Zach Gage and Kurt Bieg</a></h3>
            </div>
        </Fragment>
    )
}
export default CreditPage;