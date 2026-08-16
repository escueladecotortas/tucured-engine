// Archivo: frontend/src/components/CinematicEntry.jsx
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CinematicAssets } from '../config/CinematicConfig';
import { ExteriorView } from './cinematic/ExteriorView';
import { LobbyView } from './cinematic/LobbyView';
import { VideoLayer } from './cinematic/VideoLayer';

const PHASE = { EXTERIOR: 'EXTERIOR', INTRO_VIDEO: 'INTRO_VIDEO', LOBBY: 'LOBBY', ELEVATOR_VIDEO: 'ELEVATOR_VIDEO' };

export default function CinematicEntry() {
    const [phase, setPhase] = useState(() => window.location.hash.includes('start=lobby') ? PHASE.LOBBY : PHASE.EXTERIOR);
    const [selectedProject, setSelectedProject] = useState(null);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const isNight = new Date().getHours() >= 19 || new Date().getHours() < 6;

    const floors = [
        { id: 'system', floor: '5', label: 'CEO Office', transition: CinematicAssets.floors['nexus-admin'].transition },
        { id: 'atlas', floor: '4', label: 'Atlas', transition: CinematicAssets.floors['atlas'].transition },
        { id: 'licitia', floor: '3', label: 'Licítia', transition: CinematicAssets.floors['licitia'].transition },
        { id: 'deco-tortas', floor: '2', label: 'Deco Tortas', transition: CinematicAssets.floors['deco-tortas'].transition },
        { id: 'tucu-red', floor: '1', label: 'Tucu Red', transition: CinematicAssets.floors['tucu-red'].transition },
        { id: 'lobby', floor: 'PB', label: 'Lobby', locked: true, isCurrent: true }
    ];

    const handleElevatorEnd = () => {
        const transition = selectedProject?.transition;
        if (Array.isArray(transition) && currentVideoIndex < transition.length - 1) {
            setCurrentVideoIndex(prev => prev + 1);
            return;
        }
        window.location.hash = selectedProject.id === 'system' ? '#/project/system?tab=overview' : `#/project/${selectedProject.id}`;
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-black font-sans overflow-hidden select-none">
            <AnimatePresence mode="wait">
                {phase === PHASE.EXTERIOR && (
                    <ExteriorView bgImage={isNight ? CinematicAssets.exterior.night : CinematicAssets.exterior.day} onStart={() => setPhase(PHASE.INTRO_VIDEO)} />
                )}
                {phase === PHASE.INTRO_VIDEO && (
                    <VideoLayer src={CinematicAssets.exterior.introVideo} onEnd={() => setPhase(PHASE.LOBBY)} skipLabel="SKIP INTRO" />
                )}
                {phase === PHASE.LOBBY && (
                    <LobbyView bgVideo={CinematicAssets.lobby.video_bg} bgImage={CinematicAssets.lobby.day} floors={floors} onFloorSelect={(f) => {
                        setSelectedProject(f); setCurrentVideoIndex(0); setPhase(PHASE.ELEVATOR_VIDEO);
                    }} />
                )}
                {phase === PHASE.ELEVATOR_VIDEO && (
                    <VideoLayer 
                        src={Array.isArray(selectedProject?.transition) ? selectedProject.transition[currentVideoIndex] : (selectedProject?.transition || CinematicAssets.lobby.transitionToElevatorGeneric)} 
                        onEnd={handleElevatorEnd} 
                        skipLabel="SKIP TO OFFICE" 
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
