import React, { Fragment, useEffect, useState } from "react";
import "./MatchPage.css"
import { useNavigate, useParams } from "react-router-dom";
import { useMatch } from "../../hooks/useMatch";
import Loading from "../Loading";
import { useUser } from "../../hooks/useUser";

const MatchPage = () => {
    const { getMatchById, isLoading:matchLoading } = useMatch();
    const {user, isLoading:userLoading, isError} = useUser();
    const { matchId } = useParams();
    const [isGettingMatch, setIsGettingMatch] = useState(true)
    const [match, setMatch] = useState(undefined)
    const navigate = useNavigate()

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
        const tempMatch = await getMatchById(matchId)
        setMatch(tempMatch)
        setIsGettingMatch(false)
    }
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
                {console.log(match)}
                <div className="match-body">
                    <div className="match-info">
                        <h3>{`Tiempo: ${String(Math.floor((match.tiempo / 60 / 60))).padStart(2, '0')}:${String(Math.floor((match.tiempo / 60 % 60))).padStart(2, '0')}:${String(match.tiempo % 60).padStart(2, '0')}`}</h3>
                    </div>
                    <div className="match-modifiers">

                    </div>
                </div>
                <div className="match-comments">

                </div>
            </div>
        </Fragment>
    )
}
export default MatchPage