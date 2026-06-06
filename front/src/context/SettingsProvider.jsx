import React, { createContext, useState, useEffect, useRef } from "react";
import MainMusic from '/sounds/main-music.mp3';
import ButtonSound from '/sounds/button-sound.mp3';

export const settingsContext = createContext();

const SettingsProvider = ({ children }) => {
    const [effectsVolume, setEffectsVolume] = useState(50);
    const [effectsMuted, setEffectsMuted] = useState(false);
    const [musicVolume, setMusicVolume] = useState(50);
    const [musicMuted, setMusicMuted] = useState(false);
    const [showFPS, setShowFPS] = useState(false);
    const [showLogs, setShowLogs] = useState(false)


    const musicRef = useRef(null);
    const effectRef = useRef(null);


    useEffect(() => {
        const savedEffect = localStorage["effect_sound"];
        const savedMusic = localStorage["music_sound"];
        const savedMutedEffect = localStorage["effect_muted"];
        const savedMutedMusic = localStorage["music_muted"];
        const savedShowFPS = (localStorage.getItem('show_fps'));
        const savedShowLogs = (localStorage.getItem('show_logs'))

        if (savedMutedMusic !== null && savedMutedMusic !== undefined) setMusicMuted(Number(savedMutedMusic));
        if (savedMutedEffect !== null && savedMutedEffect !== undefined) setEffectsMuted(Number(savedMutedEffect));
        if (savedEffect !== null && savedEffect !== undefined) setEffectsVolume(Number(savedEffect));
        if (savedMusic !== null && savedMusic !== undefined) setMusicVolume(Number(savedMusic));
        if (savedShowFPS !== null && savedShowFPS !== undefined) setShowFPS(savedShowFPS);
        if (savedShowLogs !== null && savedShowLogs !== undefined) setShowLogs(savedShowLogs);
    }, []);

    useEffect(() => {
        if (musicMuted) {
            if (musicRef.current) musicRef.current.volume = 0
        } else {
            if (musicRef.current) musicRef.current.volume = musicVolume / 100
        };
    }, [musicVolume, musicMuted]);

    //EventListener para iniciar la música cuando el jugador clicke dentro de la web.
    useEffect(() => {
        const enableAudio = () => {
            if (musicRef.current) {
                musicRef.current.play().catch(err => console.log("Audio bloqueado:", err));
            }
            window.removeEventListener('click', enableAudio);
        };
        window.addEventListener('click', enableAudio);
        return () => window.removeEventListener('click', enableAudio);
    }, []);


    const changeEffectsSound = (val) => {
        const num = Number(val);
        if (num >= 0 && num <= 100) {
            setEffectsMuted(false)
            setEffectsVolume(num);
            localStorage.setItem('effect_sound', num)
        }

    };

    const changeMusicSound = (val) => {
        const num = Number(val);
        if (num >= 0 && num <= 100) {
            setMusicMuted(false)
            setMusicVolume(num)
            localStorage.setItem('music_sound', num)
        };
    };

    const muteMusic = (event) => {
        if (event) {
            localStorage['music_muted'] = !musicMuted
            setMusicMuted(!musicMuted)
        }
    }
    const muteEffects = (event) => {
        if (event) {
            localStorage['effect_muted'] = !effectsMuted
            setEffectsMuted(!effectsMuted)
        }
    }

    const startButtonSound = (event) => {
        if (effectRef.current && event !== undefined && !effectsMuted) {
            effectRef.current.src = ButtonSound;
            effectRef.current.volume = effectsVolume / 100;
            effectRef.current.play().catch(e => console.log("Playback prevented:", e));
        }
    };

    const changeShowFPS = (event) => {
        localStorage.setItem('show_fps', event.currentTarget.checked)
        setShowFPS(event.currentTarget.checked)
    }
    const changeShowLogs = (event) => {
        localStorage.setItem('show_logs', event.currentTarget.checked)
        setShowLogs(event.currentTarget.checked)
    }

    const value = {
        effectsVolume,
        musicVolume,
        effectsMuted,
        musicMuted,
        showFPS,
        changeEffectsSound,
        changeMusicSound,
        startButtonSound,
        muteEffects,
        muteMusic,
        changeShowFPS,
        changeShowLogs,
        showLogs
    };

    return (
        < settingsContext.Provider value={value}>
            <audio ref={musicRef} src={MainMusic} volume={musicVolume} loop />
            <audio ref={effectRef} volume={effectsVolume} />
            {children}
        </ settingsContext.Provider>
    );
};

export default SettingsProvider;