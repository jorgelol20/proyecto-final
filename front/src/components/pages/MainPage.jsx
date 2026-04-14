import React, { Fragment } from "react";
//import './Content.css';
import AppRoutes from "../structure/AppRoutes.jsx";


const MainPage = () => {
    
    return (
        <Fragment>
            <main>
                {<AppRoutes />}
            </main>
        </Fragment>
    );
}
export default MainPage;