import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from "react";
import { Group, Rect, Text, Image } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';
import Default from '/images/default_card.webp'
import PoisonIcon from '/images/cardEffects/Poison.webp';
import AntihealIcon from '/images/cardEffects/Antiheal.webp';
import WeaponBreakerIcon from '/images/cardEffects/WeaponBreaker.webp';
import RestoreAbilityIcon from '/images/cardEffects/RestoreAbility.webp';
import DmgReductionIcon from '/images/cardEffects/DmgReduction.webp';
import ProgresiveHealIcon from '/images/cardEffects/ProgresiveHeal.webp';
import HealRouleteIcon from '/images/cardEffects/HealRoulete.webp';
import InvincibilityIcon from '/images/cardEffects/Invincibility.webp';
import ReviveIcon from '/images/cardEffects/Revive.webp';
import HealthStealIcon from '/images/cardEffects/HealthSteal.webp';
import ThornyIcon from '/images/cardEffects/Thorny.webp';
import PlunderIcon from '/images/cardEffects/Plunder.webp';
import ExtraGoldIcon from '/images/cardEffects/ExtraGold.webp';


const Card = forwardRef(({ cardInfo, x, y, onDragEnd, onClick, isDraggable = true, onDeck = false, isWizard = false, setOverDungeonZone, canBeClicked, cardSuit, defaultImage }, ref) => {

    const groupRef = useRef(null);
    const [strokeWidth, setStrokeWidth] = useState(2);
    const [hasEffect, setHasEffect] = useState(false)

    // Exponemos métodos al padre (GamePage)
    useImperativeHandle(ref, () => ({
        animateTo: (targetX, targetY, duration = 0.3) => {
            groupRef.current.to({
                x: targetX,
                y: targetY,
                duration: duration,
                easing: Konva.Easings.EaseInOut,
            });
        }
    }));

    // Carga de imágenes
    const [image] = useImage(cardInfo?.imagen);
    const [suit] = useImage(cardSuit);
    const selectEffectImage = () => {
        if (cardInfo?.efectos) {
            const effectsList = Array.isArray(cardInfo.efectos) ? cardInfo.efectos : [cardInfo.efectos];
            switch (effectsList[0].name) {
                case 'antiheal':
                    return AntihealIcon
                    break;
                case 'weapon_breaker':
                    return WeaponBreakerIcon
                    break;
                case 'poison':
                    return PoisonIcon
                    break;
                case 'restore_ability':
                    return RestoreAbilityIcon;
                    break;
                case 'progresive_heal':
                    return ProgresiveHealIcon;
                    break;
                case 'heal_roulete':
                    return HealRouleteIcon;
                    break;
                case 'dmg_reduction':
                    return DmgReductionIcon;
                    break;
                case 'revive':
                    return ReviveIcon;
                    break;
                case 'invincibility_turns':
                    return InvincibilityIcon;
                    break;
                case 'health_steal':
                    return HealthStealIcon;
                    break;
                case 'thorny':
                    return ThornyIcon;
                    break;
                case 'plunder':
                    return PlunderIcon;
                    break;
                case 'extra_gold':
                    return ExtraGoldIcon;
                    break;
                default:
                    return null
                    break;
            }
        }
    }
    const [effectIcon] = useImage(selectEffectImage())

    //Cachear la carta para mejorar el rendimiento
    useEffect(() => {
        const allImagesLoaded = image && suit && defaultImage && (!hasEffect || effectIcon);

        if (allImagesLoaded && groupRef.current) {
            const timeoutId = setTimeout(() => {
                if (groupRef.current) {
                    groupRef.current.cache({
                        x: 0,
                        y: 0,
                        width: 120, // El ancho de tu Rect base
                        height: 150, // El alto de tu Rect base
                        pixelRatio: 2 // Evita que el texto y el pixel art se difuminen
                    });

                    // CRUCIAL PARA PIXEL ART: 
                    // Al cachear, Konva crea un canvas interno. Le decimos que no suavice los píxeles.
                    const canvas = groupRef.current._cache.canvas._canvas;
                    const ctx = canvas.getContext('2d');
                    ctx.imageSmoothingEnabled = false;

                    // Forzamos a la capa a dibujar el cambio
                    groupRef.current.getLayer()?.batchDraw();
                }
            }, 100);

            return () => clearTimeout(timeoutId);
        }

        return () => {
            if (groupRef.current) {
                groupRef.current.clearCache();
            }
        };
    }, [image, suit, effectIcon, defaultImage, strokeWidth, hasEffect, cardInfo]);
    // Color de la carta
    const colorRef = useRef('')

    const handleDragEndInternal = (e) => {
        const finalX = e.target.x();
        const finalY = e.target.y();
        const isValidMove = onDragEnd(cardInfo, finalX, finalY);
        setStrokeWidth(2)

        if (!isValidMove) {
            groupRef.current.to({
                x: x,
                y: y,
                duration: 0.2,
                easing: Konva.Easings.EaseInOut,
            });
        }
    };
    const deckPositionY = useRef(5);

    useEffect(() => {
        const palos = ['Diamante', 'Corazon']
        if (cardInfo.valor > 10 && palos.indexOf(cardInfo.palo) != -1) {
            if (cardInfo.valor == 14) {
                cardInfo.valor = 14;
            } else {
                cardInfo.valor = 10;
            }
        }
        setHasEffect(cardInfo.efectos ? true : false)
        colorRef.current = cardInfo.especial ? '#D4AF37' : cardInfo.palo === 'Corazon' ? '#1E5128' : cardInfo.palo === 'Diamante' ? '#F77F00' : '#0C0C0C';

    }, [])

    return (
        <Group
            ref={groupRef}
            x={x}
            y={y}
            draggable={isDraggable}
            onClick={() => !onDeck ? canBeClicked ? onClick(cardInfo) : null : canBeClicked && setOverDungeonZone ? setOverDungeonZone(prev => !prev) : null}
            onTap={() => !onDeck ? canBeClicked ? onClick(cardInfo) : null : canBeClicked && setOverDungeonZone ? setOverDungeonZone(prev => !prev) : null}
            onDragStart={() => { setStrokeWidth(6); document.body.style.cursor = "url('/images/cursor/Cursor_4.webp') 3 7, auto" }}
            onDragEnd={handleDragEndInternal}
            onMouseEnter={() => { isWizard ? setOverDungeonZone(true) : ""; document.body.style.cursor = isDraggable ? "url('/images/cursor/Cursor_3.webp') 3 7, auto" : "url('/images/cursor/Cursor_5.webp') 3 7, auto"; }}
            onMouseLeave={() => { isWizard ? setOverDungeonZone(false) : ""; document.body.style.cursor = "url('/images/cursor/Cursor_1.webp') 3 7, auto"; }}
        >
            <Rect
                width={120}
                height={150}
                fill={onDeck ? !isWizard ? "#000000" : "#ffffffe5" : "white"}
                cornerRadius={8}
                stroke={!onDeck ? colorRef.current : '#0C0C0C'}
                strokeWidth={!onDeck ? strokeWidth : 0}
                lineJoin="round"
                onDragMove={null}
            />

            {!onDeck && (
                <>
                    {/* VALOR SUPERIOR */}
                    <Text
                        text={`${cardInfo.valor}`}
                        fill={colorRef.current}
                        fontSize={34}
                        fontFamily="Romulus"
                        x={15}
                        y={4}
                        listening={false}
                    />

                    {/* PALO SUPERIOR */}
                    <Image
                        image={suit}
                        width={25}
                        height={25}
                        x={75}
                        y={8}
                        imageSmoothingEnabled={false}
                        listening={false}
                    />

                    {/* IMAGEN CENTRAL */}
                    <Image
                        image={image}
                        width={90}
                        height={90}
                        x={15}
                        y={35}
                        imageSmoothingEnabled={false}
                        listening={false}
                    />
                    {/* EFECTO */}
                    {
                        hasEffect && <Image
                            image={effectIcon}
                            width={30}
                            height={30}
                            x={45}
                            y={112}
                            imageSmoothingEnabled={false}
                            listening={false}
                        />
                    }

                    {/* PALO INFERIOR (Rotado) */}
                    <Image
                        image={suit}
                        width={25}
                        height={25}
                        x={40}
                        y={142}
                        imageSmoothingEnabled={false}
                        rotation={180}
                        listening={false}
                    />
                    {/* 
                        --main-green: #1E5128;
                        --main-red: #84142D;
                        --main-orange: #F77F00;
                    */}
                    {/* VALOR INFERIOR (Rotado) */}
                    <Text
                        text={`${cardInfo.valor}`}
                        fill={colorRef.current}
                        fontSize={34}
                        fontFamily="Romulus"
                        x={100}
                        y={146}
                        rotation={180}
                        listening={false}
                    />
                </>
            )}

            {onDeck ? !isWizard ? (
                <>
                    <Image
                        image={defaultImage}
                        width={120}
                        height={150}
                        x={0}
                        y={0}
                        imageSmoothingEnabled={false}
                        listening={false}
                    />
                </>
            )
                : (
                    <>
                        <Image
                            image={defaultImage}
                            width={120}
                            height={150}
                            x={0}
                            y={0}
                            opacity={0.2}
                            imageSmoothingEnabled={false}
                            listening={false}
                        />
                        {/* VALOR SUPERIOR */}
                        <Text
                            text={`${cardInfo.valor}`}
                            fill={colorRef.current}
                            fontSize={34}
                            fontFamily="Romulus"
                            x={15}
                            y={4}
                            listening={false}
                        />

                        {/* PALO SUPERIOR */}
                        <Image
                            image={suit}
                            width={25}
                            height={25}
                            x={75}
                            y={8}
                            imageSmoothingEnabled={false}
                            listening={false}
                        />

                        {/* IMAGEN CENTRAL */}
                        <Image
                            image={image}
                            width={90}
                            height={90}
                            x={15}
                            y={35}
                            imageSmoothingEnabled={false}
                            listening={false}
                        />

                        {/* PALO INFERIOR (Rotado) */}
                        <Image
                            image={suit}
                            width={25}
                            height={25}
                            x={40}
                            y={142}
                            imageSmoothingEnabled={false}
                            rotation={180}
                            listening={false}
                        />
                        {/* 
                        --main-green: #1E5128;
                        --main-red: #84142D;
                        --main-orange: #F77F00;
                    */}
                        {/* VALOR INFERIOR (Rotado) */}
                        <Text
                            text={`${cardInfo.valor}`}
                            fill={colorRef.current}
                            fontSize={34}
                            fontFamily="Romulus"
                            x={100}
                            y={146}
                            rotation={180}
                            listening={false}
                        />
                    </>
                ) : <></>}
        </Group>
    );
});

export default Card;