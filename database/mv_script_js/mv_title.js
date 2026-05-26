(function() {
  // ─── Configuración ──────────────────────────────────────────────
  const FINAL_TITLE = "@_maxgh";
  const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;:',.<>?/`~█▓▒░☠⚡☢☣";

  const SURPRISE_PHRASES = [
    "¡Hola a todos!",
    "Me encontraste...",
    "Shh... página secreta",
    "Bievenido a mi mundo",
    "Puedo verte...",
    "Entrando al vacío",
    "Cargando personalidad...",
    "Error 404: No encontrado",
    "🤖 Beep boop",
    "Eres parte del experimento",
    "Psst... Estoy vigilandote"
  ];

  // ─── Utilidades ─────────────────────────────────────────────────
  let currentTimeout;
  let glitchInterval;

  const randomGlitchChar = () =>
    GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];

  // 👇 Función para evitar el recorte de espacios
  const safeChar = (ch) => ch === " " ? "\u00A0" : ch;

  // Escribe título letra por letra respetando espacios
  const typeText = (text, onEnd, speed = 80) => {
    let i = 0;
    document.title = "";
    const type = () => {
      if (i < text.length) {
        document.title += safeChar(text.charAt(i));
        i++;
        const variation = Math.random() * 60 + speed - 30;
        currentTimeout = setTimeout(type, variation);
      } else {
        if (onEnd) onEnd();
      }
    };
    type();
  };

  // Borra título letra por letra
  const deleteText = (onEnd, speed = 50) => {
    const deleteStep = () => {
      if (document.title.length > 0) {
        document.title = document.title.slice(0, -1);
        currentTimeout = setTimeout(deleteStep, speed);
      } else {
        if (onEnd) onEnd();
      }
    };
    deleteStep();
  };

  // Efecto glitch
  const startGlitch = (duration = 600) => {
    if (glitchInterval) clearInterval(glitchInterval);
    const original = document.title;
    const length = original.length || 8;

    glitchInterval = setInterval(() => {
      let glitched = "";
      for (let i = 0; i < length; i++) {
        glitched += Math.random() < 0.5 ? randomGlitchChar() : (original[i] || " ");
      }
      document.title = glitched;
    }, 50);

    setTimeout(() => {
      clearInterval(glitchInterval);
      glitchInterval = null;
      document.title = original;
    }, duration);
  };

  // Muestra frase sorpresa y luego escribe el título final
  const showSurprisePhrase = (callback) => {
    let phrase;
    if (localStorage.getItem('visited_before')) {
      phrase = "Nuevamente, amigo! :)";
    } else {
      localStorage.setItem('visited_before', 'true');
      phrase = SURPRISE_PHRASES[Math.floor(Math.random() * SURPRISE_PHRASES.length)];
    }

    typeText(phrase, () => {
      setTimeout(() => {
        startGlitch(400);
        setTimeout(() => {
          deleteText(() => {
            typeFinalWithGlitch(callback);
          });
        }, 500);
      }, 1200);
    }, 90);
  };

  // Escribe título final con micro‑glitches, también respetando espacios
  const typeFinalWithGlitch = (callback) => {
    const text = FINAL_TITLE;
    let i = 0;
    document.title = "";

    const typeStep = () => {
      if (i < text.length) {
        document.title += safeChar(text.charAt(i));
        i++;
        // Pequeño glitch cada dos caracteres
        if (i % 2 === 0) {
          const prev = document.title;
          document.title = randomGlitchChar() + prev.slice(1);
          setTimeout(() => {
            document.title = prev;
          }, 60);
        }
        currentTimeout = setTimeout(typeStep, 100 + Math.random() * 70);
      } else {
        startGlitch(500);
        setTimeout(() => {
          document.title = FINAL_TITLE; // ya puede llevar espacios normales
          scheduleIdleSurprises();
          if (callback) callback();
        }, 600);
      }
    };
    typeStep();
  };

  // Sorpresas de fondo: emojis y micro‑glitches periódicos
  const scheduleIdleSurprises = () => {
    setInterval(() => {
      if (Math.random() < 0.3) {
        const emojis = ["✨", "🌀", "👾", "💫", "🔮"];
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        document.title = FINAL_TITLE + " " + emoji;
        setTimeout(() => {
          document.title = FINAL_TITLE;
        }, 1500);
      } else if (Math.random() < 0.15) {
        startGlitch(300);
      }
    }, 30000 + Math.random() * 40000);
  };

  // Reacción al volver a la pestaña
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      document.title = "👋 " + FINAL_TITLE;
      setTimeout(() => {
        document.title = FINAL_TITLE;
      }, 1500);
    }
  });

  // Easter egg con Ctrl+Shift+S
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === "S") {
      e.preventDefault();
      document.title = "🎉 SECRET UNLOCKED! 🎉";
      setTimeout(() => {
        document.title = FINAL_TITLE;
      }, 2000);
    }
  });

  // Inicio de la experiencia
  const init = () => {
    document.title = "⚡";
    setTimeout(() => {
      showSurprisePhrase();
    }, 200);
  };

  // Limpieza por si se llama varias veces
  window._surpriseTitleCleanup = () => {
    if (currentTimeout) clearTimeout(currentTimeout);
    if (glitchInterval) clearInterval(glitchInterval);
  };

  init();
})();