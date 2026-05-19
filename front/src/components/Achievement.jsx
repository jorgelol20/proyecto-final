import React, { Fragment } from "react";
import './Achievement.css';

const Achievement = ({ achievementInfo, obtained = false }) => {
    return (
        <Fragment>
            <div className={obtained ? "achievement true" : "achievement false"}>
                <div className="achievement-info">
                    <img src={achievementInfo.icono} alt="" />
                    <h1>{achievementInfo.nombre}</h1>
                    {achievementInfo.created_at ? <p>{new Date(achievementInfo.created_at).toLocaleDateString('es-ES')}</p> : <></>}
                </div>
                <div className="achievement-description">
                    <p>{achievementInfo.descripcion}</p>
                </div>
            </div>
        </Fragment>
    )
}
export default Achievement;