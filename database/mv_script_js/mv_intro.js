const introOverlay = document.getElementById('intro-overlay');
const skullAscii = document.getElementById('skull-ascii');
const loadingBar = document.getElementById('loading-bar');
const clickToContinue = document.getElementById('click-to-continue');
const video = document.getElementById("bg-video");
const music = document.getElementById("bg-music");

const sfxGlitch = new Audio('database/mv_background_mp3/sfx/mv_glitch.mp3');
sfxGlitch.volume = 0.5;

const config = {
    maxVolume: 0.5,
    fadeDuration: 5000,
    intervalTime: 10
};

const tracksDatabase = [
    {
        local: 'database/mv_background_mp3/rave.mp3',
        spotify: 'spotify:track:01kfSdF9zfcDLri5sSWEoL'
    },
    {
        local: 'database/mv_background_mp3/shadow.mp3',
        spotify: 'spotify:track:0wGbyS1tExQSwOYu6UceyE'
    },
    {
        local: 'database/mv_background_mp3/victory.mp3',
        spotify: 'spotify:track:234SaqlzLfKAsE6gsmvMnR'
    },
    {
        local: 'database/mv_background_mp3/big_dawgs.mp3',
        spotify: 'spotify:track:0OA00aPt3BV10qeMIs3meW'
    },
    {
        local: 'database/mv_background_mp3/metamorphosis.mp3',
        spotify: 'spotify:track:2ksyzVfU0WJoBpu8otr4pz'
    },
    {
        local: 'database/mv_background_mp3/nuthin_but_a.mp3',
        spotify: 'spotify:track:5Tbpp3OLLClPJF8t1DmrFD'
    }
];

let currentTrackIndex = Math.floor(Math.random() * tracksDatabase.length);
window.spotifyController = null;

// Spotify carga silenciosamente en el fondo desde el primer momento
window.onSpotifyIframeApiReady = (IFrameAPI) => {
    const element = document.getElementById('embed-iframe');
    const options = {
        width: '100%',
        height: '80',
        uri: tracksDatabase[currentTrackIndex].spotify
    };
    const callback = (EmbedController) => {
        window.spotifyController = EmbedController;
    };
    IFrameAPI.createController(element, options, callback);
};

if (music) {
    music.volume = 0;
}

const fadeIn = (element) => {
    const step = config.maxVolume / (config.fadeDuration / config.intervalTime);
    const timer = setInterval(() => {
        if (element.volume < config.maxVolume) {
            element.volume = Math.min(config.maxVolume, element.volume + step);
        } else {
            clearInterval(timer);
        }
    }, config.intervalTime);
};

// === LÓGICA DEL BORDE ANIMADO SVG ===
const progressRect = document.querySelector('.progress-rect');

const updateBorderProgress = () => {
    if (!progressRect || !music.duration) return;
    
    const rectPerimeter = progressRect.getTotalLength();
    progressRect.style.strokeDasharray = rectPerimeter;
    
    const progress = music.currentTime / music.duration;
    progressRect.style.strokeDashoffset = rectPerimeter * progress;
};

if (music) {
    music.addEventListener('timeupdate', updateBorderProgress);
}

window.addEventListener('resize', () => {
    if (progressRect && music.duration) {
        const rectPerimeter = progressRect.getTotalLength();
        progressRect.style.strokeDasharray = rectPerimeter;
        const progress = music.currentTime / music.duration;
        progressRect.style.strokeDashoffset = rectPerimeter * progress;
    }
});

// === EL NÚCLEO CORREGIDO: TRANSICIONES PERFECTAS ===
const playTrack = (isInitial = false) => {
    if (!music || tracksDatabase.length === 0) return;
    const wrapper = document.querySelector('.spotify-wrapper');

    if (isInitial) {
        // 1. CARGA INICIAL: Spotify ya se cargó en el fondo gracias al IFrameAPI.
        // Solo iniciamos el audio local y hacemos aparecer el reproductor suavemente.
        const currentTrack = tracksDatabase[currentTrackIndex];
        music.src = currentTrack.local;
        music.currentTime = 0;
        music.play().then(() => fadeIn(music)).catch(e => console.log(e));

        if (wrapper) {
            wrapper.classList.remove('changing-track'); // Aparece de forma épica
        }
    } else {
        // 2. CAMBIO DE CANCIÓN: Ocultar, cambiar todo en las sombras, y revelar.
        if (wrapper) {
            wrapper.classList.add('changing-track'); // Animación de salida
        }

        // Esperamos 400ms a que desaparezca por completo antes de cambiar algo
        setTimeout(() => {
            let newIndex = Math.floor(Math.random() * tracksDatabase.length);
            if (tracksDatabase.length > 1 && newIndex === currentTrackIndex) {
                newIndex = (newIndex + 1) % tracksDatabase.length;
            }
            currentTrackIndex = newIndex;
            const currentTrack = tracksDatabase[currentTrackIndex];

            // Iniciar nuevo audio local
            music.src = currentTrack.local;
            music.currentTime = 0;
            music.play().then(() => fadeIn(music)).catch(e => console.log(e));

            // Cambiar Spotify de forma invisible
            if (window.spotifyController) {
                window.spotifyController.loadUri(currentTrack.spotify);
            }

            // Darle tiempo a Spotify para renderizarse (1 segundo) y luego revelar
            setTimeout(() => {
                if (wrapper) {
                    wrapper.classList.remove('changing-track'); // Animación de entrada
                }
            }, 1000);

        }, 400); 
    }
};

if (music) {
    music.addEventListener('ended', () => {
        playTrack(false);
    });
}

// === LÓGICA DE LA INTRODUCCIÓN ===
let progress = 0;

const loadingInterval = setInterval(() => {
    progress += Math.random() * 4 + 2; 
    
    if (progress >= 100) {
        progress = 100;
        clearInterval(loadingInterval);
        
        setTimeout(() => {
            clickToContinue.classList.add('visible');
        }, 600); 
    }
    loadingBar.style.width = `${progress}%`;
    skullAscii.style.clipPath = `inset(0 0 ${100 - progress}% 0)`;
}, 150);

introOverlay.addEventListener('click', () => {
    if (progress >= 100) {
        introOverlay.style.pointerEvents = 'none'; 
        sfxGlitch.play().catch(e => console.log(e));
        introOverlay.classList.add('glitch-active');
        
        setTimeout(() => {
            introOverlay.classList.add('hidden');
            
            if (video) {
                video.currentTime = 0;
                video.play().catch(e => console.log(e));
            }
            
            // Inicia la música y revela el iframe
            playTrack(true);
            
        }, 300);
        
        introOverlay.addEventListener('transitionend', () => {
            clearInterval(loadingInterval);
            sfxGlitch.pause();
            introOverlay.remove();
        }, { once: true });
    }
});

