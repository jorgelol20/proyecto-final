import React, { Fragment } from "react";

import './UserShow.css';

const UserShow = ({userInfo}) => {
    return (
        <Fragment>
            <div className="show">
                <img className="show-avatar" src={userInfo.avatar} alt="" />
                <h1 className={userInfo.es_admin ? "admin" : "user"}>{userInfo.nick}</h1>
            </div>
        </Fragment>
    )
}
export default UserShow