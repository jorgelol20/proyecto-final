import React, { act, Fragment, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Stage, Layer, Text, Group, Rect, Image } from 'react-konva';
// Importaciones de imágenes (mantenidas igual)
import ClubIcon from '/images/suit_club.webp'
import HeartIcon from '/images/suit_heart.webp'
import DiamonIcon from '/images/suit_diamond.webp'
import SpadeIcon from '/images/suit_spade.webp'
import DefaultCardImage from '/images/default_card.webp'


import lodash, { fill, forEach, invert, round, toInteger } from 'lodash';

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
import { settingsContext } from "../../context/SettingsProvider.jsx";
import GameShop from "../GameShop.jsx";
import useImage from "use-image";



const GamePage = () => {
    const navigate = useNavigate();
    const { startButtonSound, showLogs } = useContext(settingsContext)
    const { matchDeck, character, activeModifiers: modifiers, setNewDeck, setNewCharacter, startNewGame, addCardToMatchDeck, gameLoading, availableCharacters, getWeapon, endGame, updateActualGame, setCharacter, setActiveModifiers, setGameLoading, addEnemysToMatchDeck, addModifierToMatch } = useContext(matchContext);
    const { user, isLoading } = useUser();
    useEffect(() => {
        restartFunction();
        setShopAvailable(false)
        startNewGame();
    }, []);

    // Imagen por defecto
    const [defaultImage] = useImage(DefaultCardImage);


    //Estados que almacenan si el juego ha empezado y si el juego está en GameOver
    const [gameOn, setGameOn] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [gameWin, setGameWin] = useState(false);
    const [restart, setRestart] = useState(false);

    const totalEarnedGold = useRef(0);
    const healedLife = useRef(0);
    const enemysDefeated = useRef(0)


    const logsRef = useRef([]);

    const continueFunction = () => {
        setGameOn(true)
        setGameWin(false)
        startNewRound(true)
    }

    const restartFunction = () => {
        // Reset de estadísticas de partida
        setRounds(0);
        setGold(0);
        setHealth(20);
        setMaxHealth(20)
        setAvailableAbility(true);
        setShopAvailable(false)
        actualStreak.current = 0;
        canScape.current = true;
        healedLife.current = 0;
        totalEarnedGold.current = 0;
        enemysDefeated.current = 0;

        // Limpieza de cartas y mazo
        setDungeon([]);
        setRoom([]);
        setDiscardPile([]);
        setWeapon(null);
        setSlainMonsters([]);

        // Reiniciar contexto
        setNewDeck();
        setNewCharacter(null);
        setGameLoading(false)
        setRestart(false)
        startNewGame();

        // Sonido y UI básica
        startButtonSound(event);
        setGameOver(false);
        setGameOn(false);
        setGameWin(false)
        logsRef.current = [];






        // Reset del Timer
        stopTimer();
        timeRef.current = 0;
        if (formatedTimeRef.current) {
            formatedTimeRef.current.textContent = `Tiempo: 00:00`;
        }
        // Reiniciar modificadores
        cleanModifiers()

        // Reiniciar efectos cartas
        cleanHealEffects()
        cleanWeaponEffects()

    }

    useEffect(() => {
        if (restart) {
            restartFunction()
        }
    }, [restart])

    useEffect(() => {
        if (character) {
            setGameOn(true);
        }
    }, [character]);

    // State de número de ronda
    const [rounds, setRounds] = useState(0);
    const [maxRounds, setMaxRounds] = useState(10)

    //State de tiempo
    const formatedTimeRef = useRef(null)
    const timeRef = useRef(0);
    const intervalRef = useRef(null);
    useEffect(() => {
        if (gameOn) {
            stopTimer();

            intervalRef.current = setInterval(() => {
                timeRef.current += 1;
                const mins = Math.floor(timeRef.current / 60);
                const secs = timeRef.current % 60;
                if (formatedTimeRef.current) {
                    formatedTimeRef.current.textContent = `Tiempo: ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
                }
            }, 1000);
        } else if (user !== undefined) {
            stopTimer();
            if (gameWin) {
                updateActualGame(user.id, timeRef.current, gameWin, rounds, totalEarnedGold.current, healedLife.current, enemysDefeated.current)
            } else {
                endGame(user.id, timeRef.current, gameWin, rounds, totalEarnedGold.current, healedLife.current, enemysDefeated.current)
            }
        }

        return () => stopTimer();
    }, [gameOn]);

    const stopTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };


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
            setGameOver(true)
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

    const [shopAvailable, setShopAvailable] = useState(false);

    useEffect(() => {
        if (!shopAvailable) {
            setRoom([])
            shuffleDeck(matchDeck)
        }
    }, [shopAvailable])


    /**
     * ===================================
     *  CARTAS Y ZONAS (Elementos Konva)
     * ===================================
     */
    // Zona principal de Konva
    const layerRef = useRef(null);

    // La carta puede ser clicada
    const [canBeClicked, setCanBeClicked] = useState(true);

    useEffect(() => {
        if (canBeClicked == false) {
            setTimeout(() => {
                setCanBeClicked(true)
            }, 500)
        }
    }, [canBeClicked])


    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const vertical = windowHeight > windowWidth ? true : false

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
    const [overDungeonZone, setOverDungeonZone] = useState(false)

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
            if (user && character && modifiers.length > 0) {
                // user_id, tiempo, victoria, rondas, earnedGold, healedLife, enemysDefeated
                endGame(user.id, timeRef.current, gameWin, rounds, totalEarnedGold.current, healedLife.current, enemysDefeated.current)
            }
            restartFunction()
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
    }, [matchDeck, dungeon, room]);


    /**
     * ===================================
     *            PERSONAJES
     * ===================================
     */
    // Parámetros de personaje
    const [isWizard, setIsWizard] = useState(false);
    const isScapingRef = useRef(false);
    const canScape = useRef(true)
    const [availableAbility, setAvailableAbility] = useState(true)

    // Habilidad del guerrero
    const warrior = () => {
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
        actualScapes.current - 1 > 0 ?
            actualScapes.current -= 1 :
            canScape.current = false;
        canScape.current ? setAvailableAbility(true) : setAvailableAbility(false)
    }

    // Habilidad del elfo
    const elf = () => {
        let actualRoom = [...room];
        let newCards = [];

        if (actualRoom.length <= 2) {
            newCards = actualRoom.map((card) => {
                return {
                    ...card,
                    valor: Math.max(0, card.valor - 5)
                };
            });
        } else {
            newCards = actualRoom.map((card, index) => {
                if (index == actualRoom.length - 1 || index == actualRoom.length - 2) {
                    return {
                        ...card,
                        valor: Math.max(0, card.valor - 5)
                    };
                }
                return card;
            });
        }

        setRoom(newCards);
    }

    // Función para usar la habilidad
    const handleUseAbility = (id) => {
        if (availableAbility) {
            switch (id) {
                case 1: // Guerrero
                    warrior()
                    break
                case 2: // Paladín (1 vez por ronda)
                    setHealth(prev => Math.min(maxHealth, prev + 5));
                    healedLife.current += 5;
                    healAnimation(5)
                    setAvailableAbility(false)
                    break
                case 3: // Elfo
                    elf()
                    setAvailableAbility(false)
                    break
                case 4: // Mago (1 vez por ronda)
                    shuffleDeck(dungeon)
                    setAvailableAbility(false)
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

    // Daño enemigos
    const enemyDmgMultiplier = useRef(1);
    const enemyExtraDmg = useRef(0)
    const spadesExtraTakedDmg = useRef(0);
    const clubsExtraTakedDmg = useRef(0);

    // Robo de vida
    const healthSteal = useRef(false);

    // Pentakill
    const pentakillTargetNumber = useRef(0);
    const pentakillDmg = useRef(0);
    const actualStreak = useRef(0);

    // Escape
    const [maxScapes, setMaxScapes] = useState(1)
    const actualScapes = useRef(maxScapes);

    // Ricochet
    const ricochet = useRef(false)



    useEffect(() => {
        if (modifiers.length > 0) {
            setModifiersLoading(true)
            handleModifierEvent()
        }
    }, [modifiers])



    const setModifierWeapon = async (power) => {
        const newWeapon = getWeapon(power)
        processCardAction(newWeapon)
        canScape.current = true

    }

    const applyEffect = (effect) => {
        switch (effect.name) {
            case "chest_rewards":
                const weaponValue = lodash.shuffle(effect.value)[0];
                setModifierWeapon(weaponValue);
                break;
            case "pentakill_target_number":
                // Lógica para registrar cuántas muertes se necesitan (ej: 3)
                pentakillTargetNumber.current = pentakillTargetNumber.current < effect.value ?
                    effect.value
                    : pentakillTargetNumber.current
                break;

            case "pentakill_dmg":
                // Lógica para aplicar el daño extra
                pentakillDmg.current = pentakillDmg.current < effect.value ?
                    effect.value
                    : pentakillDmg.current
                break;

            case "health_steal":
                // Lógica para el drenaje
                healthSteal.current = true;
                break;
            case "user_clubs_dmg":
                clubsExtraTakedDmg.current = effect.value
                break;
            case "user_spades_dmg":
                spadesExtraTakedDmg.current = effect.value
                break;
            case "enemy_dmg_multiplier":
                enemyDmgMultiplier.current = enemyDmgMultiplier.current * effect.value
                break;
            case "enemy_extra_dmg":
                enemyExtraDmg.current = enemyExtraDmg.current + effect.value
                break
            case "max_scapes":
                setMaxScapes(effect.value)
                actualScapes.current = effect.value
                break;
            case "max_hp":
                setMaxHealth(maxHealth + effect.value)
                setHealth(health + effect.value)
                break;
            case "ricochet":
                ricochet.current = true;
                break;
            default:
                return false;
        }
        return true;
    }

    const cleanModifiers = () => {
        pentakillTargetNumber.current = 0;
        pentakillDmg.current = 0;
        actualStreak.current = 0;
        actualScapes.current = 1;
        healthSteal.current = false;
        ricochet.current = false
        enemyDmgMultiplier.current = (1);
        enemyExtraDmg.current = (0)
        spadesExtraTakedDmg.current = (0);
        clubsExtraTakedDmg.current = (0);
        ricochet.current = false;
        totalCardsUsed.current = 0
        setMaxScapes(1)
    }

    const handleModifierEvent = () => {
        const modifier = modifiers[modifiers.length - 1]
        const modifierEffects = modifier.efectos[0]
        const effectsList = Array.isArray(modifierEffects) ? modifierEffects : [modifierEffects];
        effectsList.forEach((effect) => {
            applyEffect(effect)
        });
        setModifiersLoading(false)
    }

    /**
     * ===================================
     *         RELLENAR    MANO
     * ===================================
     */
    // Función para rellenar las cartas activas
    const totalCardsUsed = useRef(0)

    const fillRoom = useCallback(() => {
        // 1. Calculamos cuántas cartas necesitamos basándonos en el estado actual de la habitación
        const roomSize = room.length;
        const cardsNeeded = 4 - roomSize;

        if (cardsNeeded <= 0 || dungeon.length === 0) return;

        // 2. Identificamos qué cartas vamos a mover (las últimas del mazo)
        const actualToDraw = Math.min(cardsNeeded, dungeon.length);
        const newCards = dungeon.slice(-actualToDraw).reverse();

        // 3. Actualizamos el Dungeon: quitamos esas cartas
        setDungeon(prevDungeon => prevDungeon.slice(0, prevDungeon.length - actualToDraw));

        // 4. Actualizamos la Room: añadimos las cartas asegurando que no haya duplicados por ID
        setRoom(prevRoom => {
            const uniqueNewCards = newCards.filter(
                newCard => !prevRoom.some(existingCard => existingCard.key === newCard.key)
            );
            return [...prevRoom, ...uniqueNewCards];
        });
    }, [room.length, dungeon]); // Ahora depende de dungeon para tener los datos frescos

    const isDrawingRef = useRef(false); // Nueva referencia al inicio del componente

    useEffect(() => {
        // Si no hay cartas o ya estamos robando, cancelamos
        if (dungeon.length === 0 || isDrawingRef.current) return;

        if (room.length <= 1) {
            isDrawingRef.current = true; // Bloqueamos

            fillRoom();

            if (!isScapingRef.current) {
                if (character?.habilidad_personaje?.id === 1) {
                    setAvailableAbility(true);
                }
                healedRef.current = false;
                actualScapes.current = maxScapes;
                canScape.current = true;
            }

            isScapingRef.current = false;

            // Liberamos el bloqueo después de un pequeño delay para que React procese los estados
            setTimeout(() => {
                isDrawingRef.current = false;
            }, 100);
        }
    }, [room.length, dungeon.length]);

    const addEnemy = async (value, randomModifier = false) => {

    }
    const addEnemys = async (quantity) => {
        await addEnemysToMatchDeck(quantity, rounds)
    }

    const shuffleDeck = (deck) => {
        const shuffled = lodash.shuffle(deck).map((card) => ({
            ...card,              
            key: crypto.randomUUID()
        }));

        setDungeon(shuffled);
    };
    const startNewRound = async (continueMatch = false) => {
        if (rounds !== 10 || continueMatch) {
            setSelectModifier(true)
            if (rounds >= 1 && gameOn) {
                setShopAvailable(true)
                await addEnemys(5)

            } else {
                setShopAvailable(false)
            }
            if (gameOn || rounds == 0) {
                setRounds(rounds + 1)
            }
            shuffleDeck(matchDeck);
            setDiscardPile([]);
            setAvailableAbility(true)
        } else if (rounds === 10) {
            setGameOn(false)
            setGameWin(true)
        }
        cardRefs.current = []
    }

    const scape = () => {
        if (canScape.current) {
            isScapingRef.current = true;
            setDungeon(prev => [...room, ...prev]);
            setRoom([]);
            if (actualScapes.current - 1 > 0) {
                actualScapes.current -= 1;
            } else {
                canScape.current = false;
            }

            if (character?.habilidad_personaje?.id === 1 && !canScape.current) {
                setAvailableAbilitie(false);
            }
        }
    };



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
        setRoom(prev => prev.filter(c => c.key !== card.key));
    }

    // Función para ejecutar la animación para mover a descartes
    const moveCardToDiscard = (cardsToMove, moved = false) => {
        if (moved) {
            cardsToMove.forEach((card) => {
                if (cardRefs.current[card.key]) {
                    const x = 660 - card.x - 2
                    cardRefs.current[card.key].animateTo(x, 6, 0.2);
                }
            });
        } else {
            cardsToMove.forEach((card) => {
                if (cardRefs.current[card.key]) {
                    cardRefs.current[card.key].animateTo(660, 204, 0.4);
                }
            });
        }
        setTimeout(() => {
            setDiscardPile(prev => [...prev, ...cardsToMove]);
            setRoom(prev => prev.filter(c => !cardsToMove.find(moved => moved.key === c.key)));
            cardsToMove.forEach(card => {
                delete cardRefs.current[card.key];
            });
        }, 450);
    };

    // EFECTOS CARTAS
    // Efectos vida
    const currentHeal = useRef(0);
    const progresive_heal = useRef(0);
    const progresive_heal_turns = useRef(0);
    const dmg_reduction = useRef(0);

    const heal_roulete = (execute = false) => {
        if (execute) {
            if (Math.floor(Math.random() * 100) > 75) {
                currentHeal.current = -100
            } else {
                currentHeal.current = 100
            }
        }
    }

    const cleanHealEffects = () => {
        currentHeal.current = 0;
        progresive_heal.current = 0;
        progresive_heal_turns.current = 0;
        dmg_reduction.current = 0;
    }
    // Efectos armas

    const weapon_dmg = useRef(0)
    const invincibility_turns = useRef(0);

    const revive = useRef(false);
    const revive_health = useRef(0)

    const weapon_health_steal = useRef(false)
    const weapon_health_steal_quantity = useRef(0)

    const cleanWeaponEffects = () => {
        weapon_dmg.current = 0
        invincibility_turns.current = 0
        revive.current = false
        revive_health.current = 0
        weapon_health_steal.current = false
        weapon_health_steal_quantity.current = 0
    }



    const applyCardEffect = (effect) => {
        switch (effect.name) {
            case 'restore_ability':
                setAvailableAbility(true)
                break
            case 'heal':
                currentHeal.current = effect.value;
                break;
            case 'dmg_reduction':
                dmg_reduction.current = effect.value
                break;
            case 'heal_roulete':
                heal_roulete(true)
                break;
            case 'progresive_heal':
                progresive_heal.current = effect.value
                break;
            case 'progresive_heal_turns':
                progresive_heal_turns.current = effect.value
            case 'weapon_dmg':
                weapon_dmg.current = effect.value
            case 'invincibility_turns':
                invincibility_turns.current = effect.value
            case 'revive':
                revive.current = true;
                break;
            case 'revive_health':
                revive_health.current = effect.value
                break;
            case 'health_steal':
                weapon_health_steal.current = true;
                weapon_health_steal_quantity.current = effect.value
                break;
            default:
                return false;
        }
        return true;
    }

    const handleCardEffect = (card) => {
        const cardEffects = card.efectos[0]
        const effectsList = Array.isArray(cardEffects) ? cardEffects : [cardEffects];
        effectsList.forEach((effect) => {
            applyCardEffect(effect)
        });
    }


    const handleHeal = (card) => {
        currentHeal.current = card.valor;
        if (card.especial) {
            handleCardEffect(card)
        }
        if (!healedRef.current) {
            setHealth(prev => Math.min(maxHealth, prev + currentHeal.current));
            healAnimation(currentHeal.current)
            healedLife.current += currentHeal.current;
            healedRef.current = true
            logsRef.current.push((logsRef.current.length + 1) + " - " + card.valor + " de " + card.palo + " te ha curado " + currentHeal.current + " de daño.")
        } else {
            logsRef.current.push((logsRef.current.length + 1) + " - " + card.valor + " de " + card.palo + " te no te ha curado nada.")
        }
        moveCardToDiscard([card])
        actualStreak.current = 0;
        return true;
    }

    const handleWeapon = (card) => {
        cleanWeaponEffects();
        weapon_dmg.current = card.valor
        if (card.especial) {
            handleCardEffect(card)
        }
        if (weapon) {
            moveCardToDiscard([weapon], true)
            logsRef.current.push((logsRef.current.length + 1) + " - " + "Arma de " + weapon.valor + " ha sido cambiada por arma de " + card.valor + ".")
            setTimeout(() => {
                setWeapon(card);
                deleteFromRoom(card);
            }, 100);
        } else {
            deleteFromRoom(card)
            setWeapon(card);
            logsRef.current.push((logsRef.current.length + 1) + " - " + "Nueva arma de " + card.valor + " activa.")
        }
        if (slainMonsters.length > 0) {
            moveCardToDiscard([...slainMonsters], true)
            setTimeout(() => {
                setSlainMonsters([]);
            }, 200);
        }
        actualStreak.current = 0;
        return true;
    }

    const handleCombat = (card) => {

        if (card.especial) {
            handleCardEffect(card)
        }
        let user_dmg_reduction = 0;
        if (dmg_reduction.current !== 0) {
            user_dmg_reduction = dmg_reduction.current;
            dmg_reduction.current = 0;
        }

        const enemy_dmg = Math.ceil((card.valor * enemyDmgMultiplier.current)) + enemyExtraDmg.current - user_dmg_reduction;
        const pentakill = actualStreak.current >= pentakillTargetNumber.current ? pentakillDmg.current : 0

        if (invincibility_turns.current > 0) {

            const final_user_dmg = 100
            const final_enemy_dmg = - pentakill;
            const final_dmg = Math.max(0, final_enemy_dmg - final_user_dmg);

            damageAnimation(final_dmg)
            const earnedGold = 5;
            coinAnimation(earnedGold)
            totalEarnedGold.current += earnedGold;
            setGold(prev => prev + earnedGold);

            let final_health = Math.max(0, health - final_dmg)
            if (final_health === 0 && revive.current) {
                final_health = revive_health.current;
                revive.current = false;
            }

            setHealth(final_health);

            if (healthSteal.current && card.valor < weapon_dmg.current) {
                const heal = Math.min(0, card.valor - weapon_dmg.current) > -3 ? Math.min(0, card.valor - weapon_dmg.current) * -1 : 3;
                healAnimation(heal)
                setHealth(prev => Math.min(maxHealth, prev + heal));
            }
            if (weapon_health_steal) {
                setHealth(prev => Math.min(maxHealth, prev + weapon_health_steal_quantity));
            }

            setSlainMonsters([...slainMonsters, card]);
            deleteFromRoom(card)
            actualStreak.current = actualStreak.current + 1;
            logsRef.current.push((logsRef.current.length + 1) + " - " + card.valor + " de " + card.palo + " te ha hecho " + final_dmg + " de daño.")
            invincibility_turns.current -= 1;
            return true
        }

        // ATAQUE CON ARMA
        else if (weapon && (slainMonsters.length === 0 || card.valor < (slainMonsters[slainMonsters.length - 1]?.valor || 99))) {

            const final_user_dmg = weapon_dmg.current + (card.palo == 'Pica' ? spadesExtraTakedDmg.current : clubsExtraTakedDmg.current);
            const final_enemy_dmg = enemy_dmg - pentakill;

            const final_dmg = Math.max(0, final_enemy_dmg - final_user_dmg);
            damageAnimation(final_dmg)
            const earnedGold = gold + 5;
            coinAnimation(5)
            setGold(earnedGold);
            totalEarnedGold.current += earnedGold;
            setHealth(prev => Math.max(0, prev - final_dmg));
            if (healthSteal.current && card.valor < weapon_dmg.current) {
                const heal = Math.min(0, card.valor - weapon_dmg.current) > -3 ? Math.min(0, card.valor - weapon_dmg.current) * -1 : 3;
                healAnimation(heal)
                setHealth(prev => Math.min(maxHealth, prev + heal));
            }
            setSlainMonsters([...slainMonsters, card]);
            deleteFromRoom(card)
            actualStreak.current = actualStreak.current + 1;
            logsRef.current.push((logsRef.current.length + 1) + " - " + card.valor + " de " + card.palo + " te ha hecho " + final_dmg + " de daño.")
            return true
        }
        // ATAQUE SIN ARMA
        else {
            const final_user_dmg = pentakill + (card.palo == 'Pica' ? spadesExtraTakedDmg.current : clubsExtraTakedDmg.current)
            const final_dmg = Math.max(0, enemy_dmg - final_user_dmg);
            moveCardToDiscard([card])
            damageAnimation(final_dmg, true)
            setHealth(prev => Math.max(0, prev - final_dmg));
            actualStreak.current = 0;
            logsRef.current.push((logsRef.current.length + 1) + " - " + card.valor + " de " + card.palo + " te ha hecho " + final_dmg + " de daño.")
            return true
        }
    }


    // Lógica de combate
    const processCardAction = useCallback((card) => {
        setCanBeClicked(false)
        document.body.style.cursor = "url('/images/cursor/Cursor_2.webp') 16 16, auto"
        let validMove = false;
        // Lógica de curación
        if (card.palo === 'Corazon') {
            validMove = handleHeal(card)
        }
        // Lógica de arma
        else if (card.palo === 'Diamante') {
            validMove = handleWeapon(card)
        }
        // Lógica de combate
        else if (card.palo === 'Pica' || card.palo === 'Trebol') {
            validMove = handleCombat(card)
            validMove ? enemysDefeated.current += 1 : null;
        }
        if (validMove) {
            if (character?.habilidad_personaje?.id === 1) {
                setAvailableAbility(false)
            }
            if (progresive_heal_turns.current > 0) {
                setHealth(prev => Math.min(maxHealth, prev + progresive_heal));
                healedLife.current += progresive_heal.current;
                progresive_heal_turns.current -= 1;
            }
            canScape.current = false
            totalCardsUsed.current += 1;
        } else {
            logsRef.current.push((logsRef.current.length + 1) + " - " + "Movimiento no válido.")
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


    if (!character && !gameOver) {
        return (
            <Fragment>
                <div>
                    <SelectCharacter availableCharacters={availableCharacters} />
                </div>
            </Fragment>
        )
    }
    if (selectModifier && !gameOver) {
        return (
            <Fragment>
                <div>
                    <SelectModifier rounds={rounds} setSelectModifier={setSelectModifier} />
                </div>
            </Fragment>
        )
    }
    if (modifiersLoading && !gameOver) {
        return (
            <Fragment>
                <Loading />
            </Fragment>
        )
    }
    if (shopAvailable && !gameOver) {
        return (
            <Fragment>
                <GameShop
                    gold={gold}
                    setGold={setGold}
                    setShopAvailable={setShopAvailable}
                    health={health}
                    maxHealth={maxHealth}
                    formatedTimeRef={formatedTimeRef}
                    healthIcon={healthIcon}
                    character={character}
                    round={rounds}
                />
            </Fragment>
        )
    }


    return (
        <Fragment>
            <div className="game">
                {
                    !gameOn ?
                        <div className="gameOver-menu">
                            <h1 className={gameWin ? "victory" : "lose"}>{gameWin ? "VICTORIA" : "DERROTA"}</h1>
                            {
                                gameWin ?
                                    <button onClick={() => { continueFunction() }}>
                                        CONTINUAR
                                    </button>
                                    : <></>
                            }
                            <button onClick={(event) => {
                                setRestart(true)
                            }}>
                                {gameWin ? 'JUGAR OTRA' : 'REINTENTAR'}
                            </button>
                            <button onClick={(event) => { startButtonSound(event); setRestart(true); navigate('/') }}>INICIO</button>
                            <button onClick={(event) => { startButtonSound(event); setRestart(true); navigate(`/perfil/${user ? user.nick : ''}`) }}>PERFIL</button>
                            <div className="final-match-info">
                                <p>{formatedTimeRef.current.textContent}</p>
                                <p>Rondas: {rounds}</p>
                                <p>Cartas restantes en esta ronda: {dungeon.length + room.length}</p>
                                <p>Total de cartas jugadas: {totalCardsUsed.current}</p>
                            </div>
                        </div> :
                        <></>
                }
                <div className="game-container">
                    {/* INTERFAZ IZQUIERDA */}
                    <div className="game-hud">
                        <div>
                            <h1 className="player-health"><img src={healthIcon} />{health}/{maxHealth}{healthAnimation !== null ? <div className="animation-container"><strong className="animation" disabled={healthAnimation}>{healthAnimationValue}</strong><img className="animation" disabled={healthAnimation} src={healthAnimation} /></div> : <></>}</h1>
                            <h1 className="player-gold"><img src={GoldIcon} />{gold}{goldAnimation !== null ? <div className="animation-container"><strong className="animation" disabled={goldAnimation}>{goldAnimationValue}</strong><img className="animation" disabled={goldAnimation} src={goldAnimation} /></div> : <></>}</h1>
                            {!modifiersLoading && pentakillTargetNumber.current !== 0 ? <h1>Racha <strong>{actualStreak.current}</strong>/<strong>{pentakillTargetNumber.current}</strong></h1> : <></>}
                            {gameOn && gameWin ? <h1>Sin límite</h1> : <h1>RONDA {rounds}/{maxRounds}</h1>}
                            <h2 ref={formatedTimeRef}>Tiempo: 00:00</h2>
                            <p>{dungeon.length} cartas restantes</p>
                        </div>
                        <div className="game-character">
                            <img className="character-avatar" style={{ borderColor: user.color }} src={character?.imagen} alt={character?.nombre} />
                            <img className={availableAbility ? "character-ability available" : "character-ability"} src={character?.habilidad_personaje?.icono} style={null} />
                        </div>
                        <div className="game-modifiers">
                            {
                                modifiers.map((modifierInfo) => (
                                    <Modifier key={crypto.randomUUID()} modifierInfo={modifierInfo} />
                                ))
                            }
                        </div>
                        <div className="game-buttons">
                            <button disabled={!canScape.current || !gameOn} onClick={() => {
                                scape()
                            }}>HUIR</button>
                            <button disabled={!availableAbility || !gameOn} onClick={() => {
                                handleUseAbility(character.habilidad_personaje.id)
                            }}>HABILIDAD</button>
                        </div>
                    </div>

                    {/* VENTANA DE JUEVO */}
                    <Stage className="game-window" width={stageSize.width * (0.5)} height={stageSize.height / 2} scaleX={scale} scaleY={scale} imageSmoothingEnabled={false}>
                        {/* CAPA ESTÁTICA */}
                        <Layer>
                            {/* ZONA DEL MAZO */}
                            <Group x={DUNGEON_ZONE.x} y={DUNGEON_ZONE.y}>
                                <Rect width={DUNGEON_ZONE.width} height={DUNGEON_ZONE.height} fill="#0000006c" stroke="white" strokeWidth={2} cornerRadius={8} onMouseEnter={(e) => { setOverDungeonZone(true) }} onMouseLeave={(e) => { setOverDungeonZone(false) }} />
                                <Text text="DUNGEON" rotation={55} fontFamily="Romulus" fontSize={30} fill="white" y={20} x={35} />

                                {dungeon.toReversed().slice(0, 4).toReversed().map((card, i) => (
                                    <Card
                                        key={card.key}
                                        cardInfo={card}
                                        x={7}
                                        y={isWizard ? 5 + (i * (overDungeonZone ? 100 : 0)) : 5}
                                        onDragEnd={() => { }}
                                        onClick={setOverDungeonZone}
                                        canBeClicked={canBeClicked}
                                        isDraggable={false}
                                        isWizard={isWizard}
                                        onDeck={true}
                                        setOverDungeonZone={setOverDungeonZone}
                                        cardSuit={card.palo == "Diamante" ? DiamonIcon : card.palo == "Trebol" ? ClubIcon : card.palo == "Corazon" ? HeartIcon : SpadeIcon}
                                        defaultImage={defaultImage}
                                    />
                                ))}
                            </Group>

                            {/* PILA DE DESCARTES */}
                            <Group x={DISCARD_ZONE.x} y={DISCARD_ZONE.y}>
                                <Rect width={DISCARD_ZONE.width} height={DISCARD_ZONE.height} fill="#9c4747c9" stroke="white" strokeWidth={2} cornerRadius={8} />
                                <Text text="DESCARTES" rotation={55} fontFamily="Romulus" fontSize={30} fill="white" y={WEAPON_ZONE.height * 0.05} x={WEAPON_ZONE.width * 0.08} />
                                {discardPile.toReversed().slice(0, 1).map((card, i) => (
                                    <Card
                                        key={card.key}
                                        cardInfo={card}
                                        x={5}
                                        y={5}
                                        onDragEnd={() => { }}
                                        onClick={() => { }}
                                        isDraggable={false}
                                        cardSuit={card.palo == "Diamante" ? DiamonIcon : card.palo == "Trebol" ? ClubIcon : card.palo == "Corazon" ? HeartIcon : SpadeIcon}
                                        defaultImage={defaultImage}
                                    />
                                ))}
                            </Group>

                            {/* ZONA DE EQUIPO */}
                            <Group x={WEAPON_ZONE.x} y={WEAPON_ZONE.y}>
                                <Rect width={WEAPON_ZONE.width} height={WEAPON_ZONE.height} fill="#6a9c476e" stroke="white" strokeWidth={2} cornerRadius={8} />
                                <Text text="ZONA DE EQUIPO" fontFamily="Romulus" fontSize={40} fill="white" y={WEAPON_ZONE.height * 0.4} x={WEAPON_ZONE.width * 0.12} />
                                {weapon && <Card
                                    ref={el => cardRefs.current[weapon.key] = el}
                                    key={weapon.key}
                                    cardInfo={weapon}
                                    x={10}
                                    y={10}
                                    onDragEnd={() => { }}
                                    onClick={() => { }}
                                    isDraggable={false}
                                    cardSuit={weapon.palo == "Diamante" ? DiamonIcon : weapon.palo == "Trebol" ? ClubIcon : weapon.palo == "Corazon" ? HeartIcon : SpadeIcon}
                                    defaultImage={defaultImage}
                                />}
                                {slainMonsters.map((card, i) => (
                                    <Card
                                        ref={el => cardRefs.current[card.key] = el}
                                        key={card.key}
                                        cardInfo={card}
                                        x={150 + (i * 20)}
                                        y={10 + (i * 10)}
                                        onDragEnd={() => { }}
                                        onClick={() => { }}
                                        isDraggable={false}
                                        cardSuit={card.palo == "Diamante" ? DiamonIcon : card.palo == "Trebol" ? ClubIcon : card.palo == "Corazon" ? HeartIcon : SpadeIcon}
                                        defaultImage={defaultImage}
                                    />
                                ))}
                            </Group>
                        </Layer>

                        {/* PARTES JUGABLES (No estáticas) */}
                        <Layer ref={layerRef}>
                            {room.map((card, index) => (
                                <Card
                                    ref={el => cardRefs.current[card.key] = el}
                                    key={card.key}
                                    cardInfo={card}
                                    x={card.x + (index * 140)}
                                    y={card.y + 10}
                                    onDragEnd={handleDragEnd}
                                    onClick={gameOn ? processCardAction : () => { }}
                                    canBeClicked={canBeClicked}
                                    isDraggable={gameOn}
                                    cardSuit={card.palo == "Diamante" ? DiamonIcon : card.palo == "Trebol" ? ClubIcon : card.palo == "Corazon" ? HeartIcon : SpadeIcon}
                                    defaultImage={defaultImage}
                                />
                            ))}
                        </Layer>
                    </Stage>
                    {
                        showLogs ?

                            <div className="logs-container">
                                {
                                    logsRef.current.length > 0 ?
                                        <div className="logs">
                                            <pre>{logsRef.current.toReversed().join('\n\n')}</pre>
                                        </div>
                                        : <h1 style={{ color: "white" }}>SIN LOGS</h1>
                                }
                            </div>
                            : <></>
                    }
                </div>
            </div>
        </Fragment>
    );
};

export default GamePage;