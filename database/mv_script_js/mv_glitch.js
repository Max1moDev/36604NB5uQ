        document.addEventListener('DOMContentLoaded', () => {
            const nombreElement = document.getElementById('mv_discord_name');
            const letrasFalsas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>';
            let intervaloDecodificacion;
            let intervaloTwitch;
            
            // Función: Decodificación estilo Matrix / Hacker
            const detonarGlitch = (textoReal) => {
                let iteracion = 0;
                clearInterval(intervaloDecodificacion);
                
                intervaloDecodificacion = setInterval(() => {
                    nombreElement.innerText = textoReal
                        .split('')
                        .map((letra, index) => {
                            // Si la iteración ya pasó esta letra, mostramos la letra real
                            if (index < iteracion) {
                                return textoReal[index];
                            }
                            // Si no, mostramos un carácter al azar
                            return letrasFalsas[Math.floor(Math.random() * letrasFalsas.length)];
                        })
                        .join('');
                    
                    // Condición de parada
                    if (iteracion >= textoReal.length) {
                        clearInterval(intervaloDecodificacion);
                        iniciarTwitchErratico(); // Empezamos los espasmos aleatorios
                    }
                    
                    iteracion += 1 / 3; // Controla qué tan rápido se revela el nombre
                }, 30);
            };

            // Función: Espasmos CSS en momentos aleatorios
            const iniciarTwitchErratico = () => {
                clearInterval(intervaloTwitch);
                intervaloTwitch = setInterval(() => {
                    // Hay un 15% de probabilidad de que el texto falle cada medio segundo
                    if (Math.random() > 0.85) {
                        nombreElement.classList.add('glitch-erratico');
                        
                        // Le quitamos la clase rápido para que pueda volver a fallar luego
                        setTimeout(() => {
                            nombreElement.classList.remove('glitch-erratico');
                        }, 150); 
                    }
                }, 500);
            };

            // INTERACTIVIDAD: Al pasar el mouse, se vuelve a encriptar/desencriptar
            nombreElement.addEventListener('mouseover', () => {
                if (nombreElement.dataset.nombreReal) {
                    detonarGlitch(nombreElement.dataset.nombreReal);
                }
            });

            // OBSERVADOR: Espera a que tu script de Discord reemplace el "Cargando..."
            const observer = new MutationObserver((mutations) => {
                const textoActual = nombreElement.innerText;
                
                // Si el texto ya no es "Cargando..." y aún no guardamos el nombre real
                if (textoActual !== 'Cargando...' && !nombreElement.dataset.nombreReal) {
                    nombreElement.dataset.nombreReal = textoActual; // Guardamos tu nombre real en memoria
                    detonarGlitch(textoActual); // Disparamos la magia
                }
            });

            observer.observe(nombreElement, { childList: true, characterData: true, subtree: true });
        });