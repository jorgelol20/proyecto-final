import React, { Fragment, lazy, Suspense } from "react";
import { Routes, Route } from 'react-router-dom';

// Importaciones `lazy` para que al hacer npm run build no pese tanto
const LoginPage = lazy(() => import('../pages/LoginPage.jsx'));
const ProfilePage = lazy(() => import('../pages/ProfilePage.jsx'));
const ProfileEdit = lazy(() => import('../pages/ProfileEditPage.jsx'));
const MainPage = lazy(() => import('../pages/MainPage.jsx'));
const SignupPage = lazy(() => import('../pages/SignupPage.jsx'));
const GamePage = lazy(() => import('../pages/GamePage.jsx'));
const SettingsPage = lazy(() => import('../pages/SettingsPage.jsx'));
const MatchPage = lazy(() => import('../pages/MatchPage.jsx'));
const Tutorial = lazy(() => import('../pages/Tutorial.jsx'));


import GoogleCallback from "./GoogleCallback.jsx";
const AppRoutes = () => {
    return (
        <Fragment>
            <Suspense fallback={<div>Cargando página...</div>}>
                <Routes>
                    <Route path="/perfil/:nick/editar" element={<ProfileEdit/>}/>
                    <Route path='/perfil/:nick' element={<ProfilePage/>}/>
                    <Route path='/perfil' element={<ProfilePage/>}/>

                    <Route path='/jugar/tutorial' element={<Tutorial/>}/>

                    <Route path='/partida/:matchId' element={<MatchPage/>}/>
                    
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/signup" element={<SignupPage/>}/>

                    <Route path="/" element={<MainPage/>}/>
                    <Route path="/jugar" element={<GamePage/>}/>
                    <Route path='/ajustes' element={<SettingsPage/>}/>
                    
                    <Route path="/*" element={<MainPage/>}/>

                    <Route path="/auth/callback" element={<GoogleCallback/>}/>
                </Routes>
            </Suspense>
        </Fragment>
    )
}

export default AppRoutes;