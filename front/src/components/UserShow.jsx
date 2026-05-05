import React, { Fragment } from "react";

import './UserShow.css';

const UserShow = ({userInfo}) => {
    return (
        <Fragment>
            <div className="show">
                <img className="show-avatar" src={userInfo.avatar} alt="" />
                <h1>{userInfo.nick}</h1>
            </div>
        </Fragment>
    )
}
export default UserShow