/* =====================================================================
   EL RETO · Nuevas grafías (2.º GP · U4) · 5-nov-2026
   Al acabar el vídeo («Empezar el reto»), tipo Kahoot:
   · EN CLASE: la pantalla pone un QR y un PIN; cada alumno entra desde su móvil (movil.html) con un apodo y contesta tocando el
     color. Puntos por acierto y rapidez (hasta 1000 por pregunta), clasificación cada 4 preguntas y podio al final.
     Servidor: las funciones suite_aq_* de Supabase (las del quiz de 4 Sabores), con la clave pública (reto-sb.js).
     Sin red o sin móviles también se juega: la clase contesta en voz alta y la pantalla marca la buena.
   · SOLO (en casa): las mismas preguntas, contestando en la pantalla, con su cuenta atrás y sus puntos.
   16 preguntas: 4 de cada tipo (¿cuál es moderna? · ¿qué recurso es? · ¿tradicional o moderna? · ¿a qué equivale?), sacadas al
   azar de un banco hecho con los ejemplos del libro (Apuntes 2.º GP, pp. 16–18). Todo se dibuja en el SVG de la intro.
   Pantalla del aula (Chrome 94, pocos fotogramas): nada depende de animaciones fluidas; los números cambian a saltos.
   Entradas: el botón «Empezar el reto» del final, o la dirección con #reto (va directo al reto, sin el vídeo).
   ===================================================================== */
(function () {
  'use strict';
  const N = window.NOTA, D = window.DIB, C = D.C;
  const { texto, panel, chip, pos, opa, color, mezcla } = D;
  const SP = 24, CX = 960;
  // (6-nov, Iago: vídeo + reto en unos 10 minutos) 10 preguntas: 3 ¿cuál es moderna? · 3 ¿tradicional o moderna? · 2 ¿qué recurso
  // es? · 2 ¿a qué equivale?; 15 s las de mirar y 20 s las de pensar; la clasificación, a la mitad
  const SEGT = { cual: 15, tm: 15, recurso: 20, equiv: 20 };
  const SEG = 20;
  const NPREG = 10, CADA = 5;
  const CUANTAS = { cual: 3, tm: 3, recurso: 2, equiv: 2 };
  const COL = ['#ec4899', '#3b82f6', '#fbbf24', '#22c55e'];
  const FORMA = ['M12 3 22 20H2z', 'M12 1.8 22.2 12 12 22.2 1.8 12z', null, 'M3 3h18v18H3z'];
  const $ = id => document.getElementById(id);

  // ================================================================ EL BANCO (ejemplos del libro)
  const R = {
    lig34a: { c: ['3', '4'], it: [{ n: '8' }, { n: 'q', p: 1, liga: true }, { n: '8', barra: 'x' }, { n: '8', barra: 'x' }] },
    lig34b: { c: ['3', '4'], it: [{ n: '8', barra: 'y' }, { n: '8', barra: 'y', liga: true }, { n: 'q', p: 1 }, { n: '8' }] },
    abc34: { c: ['3', '4'], it: [{ n: '8', barra: 'a' }, { n: '8', barra: 'a', liga: true }, { n: 'q', liga: true }, { n: '8', barra: 'b' }, { n: '8', barra: 'b' }] },
    mod34: { it: [{ n: '8' }, { n: 'h' }, { n: '8' }] },
    mod34c: { c: ['3', '4'], it: [{ n: '8' }, { n: 'h' }, { n: '8' }] },
    lig44: { c: ['4', '4'], it: [{ n: '8', barra: 'a' }, { n: '8', barra: 'a', liga: true }, { n: 'q', liga: true }, { n: '8', barra: 'b' }, { n: '8', barra: 'b', liga: true }, { n: 'q' }] },
    mod44: { it: [{ n: '8' }, { n: 'h' }, { n: 'q', p: 1 }] },
    mod44c: { c: ['4', '4'], it: [{ n: '8' }, { n: 'h' }, { n: 'q', p: 1 }] },
    lig68: { c: ['6', '8'], it: [{ n: 'q', p: 1, liga: true }, { n: '8', barra: 'c' }, { n: '8', barra: 'c' }, { n: '8', barra: 'c' }] },
    mod68: { it: [{ n: 'h' }, { n: '8', barra: 'd' }, { n: '8', barra: 'd' }] },
    mod68c: { c: ['6', '8'], it: [{ n: 'h' }, { n: '8', barra: 'd' }, { n: '8', barra: 'd' }] },
    pun1t: { it: [{ n: '16', barra: 'a' }, { n: '8', barra: 'a', p: 1, liga: true }, { n: 'q' }], o: { enGrupo: { '16': 2.4 }, espacio: { '8': 5.0 } } },
    pun1m: { it: [{ n: '16' }, { n: 'q', p: 2 }], o: { espacio: { '16': 3.2 } } },
    pun2t: { it: [{ n: '32', barra: 'b' }, { n: '8', barra: 'b', p: 2, liga: true }, { n: 'q' }], o: { enGrupo: { '32': 2.4 }, espacio: { '8': 5.0 } } },
    pun2m: { it: [{ n: '32' }, { n: 'q', p: 3 }], o: { espacio: { '32': 3.2 } } },
    pun3t: { it: [{ n: '32', barra: 'c' }, { n: '8', barra: 'c', p: 2, liga: true }, { n: 'h', p: 1 }], o: { enGrupo: { '32': 2.4 }, espacio: { '8': 5.0 } } },
    pun3m: { it: [{ n: '32' }, { n: 'h', p: 4 }], o: { espacio: { '32': 3.2 } } },
    bar68t: { c: ['6', '8'], it: [{ sil: '16' }, { n: '8', barra: 'a' }, { n: '8', barra: 'a' }, { n: '16', barra: 'a', liga: true }, { n: '16', barra: 'b' }, { n: '8', barra: 'b' }, { n: '8', barra: 'b' }, { n: '16', barra: 'b' }, { div: 'simple', pre: 0.9, post: 0 }], o: { enGrupo: { '8': 2.35, '16': 2.1 } } },
    bar68m: { c: ['6', '8'], it: [{ sil: '16' }, { n: '8', barra: 'm' }, { n: '8', barra: 'm' }, { n: '8', barra: 'm' }, { n: '8', barra: 'm' }, { n: '8', barra: 'm' }, { n: '16', barra: 'm' }, { div: 'simple', pre: 0.9, post: 0 }], o: { enGrupo: { '8': 2.35, '16': 2.1 } } },
    // (6-nov) barrado «puro»: las mismas corcheas, sólo cambian las barras (para «¿Qué recurso es?», sin dudas)
    bar68pt: { c: ['6', '8'], it: [{ sil: '8' }, { n: '8', barra: 'a' }, { n: '8', barra: 'a' }, { n: '8', barra: 'b' }, { n: '8', barra: 'b' }, { n: '8', barra: 'b' }, { div: 'simple', pre: 0.9, post: 0 }], o: { enGrupo: { '8': 2.35 } } },
    bar68pm: { c: ['6', '8'], it: [{ sil: '8' }, { n: '8', barra: 'm' }, { n: '8', barra: 'm' }, { n: '8', barra: 'm' }, { n: '8', barra: 'm' }, { n: '8', barra: 'm' }, { div: 'simple', pre: 0.9, post: 0 }], o: { enGrupo: { '8': 2.35 } } },
    bar24t: { c: ['2', '4'], it: [{ n: 'q' }, { sil: '8' }, { n: '8', acento: true }, { div: 'simple', pre: 0.7, post: 0.9 }, { n: '8', barra: 'c' }, { n: '8', barra: 'c' }, { n: 'q' }, { div: 'simple', pre: 0.6, post: 0 }], o: { espacio: { q: 3.7, '8': 3.0 }, silencio: { '8': 2.0 } } },
    bar24m: { c: ['2', '4'], it: [{ n: 'q' }, { sil: '8' }, { n: '8', barra: 'd' }, { div: 'simple', pre: 0.55, post: 0.55 }, { n: '8', barra: 'd' }, { n: '8', barra: 'd' }, { n: 'q' }, { div: 'simple', pre: 0.6, post: 0 }], o: { espacio: { q: 3.7, '8': 3.0 }, silencio: { '8': 2.0 } } },
    // compases (número · figura)
    c24: { cn: ['2', '4'] }, c68: { cn: ['6', '8'] }, c64: { cn: ['6', '4'] }, c34: { cn: ['3', '4'] }, c38: { cn: ['3', '8'] }, c22: { cn: ['2', '2'] }, c28: { cn: ['2', '8'] }, c44: { cn: ['4', '4'] },
    f2q: { cf: ['2', 'q', 0] }, f2qp: { cf: ['2', 'q', 1] }, f6c: { cf: ['6', '8', 0] }, f6q: { cf: ['6', 'q', 0] }, f2hp: { cf: ['2', 'h', 1] }, f3qp: { cf: ['3', 'q', 1] },
    // figuras sueltas (¿a qué equivale?)
    qpl8: { it: [{ n: 'q', p: 1, liga: true }, { n: '8' }] }, p8q: { it: [{ n: '8', p: 1, liga: true }, { n: 'q' }] }, pp8q: { it: [{ n: '8', p: 2, liga: true }, { n: 'q' }] },
    c8q8: { it: [{ n: '8', liga: true }, { n: 'q', liga: true }, { n: '8' }] },
    h: { it: [{ n: 'h' }] }, hp: { it: [{ n: 'h', p: 1 }] }, q: { it: [{ n: 'q' }] }, qp: { it: [{ n: 'q', p: 1 }] }, qpp: { it: [{ n: 'q', p: 2 }] }, qppp: { it: [{ n: 'q', p: 3 }] },
  };
  const PARES = [   // tradicional = moderna (recurso · explicación)
    ['lig34a', 'mod34', 'LIGADURAS', 'Lo ligado se suma: corchea · blanca · corchea'],
    ['lig34b', 'mod34', 'LIGADURAS', 'Lo ligado se suma: corchea · blanca · corchea'],
    ['lig44', 'mod44', 'LIGADURAS', 'Lo ligado se suma: corchea · blanca · negra con puntillo'],
    ['lig68', 'mod68', 'LIGADURAS', 'Negra con puntillo + corchea = blanca'],
    ['pun1t', 'pun1m', 'PUNTILLOS', 'Corchea con puntillo + negra = negra con doble puntillo'],
    ['pun2t', 'pun2m', 'PUNTILLOS', 'Corchea con doble puntillo + negra = negra con triple puntillo'],
    ['pun3t', 'pun3m', 'PUNTILLOS', 'Corchea con doble puntillo + blanca con puntillo = cuádruple puntillo'],
    // (6-nov, Iago) el del libro junta dos recursos (las dos semicorcheas ligadas se suman y la barra se salta el pulso):
    // vale para «¿cuál es moderna?», pero no para «¿qué recurso es?» (MIXTO no entra en esa pregunta)
    ['bar68t', 'bar68m', 'MIXTO', 'Lo ligado se suma y una sola barra cruza los dos pulsos'],
    ['bar68pt', 'bar68pm', 'BARRADO', 'Las mismas corcheas: una sola barra cruza los dos pulsos'],
    ['bar24t', 'bar24m', 'BARRADO', 'La barra de las corcheas se salta la línea divisoria'],
  ];
  const PARES_C = [
    ['c24', 'f2q', 'COMPASES', '2/4 = un 2 encima de una negra'],
    ['c68', 'f6c', 'COMPASES', '6/8 = un 6 encima de una corchea'],
    ['c68', 'f2qp', 'COMPASES', '6/8 = un 2 encima de una negra con puntillo'],
    ['c64', 'f6q', 'COMPASES', '6/4 = un 6 encima de una negra'],
    ['c64', 'f2hp', 'COMPASES', '6/4 = un 2 encima de una blanca con puntillo'],
  ];
  const SUELTOS = [   // ¿tradicional o moderna?
    ['abc34', 0, 'Tradicional: los tres pulsos del 3/4 se ven (el a) del vídeo)'], ['lig34a', 0, 'Tradicional: agrupa por pulsos, con ligaduras'],
    ['lig44', 0, 'Tradicional: agrupa por pulsos, con ligaduras'], ['lig68', 0, 'Tradicional: los dos pulsos del 6/8 se ven'],
    ['bar68t', 0, 'Tradicional: las barras respetan los pulsos'], ['bar24t', 0, 'Tradicional: cada compás con su barra'],
    ['mod34c', 1, 'Moderna: lo mínimo, aunque el pulso no se vea (el c) del vídeo)'], ['mod44c', 1, 'Moderna: lo ligado se ha sumado'],
    ['mod68c', 1, 'Moderna: la blanca tapa el segundo pulso'], ['pun2m', 1, 'Moderna: triple puntillo'], ['pun3m', 1, 'Moderna: cuádruple puntillo'],
    ['bar68m', 1, 'Moderna: una sola barra para todo el compás'], ['bar24m', 1, 'Moderna: la barra se salta la línea divisoria'],
    ['f2qp', 1, 'Moderna: el compás indicado con una figura'],
  ];
  const EQUIV = [     // ¿a qué equivale? (la primera opción es la buena)
    ['qpl8', ['h', 'qp', 'hp', 'q'], 'Negra con puntillo + corchea = blanca'],
    ['p8q', ['qpp', 'qp', 'h', 'qppp'], 'Corchea con puntillo + negra = negra con doble puntillo'],
    ['pp8q', ['qppp', 'qpp', 'h', 'hp'], 'Corchea con doble puntillo + negra = negra con triple puntillo'],
    ['c8q8', ['h', 'qp', 'hp', 'qpp'], 'Corchea + negra + corchea = blanca'],
    ['f2qp', ['c68', 'c24', 'c34', 'c64'], 'Dos pulsos de negra con puntillo: 6/8'],
    ['f6c', ['c68', 'c34', 'c64', 'c38'], 'Seis pulsos de corchea: 6/8'],
    ['f2hp', ['c64', 'c68', 'c22', 'c34'], 'Dos pulsos de blanca con puntillo: 6/4'],
    ['f2q', ['c24', 'c28', 'c22', 'c44'], 'Dos pulsos de negra: 2/4'],
    ['c68', ['f2qp', 'f2q', 'f3qp', 'f6q'], '6/8 = dos pulsos de negra con puntillo', '¿Cómo se escribe con una figura?'],
  ];
  const RECURSOS = ['LIGADURAS', 'PUNTILLOS', 'BARRADO', 'COMPASES'];
  // (6-nov, Iago) «ligadura» es lo que hace la tradicional: las opciones dicen lo que hace la moderna, en frase corta
  // (las mismas palabras del repaso del vídeo, F2)
  const ETQ_REC = { LIGADURAS: 'Agrupar ligaduras', PUNTILLOS: 'Dobles y triples puntillos', BARRADO: 'Barras que saltan pulsos', COMPASES: 'Compás con una figura',
    MIXTO: 'Agrupar ligaduras y barras que saltan pulsos' };
  // en los de puntillos también desaparece una ligadura: la explicación dice cuál es el recurso que se ve
  const NOTA_REC = { PUNTILLOS: 'También desaparece una ligadura, pero lo nuevo, lo que se ve, son los puntillos' };

  const baraja = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const x = b[i]; b[i] = b[j]; b[j] = x; } return b; };
  /** Las 16 preguntas de esta partida: 4 de cada tipo, al azar, sin que se repita un ejemplo y sin dos tipos iguales seguidos. */
  function monta() {
    const usado = new Set(), ok = (...ks) => ks.every(k => !usado.has(k)), usa = (...ks) => ks.forEach(k => usado.add(k));
    const T = { cual: [], recurso: [], tm: [], equiv: [] };
    // ¿qué recurso es? (uno de cada recurso, si se puede)
    const porRec = {}; baraja(PARES.concat(PARES_C)).forEach(p => (porRec[p[2]] = porRec[p[2]] || []).push(p));
    baraja(RECURSOS).slice(0, CUANTAS.recurso).forEach(rc => { const p = (porRec[rc] || [])[0]; if (p) { T.recurso.push({ tipo: 'recurso', t: p[0], m: p[1], buena: rc, expl: ETQ_REC[rc] + ' · ' + p[3], expl2: NOTA_REC[rc] }); usa(p[0], p[1]); } });
    // ¿cuál es moderna?
    const recCual = new Set();   // (6-nov) cada «¿cuál?», de un recurso distinto
    baraja(PARES).forEach(p => { if (T.cual.length < CUANTAS.cual && ok(p[0], p[1]) && !recCual.has(p[2] === 'MIXTO' ? 'BARRADO' : p[2]) && recCual.add(p[2] === 'MIXTO' ? 'BARRADO' : p[2])) { const izq = Math.random() < .5; T.cual.push({ tipo: 'cual', A: izq ? p[1] : p[0], B: izq ? p[0] : p[1], buena: izq ? 0 : 1, expl: ETQ_REC[p[2]] + ' · ' + p[3] }); usa(p[0], p[1]); } });
    // ¿tradicional o moderna? (dos y dos)
    const tr = baraja(SUELTOS.filter(x => x[1] === 0)), mo = baraja(SUELTOS.filter(x => x[1] === 1));
    const elige = (lista, n) => { const out = []; lista.forEach(x => { if (out.length < n && ok(x[0])) { out.push(x); usa(x[0]); } }); return out; };
    baraja(elige(tr, 2).concat(elige(mo, CUANTAS.tm - 2))).forEach(x => T.tm.push({ tipo: 'tm', r: x[0], buena: x[1], expl: x[2] }));
    // ¿a qué equivale? (dos de figuras y dos de compases)
    const fig = baraja(EQUIV.slice(0, 4)), com = baraja(EQUIV.slice(4));
    fig.slice(0, 1).concat(com.slice(0, CUANTAS.equiv - 1)).forEach(e => { const orden = baraja([0, 1, 2, 3]); T.equiv.push({ tipo: 'equiv', dado: e[0], ops: orden.map(i => e[1][i]), buena: orden.indexOf(0), expl: e[2], titulo: e[3] }); });
    Object.keys(T).forEach(k => { T[k] = baraja(T[k]); while (T[k].length < CUANTAS[k]) T[k].push(T[k][0]); });
    // rondas de 4 (un tipo de cada), sin repetir tipo en la costura
    const out = []; let ult = null;
    // el orden: empieza por «¿cuál?», sin dos tipos iguales seguidos (y las de pensar repartidas)
    const quedan = { cual: T.cual.slice(1), tm: T.tm.slice(), recurso: T.recurso.slice(), equiv: T.equiv.slice() };
    out.push(T.cual[0]); ult = 'cual';
    while (out.length < NPREG) {
      const tipos = Object.keys(quedan).filter(k => quedan[k].length && k !== ult);
      if (!tipos.length) { const k = Object.keys(quedan).find(k => quedan[k].length); if (!k) break; out.push(quedan[k].shift()); ult = k; continue; }
      const max = Math.max(...tipos.map(k => quedan[k].length)); const k = baraja(tipos.filter(x => quedan[x].length === max))[0];
      out.push(quedan[k].shift()); ult = k;
    }
    return out.slice(0, NPREG);
  }
  const TITULO = { cual: '¿Cuál está escrito con nuevas grafías?', recurso: '¿Qué recurso es?', tm: '¿Tradicional o moderna?', equiv: '¿A qué equivale?' };
  function etiquetas(q) {
    if (q.tipo === 'cual') return ['A', 'B'];
    if (q.tipo === 'recurso') return RECURSOS.map(r => ETQ_REC[r]);
    if (q.tipo === 'tm') return ['Tradicional', 'Moderna'];
    return ['A', 'B', 'C', 'D'];
  }
  const buenaIdx = q => q.tipo === 'recurso' ? RECURSOS.indexOf(q.buena) : q.buena;

  // ================================================================ dibujo
  let capa = null;
  const el = N.el;
  function limpia() { while (capa.firstChild) capa.removeChild(capa.firstChild); }
  /** Un ritmo (o un compás) centrado en (cx, yMid), que no pase de maxW. */
  function dibuja(parent, clave, cx, yMid, maxW, sp) {
    sp = sp || SP;
    const e = R[clave]; const g = N.group(parent, 'ej'); const gi = N.group(g);
    let w = 0;
    if (e.cn) { const r = N.compasNum(gi, e.cn[0], e.cn[1], 0, 0, sp * 1.5); w = r.w; }
    else if (e.cf) {   // (6-nov) con la plica hacia abajo es más alto: un poco más pequeño y subido, centrado como los numéricos
      const s2 = sp * 1.2, alto = e.cf[1] === '8' ? 4.7 : 4.2; const r = N.compasFigura(gi, e.cf[0], e.cf[1], e.cf[2], 0, -((alto - 2) / 2) * s2, s2); w = r.w; }
    else {
      let x = 0;
      if (e.c) { const c = N.compasNum(gi, e.c[0], e.c[1], 0, 0, sp); x = c.w + 0.9 * sp; }
      const r = N.ritmo2(gi, e.it, x, 0, Object.assign({ sp, alto: 1.6 }, e.o || {}));
      w = x + r.w;
    }
    const k = Math.min(1, (maxW || 1e9) / Math.max(1, w));
    g.setAttribute('transform', `translate(${(cx - w * k / 2).toFixed(1)},${yMid.toFixed(1)}) scale(${k.toFixed(3)})`);
    g._w = w * k;
    return g;
  }
  function boton(parent, txt, x, y, w, h, fn, o) {
    o = o || {};
    const g = N.group(parent, 'boton'); g.style.cursor = 'pointer';
    el('rect', { x, y, width: w, height: h, rx: h / 2, fill: o.lleno === false ? 'rgba(255,255,255,0.04)' : C.rosa, stroke: o.lleno === false ? 'rgba(255,255,255,0.55)' : 'none', 'stroke-width': 2 }, g);
    texto(g, txt, x + w / 2, y + h / 2 + 9, { anchor: 'middle', size: o.size || 26, peso: 800, ls: '0.08em', fill: '#fff' });
    g.addEventListener('click', e => { e.stopPropagation(); fn(); });
    return g;
  }
  function forma(parent, j, x, y, s, fill) {
    const g = N.group(parent); g.setAttribute('transform', `translate(${x},${y}) scale(${s / 24})`);
    if (FORMA[j]) el('path', { d: FORMA[j], fill: fill || '#fff' }, g); else el('circle', { cx: 12, cy: 12, r: 10, fill: fill || '#fff' }, g);
    return g;
  }
  function fondo() { panel(capa, 120, 90, 1680, 900); }
  function cabecera(t1, t2) {
    texto(capa, t1, 190, 160, { size: 22, peso: 800, ls: '0.24em', fill: C.rosa });
    if (t2) texto(capa, t2, 1730, 160, { anchor: 'end', size: 22, peso: 800, ls: '0.18em', fill: C.suave });
  }

  // ================================================================ sonido (música en bucle y pitidos sintetizados)
  let AC = null, musica = null, gMus = null;
  function audio() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = null; } } if (AC && AC.state === 'suspended') AC.resume(); return AC; }
  async function musicaOn(vol) {
    const ac = audio(); if (!ac) return;
    if (!musica) {
      try {
        const buf = await (await fetch('reto_fondo.wav')).arrayBuffer(); const b = await ac.decodeAudioData(buf);
        gMus = ac.createGain(); gMus.gain.value = 0; gMus.connect(ac.destination);
        musica = ac.createBufferSource(); musica.buffer = b; musica.loop = true; musica.connect(gMus); musica.start();
      } catch (e) { return; }
    }
    gMus.gain.cancelScheduledValues(ac.currentTime); gMus.gain.setTargetAtTime(vol, ac.currentTime, 0.6);
  }
  function pitido(f, dur, vol, tipo) {
    const ac = audio(); if (!ac) return;
    const o = ac.createOscillator(), g = ac.createGain(); o.type = tipo || 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0, ac.currentTime); g.gain.linearRampToValueAtTime(vol || .15, ac.currentTime + .01); g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + dur);
    o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + dur + .05);
  }
  const tic = () => pitido(1320, .07, .06, 'square');
  const acierto = () => { pitido(784, .25, .12); setTimeout(() => pitido(1175, .4, .12), 120); };

  // ================================================================ servidor (suite_aq_*)
  const SB = () => (/[?&]quizsb=local\b/.test(location.search) ? { url: location.origin, anon: 'local', sabor: 4 } : window.RETO_SB);
  async function rpc(fn, args) {
    const s = SB(); if (!s || !s.url) throw new Error('sin servidor');
    const ab = new AbortController(), to = setTimeout(() => ab.abort(), 7000);
    try {
      const r = await fetch(s.url + '/rest/v1/rpc/' + fn, { method: 'POST', signal: ab.signal, cache: 'no-store',
        headers: { 'Content-Type': 'application/json', apikey: s.anon, Authorization: 'Bearer ' + s.anon }, body: JSON.stringify(args || {}) });
      const t = await r.text(); let j = null; try { j = t ? JSON.parse(t) : null; } catch (e) { }
      if (!r.ok) throw new Error((j && j.message) || ('HTTP ' + r.status));
      return j;
    } finally { clearTimeout(to); }
  }
  const dirMovil = pin => location.origin + location.pathname.replace(/[^/]*$/, '') + 'movil.html?c=' + pin;
  function qr(parent, txt, x, y, lado) {
    if (typeof window.qrcode !== 'function') return;
    const q = window.qrcode(0, 'M'); q.addData(txt); q.make(); const n = q.getModuleCount(), m = lado / (n + 4);
    const g = N.group(parent); el('rect', { x, y, width: lado, height: lado, rx: 14, fill: '#fff' }, g);
    let d = ''; for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${(x + (c + 2) * m).toFixed(2)} ${(y + (r + 2) * m).toFixed(2)}h${m.toFixed(2)}v${m.toFixed(2)}h-${m.toFixed(2)}z`;
    el('path', { d, fill: '#0b1320', 'shape-rendering': 'crispEdges' }, g);
  }

  // ================================================================ el juego
  let estado = null;      // { modo:'clase'|'solo'|'voz', partida, preg:[], k, puntos, aciertos, timers }
  const timers = new Set();
  const cada = (fn, ms) => { const id = setInterval(fn, ms); timers.add(id); return id; };
  const para = id => { clearInterval(id); timers.delete(id); };
  const paraTodo = () => { timers.forEach(id => clearInterval(id)); timers.clear(); };
  const espera = s => new Promise(r => setTimeout(r, s * 1000));
  let siguiente = null;   // resolver de «Siguiente»

  function abrir() {
    const a = $('audio'); try { a.pause(); } catch (e) { }
    document.documentElement.classList.add('reto');
    if (!capa) { capa = N.group($('lienzo'), 'reto'); capa.id = 'capaReto'; }
    paraTodo(); estado = null;
    musicaOn(0.32);
    inicio();
  }
  function cerrar() {
    paraTodo(); limpia(); document.documentElement.classList.remove('reto');
    if (gMus && AC) gMus.gain.setTargetAtTime(0, AC.currentTime, 0.3);
  }

  function inicio() {
    limpia(); fondo();
    texto(capa, 'GRADO PROFESIONAL  ·  UNIDAD 4', CX, 300, { anchor: 'middle', size: 24, peso: 800, ls: '0.3em', fill: C.rosa });
    texto(capa, 'EL RETO DE LAS', CX, 400, { anchor: 'middle', size: 64, peso: 800, ls: '0.04em', fill: C.blanco });
    texto(capa, 'NUEVAS GRAFÍAS', CX, 480, { anchor: 'middle', size: 64, peso: 800, ls: '0.04em', fill: C.blanco });
    el('rect', { x: CX - 60, y: 512, width: 120, height: 5, rx: 2.5, fill: C.rosa }, capa);
    texto(capa, `${NPREG} preguntas · 4 tipos de reto · 15 o 20 segundos para cada una`, CX, 572, { anchor: 'middle', size: 30, fill: '#cbd5e1' });
    boton(capa, 'JUGAR EN CLASE · CON MÓVILES', CX - 460, 650, 560, 84, sala);
    boton(capa, 'JUGAR YO SOLO', CX + 130, 650, 330, 84, () => juego('solo'), { lleno: false });
    const v = texto(capa, '← Volver al vídeo', 190, 940, { size: 24, peso: 700, fill: C.suave }); v.style.cursor = 'pointer';
    v.addEventListener('click', cerrar);
  }

  async function sala() {
    limpia(); fondo(); cabecera('EN CLASE · CON MÓVILES', '');
    const msg = texto(capa, 'Preparando la partida…', CX, 520, { anchor: 'middle', size: 34, fill: C.texto });
    let partida = null;
    try { partida = await rpc('suite_aq_crear', { p_sabor: (SB().sabor || 4), p_total: NPREG }); } catch (e) { partida = null; }
    limpia(); fondo(); cabecera('EN CLASE · CON MÓVILES', '');
    if (!partida) {
      texto(capa, 'No hay conexión con el servidor del reto.', CX, 440, { anchor: 'middle', size: 36, peso: 700, fill: C.blanco });
      texto(capa, 'Se puede jugar igual: la clase contesta en voz alta y la pantalla marca la buena.', CX, 500, { anchor: 'middle', size: 28, fill: '#cbd5e1' });
      boton(capa, 'JUGAR SIN MÓVILES', CX - 210, 590, 420, 84, () => juego('voz'));
      boton(capa, 'VOLVER', CX - 120, 700, 240, 70, inicio, { lleno: false, size: 22 });
      return;
    }
    qr(capa, dirMovil(partida.pin), 230, 240, 520);
    texto(capa, 'Escanea el QR con el móvil', 490, 820, { anchor: 'middle', size: 28, peso: 700, fill: C.blanco });
    const corta = dirMovil('').replace(/^https?:\/\//, '').replace(/\?c=$/, '');
    texto(capa, 'o entra en ' + corta, 490, 862, { anchor: 'middle', size: 20, fill: C.suave });
    texto(capa, 'PIN', 1240, 300, { anchor: 'middle', size: 26, peso: 800, ls: '0.3em', fill: C.rosa });
    texto(capa, partida.pin, 1240, 420, { anchor: 'middle', size: 132, peso: 800, ls: '0.12em', fill: C.blanco });
    const cuenta = texto(capa, 'Esperando a la clase…', 1240, 500, { anchor: 'middle', size: 30, fill: '#cbd5e1' });
    const lista = N.group(capa);
    const bt = boton(capa, 'EMPEZAR', 1240 - 170, 820, 340, 84, () => { para(poll); juego('clase', partida); });
    opa(bt, 0.4);
    let n = 0;
    const poll = cada(async () => {
      try {
        const s = await rpc('suite_aq_sala', { p_pin: partida.pin, p_clave: partida.clave });
        const js = s.jugadores || [];
        if (js.length !== n) {
          n = js.length; cuenta.textContent = n ? (n === 1 ? '1 en la partida' : n + ' en la partida') : 'Esperando a la clase…';
          opa(bt, n ? 1 : 0.4);
          while (lista.firstChild) lista.removeChild(lista.firstChild);
          js.slice(0, 24).forEach((j, i) => { const c = chip(lista, j.nick, 0, 0, { size: 20, relleno: false }); pos(c, 900 + (i % 3) * 230, 570 + Math.floor(i / 3) * 44); });
        }
      } catch (e) { }
    }, 1500);
  }

  async function juego(modo, partida) {
    paraTodo();
    estado = { modo, partida, preg: monta(), k: 0, puntos: 0, aciertos: 0, antes: {} };
    const moviles = modo === 'clase' && partida;
    for (let k = 1; k <= estado.preg.length; k++) {
      if (!estado) return;
      estado.k = k;
      const q = estado.preg[k - 1];
      const r = await pregunta(q, k, moviles);
      if (!estado) return;
      if (moviles && r && r.top && r.top.length && k % CADA === 0 && k < estado.preg.length) await clasificacion(r.top, k);
    }
    await final(moviles);
  }

  /** Una pregunta: dibujo, cuenta atrás, respuestas y solución. Devuelve lo que diga el servidor al resolver (o null). */
  function pregunta(q, k, moviles) {
    return new Promise(async res => {
      limpia(); fondo();
      cabecera(`PREGUNTA ${k} DE ${estado.preg.length}`, '');
      if (estado.modo === 'solo') texto(capa, `${estado.puntos} puntos`, 190, 236, { size: 24, peso: 700, fill: C.suave });
      texto(capa, q.titulo || TITULO[q.tipo], CX, 250, { anchor: 'middle', size: 50, peso: 800, fill: C.blanco });
      const ops = etiquetas(q), buena = buenaIdx(q), SEGq = SEGT[q.tipo] || SEG;
      // el enunciado musical
      if (q.tipo === 'recurso') {
        dibuja(capa, q.t, 580, 420, 600); texto(capa, '=', CX, 438, { anchor: 'middle', size: 70, peso: 300, fill: C.suave }); dibuja(capa, q.m, 1340, 420, 600);
      } else if (q.tipo === 'tm') {
        dibuja(capa, q.r, CX, 420, 1100);
      } else if (q.tipo === 'equiv') {
        const gd = dibuja(capa, q.dado, CX - 70, 420, 700, 28); texto(capa, '=  ?', CX - 70 + gd._w / 2 + 40, 444, { anchor: 'start', size: 64, peso: 300, fill: C.suave });
      }
      // las opciones (colores y formas como en el móvil)
      const cajas = [];
      const geo = q.tipo === 'cual' ? [[180, 330, 770, 470], [970, 330, 770, 470]]
        : ops.length === 2 ? [[300, 590, 640, 200], [980, 590, 640, 200]]
        : [[190, 560, 760, 170], [970, 560, 760, 170], [190, 750, 760, 170], [970, 750, 760, 170]];
      ops.forEach((o, j) => {
        const [x, y, w, h] = geo[j]; const g = N.group(capa, 'op');
        const fondoOp = el('rect', { x, y, width: w, height: h, rx: 18, fill: 'rgba(255,255,255,0.05)', stroke: COL[j], 'stroke-width': 3 }, g);
        el('rect', { x, y, width: 64, height: h, rx: 18, fill: COL[j] }, g); el('rect', { x: x + 40, y, width: 24, height: h, fill: COL[j] }, g);
        forma(g, j, x + 14, y + h / 2 - 18, 36, j === 2 ? '#0b1320' : '#fff');
        const cx = x + 64 + (w - 64) / 2, cy = y + h / 2;
        if (q.tipo === 'cual') { texto(g, o, x + 96, y + 56, { size: 34, peso: 800, fill: C.suave }); dibuja(g, j === 0 ? q.A : q.B, cx, cy + 10, w - 140); }
        else if (q.tipo === 'equiv') { texto(g, o, x + 96, y + 52, { size: 28, peso: 800, fill: C.suave }); dibuja(g, q.ops[j], cx + 10, cy + (R[q.ops[j]].it ? -2 : -8), w - 200, R[q.ops[j]].it ? 28 : 17); }
        else if (q.tipo === 'recurso') texto(g, o, cx, cy + 13, { anchor: 'middle', size: 38, peso: 800, fill: C.blanco });   // (6-nov) frases cortas, sin mayúsculas
        else texto(g, o.toUpperCase(), cx, cy + 12, { anchor: 'middle', size: 34, peso: 800, ls: '0.1em', fill: C.blanco });
        cajas.push({ g, fondoOp });
        if (estado.modo === 'solo') { g.style.cursor = 'pointer'; g.addEventListener('click', () => contesta(j)); }
      });
      // la cuenta atrás
      const cxr = 1660, cyr = 236, rr = 46, circ = 2 * Math.PI * rr;
      const pista = el('circle', { cx: cxr, cy: cyr, r: rr, fill: 'none', stroke: 'rgba(255,255,255,0.14)', 'stroke-width': 8 }, capa);
      const arco = el('circle', { cx: cxr, cy: cyr, r: rr, fill: 'none', stroke: C.rosa, 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-dasharray': circ.toFixed(1), transform: `rotate(-90 ${cxr} ${cyr})` }, capa);
      const num = texto(capa, String(SEGq), cxr, cyr + 16, { anchor: 'middle', size: 44, peso: 800, fill: C.blanco });
      const reloj0 = [pista, arco, num];
      const recuento = texto(capa, '', 190, 236, { size: 24, peso: 700, fill: C.suave });
      let abierta = false;
      if (moviles) { try { await rpc('suite_aq_preguntar', { p_pin: estado.partida.pin, p_clave: estado.partida.clave, p_n: k, p_opciones: ops, p_segundos: SEGq }); abierta = true; } catch (e) { abierta = false; } }
      musicaOn(0.16);
      const t0 = performance.now(); let hecho = false, mia = null, tMia = 0, ultS = -1;
      const reloj = cada(() => {
        const t = (performance.now() - t0) / 1000, s = Math.max(0, Math.ceil(SEGq - t));
        if (s !== ultS) { ultS = s; num.textContent = String(s); arco.setAttribute('stroke-dashoffset', (circ * Math.min(1, t / SEGq)).toFixed(1)); if (s <= 5 && s > 0) tic(); }
        if (t >= SEGq) acaba();
      }, 250);
      let poll = null;
      if (moviles && abierta) poll = cada(async () => {
        try { const s = await rpc('suite_aq_sala', { p_pin: estado.partida.pin, p_clave: estado.partida.clave });
          const n = (s.jugadores || []).length, c = s.contestados || 0; recuento.textContent = c + ' / ' + n + ' respuestas';
          if (n && c >= n) acaba(); } catch (e) { }
      }, 1000);
      function contesta(j) { if (hecho || mia != null) return; mia = j; tMia = (performance.now() - t0) / 1000; cajas.forEach((c, i) => { if (i !== j) c.g.setAttribute('opacity', '0.45'); }); acaba(); }
      async function acaba() {
        if (hecho) return; hecho = true; para(reloj); if (poll) para(poll);
        let r = null;
        if (moviles && abierta) { try { r = await rpc('suite_aq_resolver', { p_pin: estado.partida.pin, p_clave: estado.partida.clave, p_buena: buena }); } catch (e) { r = null; } }
        if (!estado) return;
        musicaOn(0.28);
        num.textContent = ''; reloj0.forEach(x => x.remove());
        cajas.forEach((c, j) => {
          if (j === buena) { c.fondoOp.setAttribute('fill', 'rgba(236,72,153,0.20)'); c.fondoOp.setAttribute('stroke', C.rosa); c.fondoOp.setAttribute('stroke-width', '6'); c.g.setAttribute('opacity', '1'); }
          else c.g.setAttribute('opacity', '0.3');
          if (r && r.reparto) { const [x, y, w, h] = geo[j]; texto(capa, String(r.reparto[j] || 0), x + w - 24, y + 44, { anchor: 'end', size: 30, peso: 800, fill: j === buena ? C.rosa : C.suave }); }
        });
        // ✓ en la buena
        { const [x, y, w] = geo[buena]; const tk = D.tick(capa, x + w - 50, y + (q.tipo === 'cual' ? 430 : 120), 20, 8); color(tk, C.rosa); if (r && r.reparto) tk.setAttribute('transform', 'translate(0,0)'); }
        acierto();
        let linea = q.expl;
        if (estado.modo === 'solo') {
          const ok = mia === buena; const pts = ok ? Math.round(1000 * (1 - 0.5 * Math.min(1, tMia / SEGq))) : 0;
          if (ok) { estado.puntos += pts; estado.aciertos++; }
          linea = (mia == null ? 'Sin respuesta · ' : ok ? `¡Bien! +${pts} puntos · ` : 'No era esa · ') + q.expl;
        } else if (r) linea = `${r.aciertos || 0} de ${r.contestados || 0} ${(r.aciertos || 0) === 1 ? 'ha' : 'han'} acertado · ` + q.expl;
        const yL = q.tipo === 'cual' ? 900 : (ops.length === 2 ? 870 : 966);
        texto(capa, linea, CX, yL, { anchor: 'middle', size: 28, peso: 600, fill: C.texto });
        if (q.expl2) texto(capa, q.expl2, CX, yL + 38, { anchor: 'middle', size: 24, peso: 600, fill: C.suave });   // (6-nov) segunda línea
        if (ops.length === 4 && q.tipo !== 'cual') { /* la explicación va abajo del todo */ }
        await botonSiguiente(k < estado.preg.length ? 'SIGUIENTE' : 'VER EL RESULTADO');
        res(r);
      }
    });
  }
  function botonSiguiente(txt) {
    return new Promise(res => {
      const b = boton(capa, txt, 1740 - 320, 112, 320, 64, () => { document.removeEventListener('keydown', tecla); res(); }, { size: 22 });
      const tecla = e => { if (e.key === 'Enter' || e.key === 'ArrowRight') { document.removeEventListener('keydown', tecla); res(); } };
      document.addEventListener('keydown', tecla);
      // tapa la cabecera de la derecha
      b.parentNode.appendChild(b);
    });
  }
  async function clasificacion(top, k) {
    limpia(); fondo(); cabecera('CLASIFICACIÓN', ''); texto(capa, `Tras la pregunta ${k} de ${estado.preg.length}`, 190, 200, { size: 26, fill: C.suave });
    top.slice(0, 5).forEach((t, i) => {
      const y = 300 + i * 110;
      el('rect', { x: 460, y: y - 50, width: 1000, height: 86, rx: 16, fill: i === 0 ? 'rgba(236,72,153,0.18)' : 'rgba(255,255,255,0.05)', stroke: i === 0 ? C.rosa : 'rgba(255,255,255,0.14)', 'stroke-width': 2 }, capa);
      texto(capa, String(i + 1), 520, y + 12, { anchor: 'middle', size: 40, peso: 800, fill: i === 0 ? C.rosa : C.suave });
      texto(capa, t.nick, 580, y + 12, { size: 38, peso: 700, fill: C.blanco });
      texto(capa, String(t.puntos), 1420, y + 12, { anchor: 'end', size: 38, peso: 800, fill: C.blanco });
    });
    await botonSiguiente('SIGUIENTE');
  }
  async function final(moviles) {
    let f = null;
    if (moviles) { try { f = await rpc('suite_aq_fin', { p_pin: estado.partida.pin, p_clave: estado.partida.clave }); } catch (e) { f = null; } }
    limpia(); fondo(); musicaOn(0.36);
    texto(capa, '¡FIN DEL RETO!', CX, 220, { anchor: 'middle', size: 64, peso: 800, ls: '0.04em', fill: C.blanco });
    el('rect', { x: CX - 60, y: 248, width: 120, height: 5, rx: 2.5, fill: C.rosa }, capa);
    if (estado.modo === 'solo') {
      texto(capa, String(estado.puntos), CX, 470, { anchor: 'middle', size: 150, peso: 800, fill: C.rosa });
      texto(capa, 'PUNTOS', CX, 530, { anchor: 'middle', size: 26, peso: 800, ls: '0.3em', fill: C.suave });
      texto(capa, `${estado.aciertos} de ${estado.preg.length} aciertos`, CX, 620, { anchor: 'middle', size: 40, peso: 700, fill: C.blanco });
      const fr = estado.aciertos >= estado.preg.length - 1 ? '¡Dominas las nuevas grafías!' : estado.aciertos >= Math.ceil(estado.preg.length * 0.6) ? '¡Muy bien! Repasa los que has fallado.' : 'Vuelve a ver el vídeo y prueba otra vez.';
      texto(capa, fr, CX, 690, { anchor: 'middle', size: 32, fill: '#cbd5e1' });
    } else if (f && f.top && f.top.length) {
      const top = f.top; const pod = [[top[1], 2, 700, 560], [top[0], 1, CX, 500], [top[2], 3, 1220, 610]];
      pod.forEach(([t, p, x, y]) => {
        if (!t) return;
        const h = 860 - y; el('rect', { x: x - 150, y, width: 300, height: h, rx: 16, fill: p === 1 ? 'rgba(236,72,153,0.22)' : 'rgba(255,255,255,0.06)', stroke: p === 1 ? C.rosa : 'rgba(255,255,255,0.18)', 'stroke-width': 2 }, capa);
        texto(capa, String(p), x, y + 70, { anchor: 'middle', size: 60, peso: 800, fill: p === 1 ? C.rosa : C.suave });
        texto(capa, t.nick, x, y - 50, { anchor: 'middle', size: 40, peso: 800, fill: C.blanco });
        texto(capa, t.puntos + ' puntos', x, y - 14, { anchor: 'middle', size: 24, peso: 600, fill: '#cbd5e1' });
      });
      if (top.length > 3) texto(capa, top.slice(3, 8).map((t, i) => `${i + 4}. ${t.nick} · ${t.puntos}`).join('     '), CX, 920, { anchor: 'middle', size: 24, fill: C.suave });
    } else {
      texto(capa, `${estado.preg.length} preguntas · 4 tipos de reto`, CX, 480, { anchor: 'middle', size: 40, fill: '#cbd5e1' });
    }
    boton(capa, 'JUGAR OTRA VEZ', CX - 360, 760 + (estado.modo === 'solo' ? 0 : 160), 340, 76, inicio, { lleno: false, size: 22 });
    boton(capa, 'SALIR', CX + 20, 760 + (estado.modo === 'solo' ? 0 : 160), 340, 76, salir, { size: 22 });
  }
  function salir() {
    const a = $('salir'); cerrar();
    if (a) a.click();
  }

  // ================================================================ enganche con la intro
  const css = document.createElement('style');
  css.textContent = 'html.reto #capaEscenas,html.reto #finalUI,html.reto #controles,html.reto #barra,html.reto #subtitulo,html.reto #portada{display:none!important}' +
    'html.reto #velo{opacity:.78!important}';
  document.head.appendChild(css);
  document.addEventListener('click', e => {
    const a = e.target && e.target.closest ? e.target.closest('#irEjercicios') : null;
    if (!a) return;
    e.preventDefault(); e.stopImmediatePropagation(); abrir();
  }, true);
  function directo() { if (/#reto\b/.test(location.hash) || /[?&]reto\b/.test(location.search)) abrir(); }
  const espera0 = setInterval(() => { if (window.__listo) { clearInterval(espera0); directo(); } }, 200);
  window.RETO = { abrir, cerrar, monta };
})();
