import React, { Fragment } from "react";
import './Achievement.css';

const Achievement = ({ achievementInfo, obtained = false }) => {
    return (
        <Fragment>
            <div className={obtained ? "achievement true" : "achievement false"}>
                <div className="achievement-info">
                    <img src={achievementInfo.icono} alt="" />
                    <div>
                        <h1>{achievementInfo.nombre}</h1>
                        {console.log(achievementInfo.nombre)}
                        {console.log(achievementInfo?.pivot[0]?.created_at ?? false)}
                        {achievementInfo.pivot[0]?.created_at ? <p>{new Date(achievementInfo.pivot[0].created_at).toLocaleDateString('es-ES')}</p> : <></>}
                    </div>
                </div>
                <div className="achievement-description">
                    <p>{achievementInfo.descripcion}</p>
                </div>
            </div>
        </Fragment>
    )
}
export default Achievement;