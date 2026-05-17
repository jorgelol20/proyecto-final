import React, { useState, Fragment, useContext } from "react";
import './Tutorial.css';
import { useNavigate } from "react-router-dom";
import { matchContext } from "../../context/MatchProvider.jsx";
import { Layer, Label, Rect, Stage, Text, Image } from "react-konva";
import Card from "../Card";
import useImage from "use-image";

//Palos
import ClubIcon from '/images/suit_club.webp';
import HeartIcon from '/images/suit_heart.webp';
import DiamonIcon from '/images/suit_diamond.webp';
import SpadeIcon from '/images/suit_spade.webp';
import DefaultCardImage from '/images/default_card.webp';

//ShopMan
import ShopManSad from '/images/shopman/Sad.webp';
import ShopManAngry from '/images/shopman/Angry.webp';
import ShopManNormal from '/images/shopman/Normal.webp';
import ShopManHappy from '/images/shopman/Happy.webp';
import ShopManSarcastic from '/images/shopman/Sarcastic.webp';
import ShopManThinking from '/images/shopman/Thinking.webp';

const Tutorial = () => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const { getTutorialCards } = useContext(matchContext);

    //Imagenes ShopMan
    const [shopManSad] = useImage(ShopManSad);
    const [shopManAngry] = useImage(ShopManAngry);
    const [shopManNormal] = useImage(ShopManNormal);
    const [shopManHappy] = useImage(ShopManHappy);
    const [shopManThinking] = useImage(ShopManSarcastic);
    const [shopManSarcastic] = useImage(ShopManThinking);

    // Tutorial 1
    const tutorial1Cards = getTutorialCards(1);
    const [defaultImage] = useImage(DefaultCardImage);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    // Escala para react-konva
    const scale = window.innerWidth / 2560;

    // 1. Cambiamos los componentes anidados por simples variables que almacenan JSX
    const slide1 = (
        <Fragment>
            <div className="slide-1">
                <h1>Bienvenido a </h1>
                <img src="/images/banner_menu.webp" alt="Banner Menu" />
                <p>El roguelike estratégico de cartas más adictivo y dificil.</p>
            </div>
        </Fragment>
    );

    const slide2 = (
        <Fragment>
            <div className="slide-2">
                <div className="container">
                    <h1>Tu objetivo</h1>
                    <p>Te has adentrado en la mazmorra para conseguir <span>riquezas</span> y no tener que preocuparte más de ser pobre. ¿Sencillo verdad?</p>
                    <h2><strong>¡Pues no!</strong></h2>
                    <p>Para poder llevar a casa toda esa riqueza, deberás superar las 10 rondas de la mazmorra donde, con cada ronda que superes, más enemigos irán apareciendo incluso algunos teniendo <span>efectos especiales</span> que complicarán más tu cometido.</p>
                </div>
            </div>
        </Fragment>
    );

    const slide3 = (
        <Fragment>
            <div className="slide-3">
                <div className="slide-3-info">
                    <h1>Cartas</h1>
                    <p>En <span>Scoundrel's Quest</span> cada carta tiene su función y motivo y la forma más fácil de conocerlas, es verlas.</p>
                    <p><span>Ponte encima </span> o <span>clica</span> en ellas para conocer más.</p>
                </div>
                <div className="card-stage">
                    {/* Carta 2 */}
                    <div key={tutorial1Cards[1]?.key + 3}>
                        <Stage width={200} height={200} scaleX={scale} scaleY={scale} y={20}
                            onMouseOver={() => setHoveredIndex(tutorial1Cards[1]?.id)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onTap={() => item.data.efectos ? hoveredIndex != null ? setHoveredIndex(null) : setHoveredIndex(index) : null}
                        >
                            <Layer key={tutorial1Cards[1]?.key + 1}>
                                <Card
                                    key={tutorial1Cards[1]?.key}
                                    cardInfo={tutorial1Cards[1]}
                                    onMouseOver={() => { }}
                                    onDragEnd={() => { }}
                                    onClick={() => { }}
                                    canBeClicked={false}
                                    isDraggable={false}
                                    cardSuit={HeartIcon}
                                    defaultImage={defaultImage}
                                />
                                {hoveredIndex === tutorial1Cards[1]?.id && (
                                    <Label x={0} y={0}>
                                        <Rect width={150} height={110} fill="#FFF" x={50} y={0} cornerRadius={5} stroke={"black"} />

                                        <Text text={"¡Comida! Te servirá para curarte tras el combate. Su poder base va desde el 2 hasta el 10"} fill="var(--main-black)" padding={5} fontSize={16} width={150} align="center" fontFamily="Romulus" x={50} y={0} />
                                        <Image image={shopManHappy} width={60} height={60} x={15} y={85} imageSmoothingEnabled={false} listening={false} />
                                    </Label>
                                )}
                            </Layer>
                        </Stage>
                    </div>

                    {/* Carta 3 */}
                    <div key={tutorial1Cards[2]?.key + 3}>
                        <Stage width={200} height={200} scaleX={scale} scaleY={scale} y={20}
                            onMouseOver={() => setHoveredIndex(tutorial1Cards[2]?.id)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onTap={() => item.data.efectos ? hoveredIndex != null ? setHoveredIndex(null) : setHoveredIndex(index) : null}
                        >
                            <Layer key={tutorial1Cards[2]?.key + 1}>
                                <Card
                                    key={tutorial1Cards[2]?.key}
                                    cardInfo={tutorial1Cards[2]}
                                    onMouseOver={() => { }}
                                    onDragEnd={() => { }}
                                    onClick={() => { }}
                                    canBeClicked={false}
                                    isDraggable={false}
                                    cardSuit={DiamonIcon}
                                    defaultImage={defaultImage}
                                />
                                {hoveredIndex === tutorial1Cards[2]?.id && (
                                    <Label x={0} y={0}>
                                        <Rect width={150} height={110} fill="#FFF" x={50} y={0} cornerRadius={5} stroke={"black"} />
                                        <Text text={"Son las armas que te ayudarán en la mazmorra. Su poder base va desde el 2 hasta el 10."} fill="var(--main-black)" padding={5} fontSize={16} width={150} align="center" fontFamily="Romulus" x={50} y={0} />
                                        <Image image={shopManNormal} width={60} height={60} x={15} y={85} imageSmoothingEnabled={false} listening={false} />
                                    </Label>
                                )}
                            </Layer>
                        </Stage>
                    </div>

                    {/* Carta 1 */}
                    <div key={tutorial1Cards[0]?.key + 3}>
                        <Stage width={200} height={200} scaleX={scale} scaleY={scale} y={20}
                            onMouseOver={() => setHoveredIndex(tutorial1Cards[0]?.id)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onTap={() => item.data.efectos ? hoveredIndex != null ? setHoveredIndex(null) : setHoveredIndex(index) : null}
                        >
                            <Layer key={tutorial1Cards[0]?.key + 1}>
                                <Card
                                    key={tutorial1Cards[0]?.key}
                                    cardInfo={tutorial1Cards[0]}
                                    onMouseOver={() => { }}
                                    onDragEnd={() => { }}
                                    onClick={() => { }}
                                    canBeClicked={false}
                                    isDraggable={false}
                                    cardSuit={SpadeIcon}
                                    defaultImage={defaultImage}
                                />
                                {hoveredIndex === tutorial1Cards[0]?.id && (
                                    <Label x={0} y={0}>
                                        <Rect width={150} height={90} fill="#FFF" x={50} y={20} cornerRadius={5} stroke={"black"} />
                                        <Text text={"Se tratan de enemigos con forma humanoide. Su poder va del 2 al 14."} fill="var(--main-black)" padding={5} fontSize={16} width={150} align="center" fontFamily="Romulus" x={50} y={20} />
                                        <Image image={shopManAngry} width={60} height={60} x={15} y={85} imageSmoothingEnabled={false} listening={false} />
                                    </Label>

                                )}
                            </Layer>
                        </Stage>
                    </div>

                    {/* Carta 4 */}
                    <div key={tutorial1Cards[3]?.key + 3}>
                        <Stage width={200} height={200} scaleX={scale} scaleY={scale} y={20}
                            onMouseOver={() => setHoveredIndex(tutorial1Cards[3]?.id)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onTap={() => item.data.efectos ? hoveredIndex != null ? setHoveredIndex(null) : setHoveredIndex(index) : null}
                        >
                            <Layer key={tutorial1Cards[3]?.key + 1}>
                                <Card
                                    key={tutorial1Cards[3]?.key}
                                    cardInfo={tutorial1Cards[3]}
                                    onMouseOver={() => { }}
                                    onDragEnd={() => { }}
                                    onClick={() => { }}
                                    canBeClicked={false}
                                    isDraggable={false}
                                    cardSuit={ClubIcon}
                                    defaultImage={defaultImage}
                                />
                                {hoveredIndex === tutorial1Cards[3]?.id && (
                                    <Label x={0} y={0}>
                                        <Rect width={150} height={90} fill="#FFF" x={50} y={20} cornerRadius={5} stroke={"black"} />
                                        <Text text={"Se tratan de enemigos monstruosos. Su poder va del 2 al 14."} fill="var(--main-black)" padding={5} fontSize={16} width={150} align="center" fontFamily="Romulus" x={50} y={20} />
                                        <Image image={shopManThinking} width={60} height={60} x={15} y={85} imageSmoothingEnabled={false} listening={false} />
                                    </Label>
                                )}
                            </Layer>
                        </Stage>
                    </div>
                </div>
            </div>
        </Fragment>
    );

    const slides = [slide1, slide2, slide3];
    const totalSlides = slides.length;

    const moveSlide = (direction) => {
        if (direction === 1) {
            setCurrentIndex((prev) => (prev === totalSlides - 1 ? prev : prev + 1));
        } else {
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