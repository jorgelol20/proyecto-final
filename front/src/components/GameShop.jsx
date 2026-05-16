import React, { Fragment, useContext, useState, useEffect } from "react";
import './GameShop.css';
import { matchContext } from "../context/MatchProvider";
import GoldIcon from '/images/gold.webp';
import { useUser } from "../hooks/useUser";
import Card from "./Card.jsx";
import Modifier from "./Modifier.jsx";
import { Stage, Layer, Group, Label, Tag, Text, Rect } from 'react-konva';
import ShopMan from '/images/ShopMan.webp'
import Dialogs from './../assets/database/dialogs.json'
import lodash from 'lodash';
import HeartIcon from '/images/suit_heart.webp';
import DiamonIcon from '/images/suit_diamond.webp';

const GameShop = ({ gold, setGold, setShopAvailable, health, maxHealth, formatedTimeRef, healthIcon, character, round }) => {
    const { user } = useUser();
    const { addCardToMatchDeck, addModifierToMatch, getRandomsModifier, getWeapon, getHealItem, activeModifiers: modifiers, } = useContext(matchContext);

    const dialogs = Dialogs;

    const [dialog, setDialog] = useState(lodash.shuffle(dialogs)[0])

    // Estado para almacenar los ítems de la tienda
    const [shopItems, setShopItems] = useState([]);

    const [hoveredIndex, setHoveredIndex] = useState(null);

    useEffect(() => {
        const currentRound = 1;
        const mods = getRandomsModifier(3, currentRound) || [];
        let temp_weapons = []
        for (let i = 2; i <= 14; i++) {
            temp_weapons.push(getWeapon(i))
        }
        let temp_heal = []
        for (let i = 2; i <= 14; i++) {
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
            items.push({ id: `wep-${index}`, type: 'card', data: wep, price: Math.max(20, (index < 9?wep.valor * 5:((wep.valor - 4) * 5) + ((wep.valor >= 14 ? 15 : 10) * (wep.valor - 8)))), isBought: false });
        });

        // Agregar cura
        heal.forEach((heal, index) => {
            items.push({ id: `heal-${index}`, type: 'card', data: heal, price: Math.max(5, (index < 9?heal.valor * 5:((heal.valor - 4) * 5) + (10 * (heal.valor - 8)))), isBought: false });
        });

        setShopItems(items);
    }, []);

    // Función para manejar la compra
    const handleBuyItem = (index) => {
        setDialog(lodash.shuffle(dialogs)[0])
        const item = shopItems[index];

        // Validar si ya se compró o no hay oro suficiente
        if (item.isBought || gold < item.price) return;

        // 1. Restar el oro al jugador
        setGold(prevGold => prevGold - item.price);

        // 2. Añadir el ítem al jugador según su tipo
        if (item.type === 'modifier') {
            addModifierToMatch(item.data);
        } else if (item.type === 'card') {
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
                            modifiers.length > 0 ? modifiers.map((modifierInfo) => (
                                <Modifier key={modifierInfo.id + modifierInfo.nombre.charCodeAt(0)} modifierInfo={modifierInfo} />
                            ))
                                : <></>
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
                                            <Stage width={250} height={200}>
                                                <Layer>
                                                    <Group
                                                        onMouseOver={() => item.data.efectos ?setHoveredIndex(index):null}
                                                        onMouseLeave={() => item.data.efectos ?setHoveredIndex(null):null}
                                                        onTap={() => item.data.efectos ? hoveredIndex != null ? setHoveredIndex(null):setHoveredIndex(index):null}
                                                    >
                                                        <Card
                                                            cardInfo={item?.data}
                                                            x={55}
                                                            y={0}
                                                            isDraggable={false}
                                                            cardSuit={item.palo == "Diamante" ? DiamonIcon : HeartIcon}
                                                        />
                                                    

                                                    {/* Ventana emergente simple */}
                                                    {hoveredIndex === index && item.data.efectos && (
                                                        <Label x={0} y={0}>

                                                            <Rect
                                                                width={150}
                                                                height={90}
                                                                fill="#685a5a"
                                                                x={40}
                                                                y={0}
                                                                cornerRadius={5}
                                                                stroke={"black"}
                                                            />
                                                            <Text
                                                                text={item.data.efectos[0].description}
                                                                fill="white"
                                                                padding={5}
                                                                fontSize={16}
                                                                width={150}
                                                                align="center"
                                                                fontFamily="Romulus"
                                                                x={40}
                                                                y={0}
                                                            />
                                                        </Label>
                                                    )}
                                                    </Group>
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
                            <p>{dialog}</p>
                        </div>
                    </div>
                    <img src={ShopMan} alt="" />
                </div>
            </div>
        </Fragment>
    );
}

export default GameShop;