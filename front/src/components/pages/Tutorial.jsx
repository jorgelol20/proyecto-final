import React, { useState, useEffect, Fragment } from "react";
import './Tutorial.css';
import { useNavigate } from "react-router-dom";

const Tutorial = () => {
    const navigate = useNavigate()
    useEffect(()=>{
        navigate('/')
    },[])
    const [currentIndex, setCurrentIndex] = useState(0);
    const Slide1 = () => {
        return (
            <Fragment>
                <div className="slide-1">
                    <h1>Bienvenido a </h1>
                    <img src="/images/banner_menu.webp" />
                    <p>El roguelike estratégico de cartas más adictivo y complicado.</p>
                </div>
            </Fragment>
        )
    }
    const Slide2 = () => {
        return (
            <Fragment>
                <div className="slide-1">
                    <h1>Bienvenido a <img src="/images/banner_menu.webp" /></h1>
                </div>
            </Fragment>
        )
    }
    const Slide3 = () => {
        return (
            <Fragment>
                <div className="slide-1">
                    <h1>Bienvenido a <img src="/images/banner_menu.webp" /></h1>
                </div>
            </Fragment>
        )
    }
    const slides = [
        <Slide1 />,
        <Slide2 />,
        <Slide3 />,
    ];



    const totalSlides = slides.length;

    // 2. Función para mover las diapositivas
    const moveSlide = (direction) => {
        if (direction === 1) {
            // Ir al siguiente o volver al inicio
            setCurrentIndex((prev) => (prev === totalSlides - 1 ? prev : prev + 1));
        } else {
            // Ir al anterior o ir al final
            setCurrentIndex((prev) => (prev === 0 ? prev : prev - 1));
        }
    };


    return (
        <Fragment>
            <div className="tutorial-container">
                <div className="tutorial-carousel">
                    <div className="carousel-inner">
                        {slides[currentIndex]}
                    </div>
                </div>
                <button className="btn-prev" onClick={() => moveSlide(-1)}>&#10094;</button>
                <button className="btn-next" onClick={() => moveSlide(1)}>&#10095;</button>
            </div>
        </Fragment>
    );
};

export default Tutorial;