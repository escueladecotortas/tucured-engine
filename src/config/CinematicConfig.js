// CONFIGURACIÓN DE ASSETS VISUALES (CINEMATIC MODE)
// Mapea Vibración/Proyecto a archivos en /public/assets/cinematic

export const CinematicAssets = {
    exterior: {
        day: '/assets/cinematic/exterior/building_day.png',
        night: '/assets/cinematic/exterior/building_night.png',
        introVideo: '/assets/cinematic/transitions/intro.mp4'
    },
    lobby: {
        day: '/assets/cinematic/lobby/lobby_day.png',
        night: '/assets/cinematic/lobby/lobby_night.png',
        video_bg: null, // Disabled to show static lobby_day.png
        transitionToElevatorGeneric: '/assets/cinematic/transitions/lobby_to_elevator.mp4',
        botonera: '/assets/cinematic/lobby/intercom_panel.png', // Keeping asset just in case
        elevator_inside: '/assets/cinematic/lobby/elevator_inside.png'
    },
    floors: {
        'tucu-red': { // Floor 1
            bg: '/assets/cinematic/floors/floor_1_tucured.png',
            // SEQUENCE: Walk -> Ride -> Open -> Enter
            transition: [
                '/assets/cinematic/transitions/lobby_to_elevator.mp4', // Step 1: Walk to elevator
                '/assets/cinematic/transitions/elevator_ride_f1.mp4',  // Step 2: Ride
                '/assets/cinematic/transitions/elevator_open_f1.mp4',  // Step 3: Open
                '/assets/cinematic/transitions/enter_office_f1.mp4'    // Step 4: Enter
            ]
        },
        'deco-tortas': { // Floor 2
            bg: '/assets/cinematic/floors/floor_2_decotortas.png',
            transition: [
                '/assets/cinematic/transitions/lobby_to_elevator.mp4',
                '/assets/cinematic/transitions/Loby a Ascensor 2.mp4'
            ]
        },
        'licitia': { // Floor 3
            bg: '/assets/cinematic/floors/floor_3_licitia.png',
            transition: [
                '/assets/cinematic/transitions/lobby_to_elevator.mp4',
                '/assets/cinematic/transitions/Loby a Ascensor 1.mp4'
            ]
        },
        'atlas': { // Floor 4
            bg: '/assets/cinematic/floors/floor_4_atlas.png',
            transition: [
                '/assets/cinematic/transitions/lobby_to_elevator.mp4',
                '/assets/cinematic/transitions/Loby a Ascensor 1.mp4'
            ]
        },
        'nexus-admin': { // Floor 5 (CEO)
            bg_day: '/assets/cinematic/floors/ceo/ceo_office_frente_day.png',
            bg_night: '/assets/cinematic/floors/ceo/ceo_office_noche_luna.png',
            active_bg: '/assets/cinematic/floors/ceo/ceo_office_frente_day.png',
            transition: [
                '/assets/cinematic/transitions/lobby_to_elevator.mp4',
                '/assets/cinematic/transitions/Loby a Ascensor 2.mp4'
            ],
            // 360 Frames for reference or future viewer
            frames360: [
                '/assets/cinematic/floors/ceo/ceo_office_frente_day.png',
                '/assets/cinematic/floors/ceo/ceo_office_costado1_day.png',
                '/assets/cinematic/floors/ceo/ceo_office_costado2_day.png',
                '/assets/cinematic/floors/ceo/ceo_office_ascensor_day.png'
            ]
        }
    }
};

export const getFloorAsset = (projectId, isNight = false) => {
    const floor = CinematicAssets.floors[projectId] || CinematicAssets.floors['nexus-admin']; // Fallback
    if (!floor) return null;

    if (projectId === 'nexus-admin' || projectId === 'system') {
        // Return active office bg for dashboard
        return floor.active_bg || floor.bg_day;
    }
    return floor.bg;
};
