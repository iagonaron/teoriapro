/* =====================================================================
   GUION · Cadencias (profesional)
   Frases (id) y bloques sin voz en el orden del vídeo. Los tiempos reales
   (frases y palabras) los escribe el montaje en tiempos.js.
   ===================================================================== */
window.GUION = [
  { bloque: 'TITULO', dur: 5.0 },
  { id: 'I1', txt: "¿Te has fijado en que la música también respira?", pausa: 0.2 },
  { id: 'I2', txt: "Esos momentos en los que se detiene son las cadencias.", pausa: 0.3 },
  { id: 'I3', txt: "Funcionan como la puntuación en las frases: unas cierran del todo, como un punto; otras se quedan esperando, como la coma, y algunos cierran como de forma inesperada.", pausa: 0.4 },
  { id: 'I4', txt: "Ya los conoces, probablemente te suenen. Hoy vamos a darles un repaso y una vuelta de tuerca.", pausa: 0.6 },
  { id: 'B1', txt: "Para reconocerlas, fíjate en el bajo, la voz más grave, y en los dos últimos acordes de cada secuencia.", pausa: 0.2 },
  { id: 'B2', txt: "Lo anterior es el camino, es el preámbulo, el contexto que nos lleva al desenlace.", pausa: 0.3 },
  { id: 'B3', txt: "Venga, vamos a ver los ejemplos en Sol Mayor.", pausa: 0.6 },
  { id: 'A1', txt: "La cadencia auténtica va de la dominante a la tónica. Del quinto al primero.", pausa: 0.2 },
  { id: 'A2', txt: "Es la que suena más terminada, más conclusiva: punto final. Al escucharla, sabes que la música ha terminado.", pausa: 0.3 },
  { bloque: 'SON_AUT', dur: 9.85 },
  { id: 'A3', txt: "En este caso es auténtica perfecta, ya que los dos acordes que aparecen en pantalla están en estado fundamental.", pausa: 0.2 },
  { id: 'A4', txt: "Si uno de los dos, o los dos, estuviesen en alguna de las inversiones, se consideraría cadencia auténtica imperfecta.", pausa: 0.3 },
  { bloque: 'SON_AUI', dur: 9.85 },
  { id: 'P1', txt: "La cadencia plagal va de la subdominante a la tónica. Cuarto, primero.", pausa: 0.2 },
  { id: 'P2', txt: "También concluye, pero de una manera más tranquila, más suave.", pausa: 0.3 },
  { bloque: 'SON_PLA', dur: 9.85 },
  { id: 'P3', txt: "Al igual que las cadencias auténticas, también tenemos la versión perfecta, con los dos acordes en estado fundamental, o imperfecta, si alguno de los dos, por lo menos, está en inversión.", pausa: 0.3 },
  { bloque: 'SON_PLI', dur: 9.85 },
  { id: 'S1', txt: "La semicadencia se detiene en la dominante.", pausa: 0.1 },
  { id: 'S2', txt: "La música se queda a medias, como una coma que deja la frase en el aire. No apetece aplaudir todavía. Esta es muy fácil de reconocer.", pausa: 0.3 },
  { bloque: 'SON_SEM', dur: 9.85 },
  { id: 'R1', txt: "Y por último, la cadencia rota.", pausa: 0.2 },
  { id: 'R2', txt: "Parece que la dominante va a ir a la tónica, pero… en el último momento se va al sexto grado, fíjate.", pausa: 0.2 },
  { id: 'R3', txt: "¡Mi menor! Es una sorpresa, es un impacto muy chulo. Ya verás, escúchalo.", pausa: 0.3 },
  { bloque: 'SON_ROT', dur: 9.85 },
  { id: 'G1', txt: "Piensa que aquí estamos viendo ejemplos muy simplificados, pero lo de las cadencias es todo un mundillo. Es interesante que lo sepas reconocer, tanto a nivel teórico, viendo la partitura, como a nivel auditivo. Te recomiendo que entres en el portal y practiques de las dos formas.", pausa: 0.8 },
  { id: 'F1', txt: "Entonces, repasando: auténtica, quinto-primero; plagal, cuarto-primero.", pausa: 0.2 },
  { id: 'F2', txt: "Semicadencia: se queda en el quinto.", pausa: 0.2 },
  { id: 'F3', txt: "Y rota: un final sorprendente, acabando en el sexto.", pausa: 0.6 },
  { id: 'F4', txt: "Y recuerda que quizá lo más nuevo de todo lo que te acabo de contar es que las auténticas y las plagales tienen la versión perfecta y la imperfecta.", pausa: 0.8 },
  { id: 'Q1', txt: "Ahora cierra los ojos, escucha y dime qué cadencia es.", pausa: 0.3 },
  { bloque: 'SON_QUIZ', dur: 13.4 },
  { id: 'Q2', txt: "Ahora puedes abrir los ojos. La cadencia que has escuchado es la cadencia rota.", pausa: 0.5 },
  { id: 'Q3', txt: "Lo hayas adivinado o no, no te vendrá mal hacer unos ejercicios. ¡Venga!", pausa: 0.0 },
  { bloque: 'COLA', dur: 2.6 },
  { bloque: 'FINAL', dur: 3.6 },
];

/* ------------------------------------------------------------------ línea de tiempo */
(function () {
  'use strict';
  const HUECO = 0.5;            // silencio base entre frases (s)
  const SIL_S = 5.7;            // sílabas por segundo (ritmo de Iago, sin pausas largas)

  function silabas(txt) {
    const s = txt.toLowerCase().normalize('NFC').replace(/[^a-záéíóúüñ\s]/g, ' ');
    let n = 0;
    for (const w of s.split(/\s+/)) if (w) n += Math.max(1, (w.match(/[aeiouáéíóúü]+/g) || []).length);
    return n;
  }
  function palabras(txt) { return txt.split(/\s+/).filter(Boolean); }

  /** Estimación de la duración de una frase y de la posición de cada palabra. */
  function estimar(f) {
    const ws = palabras(f.txt);
    let t = 0; const out = [];
    for (const w of ws) {
      const d = Math.max(0.16, silabas(w) / SIL_S);
      out.push([w, +t.toFixed(3)]);
      t += d + 0.03;
      if (/[,;:]$/.test(w)) t += 0.32;
      if (/[.?!]$/.test(w)) t += 0.55;
      if (/…$/.test(w)) t += 0.55;
    }
    return { dur: t, palabras: out };
  }

  /**
   * Construye la línea de tiempo: T.frase[id] = {t0,t1,palabras:[[w,t]]}, T.bloque[nombre]={t0,t1},
   * T.dur (fin), T.acorde (golpe del acorde final). Si existe window.TIEMPOS (grabación real), manda él.
   */
  function construir() {
    const R = window.TIEMPOS;
    const T = { frase: {}, bloque: {}, orden: [], real: !!R };
    if (R) {
      Object.assign(T.frase, R.frase); Object.assign(T.bloque, R.bloque);
      T.dur = R.dur; T.acorde = R.acorde; T.orden = R.orden || [];
      return T;
    }
    let t = 0;
    for (const item of window.GUION) {
      if (item.bloque) {
        T.bloque[item.bloque] = { t0: +t.toFixed(3), t1: +(t + item.dur).toFixed(3) };
        T.orden.push(item.bloque);
        t += item.dur;
        continue;
      }
      const e = estimar(item);
      T.frase[item.id] = { t0: +t.toFixed(3), t1: +(t + e.dur).toFixed(3), txt: item.txt,
        palabras: e.palabras.map(([w, dt]) => [w, +(t + dt).toFixed(3)]) };
      T.orden.push(item.id);
      t += e.dur + HUECO + (item.pausa || 0);
    }
    T.acorde = T.bloque.FINAL.t0;
    T.dur = T.bloque.FINAL.t1;
    return T;
  }

  window.construirTiempos = construir;
  window.silabasGuion = silabas;
})();
