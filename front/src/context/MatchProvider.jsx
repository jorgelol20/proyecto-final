import React, { createContext, Fragment, useState, useEffect, use } from "react";
import lodash from 'lodash';

import Card from "../components/Card.jsx";

import { useCard } from "../hooks/useCard.js";
import { useCharacters } from "../hooks/useCharacter.js";
import { useModifier } from "../hooks/useModifier.js";
import { useMatch } from "../hooks/useMatch.js";



const matchContext = createContext();

const MatchProvider = (props) => {
    const { cards, isLoading: isLoadingCard, error: cardError, getCard } = useCard();
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
        // Convertimos los datos para que 'efectos' sea un objeto manejable
        const modifiersList = modifiers.map(item => ({
            ...item,
            efectos: typeof item.efectos === 'string' ? Array(JSON.parse(item.efectos)) : item.efectos
        }));
        const tempCards = cards.filter((card) => {
            if (!(card.palo == 'Diamante' && card.valor > 10) && !(card.palo == 'Corazon' && card.valor > 10)) {
                card.x = 200
                card.y = 0
                return card
            }
        });
        setBaseDeck(tempCards);
        setAvailableCharacters(characters);
        setAvailableModifiers(modifiersList)
        setGameLoading(false)
    }
    const startNewGame = () => {
        setGameLoading(true)
        const shuffledDeck = lodash.shuffle(baseDeck);
        setMatchDeck(shuffledDeck)
        setCharacter(undefined)
        setActiveModifiers([])
        setGameLoading(false)
        setActualMatchId(null)
    }
    const endGame = async (user_id, tiempo, victoria, rondas, earnedGold, healedLife, enemysDefeated) => {
        if (character) {
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
            console.log(savedMatch)
            setActualMatchId(savedMatch.id);
            return true
        }
    }

    const updateActualGame = async (user_id, tiempo, victoria, rondas, earnedGold, healedLife, enemysDefeated) => {
        if (character) {
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
            const savedMatch = await updateMatch({ matchId: actualMatchId ,form: payload });
            setActualMatchId(savedMatch.id);
            return true
        }
    }


    const shuffleMatchDeck = () => {
        setMatchDeck(lodash.shuffle(matchDeck))
    }

    const setNewDeck = () => {
        setMatchDeck(baseDeck);
    }

    const addCardToMatchDeck = (card) => {
        efectos: typeof item.efectos === 'string' ? Array(JSON.parse(item.efectos)) : item.efectos
        if (card.efectos !== null) {
            typeof card.efectos === 'string' ? Array(JSON.parse(card.efectos)) : card.efectos
        }
        card.x = 200
        card.y = 0
        setMatchDeck(prevDeck => [...prevDeck, card]);
    }

    const addEnemysToMatchDeck = (quantity, round) => {
        const minPower = Math.max(2, round);
        const maxPower = Math.min(round + 5, 14);
        const candidates = cards.filter(({ palo, valor }) =>
            (palo === "Trebol" || palo === "Pica") &&
            valor >= minPower &&
            valor <= maxPower
        );
        const shuffled = candidates.sort(() => Math.random() - 0.5);
        const newEnemys = shuffled.slice(0, quantity);
        const finalNewEnemys = newEnemys.map((card) => {
            card.x = 200
            card.y = 0
            return card
        })
        setMatchDeck(prevDeck => [...prevDeck, ...newEnemys]);
    }

    const addModifierToMatch = (modifier) => {
        setActiveModifiers([...activeModifiers, modifier])
    }

    const setNewCharacter = (newCharacter) => {
        setCharacter(newCharacter);
    }

    const getRandomsModifier = (quantity = 3, round = 1) => {
        const activeIds = new Set(activeModifiers.map(mod => mod.id));

        // 1. Filtrar los que no están activos y nivel > 0 una sola vez
        const pool = availableModifiers.filter(mod => !activeIds.has(mod.id) && mod.nivel > 0);

        // 2. Definir probabilidades según la ronda
        // Ejemplo de escalado: El nivel 2 empieza a aparecer en ronda 2, el nivel 3 en la 5.
        const getTargetLevel = () => {
            const roll = Math.random() * 100; // 0 a 100

            if (round === 1) return 1;

            // Probabilidades dinámicas
            // Por ejemplo, en ronda 10: Nivel 3 (25%), Nivel 2 (45%), Nivel 1 (30%)
            const probLvl3 = Math.min((round - 4) * 5, 25); // Empieza en ronda 5
            const probLvl2 = Math.min((round - 1) * 10, 45); // Empieza en ronda 2

            if (roll < probLvl3) return 3;
            if (roll < probLvl3 + probLvl2) return 2;
            return 1;
        };

        const selectedModifiers = [];

        // 3. Seleccionar 'quantity' modificadores
        for (let i = 0; i < quantity; i++) {
            const targetLevel = getTargetLevel();

            let candidates = pool.filter(mod =>
                mod.nivel === targetLevel &&
                !selectedModifiers.some(s => s.id === mod.id)
            );

            if (candidates.length === 0) {
                candidates = pool.filter(mod => !selectedModifiers.some(s => s.id === mod.id));
            }

            if (candidates.length > 0) {
                const picked = lodash.sample(candidates);
                selectedModifiers.push(picked);
            }
        }
        return selectedModifiers;
    };

    const getWeapon = (power) => {
        const card = cards.find((card) => card.palo == "Diamante" && card.valor == power)
        card.x = 200
        card.y = 0
        return card
    }
    const getHealItem = (power) => {
        const card = cards.find((card) => card.palo == "Corazon" && card.valor == power)
        card.x = 200
        card.y = 0
        return card
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
        addEnemysToMatchDeck,
        getHealItem,
        updateActualGame
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