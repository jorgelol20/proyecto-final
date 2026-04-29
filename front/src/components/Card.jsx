import React, { useRef, useImperativeHandle, forwardRef, useState } from "react";
import { Group, Rect, Text, Image } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';

// Importaciones de imágenes (mantenidas igual)
import ClubIcon from '/images/suit_club.webp'
import HeartIcon from '/images/suit_heart.webp'
import DiamonIcon from '/images/suit_diamond.webp'
import SpadeIcon from '/images/suit_spade.webp'
import Default from '/images/default_card.webp'

const Card = forwardRef(({ cardInfo, x, y, onDragEnd, onClick, isDraggable = true, onDeck = false, isWizard = false }, ref) => {

    const groupRef = useRef(null);
    const [strokeWidth, setStrokeWidth] = useState(2);

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
    const [image] = useImage(cardInfo?.imagen ?? null);
    const [diamonImage] = useImage(DiamonIcon);
    const [clubImage] = useImage(ClubIcon);
    const [heartImage] = useImage(HeartIcon);
    const [spadeImage] = useImage(SpadeIcon);
    const [defaultImage] = useImage(Default);

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

    return (
        <Group
            ref={groupRef}
            x={x}
            y={y}
            draggable={isDraggable}
            onClick={() => onClick(cardInfo)}
            onDragStart={()=>{setStrokeWidth(6)}}
            onDragEnd={handleDragEndInternal}
            onDragMove={() => { document.body.style.cursor = "url('/images/cursor/Cursor_4.webp') 3 7, auto" }}
            onMouseEnter={() => { document.body.style.cursor = isDraggable ? "url('/images/cursor/Cursor_3.webp') 3 7, auto" : "url('/images/cursor/Cursor_5.webp') 3 7, auto"; }}
            onMouseLeave={() => { document.body.style.cursor = "url('/images/cursor/Cursor_1.webp') 3 7, auto"; }}
        >
            <Rect
                width={120}
                height={150}
                fill={onDeck ? "#000" : "white"}
                cornerRadius={8}
                stroke={!onDeck?cardInfo.palo === 'Corazon' ? '#1E5128' : cardInfo.palo === 'Diamante' ? '#F77F00' : '#0C0C0C':'#0C0C0C'} 
                strokeWidth={!onDeck?strokeWidth:0}
                shadowBlur={10}
                shadowOpacity={0.3}
                lineJoin="round"
                onDragMove={null}
            />

            {!onDeck && (
                <>
                    {/* VALOR SUPERIOR */}
                    <Text
                        text={`${cardInfo.valor}`}
                        fill={cardInfo.palo === 'Corazon' ? '#1E5128' : cardInfo.palo === 'Diamante' ? '#F77F00' : '#0C0C0C'}
                        fontSize={34}
                        fontFamily="Romulus"
                        x={15}
                        y={4}
                    />

                    {/* PALO SUPERIOR */}
                    <Image
                        image={cardInfo.palo == "Diamante" ? diamonImage : cardInfo.palo == "Trebol" ? clubImage : cardInfo.palo == "Corazon" ? heartImage : spadeImage}
                        width={25}
                        height={25}
                        x={75}
                        y={8}
                        imageSmoothingEnabled={false}
                    />

                    {/* IMAGEN CENTRAL */}
                    <Image
                        image={image}
                        width={90}
                        height={90}
                        x={15}
                        y={35}
                        imageSmoothingEnabled={false}
                    />

                    {/* PALO INFERIOR (Rotado) */}
                    <Image
                        image={cardInfo.palo == "Diamante" ? diamonImage : cardInfo.palo == "Trebol" ? clubImage : cardInfo.palo == "Corazon" ? heartImage : spadeImage}
                        width={25}
                        height={25}
                        x={40}
                        y={142}
                        imageSmoothingEnabled={false}
                        rotation={180}
                    />
                    {/* 
                        --main-green: #1E5128;
                        --main-red: #84142D;
                        --main-orange: #F77F00;
                    */}
                    {/* VALOR INFERIOR (Rotado) */}
                    <Text
                        text={`${cardInfo.valor}`}
                        fill={cardInfo.palo === 'Corazon' ? '#1E5128' : cardInfo.palo === 'Diamante' ? '#F77F00' : '#0C0C0C'}
                        fontSize={34}
                        fontFamily="Romulus"
                        x={100}
                        y={146}
                        rotation={180}
                    />
                </>
            )}

            {onDeck && (
                <>
                    <Image
                        image={defaultImage}
                        width={115}
                        height={150}
                        x={0}
                        y={0}
                        imageSmoothingEnabled={false}
                    />
                    {
                        isWizard ?
                            <Image
                                image={cardInfo.palo == "Diamante" ? diamonImage : cardInfo.palo == "Trebol" ? clubImage : cardInfo.palo == "Corazon" ? heartImage : spadeImage}
                                width={60}
                                height={60}
                                x={27}
                                y={45}
                                imageSmoothingEnabled={false}
                            /> : <></>
                    }
                </>
            )}
        </Group>
    );
});

export default Card;