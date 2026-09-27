/* =====================================================================
   GUION · Compases extraños (2.º GP · Unidad 1)
   Texto de la narración partido en frases (id), en el orden de la intro.
   · Mientras no haya voz grabada, los tiempos se ESTIMAN (ritmo medio de
     la narración de Iago en el fonógrafo: ≈5,7 sílabas/s) y la frase sale
     subtitulada.
   · Cuando exista la grabación, el guion de sincronía genera
     tiempos.js (window.TIEMPOS) con los tiempos reales de cada
     frase y palabra; entonces todo se recoloca solo.
   pausa = silencio extra DESPUÉS de la frase (norma 9: respirar en momentos
   lógicos para que las animaciones tengan su sitio).
   bloque = momento sin voz (dictado, cilindro de cera…) con duración fija.
   ===================================================================== */
window.GUION = [
  { bloque: 'TITULO', dur: 4.9 },

  // ---------------- A · El dictado
  { id: 'A1', txt: 'Vale, imagina: empiezas a hacer un dictado en clase.' },
  { id: 'A2', txt: 'Ya sabes la tonalidad, la armadura… y ahora toca deducir el compás. Lo típico.', pausa: 0.4 },
  { id: 'A3', txt: 'La música empieza a sonar…', pausa: 0.2 },
  { bloque: 'DICTADO', dur: 6.4 },
  { id: 'A4', txt: '…y no te cuadra nada.', pausa: 1.6 },
  { id: 'A5', txt: '¿Será un cinco por ocho?…', pausa: 1.4 },
  { id: 'A6', txt: '…pero es que tampoco.', pausa: 0.9 },
  { id: 'A7', txt: 'Bueno, pues algo parecido les pasó a dos compositores y musicólogos que deberían de empezar a sonarte: Bartók y Kodály. Escucha.', pausa: 0.2 },
  { bloque: 'CILINDRO', dur: 5.2 },

  // ---------------- B · Bartók y Kodály
  { id: 'B1', txt: 'Bartók y Kodály, a principios del siglo veinte, empezaron a recoger música campesina y a grabar parte de ella en cilindros fonográficos.' },
  { id: 'B2', txt: '¿Te suena?', pausa: 0.9 },
  { id: 'B3', txt: 'El objetivo era estudiar la música del folclore húngaro para analizarla, y luego utilizarla como inspiración en lo que ahora llamamos música nacionalista.', pausa: 0.5 },
  { id: 'B4', txt: 'Poco a poco se adentraron en los rincones más desconocidos, y sus lugareños tocaban sus canciones tradicionales.' },
  { id: 'B5', txt: '¿Qué se encontraron? Rítmicas imposibles de cuadrar.', pausa: 1.0 },
  { id: 'B6', txt: 'Este es solo un ejemplo: han sucedido también otras situaciones parecidas, pero el patrón es siempre el mismo.', pausa: 0.3 },
  { id: 'B7', txt: 'Música folclórica de una región… grabación de muestras… transcripción analítica… descubrimiento y estudio de métricas inéditas… y necesidad de nuevos compases.', pausa: 1.2 },

  // ---------------- C · Tres formas de una misma realidad
  { id: 'C1', txt: 'Bien, pues vamos a ver estos compases extraños.', pausa: 0.4 },
  { id: 'C2', txt: 'Lo primero que quiero que sepas es que lo que vamos a ver son tres formas diferentes de representar una misma realidad.', pausa: 0.5 },
  { id: 'C3', txt: 'Es posible que tengas un tipo de compás favorito, pero debemos conocer los tres. Vamos a por ellos.', pausa: 1.0 },

  // ---------------- D · Mixtos
  { id: 'D1', txt: 'Compases mixtos.', pausa: 0.5 },
  { id: 'D2', txt: '¿Qué te viene a la cabeza con la palabra mixto? Pues precisamente eso: una mezcla.', pausa: 0.4 },
  { id: 'D3', txt: 'En este caso, es la suma de dos compases con denominadores distintos.', pausa: 0.8 },
  { id: 'D4', txt: 'Y ojo, no los confundas con los compases de amalgama.' },
  { id: 'D5', txt: 'En los de amalgama sumamos compases con el mismo denominador, así que el pulso mantiene siempre el mismo valor. Aquí no.', pausa: 1.0 },
  { id: 'D6', txt: 'No se puede ni se pretende unificarlos, como el agua y el aceite. Lo interesante es ir alternándolos.', pausa: 0.8 },
  { id: 'D7', txt: 'Mira estos tres ejemplos. Dos por cuatro más uno por ocho: dos negras y una corchea.', propuesta: true, pausa: 0.4 },
  { id: 'D8', txt: 'Dos por cuatro más tres por dieciséis: dos negras y tres semicorcheas.', propuesta: true, pausa: 0.3 },
  { id: 'D9', txt: 'Y dos por cuatro más tres por treinta y dos: dos negras y tres fusas.', propuesta: true, pausa: 0.6 },
  { id: 'D10', txt: 'Muchas veces verás en la partitura esta línea discontinua: es una forma de indicarnos dónde está el cambio. GPS incorporado.', pausa: 1.3 },

  // ---------------- E · Decimales
  { id: 'E1', txt: 'Compases decimales.', pausa: 0.5 },
  { id: 'E2', txt: 'Aquí el numerador, en lugar de ser un número entero, tiene decimales. Por ejemplo: dos coma cinco por cuatro.', pausa: 0.6 },
  { id: 'E3', txt: 'Creo que es bastante intuitivo: tenemos dos negras y media. Es decir, dos negras y una corchea. ¿Se entiende?', pausa: 0.8 },
  { id: 'E4', txt: '¿Y si en vez de añadir una corchea quisiéramos añadir una semicorchea? Si los cálculos no fallan: dos coma veinticinco por cuatro.', pausa: 1.0 },
  { id: 'E5', txt: 'Y básicamente esa es la idea.', pausa: 1.0 },

  // ---------------- F · Fraccionarios
  { id: 'F1', txt: 'Ahora vamos con los fraccionarios.', pausa: 0.3 },
  { id: 'F2', txt: 'Se parecen bastante a los decimales, pero aquí hay que tener un poco de cuidado.', pausa: 0.4 },
  { id: 'F3', txt: 'En vez de utilizar un decimal, añadimos una fracción al numerador. Así que, en lugar de escribir dos coma cinco, podríamos expresar la misma idea como dos más un medio.', pausa: 0.7 },
  { id: 'F4', txt: 'Seguimos hablando exactamente de lo mismo: dos pulsos completos y medio pulso más. La fracción hace referencia al valor del denominador.', pausa: 0.9 },
  { id: 'F5', txt: 'El problema es que visualmente puede confundir.' },
  { id: 'F6', txt: 'Como un compás ya tiene un número encima de otro, y una fracción también, alguien podría mirar ese numerito pequeño y pensar que estamos indicando otra figura, o incluso otro compás.', pausa: 0.5 },
  { id: 'F7', txt: 'Siempre hay el típico que ve esto… y piensa que es un dos por cuatro más un uno por dos, y le añade una blanca.', pausa: 0.6 },
  { id: 'F8', txt: 'Esto no es un compás mixto, crack. Se ve la diferencia de tamaños, ¿no?', pausa: 0.8 },
  { id: 'F9', txt: 'Ese número pequeño es una fracción, no un compás. No lo olvides. Creo que el nombre ayuda a no olvidarse: ¡fraccionario!', pausa: 1.0 },
  { id: 'F10', txt: 'Ah, y una cosa interesante es que los fraccionarios también pueden escribirse restando.', pausa: 0.4 },
  { id: 'F11', txt: 'Imagínate que el ritmo de uno de estos aldeanos es casi un cuatro por cuatro, pero le falta una pequeña parte. Pues podemos escribir directamente cuatro por cuatro y restarle lo que falta.', pausa: 0.5 },
  { id: 'F12', txt: 'Por ejemplo, si le falta una semicorchea, escribiríamos cuatro menos un cuarto, sobre cuatro.', pausa: 0.8 },
  { id: 'F13', txt: 'Es otra forma de representar exactamente la misma realidad rítmica.', pausa: 1.0 },

  // ---------------- G · Cierre
  { id: 'G1', txt: 'Venga, ahora toca hacer ejercicios para afianzar esta idea. ¡Vamos a por ellos!' },
  { bloque: 'COLA', dur: 2.6 },          // solo música hasta el acorde final (se ajusta al compás)
  { bloque: 'FINAL', dur: 3.2 },         // acorde final + título + Salir / Ir a ejercicios
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
