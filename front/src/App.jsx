import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom';
import MainPage from './components/pages/MainPage.jsx'
import './App.css'

function App() {
  

  return (
    <>
    <BrowserRouter>
      <div className='MainPage'>
        <MainPage/>
      </div>
    </BrowserRouter>
    </>
  )
}

export default App
