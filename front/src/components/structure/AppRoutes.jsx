import React, {Fragment} from "react";
import {Routes, Route} from 'react-router-dom';
import LoginPage from '../pages/LoginPage.jsx'
import ProfilePage from "../pages/ProfilePage.jsx";
import ProfileEdit from "../pages/ProfileEditPage.jsx";
import MainPage from "../pages/MainPage.jsx"
import SignupPage from "../pages/SignupPage.jsx";
import GamePage from "../pages/GamePage.jsx";
import SettingsPage from "../pages/SettingsPage.jsx";
import GoogleCallback from "./GoogleCallback.jsx";

const AppRoutes = () => {
    return (
        <Fragment>
            <Routes>
                <Route path="/perfil/:nick/editar" element={<ProfileEdit/>}/>
                <Route path='/perfil/:nick' element={<ProfilePage/>}/>
                <Route path='/perfil' element={<ProfilePage/>}/>
                
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/signup" element={<SignupPage/>}/>

                <Route path="/" element={<MainPage/>}/>
                <Route path="/jugar" element={<GamePage/>}/>
                <Route path='/ajustes' element={<SettingsPage/>}/>
                
                <Route path="/*" element={<MainPage/>}/>

                <Route path="/auth/callback" element={<GoogleCallback/>}/>
            </Routes>
        </Fragment>
    )
}
export default AppRoutes;