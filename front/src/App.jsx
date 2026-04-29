import { Fragment, useState, useRef } from 'react'
import { BrowserRouter } from 'react-router-dom';
import MainPage from './components/pages/MainPage.jsx'
import Navbar from './components/structure/Navbar.jsx';
import './App.css'
import ContentPage from './components/pages/ContentPage.jsx';
import Banner from './components/structure/Banner.jsx';

function App() {


  return (

    <Fragment>
      <BrowserRouter>
        <Navbar className="navbar"/>
        <Banner />
        <main className='MainPage'>
          <ContentPage />
        </main>
      </BrowserRouter>
    </Fragment>

  )
}

export default App
