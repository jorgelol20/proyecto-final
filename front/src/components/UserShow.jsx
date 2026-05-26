import React, { Fragment } from "react";

import './UserShow.css';
import Placeholder from '/images/placeholder.webp'
import { useUser } from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
const UserShow = ({ userInfo, admin = false }) => {
    const { deleteProfilePhoto, update } = useUser();
    const navigate = useNavigate();
    const handleDelete = (nick) => {
        deleteProfilePhoto(nick);
    }

    const handleChangeAdmin = (nick, isAdmin) => {
        const form = new FormData();
        form.append('es_admin', isAdmin ? 0 : 1);
        form.append('_method', 'PUT');

        update({ nick, form });
    };
    return (
        <Fragment>
            <div className={admin ? "show-admin" : "show"}>
                <img
                    className="show-avatar"
                    src={userInfo.avatar}
                    alt=""
                    style={{ borderColor: userInfo.color }}
                    onError={(e) => {
                        e.currentTarget.src = Placeholder;
                    }}
                />
                <h1 className={userInfo.es_admin ? "admin" : "user"}>{userInfo.nick}</h1>
                {admin ?
                    <div style={{display:"flex", flexDirection: "column"}}>
                        <div style={{display:"flex", flexDirection: "row"}}>
                            <h1>Admin: <span className={userInfo.es_admin ? "admin" : "user"}>{userInfo.es_admin ? "Si" : "No"}</span></h1>
                            <h1>Jugadas: {userInfo.tiene_jugadas.length}</h1>
                        </div>
                        <div className="show-buttons">
                            <button onClick={() => { confirm("Se eliminará la foto de perfil") ? handleDelete(userInfo.nick) : null }}>Eliminar foto</button>
                            <button onClick={() => {
                                let confirmChange = false;
                                if (userInfo.es_admin) {
                                    confirmChange = confirm("El usuario dejará de ser administrador. ¿Estás seguro?");
                                } else {
                                    confirmChange = confirm("El usuario pasará a ser administrador. ¿Estás seguro?");
                                }
                                if (confirmChange) {
                                    handleChangeAdmin(userInfo.nick, userInfo.es_admin);
                                }
                            }}>Cambiar estado admin</button>
                            <button onClick={()=>{navigate(`/perfil/${userInfo.nick}`)}}>Ver perfil</button>
                        </div>
                    </div>
                    : <></>
                }
            </div>
        </Fragment>
    )
}
export default UserShow