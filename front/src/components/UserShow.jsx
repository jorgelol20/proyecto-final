import React, { Fragment } from "react";

import './UserShow.css';
import Placeholder from '/images/placeholder.webp'
const UserShow = ({ userInfo }) => {
    return (
        <Fragment>
            <div className="show">
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
            </div>
        </Fragment>
    )
}
export default UserShow