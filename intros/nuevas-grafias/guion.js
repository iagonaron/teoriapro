/* =====================================================================
   GUION · Nuevas grafías (2.º GP · Unidad 4 · Apuntes pp. 16–18)
   Frases (id) y bloques sin voz en el orden del vídeo. Los tiempos reales
   (frases y palabras) los escribe el montaje en tiempos.js; mientras no
   haya grabación, se estiman aquí (ritmo de Iago).
   ===================================================================== */
window.GUION = [
  { bloque: 'TITULO', dur: 5.0 },
  { id: 'I1', txt: "Mira estos tres compases. Y escúchalos.", pausa: 0.2 },
  { bloque: 'SON_ABC', dur: 8.6 },
  { id: 'I2', txt: "Suenan igual, ¿verdad? Tienen el mismo ritmo. Pues hazme un favor: dime en qué compás está escrito cada uno.", pausa: 1.2 },
  { id: 'I3', txt: "Estoy seguro de que en el a) y en el b) no tienes dudas. El a), tres por cuatro. El b), seis por ocho.", pausa: 0.3 },
  { id: 'I4', txt: "¿Y cómo lo sabes, si no te lo he dicho? Porque la propia figuración te da la pista: te dice cómo se agrupan los pulsos.", pausa: 0.4 },
  { id: 'T1', txt: "Eso es la notación tradicional: agrupar las figuras por pulsos. Es su prioridad. Así, el que toca sabe en todo momento dónde está. Y para eso funciona de maravilla.", pausa: 0.5 },
  { id: 'M1', txt: "¿Y el c)? El c) no te da ninguna pista… porque no le importa. Es el mismo ritmo escrito con lo mínimo: una corchea, una blanca y otra corchea.", pausa: 0.2 },
  { id: 'M2', txt: "Esto son las nuevas grafías, también llamadas escritura moderna.", pausa: 0.3 },
  { id: 'M3', txt: "En la escritura moderna, el compás que esté indicado no es relevante. Lo que busca es reducir la escritura a la mínima expresión gráfica. Por eso también la llamamos notación minimalista.", pausa: 0.3 },
  { id: 'M4', txt: "Es un poco como decir «finde» en lugar de decir «fin de semana». Es una forma abreviada con la que nos entendemos.", pausa: 0.6 },
  { id: 'R0', txt: "Este ha sido un ejemplo muy básico. Vamos a ver lo que nos enseñan algunos libros. Son cuatro recursos.", pausa: 0.4 },
  { id: 'R1', txt: "Uno: las ligaduras. La escritura moderna tiende a eliminarlas, haya síncopa o no. Las figuras ligadas se suman y se agrupan en una sola. Mira: en seis por ocho, una negra con puntillo ligada a una corchea… es una blanca. Y listo.", pausa: 0.6 },
  { id: 'R2', txt: "Dos: los puntillos. Los compositores modernos tienen una marcada preferencia por el doble, el triple… ¡y hasta el cuádruple puntillo! Esta corchea con puntillo, ligada a una negra, se convierte en una negra con doble puntillo.", pausa: 0.6 },
  { id: 'R3', txt: "Tres: el barrado. Las barras de las corcheas ya no respetan la división del compás en tiempos: unen notas de pulsos distintos… e incluso se saltan la línea divisoria.", pausa: 0.6 },
  { id: 'R4', txt: "Y cuatro: nuevas formas de indicar el compás. Abajo, en lugar de un número, la figura que vale cada pulso.", pausa: 0.3 },
  { id: 'R4b', txt: "Un dos por cuatro: un dos encima de una negra. Un seis por ocho: un seis encima de una corchea… o un dos encima de una negra con puntillo, también.", pausa: 0.8 },
  { id: 'D1', txt: "Todo esto, sumado a grupos irregulares cada vez más complejos —tresillos, cinquillos, septillos—, a ritmos asimétricos, a cambios constantes de tempo y a acentos irregulares… ha ido desintegrando poco a poco la idea de compás. El ritmo se ha liberado. Y la simetría ha dejado paso a la asimetría.", pausa: 0.9 },
  { id: 'F1', txt: "Repasando. Notación tradicional: las figuras, agrupadas por pulsos. Nuevas grafías, o escritura moderna: la mínima expresión gráfica, y el compás deja de importar.", pausa: 0.3 },
  { id: 'F2', txt: "¿Sus recursos? Sumar lo que va ligado, dobles y triples puntillos, barras que se saltan los pulsos y el compás indicado con una figura.", pausa: 0.7 },
  { id: 'Q0', txt: "Ahora te toca a ti. Te voy a enseñar unos ejemplos y tienes unos segundos para decidir. ¿Preparado? Vamos.", pausa: 0.0 },
  { bloque: 'COLA', dur: 4.0 },
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
      if (/[,;:—]$/.test(w)) t += 0.32;
      if (/[.?!)]$/.test(w)) t += 0.55;
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
