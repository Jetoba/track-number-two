import { useEffect, useMemo, useState } from "react";
import { TypeAnimation } from "react-type-animation";

const eraseWithAnimation = (stepMs = 32) =>
  (element) =>
    new Promise((resolve) => {
      if (!element) {
        resolve();
        return;
      }

      const deleteTick = () => {
        const current = element.textContent ?? "";

        if (current.length === 0) {
          resolve();
          return;
        }

        element.textContent = current.slice(0, -1);
        setTimeout(deleteTick, stepMs);
      };

      deleteTick();
    });

const replaceUnWithNuestroPrimer = (stepMs = 110) =>
  (element) =>
    new Promise((resolve) => {
      if (!element) {
        resolve();
        return;
      }

      const original = element.textContent ?? "";
      const from = "un ";
      const to = "nuestro primer ";

      if (!original.startsWith(from)) {
        element.textContent = `${to}${original}`;
        resolve();
        return;
      }

      let text = original;
      let removed = 0;

      const removeFromStart = () => {
        if (removed >= from.length) {
          writePrefix(text);
          return;
        }

        text = text.slice(1);
        removed += 1;
        element.textContent = text;
        setTimeout(removeFromStart, stepMs);
      };

      const writePrefix = (baseText) => {
        let i = 0;

        const typeTick = () => {
          i += 1;
          element.textContent = `${to.slice(0, i)}${baseText}`;

          if (i >= to.length) {
            resolve();
            return;
          }

          setTimeout(typeTick, stepMs);
        };

        typeTick();
      };

      removeFromStart();
    });

function App() {
  const targetDate = useMemo(() => new Date(2026, 2, 6, 0, 0, 0), []);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownTyped, setCountdownTyped] = useState(false);
  const [typedCountdownText, setTypedCountdownText] = useState("");

  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = targetDate.getTime() - Date.now();
    return Math.max(diff, 0);
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const diff = targetDate.getTime() - Date.now();
      setTimeLeft(Math.max(diff, 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetDate]);

  const sequence = useMemo(
    () => [
      "",
      7500,
      "Rara vez lo importante llega con instrucciones",
      6500,
      "suele empezar como una ruta que aún no sabes leer",
      4050,
      "Intentas entenderla",
      2000,
      "pero son como los caminos que no aparecen en ningún mapa",
      3000,
      "Entre la lógica y el impulso",
      750,
      "se dibujan trayectos que nadie más ve",
      4500,
      "Sin señales claras",
      1500,
      "solo esa intuición que te empuja a avanzar sin saber por qué",
      6000,
      "Guardamos coordenadas invisibles",
      750,
      "como si el corazón supiera orientarse solo",
      3000,
      "Ocurre así con lo que cambia todo",
      3300,
      "Empieza como un riesgo",
      4500,
      eraseWithAnimation(),
      "y termina como",
      3750,
      eraseWithAnimation(),
      "un bonito recuerdo.",
      2000,
      replaceUnWithNuestroPrimer(),
      4000,
      eraseWithAnimation(),
      "",
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            setShowCountdown(true);
            resolve();
          }, 2500);
        })
    ],
    []
  );

  const totalSeconds = Math.floor(timeLeft / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (value) => String(value).padStart(2, "0");
  const formattedCountdown = `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  useEffect(() => {
    if (showCountdown && !countdownTyped && !typedCountdownText) {
      setTypedCountdownText(formattedCountdown);
    }
  }, [showCountdown, countdownTyped, typedCountdownText, formattedCountdown]);

  return (
    <main className="screen">
      <section className="message">
        {!showCountdown ? <TypeAnimation
          sequence={sequence}
          wrapper="p"
          speed={12}
          repeat={0}
          cursor={true}
          omitDeletionAnimation={true}
          className="type-text"
        /> : null}
        {showCountdown && !countdownTyped && typedCountdownText ? (
          <TypeAnimation
            sequence={[typedCountdownText, () => setCountdownTyped(true)]}
            wrapper="p"
            speed={10}
            repeat={0}
            cursor={true}
            omitDeletionAnimation={true}
            className="countdown visible"
          />
        ) : null}
        {showCountdown && countdownTyped ? (
          <p className="countdown visible">{formattedCountdown}</p>
        ) : null}
      </section>
    </main>
  );
}

export default App;
