/* =====================================================================
   GUION · Serie armónica
   Frases (id) y bloques sin voz en el orden del vídeo. Los tiempos reales
   (frases y palabras) los escribe el montaje en tiempos.js.
   ===================================================================== */
window.GUION = [
  { bloque: 'TITULO', dur: 5.0 },
  { id: 'A1', txt: "¿Has visto el vídeo sobre cualidades del sonido? Te recomiendo que le eches un ojo antes de ver la serie armónica, y es que ahí habrás aprendido que los sonidos son compuestos, aunque el oído los perciba como individuales.", pausa: 0.6 },
  { id: 'A2', txt: "Cuando tocas una nota, no suena una sola:", pausa: 0.1 },
  { bloque: 'SON_MI2', dur: 3.6 },
  { id: 'A3', txt: "a la vez suenan muchos sonidos más agudos y más débiles: son los armónicos.", pausa: 0.3 },
  { id: 'A4', txt: "Y lo mejor es que siempre aparecen en el mismo orden, siempre, sea cual sea la nota.", pausa: 0.9 },
  { id: 'B1', txt: "Para construirla solo necesitas un código. Apúntatelo:", pausa: 0.2 },
  { id: 'B2', txt: "ocho, cinco, cuatro, tres, tres pequeños, tres pequeños, dos.", pausa: 0.6 },
  { id: 'B3', txt: "Parece la combinación de una caja fuerte, pero es un mapa: son los intervalos, siempre ascendentes, de un armónico al siguiente.", pausa: 0.3 },
  { id: 'B4', txt: "Octava justa, quinta justa, cuarta justa, tercera Mayor, tercera menor, tercera menor, segunda Mayor.", pausa: 0.4 },
  { id: 'B5', txt: "Y todavía seguirían, cada vez más pequeños, pero bueno, vamos a centrarnos en los ocho primeros.", pausa: 0.9 },
  { id: 'C1', txt: "Venga, el ejemplo del libro. Sobre Mi 2:", pausa: 0.2 },
  { id: 'C2', txt: "octava justa, Mi 3; una quinta justa, Si 3; una cuarta justa, Mi 4; tercera Mayor, Sol sostenido 4; tercera menor, Si 4; tercera menor, Re 5; y para acabar, segunda Mayor, Mi 5.", pausa: 0.3 },
  { bloque: 'SON_SERIE', dur: 4.8 },
  { id: 'C3', txt: "Como puedes comprobar, hay que estar frescos con los intervalos, porque como cometamos un error, la cadena ya se rompe.", pausa: 0.9 },
  { id: 'D1', txt: "Bueno, ¿ves algo?", pausa: 0.2 },
  { id: 'D2', txt: "El uno, el dos, el cuatro y el ocho son el mismo Mi, cada vez una octava más alta.", pausa: 0.4 },
  { id: 'D3', txt: "Tiene sentido, ¿no? Que se repita tanto la misma nota: a fin de cuentas, es la que más presencia tiene en el sonido, que aparentemente es uno… pero que ya sabemos que no.", pausa: 0.4 },
  { id: 'D4', txt: "Es el mejor truco para autocorregirte: si el uno, el dos, el cuatro y el ocho no se llaman igual, eso pinta mal, ¿eh?", pausa: 0.9 },
  { id: 'E1', txt: "Este es el concepto, básicamente, y ahora toca ponerlo en práctica. Tienes ejercicios en el portal.", pausa: 0.6 },
  { id: 'E2', txt: "Y si tocas un instrumento de viento metal, supongo que todo esto que te estoy contando te resultará familiar: y que las notas, cuanto más agudas son, más cerca están las unas de las otras, y llega un punto en el que ya ni siquiera tienes que mover o tocar los pistones para pasar de una nota a otra.", pausa: 0.3 },
  { id: 'E3', txt: "Si tienes la oportunidad de demostrarle esto a alguno de tus compañeros, la verdad es que es un ejemplo, pues, muy visual. Venga, ¡vamos con ellos!", pausa: 0.0 },
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
