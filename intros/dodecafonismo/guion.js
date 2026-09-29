/* =====================================================================
   GUION · Dodecafonismo
   Frases (id) y bloques sin voz en el orden del vídeo. Los tiempos reales
   (frases y palabras) los escribe el montaje en tiempos.js.
   ===================================================================== */
window.GUION = [
  { bloque: 'TITULO', dur: 5.0 },
  { id: 'A1', txt: "Si has visto el portal sobre la atonalidad, conocerás que hay como diferentes formas de salirse de lo que son las reglas tonales.", pausa: 0.3 },
  { id: 'A2', txt: "Y una de ellas, en la que establecían series y normas muy estrictas, era el dodecafonismo.", pausa: 0.6 },
  { id: 'A3', txt: "El dodecafonismo tiene una regla de oro: coges los doce sonidos de la escala cromática y no repites ninguno hasta que hayan sonado los doce.", pausa: 0.3 },
  { id: 'A4', txt: "Así no hay favoritismos: muy justo todo, y otra cosa es que te guste cómo suena.", pausa: 0.8 },
  { id: 'B1', txt: "El orden, en este caso, pues decídelo tú.", pausa: 0.2 },
  { id: 'B2', txt: "Esa es tu serie principal, la P0.", pausa: 0.2 },
  { id: 'B3', txt: "La que viene en el libro es esta.", pausa: 0.1 },
  { bloque: 'SON_P0', dur: 6.4 },
  { id: 'C1', txt: "Para construirla en el portal, tres avisos. Uno: un sonido y su enarmónico cuentan como el mismo.", pausa: 0.3 },
  { id: 'C2', txt: "Sol bemol y Fa sostenido son el mismo sonido. Para los dodecafónicos, aquí esto da igual.", pausa: 0.6 },
  { id: 'C3', txt: "Dos: todo va en un único compás, así que las alteraciones duran hasta el final.", pausa: 0.3 },
  { id: 'C4', txt: "Y a veces te faltará algún becuadro, no olvides esto.", pausa: 0.6 },
  { id: 'C5', txt: "Y tres: evita las escalitas.", pausa: 0.2 },
  { id: 'C6', txt: "Cuatro notas seguidas por grado conjunto en la misma dirección no es demasiado atonal, la verdad.", pausa: 0.9 },
  { id: 'V1', txt: "Con estas reglas, los dodecafónicos componían su música, pero es cierto que si estás dándole a la serie una y otra vuelta, llega un punto en el que es bastante monótono, ¿no?", pausa: 0.3 },
  { id: 'V2', txt: "Entonces tenemos una serie de variantes que surgen de la misma.", pausa: 0.5 },
  { id: 'P1', txt: "La primera es transportarla.", pausa: 0.2 },
  { id: 'P2', txt: "A toda serie le sumas los mismos semitonos. Por ejemplo, si le sumas cinco, obtienes P5.", pausa: 0.3 },
  { id: 'P3', txt: "Cada número es un semitono hacia arriba, así que tienes doce, de P0 a P11.", pausa: 0.9 },
  { id: 'R1', txt: "La segunda variante es la retrógrada: coges la serie y la lees al revés.", pausa: 0.2 },
  { id: 'R2', txt: "Algo así como si la volteas, como si la rebobinas.", pausa: 0.1 },
  { bloque: 'SON_R0', dur: 3.4 },
  { id: 'R3', txt: "Al igual que en la serie principal, también tienes las versiones transportadas, por lo tanto puedes tener R0, R1, R2… Vale, tienes otras doce series más.", pausa: 0.9 },
  { id: 'I1', txt: "La tercera, quizá un poco más compleja, es la inversión, la I.", pausa: 0.3 },
  { id: 'I2', txt: "Todo lo que sube, baja, y todo lo que baja, sube. Mismos intervalos, dirección contraria.", pausa: 0.4 },
  { id: 'I3', txt: "En P0, de Re a Si bemol subimos cuatro tonos, o una sexta menor.", pausa: 0.3 },
  { id: 'I4', txt: "En la inversión, desde Re bajamos cuatro tonos: Sol bemol.", pausa: 0.3 },
  { id: 'I5', txt: "Y así, intervalo a intervalo.", pausa: 0.1 },
  { bloque: 'SON_I0', dur: 3.4 },
  { id: 'I6', txt: "Por cierto, puedes cambiarlo de octava en el momento en el que te apetezca. Es decir, si una nota te queda demasiado grave, como es este caso,", pausa: 0.1 },
  { id: 'I7', txt: "súbela de octava, y es igual de correcto.", pausa: 0.4 },
  { id: 'I8', txt: "Para los dodecafónicos, la altura absoluta da igual.", pausa: 0.2 },
  { id: 'I9', txt: "Lo que importa es la relación.", pausa: 0.5 },
  { id: 'I10', txt: "Y aquí, como podrás suponer, también podemos hacer los transportes.", pausa: 0.8 },
  { id: 'Q1', txt: "La cuarta variante es la retrógrada de la inversión: RI.", pausa: 0.3 },
  { id: 'Q2', txt: "Pero tranquilo: simplemente me basta con que sepas que existe. No te la voy a preguntar.", pausa: 0.6 },
  { id: 'Q3', txt: "Cuatro formas por doce transportes, igual a cuarenta y ocho versiones de una misma serie: material de sobra para no aburrirse.", pausa: 0.9 },
  { id: 'E1', txt: "En el portal tienes tres ejercicios: construir tu serie, asegurándote de que haces doce sonidos sin repetir;", pausa: 0.2 },
  { id: 'E2', txt: "completar una retrógrada o una inversión a la que le faltan notas,", pausa: 0.2 },
  { id: 'E3', txt: "e identificar qué variante concreta es: la letra y el número.", pausa: 0.8 },
  { id: 'F1', txt: "Te dejo que te lo pases bien en el portal. Pero antes, vamos a hacer un repaso final.", pausa: 0.3 },
  { id: 'F2', txt: "Entonces, P:", pausa: 0.1 },
  { id: 'F3', txt: "la serie, doce sonidos sin repetir ninguno. Se puede transportar tantos semitonos como diga el número.", pausa: 0.4 },
  { id: 'F4', txt: "R: retrógrada, al revés. Y el número, en su última nota.", pausa: 0.4 },
  { id: 'F6', txt: "el espejo: cada intervalo en dirección contraria.", pausa: 0.4 },
  { id: 'F7', txt: "Y RI, que sepas que existe, y eso es lo que completa la matriz de las cuarenta y ocho variantes.", pausa: 0.0 },
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
