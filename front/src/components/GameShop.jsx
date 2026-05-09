import React, { Fragment, useContext, useState, useEffect } from "react";
import './GameShop.css';
import { matchContext } from "../context/MatchProvider";
import GoldIcon from '/images/gold.webp';
import { useUser } from "../hooks/useUser";
import Card from "./Card.jsx";
import Modifier from "./Modifier.jsx";
import { Stage, Layer } from 'react-konva';
import ShopMan from '/images/ShopMan.webp'
import Dialogs from './../assets/database/dialogs.json'
import lodash from 'lodash';


const GameShop = ({ gold, setGold, setShopAvailable, health, maxHealth, formatedTimeRef, healthIcon, character, round }) => {
    const { user } = useUser();
    const { addCardToMatchDeck, addModifierToMatch, getRandomsModifier, getWeapon, getHealItem, activeModifiers: modifiers, } = useContext(matchContext);

    const dialogs = Dialogs;

    // Estado para almacenar los ítems de la tienda
    const [shopItems, setShopItems] = useState([]);

    useEffect(() => {
        const currentRound = 1;
        const mods = getRandomsModifier(3, currentRound) || [];
        let temp_weapons = []
        for(let i = 2; i <= 14; i++){
            temp_weapons.push(getWeapon(i))
        }
        let temp_heal = []
        for(let i = 2; i <= 14; i++){
            temp_heal.push(getHealItem(i))
        }
        const weps = [...temp_weapons].filter(w => w !== undefined);
        const heal = [...temp_heal].filter(w => w !== undefined);
        const items = [];

        // Agregar modificadores
        mods.forEach((mod, index) => {
            if (mod) items.push({ id: `mod-${index}`, type: 'modifier', data: mod, price: 50 * (mod.nivel || 1), isBought: false });
        });

        // Agregar armas
        weps.forEach((wep, index) => {
            items.push({ id: `wep-${index}`, type: 'card', data: wep, price: Math.max(5,wep.valor * 5), isBought: false });
        });

        // Agregar cura
        heal.forEach((heal, index) => {
            items.push({ id: `wep-${index}`, type: 'card', data: heal, price: (heal.valor * 5), isBought: false });
        });

        setShopItems(items);
    }, []);

    // Función para manejar la compra
    const handleBuyItem = (index) => {
        const item = shopItems[index];

        // Validar si ya se compró o no hay oro suficiente
        if (item.isBought || gold < item.price) return;

        // 1. Restar el oro al jugador
        setGold(prevGold => prevGold - item.price);

        // 2. Añadir el ítem al jugador según su tipo
        if (item.type === 'modifier') {
            addModifierToMatch(item.data);
        } else if (item.type === 'card') {
            console.log(item.data)
            addCardToMatchDeck(item.data);
        }

        // 3. Marcar el ítem como comprado en la UI
        setShopItems(prevItems => {
            const newItems = [...prevItems];
            newItems[index].isBought = true;
            return newItems
        });
    };

    return (
        <Fragment>
            <div className="game-shop">
                <div className="game-hud">
                    <h1 className="player-health"><img src={healthIcon} alt="Salud" />{health}/{maxHealth}</h1>
                    <h1 className="player-gold"><img src={GoldIcon} alt="Oro" />{gold}</h1>
                    <h2 ref={formatedTimeRef}>Tiempo: 00:00</h2>
                    <div className="game-character">
                        <img className="character-avatar" style={{ borderColor: user.color }} src={character?.imagen} alt={character?.nombre} />
                        <img className="character-abilitie" src={character?.habilidad_personaje?.icono} alt="Habilidad" style={null} />
                    </div>
                    <div className="game-modifiers">
                            {
                                modifiers.map((modifierInfo) => (
                                    <Modifier key={modifierInfo.id + modifierInfo.nombre.charCodeAt(0)} modifierInfo={modifierInfo} />
                                ))
                            }
                        </div>
                </div>

                <div className="shop-container">
                    <div className="shop-items">
                        {shopItems.map((item, index) => (
                            <div
                                key={item.id}
                                className={`shop-item-wrapper ${item.isBought ? 'bought' : ''}`}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: item.isBought ? 0.5 : 1 }}
                            >
                                {/* Renderizado condicional según el tipo de ítem */}
                                <div className="item-display">
                                    <div className={item.type}>
                                        {item.type === 'modifier' ? (
                                            <Modifier modifierInfo={item.data} bigger={true} />
                                        ) : (
                                            <Stage width={150} height={200}>
                                                <Layer>
                                                    <Card
                                                        cardInfo={item?.data}
                                                        x={0}
                                                        y={0}
                                                        onDragEnd={() => { }}
                                                        onClick={() => { }}
                                                        isDraggable={false}
                                                    />
                                                </Layer>
                                            </Stage>
                                        )}
                                    </div>
                                </div>
                                <div className="item-purchase-controls" style={{ marginTop: '10px', textAlign: 'center' }}>
                                    <p style={{ margin: '5px 0', fontWeight: 'bold' }}>
                                        <img src={GoldIcon} alt="Oro" style={{ width: '16px', verticalAlign: 'middle', marginRight: '5px' }} />
                                        {item.price}
                                    </p>
                                    <button
                                        onClick={() => handleBuyItem(index)}
                                        disabled={item.isBought || gold < item.price}
                                    >
                                        {item.isBought ? 'Comprado' : 'Comprar'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="continue-button" style={{ marginTop: '20px' }} onClick={() => { setShopAvailable(false) }}>
                        Seguir
                    </button>
                </div>
                <div className="shop-man">
                    <div className="dialog">
                        <div>
                            <p>{lodash.shuffle(dialogs)[0]}</p>
                        </div>
                    </div>
                    <img src={ShopMan} alt="" />
                </div>
            </div>
        </Fragment>
    );
}

export default GameShop;