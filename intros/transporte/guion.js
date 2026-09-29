/* =====================================================================
   GUION · Transporte
   Frases (id) y bloques sin voz en el orden del vídeo. Los tiempos reales
   (frases y palabras) los escribe el montaje en tiempos.js.
   ===================================================================== */
window.GUION = [
  { bloque: 'TITULO', dur: 5.0 },
  { id: 'A1', txt: "Transportar, como habrás visto en el portal interactivo, es escribir o interpretar una obra musical en una tonalidad distinta, ya sea más grave o más aguda.", pausa: 0.3 },
  { id: 'A2', txt: "Ojo: el transporte es absoluto, el modo no cambia.", pausa: 0.3 },
  { id: 'A3', txt: "Esto quiere decir que si una melodía es…", pausa: 0.0 },
  { id: 'A4', txt: "alegre, es decir, está en modo Mayor, digamos, pues tú, por mucho que la subas o la bajes, va a seguir siendo Mayor. Esto no tiene que ver con relativos ni nada: simplemente, subir por la fuerza una melodía hacia arriba o hacia abajo.", pausa: 0.2 },
  { bloque: 'SON_DEF', dur: 10.9 },
  { id: 'B1', txt: "Vamos a ver ahora las dos formas que hay de hacer transporte.", pausa: 0.4 },
  { id: 'B2', txt: "El primero sería el transporte escrito.", pausa: 0.1 },
  { id: 'B3', txt: "Literalmente, hay que reescribir la pieza en la nueva tonalidad.", pausa: 0.3 },
  { id: 'B4', txt: "Mira este ejemplo.", pausa: 0.1 },
  { id: 'B5', txt: "Transportar esta melodía una segunda Mayor descendente.", pausa: 0.1 },
  { bloque: 'SON_ESC_SOL', dur: 3.9 },
  { id: 'B6', txt: "Lo primero es ver en qué tonalidad está. Esto parece que está en Sol Mayor.", pausa: 0.2 },
  { id: 'B7', txt: "Y bueno, pues ahora tendríamos que poner la armadura de la nueva tonalidad.", pausa: 0.2 },
  { id: 'B8', txt: "Si tenemos que bajar una segunda Mayor, pues sería Fa Mayor. Por lo tanto, la armadura ahora es un bemol.", pausa: 0.2 },
  { id: 'B9', txt: "Y volvemos a reescribir la partitura.", pausa: 0.1 },
  { bloque: 'SON_ESC_FA', dur: 3.9 },
  { id: 'B10', txt: "Desventajas, obvias: hay que tomarse la molestia de escribirlo de nuevo.", pausa: 0.2 },
  { id: 'B11', txt: "En el ejemplo son solo tres compases, pero ponte tú a transportar una sinfonía entera, imagínate.", pausa: 0.3 },
  { id: 'B12', txt: "Por suerte, si tenemos el archivo en nuestro programa de edición de partituras, digamos, formato digital, oye, lo hacemos con uno o dos clics, pero imagínate con las partituras manuscritas.", pausa: 0.5 },
  { id: 'B13', txt: "Otra desventaja es que la partitura original ya no la vas a utilizar, así que menudo desperdicio de papel.", pausa: 0.4 },
  { id: 'B14', txt: "Eso sí, la ventaja clara es que, una vez transportado, simplemente tocas tu partitura. No hay nada más que hacer ni que pensar.", pausa: 0.6 },
  { id: 'M1', txt: "Transporte mental. En este caso, las anotaciones las vamos a hacer en el papel y nos va a llevar poco tiempo, pero vamos a tener que darle bastante a la cabeza, y pondremos a prueba nuestros reflejos mentales.", pausa: 0.5 },
  { id: 'M2', txt: "Vamos con este ejemplo. Transportar este fragmento una tercera menor ascendente.", pausa: 0.1 },
  { bloque: 'SON_MEN_RE', dur: 3.9 },
  { id: 'M3', txt: "Nos fijamos en esta melodía: aparenta estar en Re Mayor.", pausa: 0.3 },
  { id: 'M4', txt: "Y si transportamos una tercera menor ascendente, pasaríamos Re, Mi, Fa: Fa Mayor.", pausa: 0.3 },
  { id: 'M5', txt: "Vale, pues tachamos la armadura que aparece ahí y añadimos la nueva: un bemol, porque estamos en Fa Mayor. Bien.", pausa: 0.3 },
  { id: 'M6', txt: "Hacemos lo mismo con la clave.", pausa: 0.2 },
  { id: 'M7', txt: "Tenemos que hacer que, sea cual sea la clave, las notas que estén escritas se llamen ya de la forma nueva. La primera nota se tiene que llamar Fa.", pausa: 0.2 },
  { id: 'M8', txt: "Así que, en este caso, ponemos la clave de Fa en cuarta.", pausa: 0.1 },
  { bloque: 'SON_MEN_FA', dur: 3.9 },
  { id: 'M9', txt: "Este ejemplo es bastante amigable, pues resulta que la clave resultante es Fa en cuarta, lo cual estamos bastante habituados.", pausa: 0.3 },
  { id: 'M10', txt: "Si requiere alguna clave que no dominamos, lo que se suele hacer, sinceramente, es contar mentalmente. Lo siento mucho, pero es la verdad.", pausa: 0.6 },
  { id: 'M11', txt: "Desventajas: pues, según la clave que te toque, puede ser bastante duro, o muy duro, a nivel mental. Si no tienes hábito, es probable que la mitad de las notas vayan fuera.", pausa: 0.4 },
  { id: 'M12', txt: "Ventajas: un par de anotaciones y a confiar en tu habilidad. Es un método muy rápido, y no te quedará otra si vas justo de tiempo.", pausa: 0.6 },
  { id: 'P1', txt: "Espera un momento.", pausa: 0.2 },
  { id: 'P2', txt: "¿Por qué en el ejemplo de arriba el Sol es sostenido", pausa: 0.0 },
  { id: 'P3', txt: "y abajo, en el transporte, la misma nota lleva… un becuadro?", pausa: 0.2 },
  { id: 'P4', txt: "¿Por qué está tachado?", pausa: 0.6 },
  { id: 'P5', txt: "Pues será mejor que te sientes. Todavía nos queda una cosa por ver. Y no te va a gustar.", pausa: 0.6 },
  { id: 'D1', txt: "Hablemos de las diferencias.", pausa: 0.3 },
  { id: 'D2', txt: "Al cambiar de tonalidad y armadura, algunas de las notas alteradas accidentalmente pueden sufrir modificaciones en cuanto a los signos de alteración que tenían.", pausa: 0.2 },
  { id: 'D3', txt: "Estas modificaciones se llaman diferencias.", pausa: 0.4 },
  { id: 'D4', txt: "Para explicarte lo de las diferencias, creo que será mejor idea empezar con un ejemplo desde el principio.", pausa: 0.1 },
  { bloque: 'SON_DIF_RE', dur: 3.9 },
  { id: 'D5', txt: "Vamos a hacer este transporte escrito.", pausa: 0.2 },
  { id: 'D6', txt: "Primero, la armadura de partida, que está ahí: dos sostenidos.", pausa: 0.2 },
  { id: 'D7', txt: "Después calculamos la nueva tonalidad. Subimos una tercera: Fa Mayor.", pausa: 0.2 },
  { id: 'D8', txt: "Entonces tiene un bemol. Vale, lo vamos poniendo en el pentagrama de abajo.", pausa: 0.3 },
  { id: 'D9', txt: "Bien, escribimos la partitura de nuevo.", pausa: 0.4 },
  { id: 'D10', txt: "Y ahora tenemos que hacer un cálculo.", pausa: 0.2 },
  { id: 'D11', txt: "Vamos a contar los pasos de una armadura a la otra.", pausa: 0.2 },
  { id: 'D12', txt: "De dos sostenidos pasamos a un bemol. Son tres pasos.", pausa: 0.5 },
  { id: 'D13', txt: "Mira, escucha: imagínate que los sostenidos son como lo alto de una montaña; cuantos más sostenidos, más alto.", pausa: 0.2 },
  { id: 'D14', txt: "Cuando no hay armadura, es el nivel del mar. Y los bemoles son las profundidades.", pausa: 0.3 },
  { id: 'D15', txt: "De dos sostenidos a un bemol has bajado tres escalones: tres diferencias descendentes.", pausa: 0.5 },
  { id: 'D16', txt: "Ojo: descendentes no quiere decir que la melodía baje. Aquí la música sube una tercera, en este ejemplo.", pausa: 0.1 },
  { id: 'D17', txt: "Lo que desciende es el camino en el mapa de las armaduras.", pausa: 0.2 },
  { id: 'D18', txt: "Imagínate las tonalidades del círculo de quintas puestas en una columna.", pausa: 0.2 },
  { id: 'D19', txt: "Y aquí hemos bajado tres pasos.", pausa: 0.8 },
  { id: 'N1', txt: "¿Y para qué sirve saber cuántas diferencias son, y si suben o si bajan? Pues para ver qué notas vigilar si están alteradas accidentalmente.", pausa: 0.3 },
  { id: 'N2', txt: "En el ejemplo, tres diferencias descendentes quiere decir que si cualquiera de las tres primeras notas del orden de bemoles tiene una alteración accidental, va a haber que rebajar la alteración que tenía inicialmente.", pausa: 0.6 },
  { id: 'N3', txt: "Respira. Sé que esto es duro de entender y de encajar, pero… es lo último del curso. Va, último esfuerzo.", pausa: 0.4 },
  { id: 'N4', txt: "Lo vamos a explicar poco a poco.", pausa: 0.2 },
  { id: 'N5', txt: "Si en la partitura transportada apareciese un Si, un Mi o un La con alteración accidental, se la cambias por la inmediatamente inferior. Un sostenido pasa a becuadro, y un becuadro, a bemol.", pausa: 0.5 },
  { id: 'N6', txt: "En el ejemplo, en Re Mayor hay un Sol sostenido. Transportado, ese Sol pasa a llamarse Si,", pausa: 0.1 },
  { id: 'N7', txt: "pero no puede ser Si sostenido, porque sonaría demasiado alto: no habría correspondencia interválica.", pausa: 0.1 },
  { bloque: 'SON_SI_MAL', dur: 3.9 },
  { id: 'N8', txt: "Diferencia descendente: se pone Si becuadro.", pausa: 0.1 },
  { bloque: 'SON_SI_BIEN', dur: 3.9 },
  { id: 'N9', txt: "Si las diferencias fueran ascendentes, hacia los sostenidos, sería al revés: las notas del orden de sostenidos, y una alteración más alta.", pausa: 0.9 },
  { id: 'E1', txt: "En las próximas clases estaremos viendo esto con calma, y además en el portal tienes tres tipos de ejercicio para poder practicar.", pausa: 0.3 },
  { id: 'E2', txt: "Unos son ejercicios de transporte escrito, otros de transporte mental, y uno último llamado Resumen, en el que practicas todo este razonamiento de armaduras, tonalidad, diferencias y qué notas vigilar, pero de forma bastante sencilla y simplificada.", pausa: 0.9 },
  { id: 'F1', txt: "Vamos a recapitular.", pausa: 0.2 },
  { id: 'F2', txt: "Transportar es mover la melodía de una tonalidad a otra. Podemos hacerlo escrito, lo cual lleva más tiempo, pero luego no hay que pensar, o mental, lo que se hace en un momento en el propio papel, pero requiere bastante concentración.", pausa: 0.3 },
  { id: 'F3', txt: "Y hay que tener cuidado con lo de las alteraciones accidentales, que puede haber diferencias. Tenemos que saber cuáles son las sospechosas, pero ahora lo vamos a poner en práctica hasta que quede bien claro.", pausa: 0.4 },
  { id: 'F4', txt: "Venga, mucho ánimo, que acabamos.", pausa: 0.0 },
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
