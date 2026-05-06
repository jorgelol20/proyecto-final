import React, { Fragment } from "react";
import './Comentario.css'
import { useUser } from "../hooks/useUser";
import Placeholder from '/images/placeholder.webp'
import { useNavigate } from "react-router-dom";
import DeleteIcon from '/images/delete-icon.svg'
const Comentario = ({ comentario, requestMatch }) => {
    const { user, isLoading: userLoading, isError, deleteComment, deleteCommentError, isDeletingComment } = useUser();
    if (user == undefined) {
        return <></>
    }
    const navigate = useNavigate()

    const handleDelete = () => {
        deleteComment(comentario.pivot.id);
        setTimeout(requestMatch, 5000)
    }

    return (
        <Fragment>
            <div className={user.id == comentario.id ? "owner box" : "user box"}>
                <div className="comment" id={user.id == comentario.id ? "owner" : "user"}>
                    <div className="comment-info">
                        <div>
                            <img className='user-avatar' onClick={() => { navigate(`/perfil/${comentario.nick}`) }} style={{ borderColor: comentario.color }} src={comentario.avatar !== "" && comentario.avatar ? comentario.avatar : Placeholder} alt={`Avatar de ${comentario.nick}`} />
                            <p className="date">{new Date(comentario.created_at).toLocaleDateString('es-ES')}</p>
                            {user.es_admin?<button className="delete-button" onClick={()=>{confirm("¿Seguro que quieres eliminar el comentario?")?handleDelete():null}}><img className="delete-icon" src={DeleteIcon} alt="" /></button>:<></>}
                        </div>
                    </div>
                    <div className="comment-content">
                        <p className={comentario.es_admin ? "admin_nick" : "user_nick"}>{comentario.nick}</p>
                        <p>{comentario.pivot.comentario}</p>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
export default Comentario