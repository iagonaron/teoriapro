/* =====================================================================
   GUION · Índice acústico
   Frases (id) y bloques sin voz en el orden del vídeo. Los tiempos reales
   (frases y palabras) los escribe el montaje en tiempos.js.
   ===================================================================== */
window.GUION = [
  { bloque: 'TITULO', dur: 5.0 },
  { id: 'A1', txt: "¿Cuántos Do hay en un piano?", pausa: 0.1 },
  { bloque: 'SON_DOS', dur: 3.0 },
  { id: 'A2', txt: "Un montón. O sea, si te digo «toca el Do grave»… ¿sabes exactamente a cuál me refiero?", pausa: 0.5 },
  { id: 'A3', txt: "Bueno, pues para esto existen los índices acústicos: un número que dice objetivamente a qué altura está cada nota.", pausa: 0.7 },
  { id: 'B1', txt: "La referencia es el Do central, el del medio del piano, el que conoces de siempre: el Do4.", pausa: 0.4 },
  { id: 'B2', txt: "Y desde ese Do hasta el Si siguiente, todas las notas llevan el 4.", pausa: 0.5 },
  { id: 'B3', txt: "Si bajas del Do… pasas al 3.", pausa: 0.2 },
  { id: 'B4', txt: "Y si subes del Si4, pues vas al 5, y así, octava a octava.", pausa: 0.7 },
  { id: 'C1', txt: "Y aquí está todo el truco: el número solo cambia al pasar de Si a Do. Ni entre Mi–Fa, ni entre La–Si, ¿vale? Lo pillas: solo de Si a Do.", pausa: 0.6 },
  { id: 'C2', txt: "Y las alteraciones… no cuentan. Un Fa sostenido lleva el mismo número que su Fa.", pausa: 0.8 },
  { id: 'D1', txt: "Vamos al pentagrama.", pausa: 0.3 },
  { id: 'D2', txt: "En clave de Sol, el Do4 es el de la línea adicional de abajo, y la nota de la segunda línea es Sol4.", pausa: 0.5 },
  { id: 'D3', txt: "Ejemplos del libro: este Sol sostenido es Sol sostenido 5; este, Re… Re5; y este Si, justo por debajo del Do central, ya es Si3.", pausa: 0.8 },
  { id: 'E1', txt: "En clave de Fa, el Do4 es el de la línea adicional de arriba, y la cuarta línea, que da nombre a la clave, es Fa3.", pausa: 0.4 },
  { id: 'E2', txt: "Es un poco lío, porque es clave de Fa en cuarta, pero realmente el Fa es Fa3.", pausa: 0.5 },
  { id: 'E3', txt: "Venga, más ejemplos del libro: Re3, La2, Si bemol 1.", pausa: 0.8 },
  { id: 'F1', txt: "Un dato importante para que sepas la altura absoluta es que la clave de Do siempre indica el Do4.", pausa: 0.3 },
  { id: 'F2', txt: "Da igual qué clave de Do te encuentres:", pausa: 0.0 },
  { id: 'F3', txt: "su línea va a representar el Do4.", pausa: 0.8 },
  { id: 'G1', txt: "Venga, así que ya sabes: a partir de ahora habla con propiedad, y siempre que te refieras a una nota, añádele el índice acústico.", pausa: 0.0 },
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
