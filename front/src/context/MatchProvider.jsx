import React, { createContext, Fragment, useState, useEffect, use } from "react";
import lodash from 'lodash';

import Card from "../components/Card.jsx";

import { useCard } from "../hooks/useCard.js";
import { useCharacters } from "../hooks/useCharacter.js";
import { useModifier } from "../hooks/useModifier.js";
import { useMatch } from "../hooks/useMatch.js";
import { useUser } from "../hooks/useUser.js";
import { useAchievements } from "../hooks/useAchievements.js";



const matchContext = createContext();

const MatchProvider = (props) => {
    const { cards, isLoading: isLoadingCard, error: cardError, getCard } = useCard();
    const { newAchievement } = useAchievements();
    const { getCharacterById, characters, isLoading: isLoadingCharacter } = useCharacters();
    const { modifiers, getModificadorById, isLoading: isLoadingModifier, error: modifierError } = useModifier();

    const [gameLoading, setGameLoading] = useState(true);


    const [actualMatchId, setActualMatchId] = useState(null);

    const { saveMatch, updateMatch } = useMatch()

    const [baseDeck, setBaseDeck] = useState([]);
    const [matchDeck, setMatchDeck] = useState([]);
    const [character, setCharacter] = useState(undefined);
    const [availableCharacters, setAvailableCharacters] = useState([])
    const [availableModifiers, setAvailableModifiers] = useState([])
    const [activeModifiers, setActiveModifiers] = useState([]);


    const load = () => {
        const modifiersList = modifiers.map(item => ({
            ...item,
            efectos: typeof item.efectos === 'string' ? JSON.parse(item.efectos) : item.efectos
        }));
        const tempCards = cards
            .filter((card) => {
                const isForbiddenDiamond = card.palo === 'Diamante' && card.valor > 10;
                const isForbiddenHeart = card.palo === 'Corazon' && card.valor > 10;
                return !isForbiddenDiamond && !isForbiddenHeart;
            })
            .map((card) => ({
                ...card,
                x: 200,
                y: 0,
                key: crypto.randomUUID() // Cada carta tiene su propia identidad
            }));

        setBaseDeck(tempCards);
        setAvailableCharacters(characters);
        setAvailableModifiers(modifiersList);
        setGameLoading(false);
    };
    const startNewGame = () => {
        setGameLoading(true);
        const shuffledDeck = lodash.shuffle(baseDeck).map(card => ({
            ...card,
            key: crypto.randomUUID()
        }));

        setMatchDeck(shuffledDeck);
        setCharacter(undefined);
        setActiveModifiers([]);
        setActualMatchId(null);
        setGameLoading(false);
    };

    const loadAchievements = async (victoria) => {
        if (victoria) {
            await newAchievement({ logro_id: 3 });
            switch (character.id) {
                case 1:
                    await newAchievement({ logro_id: 8 });
                    break;
                case 2:
                    await newAchievement({ logro_id: 7 });
                    break;
                case 3:
                    await newAchievement({ logro_id: 6 });
                    break;
                case 4:
                    await newAchievement({ logro_id: 5 });
                    break;
                case 5:
                    await newAchievement({ logro_id: 4 });
                    break;
            }
        } else {
            await newAchievement({ logro_id: 2 });
        }
        await newAchievement({ logro_id: 1 });
    }
    const endGame = async (user_id, tiempo, victoria, rondas, earnedGold, healedLife, enemysDefeated) => {
        if (character && activeModifiers.length > 0) {
            const gameModifiers = activeModifiers.map((modifier) => modifier.id);
            const payload = {
                usuario_id: user_id,
                personaje_id: character.id,
                tiempo: tiempo,
                victoria: victoria,
                rondas: rondas,
                modificadores: gameModifiers,
                oro_obtenido: earnedGold,
                vida_curada: healedLife,
                enemigos_enfrentados: enemysDefeated
            };
            const savedMatch = await saveMatch({ form: payload });
            setActualMatchId(savedMatch.id);
            loadAchievements(victoria);
            return true
        }
    }

    const updateActualGame = async (user_id, tiempo, victoria, rondas, earnedGold, healedLife, enemysDefeated) => {
        if (character) {
            const gameModifiers = activeModifiers.map((modifier) => modifier.id);
            const payload = {
                usuario_id: user_id,
                personaje_id: character.id,
                tiempo,
                victoria,
                rondas,
                modificadores: gameModifiers,
                oro_obtenido: earnedGold,
                vida_curada: healedLife,
                enemigos_enfrentados: enemysDefeated
            };

            try {
                const savedMatch = await updateMatch({ matchId: actualMatchId, form: payload });
                setActualMatchId(savedMatch.id);
                return true;
            } catch (err) {
                console.error("Error al actualizar partida:", err);
                return false;
            }
        }
    };


    const shuffleMatchDeck = () => {
        setMatchDeck(lodash.shuffle(matchDeck))
    }

    const setNewDeck = () => {
        setMatchDeck(baseDeck);
    }

    const addCardToMatchDeck = (card) => {
        if (card) {
            const newCard = {
                ...card,
                efectos: typeof card.efectos === 'string' ? JSON.parse(card.efectos) : card.efectos,
                x: 200,
                y: 0,
                key: crypto.randomUUID()
            };
            setMatchDeck(prevDeck => [...prevDeck, newCard]);
        }
    };

    const negativeCardEffectList = [
        { 'name': 'poison', 'value': 3 },
        { 'name': 'antiheal', 'value': 1 },
        { 'name': 'weapon_breaker', 'value': true },
        { 'name': 'thorny', 'value': true },
        { 'name': 'plunder', 'value': true },
        { 'name': 'extra', 'value': true },
        {'name': 'mitosis', 'value': true},
    ]

    const addRandomEnemysToMatchDeck = (quantity, round) => {
        const minPower = Math.min(9, Math.max(2, round));
        const maxPower = Math.min(round + 5, 14);

        const candidates = cards.filter(({ palo, valor }) =>
            (palo === "Trebol" || palo === "Pica") &&
            valor >= minPower &&
            valor <= maxPower
        );

        const shuffled = lodash.shuffle(candidates);
        const selectedEnemys = shuffled.slice(0, quantity);
        const effectProbability = Math.min(5 + (round - 1) * 5, 60);

        const newEnemys = selectedEnemys.map((card) => {
            const roll = Math.random() * 100;
            let appliedEffect = null;
            if (roll < effectProbability) {
                const randomEffectIndex = Math.floor(Math.random() * negativeCardEffectList.length);
                appliedEffect = { ...negativeCardEffectList[randomEffectIndex] };
            }
            return {
                ...card,
                x: 200,
                y: 0,
                key: crypto.randomUUID(),
                especial: appliedEffect !== null ? true : false,
                efectos: appliedEffect
            };
        });

        setMatchDeck(prevDeck => [...prevDeck, ...newEnemys]);
        return newEnemys;
    };

    const addEnemyToMatchDeck = (power, round) => {
        const candidates = cards.filter(({ palo, valor }) =>
            (palo === "Trebol" || palo === "Pica") && valor === power
        );
        if (candidates.length === 0) {
            return null;
        }
        const targetCard = candidates[0];
        const effectProbability = Math.min(5 + (round - 1) * 5, 60);
        const roll = Math.random() * 100;
        let appliedEffect = null;

        if (roll < effectProbability) {
            const randomEffectIndex = Math.floor(Math.random() * negativeCardEffectList.length);
            // Clonamos profundamente el efecto de la lista base
            appliedEffect = structuredClone(negativeCardEffectList[randomEffectIndex]);
        }
        const newEnemy = {
            ...targetCard,
            x: 200,
            y: 0,
            key: crypto.randomUUID(),
            especial: appliedEffect !== null,
            efectos: appliedEffect
        };
        setMatchDeck(prevDeck => [...prevDeck, newEnemy]);

        return newEnemy;
    };

    const addModifierToMatch = (modifier) => {
        setActiveModifiers([...activeModifiers, modifier])
    }

    const setNewCharacter = (newCharacter) => {
        setCharacter(newCharacter);
    }

    const getRandomsModifier = (quantity = 3, round = 1) => {
        const activeIds = new Set(activeModifiers.map(mod => mod.id));
        let pool = availableModifiers.filter(mod => !activeIds.has(mod.id) && mod.nivel > 0);

        const getTargetLevel = (isGuaranteed) => {
            if (isGuaranteed) return 3;

            const roll = Math.random() * 100;

            // CÁLCULO DE PROBABILIDADES
            // Nivel 3: Empieza en 5% y sube 2.5% por ronda (Cap en 25%)
            const probLvl3 = Math.min(5 + (round - 1) * 2.5, 25);

            // Nivel 2: Empieza en 10% y sube 5% por ronda (Cap en 40%)
            const probLvl2 = Math.min(10 + (round - 1) * 5, 40);

            if (roll < probLvl3) return 3;
            if (roll < probLvl3 + probLvl2) return 2;
            return 1;
        };

        const selectedModifiers = [];

        for (let i = 0; i < quantity; i++) {
            // REGLA DE ORO: En ronda 5, el primer slot es nivel 3 sí o sí
            const forceLevel3 = (round === 5 && i === 0);
            let targetLevel = getTargetLevel(forceLevel3);

            let options = pool.filter(mod => mod.nivel === targetLevel);

            // Fallback: Si no hay del nivel pedido, busca el más cercano por debajo
            if (options.length === 0) {
                options = pool.filter(mod => mod.nivel < targetLevel).sort((a, b) => b.nivel - a.nivel);
            }

            if (options.length > 0) {
                const randomIndex = Math.floor(Math.random() * options.length);
                const chosen = options[randomIndex];
                selectedModifiers.push(chosen);
                pool = pool.filter(mod => mod.id !== chosen.id);
            }
        }

        return selectedModifiers;
    };

    const getWeapon = (power) => {
        const card = cards.find((c) => c.palo === "Diamante" && c.valor === power);
        if (card) {
            return {
                ...card,
                x: 200,
                y: 0,
                efectos: typeof card.efectos === 'string' ? JSON.parse(card.efectos) : card.efectos,
                // Añadir aquí el crypto hace que NUNCA se repita (otra vez no porfa)
                key: crypto.randomUUID()
            };
        }
    };

    const getHealItem = (power) => {
        const card = cards.find((c) => c.palo === "Corazon" && c.valor === power);
        if (card) {
            return {
                ...card,
                x: 200,
                y: 0,
                efectos: typeof card.efectos === 'string' ? JSON.parse(card.efectos) : card.efectos,
                key: crypto.randomUUID()
            };
        }
    };

    const getTutorialCards = (tutorialNumber = 1) => {
        const tempDeck = [...baseDeck]
        switch (tutorialNumber) {
            case 1:
                const cardstutorialOne = [tempDeck[0], tempDeck[14], tempDeck[28], tempDeck[42]]
                return cardstutorialOne;
                break;
            case 7:
                const cardstutorialSeven = [tempDeck[5], tempDeck[26],tempDeck[28], tempDeck[41]]
                return cardstutorialSeven;
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        if (!isLoadingCard && !isLoadingCharacter && !isLoadingModifier) {
            load();
        }
    }, [isLoadingCard, isLoadingCharacter, isLoadingModifier])

    const exports = {
        gameLoading,
        matchDeck,
        character,
        activeModifiers,
        availableCharacters,
        isLoadingCharacter,
        setNewDeck,
        addCardToMatchDeck,
        startNewGame,
        setNewCharacter,
        getRandomsModifier,
        endGame,
        addModifierToMatch,
        getWeapon,
        setCharacter,
        setActiveModifiers,
        setGameLoading,
        addEnemysToMatchDeck: addRandomEnemysToMatchDeck,
        getHealItem,
        updateActualGame,
        getTutorialCards
    };


    return (
        <Fragment>
            <matchContext.Provider value={exports}>
                {props.children}
            </matchContext.Provider>
        </Fragment>
    );
}
export default MatchProvider;
export { matchContext };