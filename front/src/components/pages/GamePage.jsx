import React, { act, Fragment, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Stage, Layer, Text, Group, Rect } from 'react-konva';
import lodash, { fill, forEach, invert, round } from 'lodash';

import { matchContext } from "../../context/MatchProvider.jsx";
import { useUser } from "../../hooks/useUser.js";

import './GamePage.css';
import Banner from "../structure/Banner";
import Card from "../Card";

import GoldIcon from '/images/gold.webp'
import FullHealthIcon from '/images/full_health.png'
import MidHealthIcon from '/images/mid_health.png'
import NoHealthIcon from '/images/no_health.png'

import HealAnimation from '/images/animations/HealAnimation.webp'
import GoldAnimation from '/images/gold.webp'
import AllDamageAnimation from '/images/animations/AllDamageAnimation.webp'
import DamageAnimation from '/images/animations/DamageAnimation.webp'

import { set } from "lodash";
import SelectCharacter from "../SelectCharacter.jsx";
import { useNavigate } from "react-router-dom";
import SelectModifier from "../SelectModifier.jsx";
import Modifier from "../Modifier.jsx";
import Loading from "../Loading.jsx";



const GamePage = () => {
    const navigate = useNavigate();
    const { matchDeck, character, activeModifiers: modifiers, setNewDeck, setNewCharacter, startNewGame, addCardToMatchDeck, gameLoading, availableCharacters, getWeapon } = useContext(matchContext);
    const { user, isLoading } = useUser();


    //Estados que almacenan si el juego ha empezado y si el juego está en GameOver
    const [gameOn, setGameOn] = useState(false)
    const [gameOver, setGameOver] = useState(false)

    useEffect(() => {
        if (character) {
            setGameOn(true);
        }
    }, [character]);

    // State de número de ronda
    const [rounds, setRounds] = useState(0);

    //State de tiempo
    const formatedTimeRef = useRef(null)
    const timeRef = useRef(0);
    const intervalRef = useRef(null);
    useEffect(() => {
        if (gameOn && timeRef?.current != null && formatedTimeRef) {
            intervalRef.current = setInterval(() => {
                timeRef.current += 1;
                const mins = Math.floor(timeRef.current / 60);
                const secs = timeRef.current % 60;
                if (formatedTimeRef.current != null) {
                    formatedTimeRef.current.textContent = `Tiempo: ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
                }
            }, 1000)
        } else {
            clearInterval(intervalRef)
            intervalRef.current = null;
            formatedTimeRef.current = null;
        }
    }, [gameOn, timeRef, formatedTimeRef]);

    const stopTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }


    /**
     * ===================================
     *              VIDA
     * ===================================
     */
    // Estado que almacena la vida máxima del jugador
    const [maxHealth, setMaxHealth] = useState(20);

    // Estado que almacena la vida actual del jugador.
    const [health, setHealth] = useState(maxHealth);

    // Estado que almacena si el jugar se ha curado en este turno o no
    const healedRef = useRef(null);

    // Estado que almacena el icono de la vida
    const [healthIcon, setHealthIcon] = useState(FullHealthIcon);

    // Función para saber si ha perdido
    useEffect(() => {
        if (health === 0) {
            setGameOn(false)

        }
    }, [health])

    // Función para decidir que icono de la vida mostrar.
    useEffect(() => {
        if (health >= maxHealth) {
            setHealthIcon(FullHealthIcon)
        } else if (health <= maxHealth / 2 && health > 0) {
            setHealthIcon(MidHealthIcon)
        } else if (health === 0) {
            setHealthIcon(NoHealthIcon)
        }
    }, [health])





    /**
     * ===================================
     *                ORO
     * ===================================
     */
    // State de oro
    const [gold, setGold] = useState(0);




    /**
     * ===================================
     *  CARTAS Y ZONAS (Elementos Konva)
     * ===================================
     */
    // Zona principal de Konva
    const layerRef = useRef(null);

    // Mapa de referencias de las cartas (Animaciones)
    const cardRefs = useRef({});

    // Mano activa
    const [room, setRoom] = useState([]);

    // Mazo actual
    const [DUNGEON_ZONE, setDUNGEON_ZONE] = useState({ x: 10, y: 5, width: 130, height: 160 });
    // Estado que guarda el mazo que está jugandose
    const [dungeon, setDungeon] = useState([]);

    //Pila de descartes
    const [DISCARD_ZONE, setDISCARD_ZONE] = useState({ x: 650, y: 200, width: 130, height: 160 });
    // Estado que almacena la pila de descartes
    const [discardPile, setDiscardPile] = useState([]);

    // Arma actual
    const [WEAPON_ZONE, setWEAPON_ZONE] = useState({ x: 200, y: 200, width: 400, height: 240 });
    // Estados que almacenan el arma actual y los enemigos derrotados con ella
    const [weapon, setWeapon] = useState(null);
    const [slainMonsters, setSlainMonsters] = useState([]);


    /**
     * ==========================================
     *  CARGA INICIAL Y DESACOPLE DEL COMPONENTE
     * ==========================================
     */
    // Propiedad para hacer responsive los elementos Canva de Konva
    const [stageSize, setStageSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    const scale = stageSize.width / 1920;

    useEffect(() => {
        if (!user) {
            navigate('/')
        }
        const handleResize = () => {
            setStageSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize)
            stopTimer()
            setDungeon([])
            setRoom([])
            setDiscardPile([])
            setNewDeck();
            setNewCharacter(null)
            setGameOn(false)
        };
    }, []);

    // Cargar nuevo juego
    useEffect(() => {
        startNewGame();
    }, [gameLoading]);

    // Cuando el mazo base de la partida esté listo, se carga en el mazo de juego.
    useEffect(() => {
        if (matchDeck && matchDeck.length > 0 && dungeon.length == 0 && room.length == 0) {
            startNewRound();
        }
    }, [matchDeck, dungeon]);


    /**
     * ===================================
     *            PERSONAJES
     * ===================================
     */
    // Parámetros de personaje
    const [isWizard, setIsWizard] = useState(false);
    const canScape = useRef(true)
    const [availableAbilitie, setAvailableAbilitie] = useState(true)

    // Habilidad del guerrero
    const guarrior = () => {
        let actualRoom = [...room];
        let currentDungeon = [...dungeon];
        const allEnemys = actualRoom.filter(card => card.palo === 'Pica' || card.palo === "Trebol");
        const enemys = allEnemys.slice(0, 2);
        const noEnemys = actualRoom.filter(card => card.palo !== 'Pica' && card.palo !== "Trebol");
        if (enemys.length > 0) {
            currentDungeon.push(...enemys);
            const newCards = [];
            for (let i = 0; i < enemys.length; i++) {
                newCards.push(currentDungeon.shift());
            }
            const remainingEnemys = allEnemys.slice(2);
            const newRoom = [...newCards, ...remainingEnemys, ...noEnemys];
            setRoom(newRoom);
            setDungeon(currentDungeon);
        }
        canScape.current = false;
    }

    // Habilidad del elfo
    const elf = () => {
        let actualRoom = [...room];
        let newCards = []
        if (actualRoom.length < 2) {
            newCards = actualRoom.map((card) => { card.valor = card.valor - 5 < 0 ? 0 : card.valor - 5;; return card })
        } else {
            newCards = actualRoom.map((card, index) => {
                if (index == actualRoom.length - 1 || index == actualRoom.length - 2) {
                    card.valor = card.valor - 5 < 0 ? 0 : card.valor - 5;
                }
                return card
            })
        }
        const newRoom = [...newCards];
        setRoom(newRoom);
    }

    // Función para usar la habilidad
    const handleUseAbilitie = (id) => {
        if (availableAbilitie) {
            switch (id) {
                case 1: // Guerrero
                    guarrior()
                    setAvailableAbilitie(false)
                    break
                case 2: // Paladín (1 vez por ronda)
                    setHealth(prev => Math.min(maxHealth, prev + 5));
                    healAnimation(5)
                    setAvailableAbilitie(false)
                    break
                case 3: // Elfo
                    elf()
                    setAvailableAbilitie(false)
                    break
                case 4: // Mago (1 vez por ronda)
                    shuffleDeck(dungeon)
                    setAvailableAbilitie(false)
                    break
            }

        }
    }

    // Manejo de pasivas
    useEffect(() => {
        if (character) {
            if (character?.habilidad_personaje?.id === 2) {
                setMaxHealth(maxHealth + 5)
                setHealth(health + 5)
            } else if (character?.habilidad_personaje?.id === 4) {
                setIsWizard(true)
            }
        }
    }, [character])


    /**
     * ===================================
     *           MODIFICADORES
     * ===================================
     */
    const [selectModifier, setSelectModifier] = useState(false)
    const [modifiersLoading, setModifiersLoading] = useState(true)

    useEffect(() => {
        if (modifiers.length > 0) {
            handleModifierEvent()
        }
    }, [modifiers])

    const setModifierWeapon = async (power) => {
        const newWeapon = await getWeapon(power)
        setWeapon(newWeapon)

    }

    const handleModifierEvent = async () => {
        const modifier = modifiers[modifiers.length - 1]
        const modifierEffects = modifier.efectos
        modifierEffects.map((effect) => {
            switch (effect.name) {
                case "chest_rewards":
                    const weapon = lodash.shuffle(effect.value)[0]
                    setModifierWeapon(weapon)
                    break
                default:
                    break
            }
        })
        setModifiersLoading(false)

    }

    /**
     * ===================================
     *         RELLENAR    MANO
     * ===================================
     */
    // Función para rellenar las cartas activas
    const fillRoom = () => {
        if (dungeon.length === 0) return;
        let newRoom = [...room];
        let currentDungeon = [...dungeon];
        while (newRoom.length < 4 && currentDungeon.length > 0) {
            newRoom.push(currentDungeon.pop());
        }
        setRoom(newRoom);
        setDungeon(currentDungeon);
    };

    // Función para barajar el mazo de la ronda
    const shuffleDeck = (deck) => {
        const shuffled = lodash.shuffle(deck)
        setDungeon([...shuffled])
    }
    const startNewRound = () => {
        setSelectModifier(true)
        setRounds(rounds + 1)
        shuffleDeck(matchDeck);
    }

    // Función para escapar
    const scape = () => {
        if (canScape.current) {
            canScape.current = false
            // Condición del guerrero
            if (character?.habilidad_personaje?.id === 1) {
                setAvailableAbilitie(false)
            }
            setDungeon([...room, ...dungeon])
            setRoom([])
        }
    }

    // Cada vez que se realiza un cambio en la mano o en el 
    // mazo general, salta el useEffect.
    useEffect(() => {
        // Rellenado por escapar o inicial
        if (room.length === 0 && dungeon.length > 0) {
            fillRoom()
            healedRef.current = false
        }
        //Rellenado por gastar las cartas
        else if (room.length <= 1 && dungeon.length > 0) {
            fillRoom();
            if (character?.habilidad_personaje?.id === 1) {
                setAvailableAbilitie(true)
            }
            healedRef.current = false
            canScape.current = true
        }
    }, [room.length, dungeon.length]);


    /**
     * ===================================
     *      ANIMACIONES DE COMBATE
     * ===================================
     */
    const [healthAnimation, setHealthAnimation] = useState(null)
    const [goldAnimation, setGoldAnimation] = useState(null)
    const [healthAnimationValue, setHealthAnimationValue] = useState(null)
    const [goldAnimationValue, setGoldAnimationValue] = useState(null)

    const healAnimation = async (value) => {
        setHealthAnimationValue("+" + (value))
        setHealthAnimation(HealAnimation)
        setTimeout(() => {
            setHealthAnimation(null)
        }, 300)
    }

    const damageAnimation = async (value, allDamage = false) => {
        setHealthAnimationValue(value * -1)
        if (allDamage) {
            setHealthAnimation(AllDamageAnimation)
        } else {
            setHealthAnimation(DamageAnimation)
        }

        setTimeout(() => {
            setHealthAnimation(null)
        }, 300)
    }

    const coinAnimation = async (value) => {
        setGoldAnimationValue(value)
        setGoldAnimation(GoldAnimation)
        setTimeout(() => {
            setGoldAnimation(null)
        }, 300)
    }


    /**
     * ===================================
     *         JUGAR      CARTAS
     * ===================================
     */
    // Función para eliminar una carta del mazo de ronda.
    const deleteFromRoom = (card) => {
        setRoom(prev => prev.filter(c => c.id !== card.id));
    }

    // Función para ejecutar la animación para mover a descartes
    const moveCardToDiscard = (cardsToMove, moved = false) => {
        if (moved) {
            cardsToMove.forEach((card) => {
                if (cardRefs.current[card.id]) {
                    const x = 660 - card.x - 2
                    cardRefs.current[card.id].animateTo(x, 6, 0.2);
                }
            });
        } else {
            cardsToMove.forEach((card) => {
                if (cardRefs.current[card.id]) {
                    cardRefs.current[card.id].animateTo(660, 204, 0.4);
                }
            });
        }
        setTimeout(() => {
            setDiscardPile(prev => [...prev, ...cardsToMove]);
            setRoom(prev => prev.filter(c => !cardsToMove.find(moved => moved.id === c.id)));
            cardsToMove.forEach(card => {
                delete cardRefs.current[card.id];
            });
        }, 450);
    };

    // Lógica de combate
    const processCardAction = useCallback((card) => {
        document.body.style.cursor = "url('/images/cursor/Cursor_2.webp') 16 16, auto"
        let validMove = false;
        // Lógica de curación
        if (card.palo === 'Corazon') {
            if (!healedRef.current) {
                setHealth(prev => Math.min(maxHealth, prev + card.valor));
                healAnimation(card.valor)
                healedRef.current = true
            }
            moveCardToDiscard([card])
            validMove = true;
        }
        // Lógica de arma
        else if (card.palo === 'Diamante') {
            if (weapon) {
                moveCardToDiscard([weapon], true)
                setTimeout(() => {
                    setWeapon(card);
                    deleteFromRoom(card);
                }, 100);
            } else {
                deleteFromRoom(card)
                setWeapon(card);
            }
            if (slainMonsters.length > 0) {
                moveCardToDiscard([...slainMonsters], true)
                setTimeout(() => {
                    setSlainMonsters([]);
                }, 200);
            }
            validMove = true;
        }
        // Lógica de combate
        else if (card.palo === 'Pica' || card.palo === 'Trebol') {
            if (weapon && (slainMonsters.length === 0 || card.valor < (slainMonsters[slainMonsters.length - 1]?.valor || 99))) {
                // Ataque con arma
                const damage = Math.max(0, card.valor - weapon.valor);
                damageAnimation(damage)
                const earnerGold = gold + 5;
                coinAnimation(5)
                setGold(earnerGold);
                setHealth(prev => Math.max(0, prev - damage));
                setSlainMonsters([...slainMonsters, card]);
                deleteFromRoom(card)
                validMove = true;
            } else {
                // Ataque sin arma
                moveCardToDiscard([card])
                damageAnimation(card.valor, true)
                setHealth(prev => Math.max(0, prev - card.valor));
                validMove = true;
            }
        }
        if (validMove) {
            if (character?.habilidad_personaje?.id === 1) {
                setAvailableAbilitie(false)
            }
            canScape.current = false
        }
    }, [health, gold, weapon, discardPile])
    const handleDragEnd = (card, finalX, finalY) => {
        const isOverZone =
            finalX > WEAPON_ZONE.x && finalX < WEAPON_ZONE.x + WEAPON_ZONE.width &&
            finalY > WEAPON_ZONE.y && finalY < WEAPON_ZONE.y + WEAPON_ZONE.height;
        if (isOverZone) {
            processCardAction(card);
            return true;
        }
        return false;
    };

    if (!character) {
        return (
            <Fragment>
                <div>
                    <SelectCharacter availableCharacters={availableCharacters} />
                </div>
            </Fragment>
        )
    }
    if (selectModifier) {
        return (
            <Fragment>
                <div>
                    <SelectModifier setSelectModifier={setSelectModifier} />
                </div>
            </Fragment>
        )
    }
    if (modifiersLoading) {
        return (
            <Fragment>
                <Loading />
            </Fragment>
        )
    }
    return (
        <Fragment>
            <div className="game">
                <div className="game-container">
                    {/* INTERFAZ IZQUIERDA */}
                    <div className="game-hud">
                        <div>
                            <h1 className="player-health"><img src={healthIcon} />{health}{healthAnimation !== null ? <div className="animation-container"><strong className="animation" disabled={healthAnimation}>{healthAnimationValue}</strong><img className="animation" disabled={healthAnimation} src={healthAnimation} /></div> : <></>}</h1>
                            <h1 className="player-gold"><img src={GoldIcon} />{gold}{goldAnimation !== null ? <div className="animation-container"><strong className="animation" disabled={goldAnimation}>{goldAnimationValue}</strong><img className="animation" disabled={goldAnimation} src={goldAnimation} /></div> : <></>}</h1>
                            <h1>RONDAS: {rounds}</h1>
                            <h2 ref={formatedTimeRef}>Tiempo: 00:00</h2>
                            <p>{dungeon.length} encuentros restantes</p>
                        </div>
                        <div className="game-character">
                            <img className="character-avatar" style={{ borderColor: user.color }} src={character?.imagen} alt={character?.nombre} />
                            <img className={availableAbilitie ? "character-abilitie available" : "character-abilitie"} src={character?.habilidad_personaje?.icono} style={null} />
                        </div>
                        <div className="game-modifiers">
                            {
                                modifiers.map((modifierInfo) => (
                                    <Modifier modifierInfo={modifierInfo} />
                                ))
                            }
                        </div>
                        <div className="game-buttons">
                            <button disabled={!canScape.current || !gameOn} onClick={() => {
                                scape()
                            }}>HUIR</button>
                            <button disabled={!availableAbilitie || !gameOn} onClick={() => {
                                handleUseAbilitie(character.habilidad_personaje.id)
                            }}>HABILIDAD</button>
                        </div>
                    </div>

                    {/* VENTANA DE JUEVO */}
                    <Stage className="game-window" width={stageSize.width * (0.5)} height={stageSize.height / 2} scaleX={scale} scaleY={scale} imageSmoothingEnabled={false}>
                        <Layer ref={layerRef}>
                            {/* ZONA DEL MAZO */}
                            <Group x={DUNGEON_ZONE.x} y={DUNGEON_ZONE.y}>
                                <Rect width={DUNGEON_ZONE.width} height={DUNGEON_ZONE.height} fill="#0000006c" stroke="white" strokeWidth={2} cornerRadius={8} />
                                <Text text="DUNGEON" rotation={55} fontFamily="Romulus" fontSize={30} fill="white" y={WEAPON_ZONE.height * 0.075} x={WEAPON_ZONE.width * 0.1} />
                                {dungeon.map((card, i) => (
                                    <Card
                                        ref={el => cardRefs.current[card.id] = el}
                                        key={card.id + 2}
                                        cardInfo={card}
                                        x={7.5}
                                        y={5}
                                        onDragEnd={() => { }}
                                        onClick={() => { }}
                                        isDraggable={false}
                                        isWizard={isWizard}
                                        onDeck={true}
                                    />
                                ))}
                            </Group>



                            {/* PILA DE DESCARTES */}
                            <Group x={DISCARD_ZONE.x} y={DISCARD_ZONE.y}>
                                <Rect width={DISCARD_ZONE.width} height={DISCARD_ZONE.height} fill="#9c4747c9" stroke="white" strokeWidth={2} cornerRadius={8} />
                                <Text text="DESCARTES" rotation={55} fontFamily="Romulus" fontSize={30} fill="white" y={WEAPON_ZONE.height * 0.05} x={WEAPON_ZONE.width * 0.08} />
                                {discardPile.map((card, i) => (
                                    <Card
                                        ref={el => cardRefs.current[card.id] = el}
                                        key={card.id + 4}
                                        cardInfo={card}
                                        x={5}
                                        y={5}
                                        onDragEnd={() => { }}
                                        onClick={() => { }}
                                        isDraggable={false}
                                    />
                                ))}
                            </Group>

                            {/* ZONA DE EQUIPO */}
                            <Group x={WEAPON_ZONE.x} y={WEAPON_ZONE.y}>
                                <Rect width={WEAPON_ZONE.width} height={WEAPON_ZONE.height} fill="#6a9c476e" stroke="white" strokeWidth={2} cornerRadius={8} />
                                <Text text="ZONA DE EQUIPO" fontFamily="Romulus" fontSize={40} fill="white" y={WEAPON_ZONE.height * 0.4} x={WEAPON_ZONE.width * 0.12} />
                                {weapon && <Card
                                    ref={el => cardRefs.current[weapon.id] = el}
                                    key={weapon.id + 3}
                                    cardInfo={weapon}
                                    x={10}
                                    y={10}
                                    onDragEnd={() => { }}
                                    onClick={() => { }}
                                    isDraggable={false}
                                />}
                                {slainMonsters.map((card, i) => (
                                    <Card
                                        ref={el => cardRefs.current[card.id] = el}
                                        key={card.id + 3}
                                        cardInfo={card}
                                        x={150 + (i * 20)}
                                        y={10 + (i * 10)}
                                        onDragEnd={() => { }}
                                        onClick={() => { }}
                                        isDraggable={false}
                                    />
                                ))}
                            </Group>


                            {/* CARTAS EN JUEGO */}
                            {room.map((card, index) => (
                                <Card
                                    ref={el => cardRefs.current[card.id] = el}
                                    key={card.id + 5}
                                    cardInfo={card}
                                    x={card.x + (index * 140)}
                                    y={card.y + 10}
                                    onDragEnd={handleDragEnd}
                                    onClick={gameOn ? processCardAction : () => { }}
                                    isDraggable={gameOn}
                                />
                            ))}
                        </Layer>
                    </Stage>
                </div>
            </div>
        </Fragment>
    );
};

export default GamePage;