/* =====================================================================
   GUION · Modulación
   Frases (id) y bloques sin voz en el orden del vídeo. Los tiempos reales
   (frases y palabras) los escribe el montaje en tiempos.js.
   ===================================================================== */
window.GUION = [
  { bloque: 'TITULO', dur: 5.0 },
  { id: 'A1', txt: "En el vídeo de modulación descubriste que modular es viajar de una tonalidad a otra.", pausa: 0.3 },
  { id: 'A2', txt: "Ahora lo hacemos con nuestro método, al estilo simple: siete casillas, bloque a bloque.", pausa: 0.3 },
  { id: 'A3', txt: "Nos centraremos en la modulación diatónica, ¿vale?", pausa: 0.7 },
  { id: 'B1', txt: "En el portal te dan la primera y la última: la tónica de la tonalidad A y la de la tonalidad B.", pausa: 0.4 },
  { id: 'B2', txt: "En el ejemplo del libro, C y G.", pausa: 0.2 },
  { id: 'B3', txt: "Es decir, Do Mayor y Sol Mayor.", pausa: 0.7 },
  { id: 'C1', txt: "El primer paso, el paso cero, si quieres, será poner las armaduras.", pausa: 0.3 },
  { id: 'C2', txt: "Do Mayor, sin alteraciones.", pausa: 0.2 },
  { id: 'C3', txt: "Y Sol Mayor, un sostenido.", pausa: 0.4 },
  { id: 'C4', txt: "Y ya sabemos cuál es la nota conflictiva en este caso: Fa.", pausa: 0.3 },
  { id: 'C5', txt: "Para Do Mayor es natural,", pausa: 0.0 },
  { id: 'C6', txt: "y para Sol Mayor es sostenido.", pausa: 0.25 },
  { id: 'D1', txt: "Paso uno.", pausa: 0.1 },
  { id: 'D2', txt: "Asentamos la tonalidad A con una cadencia básica: primero, cuarto, quinto con séptima, acuérdate, y primero.", pausa: 0.2 },
  { bloque: 'SON_CAD', dur: 5.8 },
  { id: 'E1', txt: "Vamos con el paso dos.", pausa: 0.2 },
  { id: 'E2', txt: "La casilla cinco, la puerta: un acorde común a las dos tonalidades. Solo tienes que evitar los que llevan la nota conflictiva.", pausa: 0.4 },
  { id: 'E3', txt: "Y si las armaduras se diferencian en dos alteraciones, hay dos notas conflictivas: hay que evitar las dos.", pausa: 0.15 },
  { id: 'E4', txt: "En el libro elegimos Mi menor.", pausa: 0.1 },
  { id: 'E5', txt: "Para Do Mayor es un tercer grado, y para Sol Mayor, un sexto.", pausa: 0.5 },
  { id: 'F1', txt: "Paso tres: asentar la tonalidad B.", pausa: 0.3 },
  { id: 'F2', txt: "La casilla siete ya te la dan: la tónica, Sol.", pausa: 0.3 },
  { id: 'F3', txt: "Así que en la casilla seis va siempre su dominante, con séptima: Re séptima.", pausa: 0.2 },
  { bloque: 'SON_MOD1', dur: 8.8 },
  { id: 'G1', txt: "Y tres aclaraciones que te ahorran muchos errores. Fíjate bien.", pausa: 0.4 },
  { id: 'G2', txt: "Primera:", pausa: 0.1 },
  { id: 'G3', txt: "los acordes de dominante los ponemos con séptima. Es cuestión de estilo: aporta tensión y era lo más utilizado en las épocas que más trabajamos en el conservatorio, ¿vale?", pausa: 0.2 },
  { id: 'G4', txt: "En el portal, si te la olvidas, pierdes medio punto.", pausa: 0.4 },
  { id: 'G5', txt: "Dos: el acorde de dominante es siempre Mayor, diga lo que diga la armadura.", pausa: 0.28 },
  { id: 'G6', txt: "Si yo estoy en una tonalidad menor, pongo el quinto grado y no hago nada más, me quedaría un quinto grado menor, sin sensible.", pausa: 0.1 },
  { bloque: 'SON_VMEN', dur: 4.55 },
  { id: 'G7', txt: "Fuera de estilo total.", pausa: 0.5 },
  { id: 'G8', txt: "Así que, para evitar errores, cuando toque un quinto grado, solo pones la letra y, por una cuestión de estilo, como te he dicho antes, pones el 7. El 7 te genera un acorde de dominante, que per se es una tríada Mayor. Así que con eso ya lo tenemos solucionado.", pausa: 0.1 },
  { bloque: 'SON_V7', dur: 4.4 },
  { id: 'G9', txt: "Tres: ¿y cómo sé si los demás acordes que pongo por ahí son Mayores o menores?", pausa: 0.2 },
  { id: 'G10', txt: "Pues mira la armadura que les toca.", pausa: 0.2 },
  { id: 'G11', txt: "Y el acorde puente, pues da igual cuál mires: tiene que coincidir en las dos. ¿Lo entiendes?", pausa: 0.4 },
  { id: 'H1', txt: "Vamos con otro ejemplo: de Do Mayor a Mi menor.", pausa: 0.3 },
  { id: 'H2', txt: "Las armaduras: de Do Mayor, nada, y Mi menor, un sostenido.", pausa: 0.3 },
  { id: 'H3', txt: "La cadencia en Do Mayor, la de siempre: Do, Fa, Sol séptima y Do.", pausa: 0.3 },
  { id: 'H4', txt: "El acorde puente, pues uno que no tenga la nota Fa, que es la conflictiva.", pausa: 0.2 },
  { id: 'H5', txt: "La menor nos sirve: es el sexto grado para Do Mayor y el cuarto en Mi menor.", pausa: 0.3 },
  { id: 'H6', txt: "Y para cerrar en Mi menor, su dominante: Si séptima. Y aquí te puedo explicar el ejemplo que decía antes: Si, Re sostenido, Fa sostenido, La. Mayor, aunque estemos en tonalidad menor, en Mi menor.", pausa: 0.1 },
  { bloque: 'SON_MOD2', dur: 8.8 },
  { id: 'P1', txt: "En el portal, en cada casilla eliges la nota, su alteración, el tipo y, si es una dominante, con el botón de séptima.", pausa: 0.5 },
  { id: 'R1', txt: "Recapitulando: tenemos claro las armaduras de las dos tonalidades y la nota o notas conflictivas.", pausa: 0.2 },
  { id: 'R2', txt: "Empezamos con un proceso cadencial típico en la tonalidad A.", pausa: 0.2 },
  { id: 'R3', txt: "La casilla cinco nos sirve como puente: el acorde común que no tenga la nota conflictiva.", pausa: 0.2 },
  { id: 'R4', txt: "Y luego, al final, rematas con un quinto-primero.", pausa: 0.0 },
  { id: 'O1', txt: "Se me ha olvidado comentar una cosa. Es posible que alguno de los ejercicios, en lugar de siete casillas, tenga ocho. En esos casos, la casilla que añadimos es la que hay después del puente de modulación.", pausa: 0.2 },
  { id: 'O2', txt: "Ahí, en lugar de terminar simplemente con un quinto-primero, podemos currarnos un poquito más el proceso cadencial final y hacer un cuarto, quinto, primero.", pausa: 0.1 },
  { bloque: 'SON_OCHO', dur: 9.64 },
  { id: 'T1', txt: "Me permitís un último truco: el acorde cuarto, da igual en qué tonalidad estés, va a ser del mismo modo que la tónica.", pausa: 0.2 },
  { id: 'T2', txt: "Si yo estoy en Do menor, mi cuarto grado va a ser Fa menor.", pausa: 0.1 },
  { bloque: 'SON_IVMEN', dur: 3.3 },
  { id: 'T3', txt: "Si yo estoy en Do Mayor, mi cuarto grado va a ser Fa Mayor.", pausa: 0.1 },
  { bloque: 'SON_IVMAY', dur: 3.3 },
  { id: 'T4', txt: "Por supuesto, lo puedes comprobar en el pentagrama con la armadura correspondiente, pero es un pequeño atajo.", pausa: 0.5 },
  { id: 'T5', txt: "Y las quintas no las tienes que pensar, ¿verdad? ¿Cómo tienen que ser? El quinto grado tiene que ser Mayor y con séptima.", pausa: 0.5 },
  { id: 'Z1', txt: "Venga, es normal que haya dudas. Esto sí que es un contenido totalmente nuevo y le vamos a dedicar más cariño.", pausa: 0.0 },
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
