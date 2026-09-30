/* =====================================================================
   GUION · Modos
   Frases (id) y bloques sin voz en el orden del vídeo. Los tiempos reales
   (frases y palabras) los escribe el montaje en tiempos.js.
   ===================================================================== */
window.GUION = [
  { bloque: 'TITULO', dur: 5.0 },
  { id: 'I1', txt: "Hoy vamos a ver los modos: a fin de cuentas, son escalas, o combinaciones de tonos y semitonos, como ya conoces.", pausa: 0.4 },
  { id: 'I2', txt: "Algunos son muy antiguos, reinterpretaciones, que hoy suenan en el jazz, en el cine, en los videojuegos…", pausa: 0.3 },
  { id: 'I3', txt: "Y cada uno tiene su carácter, porque no, no toda la música es o triste o alegre.", pausa: 0.6 },
  { id: 'I4', txt: "En el libro los construimos todos sobre la nota Re, y para escribirlos sin volverte loco hay un método de tres pasos.", pausa: 0.8 },
  { id: 'P1', txt: "Paso 1: saber si el modo es de la familia Mayor o de la familia menor.", pausa: 0.3 },
  { id: 'P2', txt: "De la familia Mayor tenemos el jónico, el lidio y el mixolidio.", pausa: 0.2 },
  { id: 'P3', txt: "Y de la familia menor tenemos el dórico, el frigio, el eólico…", pausa: 0.2 },
  { id: 'P4', txt: "Y bueno, del locrio te hablo después.", pausa: 0.8 },
  { id: 'Q1', txt: "Paso 2: ponemos la armadura de la tonalidad Mayor o menor.", pausa: 0.3 },
  { id: 'Q2', txt: "Por ejemplo, Re dórico es de la familia menor, así que la armadura de Re menor: un bemol.", pausa: 0.8 },
  { id: 'R1', txt: "Paso 3: fíjate en la nota característica, la que hace a este modo distinto de su escala Mayor o menor de referencia.", pausa: 0.4 },
  { id: 'R2', txt: "Al final, si te fijas, cada modo lo aprendemos con dos referencias: ¿qué tipo de escala es, Mayor o menor? Y la nota característica.", pausa: 0.9 },
  { id: 'E1', txt: "Venga, un ejemplo: Re dórico.", pausa: 0.2 },
  { id: 'E2', txt: "Re dórico es menor con el sexto para arriba.", pausa: 0.2 },
  { id: 'E3', txt: "La sexta de Re es Si; si en este caso, por la armadura, el Si es bemol, pues habrá que subirlo: le ponemos un becuadro.", pausa: 0.1 },
  { bloque: 'SON_DOR_ESC', dur: 3.4 },
  { id: 'E4', txt: "Otro ejemplo: Re lidio. Viene de Mayor, y el cuarto grado hay que subirlo. Coloco la armadura de Re Mayor, y la nota característica: pues subimos al Sol sostenido.", pausa: 0.1 },
  { bloque: 'SON_LID_ESC', dur: 3.4 },
  { id: 'L1', txt: "Te debo una explicación acerca del Re locrio. Sí, viene de la familia menor, pero además el quinto grado está disminuido; por lo tanto, realmente, ni siquiera tenemos esa referencia de la quinta justa. Así que nada, la receta que te tienes que aprender es: menor, y luego rebajar el segundo grado, al igual que el frigio, pero también el quinto. Es un modo muy inestable: se utiliza bastante para generar tensión, y bastante en cine de terror.", pausa: 0.1 },
  { bloque: 'SON_LOC_ESC', dur: 3.4 },
  { id: 'T1', txt: "Venga, puedes practicar aquí en el portal todo lo que quieras. Te saldrán distintas tónicas, pero el método es el mismo.", pausa: 0.9 },
  { id: 'S1', txt: "Y para acabar, lo que realmente tiene mayor valor: porque podemos hacer ejercicios de teoría, y está muy bien,", pausa: 0.2 },
  { id: 'S2', txt: "pero lo importante es escucharlos. Cada modo tiene su color. El dórico suena como a nostalgia y a misterio, tipo música de Stranger Things.", pausa: 0.1 },
  { bloque: 'SON_DOR', dur: 8.2 },
  { id: 'S3', txt: "El lidio suena a magia, suena a fantasía, ¿no?", pausa: 0.1 },
  { bloque: 'SON_LID', dur: 8.2 },
  { id: 'S4', txt: "El frigio nos recuerda un poco al flamenco.", pausa: 0.1 },
  { bloque: 'SON_FRI', dur: 6.4 },
  { id: 'S5', txt: "Lo que sientas al escucharlos también es saber modos. Y, de verdad, aquellas palabras o recuerdos que se te vengan a la mente cuando escuches algo en un modo, realmente son las palabras que a ti te tienen que servir de referencia. No solo quiero que aprendas la receta: quiero que aprendas lo que puedes percibir y transmitir con ellos.", pausa: 0.9 },
  { id: 'F1', txt: "Venga, repaso final: cada modo tiene una receta con dos ingredientes: una referencia, Mayor o menor, y las notas características.", pausa: 0.3 },
  { id: 'F2', txt: "Con eso, la parte más teórica la tienes solucionada.", pausa: 0.0 },
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
