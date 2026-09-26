/* (26-sep-2026, Iago) VER APUNTES · datos de los Apuntes de teoría 2GP (re-creados para la web). Generado a partir de gp/gp1.js y gp/gp2.js */
/* ---- gp/gp1.js ---- */
/* Apuntes de teoría 2GP · TEORÍA PRO (tema dorado)
   Cartas: Índice acústico (gp-indice) · Modos (gp-modos) · Compases extraños (gp-compases) · Serie armónica (gp-serie)
   (26-sep-2026, Iago) Re-creado a partir de «APUNTES DE TEORIA 2GP.pdf» (páginas impresas 1–3, 5–6, 9–10).
   Necesita el motor con: clave que cambia a mitad de línea (c.clef), pentagrama sin líneas ni clave
   (lineas:0, clef:'no'), compases «raros» (c.tsL), barra discontinua (fin:'¦') y figura estrecha (maxW). */
(window.APX_TEMAS=window.APX_TEMAS||{});
(function(){
  var TINTA='#16203a';   /* etiquetas negras como en el papel */
  function lab(t){ return {t:t, col:TINTA, fw:800, fs:13}; }
  function q(k,o){ var n={k:k, d:'q'}; if(o) for(var i in o) n[i]=o[i]; return n; }
  /* ritmo suelto (sin pentagrama): todas las notas a la misma altura */
  var R='g/4';
  function r(d){ return {k:R, d:d}; }
  function modo(tit, ks, notas){ return {penta:{ tit:tit, ks:ks, bot:22, c:[ {n:notas} ] }}; }

Object.assign(window.APX_TEMAS, {

  /* ============ 1 · ÍNDICE ACÚSTICO · U0, p. 1 (PDF 4 @70%) → p. 2 (PDF 5 @37%) ============ */
  'gp-indice': {
    titulo:'Índices acústicos', corto:'Índices acústicos', fuente:'Apuntes de teoría 2GP · Unidad 0 · p. 1–2',
    bloques:[
      {p:'Son números que nos indican la altura absoluta de una nota, me explico: nos referimos con siete nombres para las notas Do, Re… pero hay muchas octavas, ¿a cuál te refieres? Pues de eso va la cosa. Cogemos de referencia el <i>Do central → Si</i> como número 4:'},
      {penta:{ c:[ {n:[
        q('c/4',{ar:lab('Do4')}), q('d/4',{ar:lab('Re4')}), q('e/4',{ar:lab('Mi4')}), q('f/4',{ar:lab('Fa4')}),
        q('g/4',{ar:lab('Sol4')}), q('a/4',{ar:lab('La4')}), q('b/4',{ar:lab('Si4')})
      ]} ] }},
      {p:'Y toda nota que baje del <i>Do4</i> cambiará al 3 y toda aquella que suba de <i>Si4</i> cambiará al 5.'},
      {penta:{ c:[
        {n:[ q('b/3',{ar:lab('Si3')}), q('d/5',{ar:lab('Re5')}), q('g#/5',{ar:{t:'Sol♯5', col:TINTA, fw:800, fs:13, dy:-4, dx:4}}), q('a/3',{ar:lab('La3')}) ], fin:' ', w:4},
        {clef:'bass', n:[ q('d/3',{ar:lab('Re3')}), q('a/2',{ar:lab('La2')}), q('bb/1',{ar:lab('Si♭1')}) ], w:3.4}
      ] }},
      {p:'¿Lo pillas? Dale.'},
      {penta:{ c:[
        {n:[ q('f/4'), q('d/5'), q('gb/4'), q('d/6') ], fin:' ', w:4},
        {clef:'bass', n:[ q('bb/3'), q('d/4'), q('d/2') ], w:3.4}
      ] }}
    ]
  },

  /* ============ 2 · MODOS · U0, p. 2 (PDF 5 @39%) → p. 3 (PDF 6 @77%) ============ */
  'gp-modos': {
    titulo:'Modos', corto:'Modos', fuente:'Apuntes de teoría 2GP · Unidad 0 · p. 2–3',
    bloques:[
      {p:'Reinterpretación y simplificación de antiguas escalas griegas que hoy nos encontramos en jazz, vanguardias, cine, videojuegos… Cada uno tiene su esencia y no, no todo en la música es triste (m) o alegre (M).'},
      {p:'Tomaremos como referencia la nota Re. Entendamos teóricamente cómo se construyen:'},
      /* la nota que caracteriza cada modo (la alteración que se sale de la armadura), en dorado */
      modo('Re Jónico. M', 'D',   [ q('d/4'), q('e/4'), q('f#/4'), q('g/4'), q('a/4'), q('b/4'), q('c#/5') ]),
      modo('Re Dórico. m+6', 'F', [ q('d/4'), q('e/4'), q('f/4'), q('g/4'), q('a/4'), q('b/4',{col:'acc'}), q('c/5') ]),
      modo('Re Frigio. m-2', 'F', [ q('d/4'), q('eb/4',{col:'acc'}), q('f/4'), q('g/4'), q('a/4'), q('bb/4'), q('c/5') ]),
      modo('Re Lidio. M+4', 'D',  [ q('d/4'), q('e/4'), q('f#/4'), q('g#/4',{col:'acc'}), q('a/4'), q('b/4'), q('c#/5') ]),
      modo('Re Mixolidio. M-7', 'D', [ q('d/4'), q('e/4'), q('f#/4'), q('g/4'), q('a/4'), q('b/4'), q('c/5',{col:'acc'}) ]),
      modo('Re Eólico. m', 'F',   [ q('d/4'), q('e/4'), q('f/4'), q('g/4'), q('a/4'), q('bb/4'), q('c/5') ]),
      modo('Re Locrio. m-2-5', 'F', [ q('d/4'), q('eb/4',{col:'acc'}), q('f/4'), q('g/4'), q('ab/4',{col:'acc'}), q('bb/4'), q('c/5') ]),
      {p:'Y ahora escribe en los recuadros qué sensaciones o recuerdos se te vienen a la mente al escucharlos.'},
      {p:'Trata de integrar estos modos tanto de forma teórica como subjetivo-emocional.'},
      {p:'Las palabras que pongas en ese recuadro son tu realidad; y es tan importante que te vincules con ellos desde lo sensitivo como que sepas la estructura que tienen.'}
    ]
  },

  /* ============ 3 · COMPASES EXTRAÑOS · U1, p. 5 (PDF 8 @10%) → p. 6 (PDF 9 @68%) ============ */
  'gp-compases': {
    titulo:'Compases extraños', corto:'Compases extraños', fuente:'Apuntes de teoría 2GP · Unidad 1 · p. 5–6',
    bloques:[
      {p:'Algunos compositores y estudiosos, como Bartók y Kodály, se dedicaron a estudiar la música popular de su región. Esta corriente tenía el nombre de Nacionalismo Musical. Y lo hicieron utilizando el fonógrafo, su juguete nuevo.'},
      {p:'Iban por las aldeas húngaras realizando grabaciones directas de los pueblerinos para después analizar las grabaciones de los cilindros de cera en sus despachos. Con toda esa información establecieron patrones y realizaban sus propias composiciones respetando las reglas culturales de la región combinadas con su estilo propio.'},
      {p:'Algo así como si te juntas con dos colegas más, grabas por las aldeas de Galicia con tu móvil y después de analizarlas formas un trío tradicional-fusión y os llamáis “Tanxugeiras”.'},
      {p:'La cosa es que se encontraron algo inesperado: era bastante común en esas grabaciones que los señoriños y señoriñas cantasen ritmos que no cuadraban en nuestros compases.'},
      {p:'Algo así como un compás que tenía dos negras y después una semicorchea random que descuadraba todo. No era un compás dispar, que eso ya sé que lo habéis dado. Era algo nuevo hasta ese momento. Y cuando hay algo nuevo, toca adaptarse. Os presento unos compases curiosos.'},

      {h:'Mixtos, decimales y fraccionarios'},
      {p:'Antes de nada aclarar que son 3 formas de representar lo mismo. Debemos conocer las 3.'},

      {h4:'Mixtos'},
      {p:'<u>Tienen denominadores distintos.</u>'},
      {penta:{ clef:'no', lineas:0, maxW:540, top:30, bot:16, c:[
        {tsL:[{n:'2',d:'4'},'+',{n:'1',d:'8'}], n:[r('q'), r('q')], fin:'¦', w:2},
        {n:[r('8')], fin:'||', w:0.9, pad:34},
        {salto:true, tsL:[{n:'2',d:'4'},'+',{n:'3',d:'16'}], n:[r('q'), r('q')], fin:'¦', w:2},
        {n:[r('16'), r('16'), r('16')], bm:[[0,2]], fin:'||', w:0.9, pad:34},
        {salto:true, tsL:[{n:'2',d:'4'},'+',{n:'3',d:'32'}], n:[r('q'), r('q')], fin:'¦', w:2},
        {n:[r('32'), r('32'), r('32')], bm:[[0,2]], fin:'||', w:0.9, pad:34}
      ] }},

      {h4:'Decimales'},
      {p:'El numerador tiene decimales, no hay mucho que aclarar.'},
      {penta:{ clef:'no', lineas:0, maxW:420, top:30, bot:12, fin:' ', c:[
        {tsL:[{n:'2’5',d:'4'}], n:[r('q'), r('q'), r('8')]}
      ] }},

      {h4:'Fraccionarios'},
      {p:'Es un compás al que se le suma o se le resta una fracción (no son dos compases, cuidado con los tamaños). <u>La fracción hace referencia a la figura del pulso.</u>'},
      {p:'Los hay de suma…'},
      {cols:[
        [ {penta:{ clef:'no', lineas:0, maxW:420, top:30, bot:12, fin:' ', c:[
            {tsL:[{n:'2', sup:'1/2', d:'4'}], n:[r('q'), r('q'), r('8')]}
          ] }} ],
        [ {p:'*Dato: la fracción hace referencia a la figura de pulso, en este caso una negra.', peq:true},
          {p:'1/2 de una negra = corchea', peq:true} ]
      ]},
      {p:'… y de resta.'},
      {cols:[
        [ {penta:{ clef:'no', lineas:0, maxW:420, top:30, bot:12, fin:' ', c:[
            {tsL:[{n:'2', sup:'-1/4', d:'4'}, '='], n:[r('q'), r('8.')]}
          ] }} ],
        [ {p:'*Aquí igual, pero en este caso es:', peq:true},
          {p:'-1/4 de negra = semicorchea (la que falta)', peq:true} ]
      ]},

      {h:'Compases quebrados'},
      {p:'Que no se nos olvide comentar en clase esta frikada, os prometo que no va a entrar en examen.'}
    ]
  },

  /* ============ 4 · SERIE ARMÓNICA · U2, p. 9 «TIMBRE» (PDF 12 @33–87%) + p. 10 entera (PDF 13) ============ */
  'gp-serie': {
    titulo:'Serie armónica', corto:'Serie armónica', fuente:'Apuntes de teoría 2GP · Unidad 2 · p. 9–10',
    bloques:[
      /* TIMBRE (p. 9): presenta la nota fundamental y sus armónicos; la serie armónica arranca refiriéndose a ello */
      {h:'Timbre'},
      {p:'Si le pregunto a mi madre qué es el timbre, me dirá que es un interruptor que se encuentra al lado de las puertas y que emite un sonido para avisar a quien esté dentro.'},
      {p:'Si le preguntas a un estudiante de la ESO probablemente te conteste que es una cualidad del sonido que nos permite distinguir un sonido de otro. Por ejemplo: un oboe tiene un timbre diferente al clarinete.'},
      {p:'…Venga, vamos a subir el nivel. Preguntémonos al menos por qué es esto así, cuál es la razón. <b>TEST DE FRECUENCIAS CON ECUALIZADOR.</b>'},
      {p:'Los sonidos NO son puros*. Lo que quiere decir esta afirmación es que (ej.) cuando escuchamos una nota, realmente estamos escuchando varios sonidos que se están produciendo a la vez. La nota fundamental y sus armónicos. Ocurre todo el tiempo, en todos los instrumentos. Y en todos los sonidos, incluidos ruidos, voces o animales. De hecho, cuando tocas un tambor (el cual no da ninguna nota determinada) en realidad estás tocando una cantidad de armónicos tan variada que nuestro cerebro no es capaz de ubicarse: lo percibe como algo indeterminado.'},
      {p:'Lo interesante de todo esto es que si tú tocas una misma nota pero con distintos instrumentos, los armónicos que se producen son los mismos. ¡Están en los mismos lugares exactos! Lo único que varía entre uno y otro son la proporción de sus intensidades.'},
      {p:'Entonces podríamos definir <b>timbre</b> como la cualidad del sonido que permite distinguir instrumentos o voces, y se determina por las intensidades relativas de los armónicos que lo forman. Mamá, aprende.'},
      {nota:'*sólo son puros si los sintetizamos artificialmente.'},

      /* SERIE ARMÓNICA (p. 10) */
      {h:'Serie armónica'},
      {p:'Y aquí es donde ordenamos el caos de los armónicos que venimos hablando. Cada sonido fundamental tiene los armónicos ubicados en los mismos lugares. Recuerda este número:'},
      /* los dos 3 del medio van más pequeños, como en el papel (3m frente a 3M) */
      {html:'<p class="apx-acc" style="margin:22px 0 26px;text-align:center;font-weight:900;font-size:clamp(46px,12vw,76px);line-height:1;letter-spacing:.08em" aria-label="8 5 4 3 3 3 2…">8 5 4 3 <span style="font-size:.6em;letter-spacing:.14em">3 3</span> 2<span style="font-size:.4em;letter-spacing:0">…</span></p>'},
      {p:'Parece un código pero es más bien un mapa de posición de los armónicos, te lo traduzco.'},
      {p:'Si tú tocas, por ejemplo, un Mi2, sus primeros armónicos son estos:'},
      {penta:{ clef:'treble', clef2:'bass', llave:false, gap2:62, bot:34, c:[ {
        n:[ {k:'b/4',d:'w',inv:true}, {k:'b/4',d:'w',inv:true}, {k:'b/4',d:'w',inv:true},
            {k:'e/4',d:'w'}, {k:'g#/4',d:'w'}, {k:'b/4',d:'w'}, {k:'d/5',d:'w'}, {k:'e/5',d:'w'} ],
        n2:[ {k:'e/2',d:'w'}, {k:'e/3',d:'w'}, {k:'b/3',d:'w'},
             {k:'d/3',d:'w',inv:true}, {k:'d/3',d:'w',inv:true}, {k:'d/3',d:'w',inv:true}, {k:'d/3',d:'w',inv:true}, {k:'d/3',d:'w',inv:true} ]
      } ] }},
      {p:'¿Ya comprendes por dónde voy? Por si acaso, te lo indico. Invita la casa:'},
      {penta:{ clef:'treble', clef2:'bass', llave:false, gap2:62, bot:60, c:[ {
        n:[ {k:'b/4',d:'w',inv:true}, {k:'b/4',d:'w',inv:true}, {k:'b/4',d:'w',inv:true},
            {k:'e/4',d:'w',id:'h4'}, {k:'g#/4',d:'w',id:'h5'}, {k:'b/4',d:'w',id:'h6'}, {k:'d/5',d:'w',id:'h7'}, {k:'e/5',d:'w',id:'h8'} ],
        n2:[ {k:'e/2',d:'w',id:'h1'}, {k:'e/3',d:'w',id:'h2'}, {k:'b/3',d:'w',id:'h3'},
             {k:'d/3',d:'w',inv:true}, {k:'d/3',d:'w',inv:true}, {k:'d/3',d:'w',inv:true}, {k:'d/3',d:'w',inv:true}, {k:'d/3',d:'w',inv:true} ]
      } ], a:[
        /* ligaduras de nota a nota con el intervalo debajo (siempre ascendente) */
        {t:'arco', de:'h1', a:'h2', lado:'abajo', txt:'8J', col:'acc', dx1:6, dx2:-7, alto:16, fs:14, fw:800, tdy:-8},
        {t:'arco', de:'h2', a:'h3', lado:'abajo', txt:'5J', col:'acc', dx1:6, dx2:-7, alto:14, fs:14, fw:800, tdy:-6},
        {t:'arco', de:'h3', a:'h4', lado:'abajo', txt:'4J', col:'acc', dx1:6, dx2:-7, alto:6, fs:14, fw:800, tdy:-2, tdx:26},
        {t:'arco', de:'h4', a:'h5', lado:'abajo', txt:'3M', col:'acc', dx1:6, dx2:-7, alto:14, fs:14, fw:800, tdy:-6},
        {t:'arco', de:'h5', a:'h6', lado:'abajo', txt:'3m', col:'acc', dx1:6, dx2:-7, alto:14, fs:14, fw:800, tdy:-6},
        {t:'arco', de:'h6', a:'h7', lado:'abajo', txt:'3m', col:'acc', dx1:6, dx2:-7, alto:14, fs:14, fw:800, tdy:-6},
        {t:'arco', de:'h7', a:'h8', lado:'abajo', txt:'2M', col:'acc', dx1:6, dx2:-7, alto:14, fs:14, fw:800, tdy:-6}
      ] }},
      {p:'El código hace referencia a los intervalos (<u>siempre ascendentes</u>) que se producen sucesivamente entre la nota fundamental y sus armónicos.'},
      {p:'Todavía hay más armónicos. Todos los que quieras. Cada vez más y más pequeños (llegando a ser particiones de semitono)… pero vamos a acotarlo a los 8 primeros sonidos.'},
      {p:'Fíjate que las notas en las posiciones 1, 2, 4 y 8 son la misma (<i>mi</i>). Tiene sentido que sea la más repetida… y es un buen truco para autocorregirse en los ejercicios.'}
    ]
  }
});
})();

/* ---- gp/gp2.js ---- */
/* Apuntes de teoría 2GP · Serialismo (U3) · Cifrado americano (U5) · Modulación (U8) · Transporte (U9)
   (26-sep-2026, Iago) Re-creados para «VER APUNTES» de TEORÍA PRO (tema dorado). */
(window.APX_TEMAS=window.APX_TEMAS||{});
(function(){
  /* ---------- ayudas ---------- */
  /* redonda; 'bn/4' = becuadro forzado (en el original van dentro de un mismo compás) */
  function R(k, extra){ var o={k:k, d:'w'}; if(/^[a-g]n\//.test(k)) o.acc='n'; if(extra) for(var x in extra) o[x]=extra[x]; return o; }
  /* serie de 12 redondas en dos grupos de 6, sin barras intermedias (en el móvil baja de línea) */
  function serie(keys, etiqueta){
    var ns = keys.map(function(k,i){ return R(k, i===0 ? {ab:{t:etiqueta, fw:800, fs:14, col:'#16203a'}} : null); });
    return [ {n:ns.slice(0,6), fin:' '}, {n:ns.slice(6,12), ini:' ', fin:'|.'} ];
  }
  var FLECHA = '<span style="font-size:34px;line-height:22px;font-weight:900">&#10140;</span>';

  /* ---------- cifrado americano: un compás por acorde ----------
     símbolo en recuadro encima (como en el original), nombre a su derecha, intervalos debajo
     (recuadro = la tríada de base), 7ª encima del recuadro y, en dorado, de qué tríada viene (las flechas del original) */
  var INK='#16203a', NOMBRES={}, ANCHO_SIMB={'D':19,'D-':24,'D+':27,'Dº':25,'Dsus':37,'D7':26,'D-7':31,'D△':29,'D∅':30,'Dº7':32};
  function acorde(id, keys, simb, nombre, ints, caja, septima, viene){
    NOMBRES[id]={simb:simb, nombre:nombre, keys:keys, septima:septima, viene:viene};
    return { minW:146, izq:true, n:[ {k:keys, d:'w', id:id,
      ar:{t:simb, caja:true, fs:18, fw:900, col:INK},
      ab:{t:ints.join('\n'), caja:(caja?'bloque':false), fs:13, fw:700, col:INK, dy:(septima?19:0)} } ] };
  }
  function topeT(keys){ /* distancia (px) de la nota más aguda a la 1ª línea: a4 → 15, c5 → 10 */
    var k=keys[keys.length-1][0], o=+keys[keys.length-1].slice(-1); var pos={c:0,d:1,e:2,f:3,g:4,a:5,b:6}[k]+7*o; return (38-pos)*5; }
  function etiquetas(ids){
    var A=[];
    ids.forEach(function(id){ var N=NOMBRES[id], t=topeT(N.keys), dx=ANCHO_SIMB[N.simb]||24;
      var base = 3 - t;                                   /* línea base = 11 px por encima de la 1ª línea */
      if(N.nombre.length===2) A.push({t:'txt', de:id, txt:N.nombre[0]+'\n'+N.nombre[1], lado:'arriba', dx:dx, dy:base-14, anchor:'start', fs:12.5, fw:600, col:INK});
      else A.push({t:'txt', de:id, txt:N.nombre[0], lado:'arriba', dx:dx, dy:base, anchor:'start', fs:12.5, fw:600, col:INK});
      if(N.septima) A.push({t:'txt', de:id, txt:N.septima, lado:'abajo', dy:0, fs:13, fw:700, col:INK});
      if(N.viene) A.push({t:'txt', de:id, txt:N.viene, lado:'arriba', dy:base-30, fs:13, fw:900, col:'acc'});
    });
    return A;
  }

  /* ---------- modulación: rejilla de 7 casillas (como en el original) ----------
     celdas: 7 cifrados ('*' delante = el que se añade en ese paso, en dorado)
     grados: [fila de arriba (Do M), fila de abajo (Sol M)] · arm: rótulos «Do M 0» / «Sol M 1♯» */
  var ACC_P = (window.APX && APX.PAL && APX.PAL.accP) || '#a8791a';
  function rejilla(celdas, grados, arm){
    var h='<div class="apx-paper" style="width:fit-content;max-width:100%;padding:12px 14px 10px">'+
      '<div style="display:grid;grid-template-columns:repeat(7,minmax(34px,64px));color:#16203a">';
    if(arm){ h+='<div style="grid-column:1/3;font-size:12px;font-weight:700;line-height:1.25;padding:0 0 6px 4px">Do M<br>&nbsp;0</div>'+
                '<div style="grid-column:6/8;font-size:12px;font-weight:700;line-height:1.25;padding:0 4px 6px 0;text-align:right">Sol M<br>1♯</div>'; }
    celdas.forEach(function(c,i){ var nuevo=c.charAt(0)==='*'; if(nuevo) c=c.slice(1);
      h+='<div style="border:1px solid #c3c8da;'+(i?'border-left:none;':'')+'height:54px;display:flex;align-items:center;justify-content:center;'+
         'font-size:clamp(17px,4.6vw,25px);font-weight:900;letter-spacing:.02em;white-space:nowrap;'+(nuevo?'color:'+ACC_P+';background:rgba(212,175,55,.12);':'')+'">'+
         c.replace('<small>','<small style="font-size:.62em;margin-left:1px">')+'</div>'; });
    (grados||[]).forEach(function(fila){ if(!fila) return;
      fila.forEach(function(g){ h+='<div style="text-align:center;font-size:12.5px;font-weight:700;color:#56607e;padding-top:4px;min-height:18px">'+g+'</div>'; }); });
    return h+'</div></div>';
  }
  var RAYA = '<div style="height:1px;background:rgba(212,175,55,.45);margin:18px 0"></div>';
  /* ---------- transporte: diálogo (el alumno en cursiva, como en el original) ---------- */
  function AL(t){ return {p:'- <i>'+t+'</i>'}; }
  function PR(t){ return {p:'- '+t}; }

  /* =====================================================================
     FIGURAS DEL LIBRO RE-ESCRITAS CON EL MOTOR (26-sep-2026, Iago)
     ===================================================================== */
  function nota(k,d,o){ var r={k:k, d:d}; if(o) for(var x in o) r[x]=o[x]; return r; }
  function Q(k,o){ return nota(k,'q',o); } function E(k,o){ return nota(k,'8',o); } function H(k,o){ return nota(k,'h',o); }
  var EJ = '<span style="font-style:normal;font-variant:small-caps;letter-spacing:.03em">Ejemplo:</span> ';

  /* ---------- transporte (p41–43) ---------- */
  var MEL_SOL = { txt:EJ+'Transportar esta melodía una 2ª Mayor descendente.', maxW:600, fin:'|', c:[
    {ks:'G', ts:'2/4', n:[E('g/4'),E('f#/4'),E('g/4'),E('a/4')], bm:[[0,1],[2,3]]},
    {n:[E('b/4'),E('d/5'),E('c#/5'),E('cn/5',{acc:'n'})], bm:[[0,1],[2,3]]},
    {n:[H('b/4')]} ] };
  var MEL_FA = { maxW:600, fin:'|', c:[
    {ks:'F', ts:'2/4', n:[E('f/4'),E('e/4'),E('f/4'),E('g/4')], bm:[[0,1],[2,3]]},
    {n:[E('a/4'),E('c/5'),E('bn/4',{acc:'n'}),E('bb/4',{acc:'b'})], bm:[[0,1],[2,3]]},
    {n:[H('a/4')]} ] };
  /* Re M original: el sol♯ en dorado (es la nota que cambia) */
  function MEL_RE(flecha){ return { txt:EJ+'Transportar este fragmento una 3ª m ascendente', maxW:600, fin:'|', c:[
    {ks:'D', ts:'2/4', n:[Q('d/5'),E('c#/5'),E('b/4')], bm:[[1,2]]},
    {n:[Q('a/4'),E('b/4'),E('g#/4',{col:'acc'})], bm:[[1,2]]},
    {n:[Q('a/4'),Q('e/4')]} ] }; }
  /* el mismo fragmento «transportado de cabeza»: clave de sol y armadura de Re M tachadas (✕), clave de fa, 1♭ y 2/4.
     Las notas no se mueven de su línea/espacio: ahora se leen en Fa M. El sol♯ pasa a ser un si con ♮ (en dorado). */
  function MEL_TACHADA(flechas){
    var S = { maxW:600, fin:'|', top:(flechas?74:58), bot:(flechas?60:44), c:[
      {ks:'D', n:[nota('b/4','16',{inv:true, id:'tx', ar:{t:'tachadas', it:true, fw:700, fs:12, col:'acc', dx:-26, dy:-6}})], fin:' ', pad:-22, w:0.01, junto:true},
      {clef:'bass', ks:'F', ts:'2/4', n:[Q('f/3'),E('e/3'),E('d/3')], bm:[[1,2]], junto:true},
      {n:[Q('c/3'),E('d/3'),E('b/2',{col:'acc', id:'nat'})], bm:[[1,2]], junto:true},
      {n:[Q('c/3'),Q('g/2')], junto:true} ],
      a:[ {t:'txt', de:'tx', txt:'✕', dx:-47, dy:0, fs:62, fw:400, col:'acc'},
          {t:'txt', de:'tx', txt:'✕', dx:-6, dy:-5, fs:46, fw:400, col:'acc'} ] };
    if(flechas){
      S.c[1].ksFlecha = {i:0, txt:'armadura'};
      S.a.push({t:'flecha', a:'nat', dx:-8, dy:-66, bdx:-12, bdy:-6, lado:'arriba'});
    }
    return S;
  }

  /* ---------- modulación (p37, p40): progresiones en sistema doble ----------
     def.compases: [{huecos:[…], marco, minW, w}] — varios acordes en un mismo compás quedan siempre en la misma línea.
     hueco: {t:[claves sol], b:[claves fa], f:[texto fila 1, fila 2, fila 3]}  (fila 1 = tonalidad inicial, tinta;
            fila 2 = tonalidad nueva, dorado; fila 3 = rótulo en cursiva) · o bien un hueco de rótulo {lab:'Do Mayor', f:[…]}:
            rótulo en recuadro encima, su fila en recuadro debajo y una línea discontinua que los une (como en el libro).
     def.guiones: [[fila, hueco i, hueco j, dx1, dx2]] → raya entre dos cifras («I — VII»). */
  function posD(k){ var m=/^([a-g])[#bn]*\/(-?\d)/.exec(k); return {c:0,d:1,e:2,f:3,g:4,a:5,b:6}[m[1]]+7*(+m[2]); }
  function claveDe(pos){ var o=Math.floor(pos/7); return 'cdefgab'.charAt(pos-7*o)+'/'+o; }
  function offFa(keys){ var p=Math.min.apply(null, keys.map(posD)); return -5*(p-18); }   /* px bajo la 5ª línea (sol2) */
  function prog(def){
    var FILAS = def.filas || [34, 56, 78], ESTILO = [
      {fs:13.5, fw:700, col:'#16203a'}, {fs:13.5, fw:800, col:'acc'}, {fs:12, fw:600, col:'#56607e', it:true} ];
    var c=[], a=[], filas=[], idx=0, guion=!!def.guiones;
    def.compases.forEach(function(C, ci){
      var n1=[], n2=[], v2=[];
      C.huecos.forEach(function(h){
        var id='h'+(def.id||'')+idx; idx++;
        var tn, bn, bk;
        if(h.lab){
          var fila = (h.f||[]).findIndex(function(t){ return t; });
          /* nota fantasma en clave de fa: su altura fija dónde acaba la línea discontinua (justo en el recuadro de su fila) */
          bk = [claveDe(18 - Math.ceil((FILAS[fila]-5)/5))];
          tn = {k:'e/5', d:'16', inv:true, id:id+'t', ar:{t:h.lab, caja:true, fs:13, fw:700, col:'#16203a', dx:(h.labDx||0)}};
          bn = {k:bk[0], d:'16', inv:true, sinCabeza:true, id:id+'b'};
          a.push({t:'arco', de:id+'t', a:id+'b', lado:'arriba', forma:'v', alto:0, dash:true});
        } else {
          var tk=h.t||['b/4']; bk=h.b||['d/3'];
          tn={k:(tk.length>1?tk:tk[0]), d:'w', id:id+'t'}; if(!h.t) tn.inv=true;
          bn={k:(bk.length>1?bk:bk[0]), d:'w', id:id+'b'}; if(!h.b) bn.inv=true;
        }
        n1.push(tn); n2.push(bn);
        /* notas fantasma muy graves en la clave de sol (misma vertical que el acorde): anclan las rayas entre cifras */
        if(guion) v2.push({k:['d/0','c/0'], d:(h.lab?'16':'w'), inv:true, sinCabeza:true, id:id+'g'});
        (h.f||[]).forEach(function(t,fi){ if(t==null || t==='') return; var E2=ESTILO[fi], xt=(typeof t==='object')?t:{t:t};
          var o={t:'txt', de:id+'b', txt:xt.t, lado:'abajo', dy:FILAS[fi]-offFa(bk)-22+(xt.dy||0), fs:xt.fs||E2.fs, fw:E2.fw, col:E2.col, it:E2.it};
          if(h.lab && fi<2){ o.caja='bloque'; o.col='#16203a'; o.fw=700; o.fs=12.5; }
          if(xt.dx!=null) o.dx=xt.dx; if(xt.anchor) o.anchor=xt.anchor;
          filas.push(o); });
      });
      var m={n:n1, n2:n2, fin:(ci===def.compases.length-1?'|':' '), centrar:true};
      if(guion) m.v2=v2;
      if(C.marco) m.marco=true; if(C.minW) m.minW=C.minW; if(C.w!=null) m.w=C.w; if(C.junto) m.junto=true;
      c.push(m);
    });
    (def.guiones||[]).forEach(function(g){ var h1='h'+(def.id||'')+g[1]+'g', h2='h'+(def.id||'')+g[2]+'g';
      a.push({t:'arco', de:h1, a:h2, lado:(g[0]===0?'arriba':'abajo'), forma:'v', alto:0, dx1:g[3], dx2:g[4], col:(g[0]===0?'#16203a':'acc')}); });
    return { txt:def.txt, clef:'treble', clef2:'bass', gap2:66, top:(def.top||62), bot:(def.bot||96), fin:'|', c:c,
             a:a.concat(filas).concat(def.a||[]) };
  }
  /* p37 · Do M → Sol M: I (Do) – VI = II (Lam) – V de Sol (Re, con fa♯) – I (Sol). Los dos acordes puente, sombreados. */
  var FIG_DIAT = prog({ id:'d', compases:[
    {huecos:[ {lab:'Do Mayor', labDx:8, f:['Ton. Inicial']} ]},
    {marco:true, huecos:[
      {t:['c/4','e/4','g/4'], b:['c/3'], f:['I','IV',{t:'Acordes Puente', dx:-14, anchor:'start'}]},
      {t:['c/4','e/4','a/4'], b:['a/2'], f:['VI','II']} ]},
    {huecos:[
      {t:['a/3','d/4','f#/4'], b:['d/3'], f:['','V']},
      {t:['b/3','d/4','g/4'], b:['g/2'], f:['','I']} ]},
    {minW:84, huecos:[ {lab:'Sol Mayor', f:['','← Nueva\nTon.']} ]} ] });
  /* p40 · cromatismo de una nota: Do M → Mi♭ M (la → la♭); el acorde puente, sombreado */
  var FIG_CROM = prog({ id:'c', txt:'Ejemplo con cromatismo de una nota.', filas:[34, 64, 88], top:84, bot:100, compases:[
    {w:0.6, huecos:[ {lab:'Do Mayor', labDx:8, f:['Tonalidad\nInicial']} ]},
    {w:2, huecos:[
      {t:['c/4','e/4','g/4'], b:['c/3'], f:['I']},
      {t:['c/4','f/4','a/4'], b:['f/3'], f:['IV']} ]},
    {marco:true, junto:true, w:1, huecos:[
      {t:['c/4','f/4','ab/4'], b:['f/3'], f:[{t:'♭', fs:18, dy:2},'II','Acorde Puente']} ]},
    {w:3, huecos:[
      {t:['bb/3','f/4','bb/4'], b:['d/3'], f:[{t:'♭6', fs:15},'V']},
      {t:['bb/3','eb/4','g/4'], b:['eb/3'], f:['','I']},
      {t:['c/4','eb/4','ab/4'], b:['ab/2'], f:['','IV']} ]},
    {w:2, huecos:[
      {t:['ab/3','d/4','f/4'], b:['bb/2'], f:['7\n+','V']},
      {t:['g/3','bb/3','eb/4'], b:['eb/2'], f:['','I']} ]},
    {junto:true, w:0.6, huecos:[ {lab:'Mi♭ Mayor', labDx:-10, f:['','← Nueva\nTonalidad']} ]} ],
    a:[ {t:'arco', de:'hc2t', a:'hc3t', lado:'arriba', forma:'v', alto:30, flecha:true, col:'#16203a', txt:'Cromatismo sencillo', tdy:-24, fs:12.5, fw:800},
        {t:'arco', de:'hc3t', a:'hc2t', lado:'arriba', forma:'v', alto:30, flecha:true, col:'#16203a'} ] });
  /* p40 · enarmonía de una nota: si = do♭ (cabezas negras = las notas que se enarmonizan, entre corchetes discontinuos) */
  var FIG_ENH1 = prog({ id:'e', txt:'Ejemplo con enarmonía de una nota', filas:[34, 58], bot:76, compases:[
    {w:0.01, huecos:[ {t:['e/4','g/4'], b:['c/3','c/4'], f:['I']} ]},
    {huecos:[
      {t:['d/4','ab/4'], b:['f/3','b/3/so'], f:['VII']},
      {b:['cb/4/so'], f:['','VII']},
      {t:['eb/4','g/4'], b:['g/3','bb/3'], f:['','I']} ]} ],
    guiones:[[0,0,1,10,-16],[1,2,3,16,-9]],
    a:[ {t:'txt', de:'he0b', txt:'Do M', lado:'abajo', dx:-18, dy:34-offFa(['c/3'])-22, anchor:'end', fs:13.5, fw:700, col:'#16203a'},
        {t:'txt', de:'he3b', txt:'Mi♭ M', lado:'abajo', dx:8, dy:58-offFa(['g/3'])-22, anchor:'start', fs:12.5, fw:800, col:'acc'},
        {t:'8va', de:'he1b', a:'he2b', lado:'arriba', txt:'', sup:'', dy:-4},
        {t:'8va', de:'he1b', a:'he1b', lado:'arriba', txt:'', sup:'', dx2:-16, dy:1} ] });
  /* p40 · enarmonía de dos notas: la♭ = sol♯ y fa = mi♯ */
  var FIG_ENH2 = prog({ id:'f', txt:'Ejemplo con enarmonía de dos notas', filas:[34, 58], bot:76, compases:[
    {w:0.01, huecos:[ {t:['e/4','g/4'], b:['c/3','c/4'], f:['I']} ]},
    {huecos:[
      {t:['d/4','ab/4/so'], b:['f/3/so','b/3'], f:['VII']},
      {t:['g#/4/so'], b:['e#/3/so'], f:['','VII']},
      {t:['c#/4','g#/4'], b:['e#/3','b/3'], f:['','V']},
      {t:['c#/4','f#/4'], b:['f#/3','a#/3'], f:['','I']} ]} ],
    guiones:[[0,0,1,10,-16],[1,2,3,16,-8],[1,3,4,8,-6]],
    a:[ {t:'txt', de:'hf0b', txt:'Do M', lado:'abajo', dx:-18, dy:34-offFa(['c/3'])-22, anchor:'end', fs:13.5, fw:700, col:'#16203a'},
        {t:'txt', de:'hf4b', txt:'Fa♯ M', lado:'abajo', dx:8, dy:58-offFa(['f#/3'])-22, anchor:'start', fs:12.5, fw:800, col:'acc'},
        {t:'8va', de:'hf1t', a:'hf2t', lado:'arriba', txt:'', sup:'', dy:0},
        {t:'8va', de:'hf1t', a:'hf1t', lado:'arriba', txt:'', sup:'', dx2:-16, dy:0},
        {t:'8va', de:'hf1b', a:'hf2b', lado:'abajo', txt:'', sup:'', dy:-28},
        {t:'8va', de:'hf1b', a:'hf1b', lado:'abajo', txt:'', sup:'', dx2:-16, dy:-28} ] });
  var ENL = 'style="color:inherit;text-decoration:underline;word-break:break-all"';

  Object.assign(window.APX_TEMAS, {

  /* =====================================================================
     SERIALISMO · PDF p15 @25% → p17 @62% (impresas 12–14)
     ===================================================================== */
  'gp-serialismo': {
    titulo:'Serialismo', corto:'Serialismo', fuente:'Apuntes de teoría 2GP · Unidad 3 · p. 12–14',
    bloques:[
      {p:'Aquí la cosa se pone seria, nunca mejor dicho. Un grupo de compositores, encabezados por el mismísimo <i>Arnold Schoenberg</i> decidieron crear un sistema meticuloso y robusto que dota de método a la atonalidad. La técnica más conocida es el <b>dodecafonismo.</b>'},
      {p:'El dodecafonismo defiende que si queremos huir de las notas centrales, de las jerarquías… no hay forma más justa de repartir el protagonismo que coger los 12 sonidos de la escala cromática y no repetir ninguno hasta que suenan los doce.'},
      {p:'Tiene bastante sentido, otra cosa es que te guste cómo suena ;).'},
      {p:'La base de cada composición es que hagas una serie. Es decir, que tú decidas el orden de esos 12 sonidos, y la llamaremos P0 (<i>Principal cero</i>). Por ejemplo:'},
      {penta:{ c: serie(['d/4','bb/4','g/4','eb/4','c/4','ab/4','bn/4','an/4','gb/4','en/4','db/4','f/4'], 'P0') }},
      {p:'He utilizado únicamente bemoles para no confundirnos, lo importante es que no se repita ningún sonido.', i:true},

      {h4:'Serie principal'},
      {p:'Los dodecafónicos partían de esta secuencia y desarrollaban sus obras. Pero claro, si tooodo el tiempo usamos la misma serie…al final se convierte en un bucle bastante repetitivo. Por lo que tuvieron que buscar alternativas pero sin renunciar a su serie principal.'},
      {p:'Lo primero que se les ocurrió fue transportarla. Añadir semitonos a toda la serie. Por ejemplo vamos a sumarle 5 semitonos (una cuarta justa, para que nos entendamos…) y obtenemos la llamada P5. Lo pillas?'},
      {penta:{ c: serie(['g/4','eb/5','c/5','ab/4','f/4','db/5','en/5','dn/5','b/4','an/4','gb/4','bb/4'], 'P5') }},
      {p:'Entonces pasamos de tener una serie a tener… 12 variaciones. Desde P0 hasta P11.'},
      {p:'Recuerda: cada número es un semitono ascendente.', i:true},

      {h4:'Retrógrada'},
      {p:'Quisieron tener mayor variedad y desarrollaron las series retrógradas (R). Consiste en coger tu serie principal y ordenarla al revés, <i>rebobinarla.</i> Voy a coger P0 y le daré la vuelta obteniendo R0.'},
      /* en el original R0 sale incompleta (7 notas) y sigue con «…» fuera del pentagrama */
      {penta:{ justificar:false, fin:' ', c:[
        {n:[R('f/4',{ab:{t:'R0', fw:800, fs:14, col:'#16203a'}}), R('db/4'), R('e/4'), R('gb/4'), R('a/4'), R('b/4'), R('ab/4',{id:'r0fin'})]}
      ], a:[ {t:'txt', de:'r0fin', txt:'…', dx:46, dy:4, fs:18, col:'#16203a'} ] }},
      {p:'Como puedes intuir, tendremos otras 12 variaciones si las transportamos. R0, R1, R2, etc.'},

      {h4:'Inversión'},
      {p:'Esta es una versión más compleja. Aquí la vamos a voltear verticalmente, tiene su ciencia: debemos analizar el intervalo entre cada nota y cambiarle la dirección. Todo lo que sube ha de bajar y viceversa. Pongamos un ejemplo.'},
      {p:'Si te fijas en P0, la primera nota es un Re, y la segunda es un Si♭. Su intervalo es una 6ªm o 4T (lo que te sea más cómodo). Pues bien, si queremos I0 partiremos también de Re, pero ahora haremos que esa 6ªm o los 4T sean descendentes: y nos da un Sol♭.'},
      {grid:[
        {penta:{ tit:'&nbsp;', bot:100, fin:' ', c:[ {n:[R('d/4',{ab:{t:'P0', fw:800, fs:14, col:'#16203a'}}), R('bb/4',{id:'iv1'})]} ],
          a:[ {t:'flecha', a:'iv1', dx:-27, dy:62, bdx:25, bdy:21, txt:'4Tonos↑', tdx:20, tdy:34, fs:13, col:'#16203a'} ] }},
        {penta:{ tit:FLECHA, bot:100, fin:' ', c:[ {n:[R('d/4',{ab:{t:'I0', fw:800, fs:14, col:'#16203a'}}), R('gb/3',{id:'iv2'})]} ],
          a:[ {t:'flecha', a:'iv2', dx:-60, dy:13, bdx:12, bdy:26, txt:'4Tonos↓', tdx:72, tdy:44, fs:13, col:'#16203a'} ] }},
        {penta:{ tit:'o', bot:100, fin:' ', c:[ {n:[R('d/4',{ab:{t:'I0', fw:800, fs:14, col:'#16203a'}}), R('gb/4')]} ],
          pie:'*dato. una vez sepas cuál es la nota (sol♭) puedes ubicarla en la octava que prefieras. Eso a los dodecafónicos les da igual.' }}
      ], cols:3},
      {p:'Entonces, si no me fallan los cálculos, I0 tendría que ser tal que así <i>(lo he subido todo una octava por comodidad visual)</i>:'},
      {penta:{ c: serie(['d/5','gb/4','a/4','db/5','e/5','ab/4','f/4','gn/4','bb/4','c/5','eb/5','bn/4'], 'I0') }},

      {h4:'Inversión de la retrogradación'},
      {p:'A estas alturas ya estarás hiperventilando. Tranquil@, esta variante solamente quiero que sepas que existe, pero no te la voy a preguntar. Consiste en hacer ambos procesos (R) e (I) al mismo tiempo, lo que nos da (RI).'},
      {p:'Entonces sumando todas las posibilidades…nos dan un total de 48 variaciones de la serie principal. Ya tenemos suficientes recursos para no aburrirnos.'},
      {p:'<b>Buena noticia.</b> Todos estos trabajos de cálculo de variaciones nos los podemos ahorrar añadiendo la P0 en esta web: <a href="https://www.musictheory.net/calculators/matrix" target="_blank" rel="noopener" '+ENL+'>https://www.musictheory.net/calculators/matrix</a>'},
      {p:'<b>Mala noticia.</b> Para los exámenes no podrás usarla, eso te lo dejo para cuando quieras componer dodecafonismo por tu cuenta.'},

      {h:'Serialismo integral'},
      {p:'Pues que sepas que hubo una serie de compositores que criticaron al dodecafonismo por ser “poco riguroso”, ya que como sabéis seriaban contundentemente las <i>alturas</i> de las notas; pero los <i>ritmos, matices, articulaciones y otros parámetros</i> lo utilizaban clásicamente.'},
      {p:'Ya te puedes imaginar: se dedicaron a seriarlo todo. Cada nota que escuchas de serialismo integral sigue un meticuloso proceso de elección de altura, timbre, intensidad, duración… preestablecido por las correspondientes series. Bastante loco.'}
    ]
  }

  ,

  /* =====================================================================
     CIFRADO AMERICANO · PDF p26 @10–52% (impresa 23)
     Las flechas del original (de cada tríada a su cuatríada) cruzan el texto
     de en medio: en la web van como etiqueta dorada encima de cada cuatríada.
     ===================================================================== */
  'gp-cifrado': {
    titulo:'Cifrado americano', corto:'Cifrado americano', fuente:'Apuntes de teoría 2GP · Unidad 5 · p. 23',
    bloques:[
      {p:'Vamos a ver los <u>10 acordes más típicos, su estructura y su cifrado</u>. Tomaremos como ejemplo la tónica Re. Empecemos por las <b>tríadas.</b>'},
      {penta:{ c:[
        acorde('t1', ['d/4','f#/4','a/4'],        'D',    ['Mayor'],               ['5J','3M'], true),
        acorde('t2', ['d/4','f/4','a/4'],         'D-',   ['Menor'],               ['5J','3m'], true),
        acorde('t3', ['d/4','f#/4','a#/4'],       'D+',   ['Aumentado'],           ['5A','3M'], false),
        acorde('t4', ['d/4','f/4','ab/4'],        'Dº',   ['Disminuido'],          ['5D','3m'], true),
        acorde('t5', ['d/4','g/4','a/4'],         'Dsus', ['4ªSuspendida'],        ['5J','4J'], false)
      ], a:etiquetas(['t1','t2','t3','t4','t5']) }},
      {p:'Ahora veamos las <b>cuatríadas. Fíjate en su relación con los anteriores.</b>'},
      {penta:{ top:74, bot:76, c:[
        acorde('c1', ['d/4','f#/4','a/4','c/5'],  'D7',   ['Séptima','dominante'], ['5J','3M'], true, '7m', '↓ D'),
        acorde('c2', ['d/4','f/4','a/4','c/5'],   'D-7',  ['Menor','séptima'],     ['5J','3m'], true, '7m', '↓ D-'),
        acorde('c3', ['d/4','f#/4','a/4','c#/5'], 'D△',   ['Mayor','séptima'],     ['5J','3M'], true, '7M', '↘ D'),
        acorde('c4', ['d/4','f/4','ab/4','c/5'],  'D∅',   ['Semi','disminuido'],   ['5D','3m'], true, '7m', '↓ Dº'),
        acorde('c5', ['d/4','f/4','ab/4','cb/5'], 'Dº7',  ['Séptima','disminuida'],['5D','3m'], true, '7D', '↘ Dº')
      ], a:etiquetas(['c1','c2','c3','c4','c5']) }}
    ]
  }

  ,

  /* =====================================================================
     MODULACIÓN · toda la U8: PDF p37–40 (impresas 34–37)
     Figuras del libro (p37, p40) re-escritas con el motor: acordes en sistema doble, rótulos y cifrado debajo.
     ===================================================================== */
  'gp-modulacion': {
    titulo:'Modulación', corto:'Modulación', fuente:'Apuntes de teoría 2GP · Unidad 8 · p. 34–37',
    bloques:[
      {p:'Modular, en música, consiste en <u>viajar de una tonalidad a otra</u>.'},
      {p:'En la <i>unidad 3</i> definimos tonalidad como un sistema jerárquico de sonidos que nos proporcionan reposo, tensión y otros que, simplemente, no forman parte del menú. De alguna forma es estar ubicados en un lugar, en una región sonora. Poder movilizarnos de una región a otra nos expande el espacio, enriquece la experiencia y aporta muchos más recursos a la hora de componer.'},
      {p:'Retomando la temática de los videojuegos, modular es algo similar a la experiencia de jugar a un juego de mundo abierto. Imagínate el <i>Breath of the Wild,</i> de Zelda: ¿ves aquella montaña que se divisa en el horizonte? pues que sepas que podrás acceder a ella. ¿Cómo? bueno, hay distintas formas: podrás acercarte por tierra y escalarla, podrás propulsarte verticalmente y planear con la paravela, o inventar algún sistema creativo que nos permitieron en <i>Tears of the Kingdom.</i>'},
      {p:'Volviendo a la música, podremos modular también de distintas formas. Vamos a mencionar algunas por encima y nos centraremos en la primera de ellas.'},

      {h:'Modulación diatónica'},
      {p:'Para realizar una modulación diatónica <u>utilizaremos uno o varios acordes que sean comunes</u> entre la tonalidad A (<i>Do Mayor</i>) y la tonalidad B (<i>Sol Mayor</i>).'},
      {penta:FIG_DIAT},
      {p:'Piensa en este ejemplo como una síntesis. En la práctica, modular nada más empezar sería absurdo y es todo lo contrario a lo que te conté al principio de expandir la música.', i:true},
      {p:'Fíjate en el segundo acorde (<i>La menor</i>):'},
      {p:'- Desde el punto de vista de <i>Do Mayor</i>, es un VI.'},
      {p:'- Desde el punto de vista de <i>Sol Mayor</i>, es un II.'},
      {p:'Pero estamos de acuerdo en que <u>no es un acorde extraño ni disonante</u> para ninguna de las dos tonalidades, ¿verdad? <u>Entra dentro de las posibilidades</u>.'},
      {p:'Bien, pues con esta idea ya podemos despedirnos de nuestra primera región y, a partir de ese momento, ya movernos en nuestro nuevo entorno (fíjate cómo ya aparece después el <i>fa♯</i>, propio de <i>Sol Mayor</i>).'},
      {html:RAYA},
      {p:'Ahora te voy a explicar cómo va nuestro método en el arte de modular. Lo haremos de forma conceptual y minimalista. Si antes hablábamos del Zelda, vámonos al Minecraft.'},
      {p:'Recuerda: esto sólo es una introducción. Cuando estudies armonía, harás modulaciones en partitura y, cuando te toque análisis, verás cómo lo hacían los compositores más destacados.', i:true},
      {p:'Simplifiquémoslo al máximo. Esto sería el enunciado de un ejercicio:'},
      {html:rejilla(['C','','','','','','G'])},
      {pasos:[
        {n:'Paso 0', t:'Establecer las armaduras de la tonalidad A y tonalidad B.', dentro:{html:rejilla(['C','','','','','','G'], null, true)}},
        {n:'Paso 1', t:'Generar un proceso cadencial básico para asentar la tonalidad A.',
          dentro:{html:rejilla(['C','*F','*G<small>7</small>','*C','','','G'], [['I','IV','V7','I','','',''],null], true)}},
        {n:'Paso 2', t:'Buscar un acorde común entre ambas tonalidades. Tan sólo hay que tener cuidado de evitar aquellos sonidos que no comparten. En este caso la nota a evitar es <i>fa</i> (porque para DoM es natural y para SolM, es sostenido). En este caso voy a optar por el acorde de Mim*.',
          dentro:{html:rejilla(['C','F','G<small>7</small>','C','*E-','','G'], [['I','IV','V7','I','III','',''],['','','','','VI','','']], true)}},
        {n:'Paso 3', t:'Asentar la tonalidad B. En estos casos, ya que solo nos queda una casilla por rellenar, optaremos siempre por la dominante.',
          dentro:{html:rejilla(['C','F','G<small>7</small>','C','E-','*D<small>7</small>','G'], [['I','IV','V7','I','III','',''],['','','','','VI','V7','I']], true)}}
      ]},
      {p:'Tres aclaraciones:'},
      {pasos:[
        {n:'1)', t:'Si te fijas, cada vez que pongo un acorde de dominante lo estoy poniendo con 7ª. Es una cuestión estilística, ya que aporta tensión y era lo más utilizado.'},
        {n:'2)', t:'Por definición, un acorde de dominante, es mayor. No importa lo que diga la armadura.'},
        {n:'3)', t:'*<i>Las dominantes son siempre mayores, ok… Pero cómo puedo saber si el resto de acordes son M o m?</i> pues mira la armadura que les corresponde, crack. Y si es el acorde de modulación… da igual cuál mires. Total, ambas tienen que coincidir en ese acorde, lo pillas?'}
      ]},

      {h:'Modulación cromática'},
      {p:'Se parece a la modulación diatónica. Es útil cuando vamos a tonalidades muy lejanas, que no tienen acordes en común, pero sí parecidos. En este caso se presenta un acorde de la tonalidad A seguido de un acorde de la tonalidad B que se le parece (sólo les diferencia algún cromatismo). Y ya puedes seguir operando con normalidad en tu nueva tonalidad.'},
      {penta:FIG_CROM},

      {h:'Modulación enarmónica'},
      {p:'Se obtiene a través de la enarmonización de una o varias notas del acorde puente entre las dos tonalidades. Es menos común. Que te suene y ya me vale.'},
      {grid:[
        {penta:FIG_ENH1},
        {penta:FIG_ENH2}
      ]}   /* 2 columnas (valor por defecto); en el móvil, una debajo de otra */
    ]
  },

  /* =====================================================================
     TRANSPORTE · toda la U9: PDF p41–45 (impresas 38–42)
     Ejemplos del libro re-escritos con el motor (p42: clave y armadura tachadas, flechas al ♮ y a la nueva armadura).
     ===================================================================== */
  'gp-transporte': {
    titulo:'Transporte', corto:'Transporte', fuente:'Apuntes de teoría 2GP · Unidad 9 · p. 38–42',
    bloques:[
      {p:'Transportar <u>es escribir o interpretar una obra musical en una tonalidad distinta</u> (más grave o más aguda). Ojo, el transporte es absoluto: el modo no cambia.'},
      {p:'Antes de ver las formas de transportar vamos a charlar un poco sobre cuáles podrían ser las situaciones en las que cambiar de tonalidad nos resulta útil o necesario. ¿Alguna idea?'},

      {h:'Transporte escrito'},
      {p:'Literalmente hay que reescribir la pieza en la nueva tonalidad.'},
      {penta:MEL_SOL},
      {p:'Tendríamos que poner la armadura de la nueva tonalidad (FaM) y volver a escribir los sonidos en su altura correspondiente:'},
      {penta:MEL_FA},
      {p:'<b>Desventajas.</b> Hay que tomarse la molestia de escribirlo de nuevo. El ejemplo son 3 compases, ¡ponte a transportar una sinfonía entera!'},
      {p:'Por suerte si tenemos el archivo en nuestro programa de edición de partituras ya lo tendríamos listo en uno o dos clicks.'},
      {p:'Otra desventaja es que la partitura original ya no la vas a usar. Menudo desperdicio de papel!'},
      {p:'<b>Ventajas.</b> Una vez transportado simplemente tocas tu partitura, no hay nada más que hacer ni pensar.'},

      {h:'Transporte mental'},
      {p:'En este caso toca darle al coco. Aprovecharás la partitura que tienes, harás unas pocas anotaciones y pondremos a prueba tus reflejos mentales.'},
      {penta:MEL_RE(true)},
      {p:'Tachamos la armadura que aparece ahí añadiendo la nueva (1♭, FaM). Hacemos lo mismo con la clave (para que las notas ya escritas se llamen como ahora queremos que se llamen)*'},
      {penta:MEL_TACHADA(true)},
      {cols:[
        [ {p:'*En este caso coincide que resulta clave de fa, lo cual es amigable. Si requiere alguna clave que no dominamos lo que se suele hacer es contar mentalmente…lo siento.', i:true} ],
        [ {p:'<s># eliminado</s>, sustituido por un becuadro porque con respecto a la <u>armadura</u> ya sube un semitono'} ]
      ]},
      {p:'<b>Desventajas.</b> Según la clave que te toque puede ser bastante duro o muy duro a nivel mental. Si no tienes hábito es probable que la mitad de las notas vayan al poste.'},
      {p:'<b>Ventajas.</b> Un par de anotaciones y a confiar en tu habilidad… es un método muy rápido y no te quedará otra si vas just@ de tiempo.'},
      {p:'Pero… un momento. ¿Por qué en el ejemplo de arriba (Re M) el sol es ♯ y abajo en el transporte (FaM) la misma nota lleva un ♮?'},
      {p:'Bueno, será mejor que te sientes. Todavía nos queda una cosa por ver. No te va a gustar.'},

      {h:'Las @#¡%&! diferencias'},
      {p:'Al cambiar de tonalidad y armadura, algunas de las notas alteradas accidentalmente pueden sufrir modificaciones en cuanto a los signos de alteración que tenían.'},
      {p:'Estas modificaciones se llaman “Diferencias”. Expliquémoslo conversando:'},
      AL('¿Esto por qué es?'),
      PR('Porque si no hacemos ese cambio de alteración, el intervalo de transporte no es el correcto. Volvamos al ejemplo de antes.'),
      {penta:MEL_RE(false)},
      {p:'Ese <i>sol♯</i>, con respecto a ReM es el IV alterado un semitono ascendente.'},
      {p:'Ahora, al cambiar a FaM, esa nota se llama <i>si.</i> De no haber cambiado la alteración (como ves en el ejemplo ya bien resuelto) figuraría por defecto <i>si♯.</i> Con respecto a la tónica, <i>si♯</i> es más que el IV alterado un semitono ascendente. Con el becuadro ya lo estamos colocando en su lugar correspondiente (lo estamos subiendo un semitono con respecto a su nueva armadura, con el <i>si♭</i>).'},
      {penta:MEL_TACHADA(false)},
      {p:'Ya te dije que no te iba a gustar. Aguanta un poco, que ya acabas Lenguaje Musical.'},
      AL('¿Pero cómo saber cuántas diferencias hay entre dos tonalidades?'),
      PR('Esta es la parte más sencilla.'),
      {p:'Comparas las dos armaduras y cuentas los pasos que te mueves. Ej: de ReM (2♯) a FaM (1♭).'},
      {html:'<p class="apx-p" style="text-align:center;max-width:none;font-size:20px;font-weight:800;letter-spacing:.04em;margin:12px 0">2♯ <span class="apx-acc" style="font-size:1.25em">➜</span> 1♯ <span class="apx-acc" style="font-size:1.25em">➜</span> 0 <span class="apx-acc" style="font-size:1.25em">➜</span> 1♭</p>'},
      {p:'Tiene tres movimientos. <u>Tiene 3 diferencias descendentes.</u>'},
      AL('¿Descendentes?'),
      PR('Sí, porque pasa de sostenidos a bemoles.'),
      AL('¿?'),
      PR('Imagina que los sostenidos simbolizan lo alto de una montaña y que los bemoles simbolizan las profundidades.'),
      AL('Ok…'),
      PR('Pues todo lo que suponga ir de más sostenidos a menos sostenidos significa bajar, no?'),
      AL('Vale, lo voy pillando.'),
      PR('Lo mismo sucede si pasas de no tener alteraciones a tener bemoles, has descendido.'),
      AL('Como el Depor.'),
      PR('Vuelve, anda, que queda poco. Si pasas de MibM a DoM ¿Cuántos saltos has dado?'),
      AL('MibM tiene 3 bemoles y DoM no tiene alteraciones. 3 diferencias… ¿ascendentes?'),
      PR('¡Eso es! Volviendo a la metáfora, la no-armadura de DoM sería algo así como el nivel del mar. De las profundidades subterráneas (3♭) al nivel del mar, has ascendido.'),
      AL('Ok, esto creo que lo tengo. ¿Para qué servía saber cuántas diferencias hay?'),
      PR('Eso nos va a revelar las notas con las que hay que tener cuidado de cambiar la alteración.'),
      AL('Esto está siendo duro… prefería el segundo trimestre y la bachatita.'),
      PR('En el ejemplo de antes pasábamos de ReM (2♯) a FaM (1♭) y llegamos a la conclusión de que había <u>3 diferencias descendentes</u>. ¿Estamos?'),
      AL('Sí, creo que sí. ¿Qué notas nos revela eso?'),
      PR('Si, Mi, La. Siguiendo el orden de bemoles.'),
      AL('¿What?'),
      PR('3 diferencias descendentes. Afectarían a las nuevas Si, Mi, La.'),
      AL('Espera, a ver si lo entiendo. Si una vez transportada la partitura, me encuentro algún Si, Mi, La con alteración accidental, ¿se la modifico?'),
      PR('Sí, la tachas y le pones otra.'),
      AL('¿Qué le pongo en su lugar?'),
      PR('La alteración inmediatamente inferior que tengas. Si tuviese un ♯, como en el ejemplo, le pones un ♮.'),
      AL('…'),
      PR('He de reconocer que para esta parte hay que hacer un acto de fe.'),
      AL('…y de paciencia. Hazme un repaso de esta movida.'),
      /* «- Recapitulando:» (última réplica) pasa a ser la etiqueta de la tarjeta dorada (el recuadro del original) */
      {ojo:'<p style="margin:0 0 10px">Cuando transportamos, debemos tener cuidado con las alteraciones accidentales.<br>Algunas deben ser modificadas.</p>'+
           '<p style="margin:0 0 10px">Para saber cuáles son, buscamos las diferencias entre la armadura original y la transportada.<br>También definimos si son diferencias ascendentes o descendentes.</p>'+
           '<p style="margin:0 0 10px">Si las diferencias son ascendentes, afectarán a tantas notas del orden de sostenidos.<br>De encontrarnos una nota de ellas alterada en la partitura transportada, le cambiamos la alteración a una superior.</p>'+
           '<p style="margin:0">Si las diferencias son descendentes, afectarán a tantas notas del orden de bemoles.<br>De encontrarnos una nota de ellas alterada en la partitura transportada, le cambiamos la alteración a una inferior.</p>',
       lab:'Recapitulando'}
    ]
  }

  });
})();

