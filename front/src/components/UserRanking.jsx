import React, { Fragment, useEffect, useState } from "react";
import './UserRanking.css'
import { useUser } from "../hooks/useUser";
const UserRanking = () => {
    const { user, isLoading, getRanking } = useUser()

    const [ranking, setRanking] = useState([]);
    const loadRanking = async () => {
        const newRanking = await getRanking();
        setRanking(newRanking)
    }
    useEffect(() => {
        loadRanking()
    }, [])

    return (
        <Fragment>
            <div className="ranking">
                <h1>Ranking de <strong style={{ color: 'var(--main-gold)' }}>VICTORIAS</strong></h1>
                <div className="ranking-container">
                    {ranking.length > 0 ?
                        ranking.map((userInfo, index) => {
                            return (
                                <div key={`user-${index}`} onClick={() => { navigate(`/perfil/${userInfo.nick}`) }} className="user-ranking">
                                    <h1 id={`num-${index + 1}`}>#{index + 1}</h1>
                                    <img style={{ borderColor: userInfo.color }} src={userInfo.avatar} alt="" />
                                    <h1 className={userInfo.es_admin ? 'admin' : 'user'}>{userInfo.nick}</h1>
                                    <h1>Total partidas: {userInfo.tiene_jugadas_count}</h1>
                                    <h1>WR: <strong style={{ color: 'var(--main-gold)' }}>{Math.floor((userInfo.total_victorias / userInfo.tiene_jugadas_count) * 100)}%</strong></h1>
                                </div>
                            )
                        })
                        : <></>}
                </div>
            </div>
        </Fragment>
    )
}
export default UserRanking