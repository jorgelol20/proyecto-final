import React, {Fragment} from "react";
import {Routes, Route} from 'react-router-dom';
import LoginPage from '../pages/LoginPage.jsx'
import ProfilePage from "../pages/ProfilePage.jsx";


const AppRoutes = () => {
    return (
        <Fragment>
            <Routes>
                <Route path="/perfil" element={<ProfilePage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
            </Routes>
        </Fragment>
    )
}
export default AppRoutes;