import React, { Fragment, useEffect, useReducer, useRef, useState } from "react";
import "./MatchPage.css"
import { useNavigate, useParams } from "react-router-dom";
import { useMatch } from "../../hooks/useMatch.js";
import Loading from "../Loading.jsx";
import Modifier from './../Modifier.jsx'
import { useUser } from "../../hooks/useUser.js";

import Placeholder from '/images/placeholder.webp'
import Comentario from "../Comentario.jsx";

const MatchPage = () => {
    const { getMatchById, isLoading: matchLoading } = useMatch();
    const { user, isLoading: userLoading, isError, comment, commentError, isCommenting } = useUser();
    const { matchId } = useParams();
    const [isGettingMatch, setIsGettingMatch] = useState(true)
    const [isLoadingComments, setIsLoadingComments] = useState(false)
    const [match, setMatch] = useState(undefined)
    const [character, setCharacter] = useState(undefined)
    const [player, setPlayer] = useState(undefined)
    const [comments, setComments] = useState([])
    const navigate = useNavigate()
    const commentRef = useRef(null)
    const scrollRef = useRef(null);

    useEffect(() => {
        if (user == undefined && !userLoading) {
            navigate('/login');
        }
        if (isError) {
            if (error.response?.status === 401) {
                localStorage.removeItem('auth_token');
                navigate('/login');
            } else {
                return <p>Error al conectar con el servidor</p>
            }
        }
    }, [userLoading])

    const requestMatch = async () => {
        const tempMatch = await getMatchById(matchId);
        if (tempMatch && tempMatch.comentarios) {
            const sortedComments = [...tempMatch.comentarios].sort((a, b) => {
                const dateA = new Date(a.pivot?.created_at || 0).getTime();
                const dateB = new Date(b.pivot?.created_at || 0).getTime();
                return dateA - dateB;
            });

            setMatch(tempMatch);
            setCharacter(tempMatch.personaje);
            setPlayer(tempMatch.jugador);
            setComments(sortedComments);
        }
        setIsLoadingComments(false);
        setIsGettingMatch(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (commentRef.current.value !== "" && commentRef !== null) {
            setIsLoadingComments(true)
            const form = new FormData();
            form.append('comentario', commentRef.current.value)
            form.append('usuario_id', user.id)
            form.append('partida_id', matchId);
            await comment(form);
            setTimeout(requestMatch, 5000)
            commentRef.current.value = ""
        }else{
            setIsLoadingComments(false)
        }
    };


    useEffect(() => {
        if (scrollRef.current) {
            const scrollToBottom = () => {
                scrollRef.current.scrollTo({
                    top: scrollRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            };
            const timeoutId = setTimeout(scrollToBottom, 100);
            return () => clearTimeout(timeoutId);
        }
    }, [comments]);

    useEffect(() => {
        if (!matchLoading && matchId != null) {
            requestMatch()
        }
    }, [matchLoading])


    if (isGettingMatch || matchLoading) {
        return <Loading />
    }
    return (
        <Fragment>
            <div className="match">
                <div className="match-body">
                    <div className="match-info">
                        <div className="match-parameters">
                            <h1>Num partida: {match.id}</h1>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <img className="character-image" src={character.imagen} alt={character.nombre} />
                                <div className="match-modifiers">
                                    {match.modificadores.length > 0 ? match.modificadores.map((modifierInfo) => {
                                        return <Modifier modifierInfo={modifierInfo} />
                                    }) : <h1>Sin modificadores</h1>}
                                </div>
                            </div>
                            <div>
                                <p>Jugada el {new Date(match.created_at).toLocaleDateString('es-ES')}</p>
                                <h2 className={match.victoria ? 'win' : 'lose'}>{match.victoria ? 'Victoria' : 'Derrota'} <strong>{`Tiempo: ${String(Math.floor((match.tiempo / 60 / 60))).padStart(2, '0')}:${String(Math.floor((match.tiempo / 60 % 60))).padStart(2, '0')}:${String(match.tiempo % 60).padStart(2, '0')}`}</strong></h2>
                            </div>
                        </div>
                        <div className="player-info">
                            <img className='user-avatar' onClick={()=>{navigate(`/perfil/${player.nick}`)}} style={{ borderColor: player.color }} src={player.avatar !== "" && player.avatar ? player.avatar : Placeholder} alt={`Avatar de ${match.jugador.nick}`} />
                            <h1 className={player.es_admin ? "admin" : "user"}>{player.nick}</h1>
                        </div>
                    </div>
                </div>
                <div className="match-comments" ref={scrollRef}>

                    <div className="comments">
                        {comments.map((comentario) => {
                            return <Comentario comentario={comentario} requestMatch={requestMatch} />
                        })}
                    </div>
                </div>
                <div className="comment-input">
                    <form onSubmit={(e) => { handleSubmit(e) }}>
                        <input type="text" ref={commentRef} placeholder="Escribe tu comentario..." />
                        <button type="submit" disabled={isLoadingComments} >Comentar</button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}
export default MatchPage