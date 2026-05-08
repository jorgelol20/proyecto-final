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

    const { saveMatch } = useMatch()

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
    }
    const endGame = async (user_id, tiempo, victoria, rondas) => {
        if (character) {
            const gameModifiers = activeModifiers.map((modifier) => modifier.id);
            const payload = {
                usuario_id: user_id,
                personaje_id: character.id,
                tiempo: tiempo,
                victoria: victoria,
                rondas: rondas,
                modificadores: gameModifiers
            };

            // 3. Pasamos el objeto a la mutación
            // Nota: Si tu mutationFn usa { form }, envíalo así:
            await saveMatch({ form: payload });
        }
    }
    const shuffleMatchDeck = () => {
        setMatchDeck(lodash.shuffle(matchDeck))
    }

    const setNewDeck = () => {
        setMatchDeck(baseDeck);
    }

    const addCardToMatchDeck = (card) => {
        setMatchDeck([...matchDeck, card])
    }

    const addModifierToMatch = (modifier) => {
        setActiveModifiers([...activeModifiers, modifier])
    }

    const setNewCharacter = (newCharacter) => {
        setCharacter(newCharacter);
    }

    const getRandomsModifier = () => {
        const tempModifiersList = availableModifiers
        //return [tempModifiersList[3], tempModifiersList[3], tempModifiersList[3]];
        const shuffledModifiers = lodash.shuffle(tempModifiersList)
        return [shuffledModifiers[0], shuffledModifiers[1], shuffledModifiers[2]];
    }

    const getWeapon = (power) => {
        const card = baseDeck.filter((card) => card.palo == "Diamante" && card.valor == power)
        return card[0]
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
        getWeapon
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