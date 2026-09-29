# Coordinación entre conversaciones de Claude · teoriapro (Teoría PRO)

Iago tiene varias conversaciones de Claude subiendo cambios a este repositorio a la vez
(27-sep-2026: tres; una de ellas va a cambiar la estética del portal). Este fichero es
el punto de encuentro. Empieza por «_» para que la web no lo publique.

## Antes de subir nada (cualquier conversación)
1. Mira el último commit de `main` y lee este fichero.
2. Apunta en el REGISTRO (abajo) fecha y hora, quién eres, qué ficheros vas a tocar y
   «EN CURSO». Sube esa línea antes que tu cambio (un commit solo con este fichero).
3. Edita SIEMPRE sobre la versión del último commit, descargada justo antes. Nunca subas
   un index.html entero hecho a partir de una copia antigua (ni del espejo de Dropbox sin
   comprobar que es igual a GitHub): borrarías el trabajo de otra conversación.
4. Justo antes de confirmar («Commit changes»), comprueba otra vez que `main` no ha cambiado.
   Si ha cambiado, rehaz tu cambio sobre la versión nueva.
5. Toca solo tu parte. Cada bloque añadido va marcado con un comentario «(fecha, Iago) …» y
   un «Para quitarlo: …». No borres ni reescribas bloques de otros; si tu cambio los afecta,
   explícalo aquí.
6. Al terminar: tu línea pasa a «HECHO · commit xxxxxxx», y deja el espejo de Dropbox
   (APPs/LMATHOME GP (github lmpro)/LMPRO/TEORÍA PRO/) igual que GitHub.

## Quién es quién
- «Intros didácticas»: vídeos de introducción (carpeta intros/ y botón ▶ en las tarjetas).
- «Fichas y rediseño»: arreglo URGENTE del guardado de las fichas de alumno (27-sep) y, más adelante,
  la estética nueva solo para las cuentas Tester/Protester (una línea «LM piel» tras `<meta charset>`).
- «Apuntes en fichas»: botones «APUNTES» / «VER VÍDEO» en la ficha del alumno (27-sep). Lo preparó otra
  conversación y lo publica el coordinador.
- (otras conversaciones: añadid aquí vuestro nombre y de qué os ocupáis)

## Dependencias (léelo si cambias la estética o el HTML de las tarjetas)
- Botón ▶ de la tarjeta «Compases» = bloque `ivf-*` al final de index.html (justo antes
  de </body>). Busca `.home-grid .mode-card[data-path="compasespro"]` y usa las variables
  CSS `--gold1`, `--gold2` y `--gold-soft` (con valores de reserva).
  Si cambiáis el HTML de las tarjetas: conservad `data-path` o actualizad `INTROS` en ese
  bloque. Los estilos `.ivf-play` / `.ivf-*` se pueden adaptar a la estética nueva.
  Prueba: pulsar ▶ → la tarjeta gira, crece y arranca el vídeo; ✕, Esc o «Salir» la cierran.
- intros/compases-extranos/ es autónoma (no carga nada del portal): no hace falta tocarla.
- Botones «APUNTES» / «VER VÍDEO» de la ficha del alumno = bloque «(27-sep-2026, Iago) APUNTES EN LAS
  FICHAS» (ApxFicha, entre VER APUNTES e `ivf-*`). Si cambiáis la fila de «No lo sé hacer…» en `pintaAlu`,
  conservad `class="fp-ayuda"` e `id="aluPractica"`. Si añadís una intro a `INTROS`, añadidla también a
  `VIDEO` de ese bloque. Los botones usan la clase `fp-practica` para el tamaño (la estética «LM piel» la
  heredará); el color lo fija `.apxf-btn`.

- (28-sep, Intros didácticas) VÍDEOS DE GRADO ELEMENTAL EN LAS TARJETAS DE REPASO: bloque de ese nombre (clases `ivg-*`,
  el mismo que en teoriaathome) justo antes de </body>. Pone ▶ en `.home-grid .mode-card[data-path=…]` de intervalos,
  inversion, escalas y tonalidades: si cambiáis el HTML de las tarjetas, conservad `data-path` o actualizad `INTROS` en
  ese bloque. «Ir a ejercicios» usa `window.__abrirVista` y, para colocar, `invOuter`/`invTab` y los id `cardESC0-2`
  (escalas) y `cardTA-TC` (tonalidades): si se renombran, actualizad `EJERCICIOS` en ese bloque. El ▶ copia el estilo de
  `.ivf-play` (variables `--gold*`) y el bloque ya trae lo equivalente a «TARJETA QUE GIRA» para `ivg-*`.
  Los vídeos con «prueba: true» solo los ven Tester y Protester (APX.comprobar). El 👍 es el MISMO que en GE (Supabase,
  clave `intros/<carpeta>/index.html`, sin «gp:»). AL PUBLICARLOS (solo cuando Iago lo diga y solo los que tengan 👍):
  «prueba: true» → «alumnos: true» (nunca invitados) y añadirlos a `VIDEO` de «APUNTES EN LAS FICHAS»: intervalos_id e
  intervalos_build → intros/intervalos/, inversion_int_simples → intros/inversion-intervalos/, inversion_int_compuestos →
  intros/inversion-compuestos/, escala_menor → intros/escalas-menores/, escala_mayor → intros/escalas-mayores/,
  escala_otras → intros/otras-escalas/, ton_nombre → intros/indica-la-tonalidad/, ton_armadura →
  intros/indica-la-armadura/, ton_vecinos → intros/tonalidades-vecinas/ (cada una con /index.html).
  Esas carpetas son COPIAS de teoriaathome/intros/ (solo cambia `INTRO_CFG` del index.html: «Salir» e «Ir a ejercicios»
  llevan a este portal): si se cambia uno de esos vídeos en GE, hay que copiarlo aquí también. intros/la-tonalidad/ sale
  la primera en el menú de «Tonalidades» (4 vídeos, como en GE; 29-sep) y también la abre el cartel «▶ La tonalidad»
  de los vídeos de escalas.

## Registro (lo más reciente arriba · hora de Galicia)
- 29-sep 16:02 · Intros didácticas · EN CURSO · (1) vídeo GP nuevo EN PRUEBA: intros/dodecafonismo/ (▶ en la tarjeta
  «Dodecafonismo») + index.html: bloque ivg (INTROS y EJERCICIOS) y VIDEOS/TEMA_VIDEO de «APUNTES EN LAS FICHAS»; (2) MP4
  60 fps de las copias GE indica-la-armadura, tonalidades-vecinas y escalas-mayores (1440p); (3) intros/*/motor.js: cursor
  escondido mientras suena; (4) index.html, bloques ivg e ivf: pulsar fuera del vídeo ya no lo cierra y el cursor se
  esconde a los 2,5 s. Parto de 0c2bc07.
- 29-sep 15:33 · Intros didácticas · HECHO · commit 4ef13a9 (EN CURSO en b9f8e60) · intros/*/motor.js (las 18, el mismo
  fichero): en modo MP4 el vídeo se DESCARGA ENTERO (fetch → Blob) antes de empezar; mientras, se ve el título dibujado y
  una barra rosa con el % descargado bajo él; luego ya no se para a mitad. Sin descarga posible, como antes. Para volver al
  motor anterior: el motor.js del commit 24889b5.
- 29-sep 15:28 · Intros didácticas · EN CURSO · intros/*/motor.js (todas, el mismo fichero): en modo MP4 el vídeo se
  DESCARGA ENTERO antes de empezar (barra rosa con el % bajo el título; luego ya no se para a mitad) y el título se ve
  dibujado mientras. Nada más. Parto de 24889b5.
- 29-sep 15:06 · Intros didácticas · HECHO · commit 4156294 (EN CURSO en 3a6e910) · (1) intros/serie-armonica/: vídeo GP
  nuevo EN PRUEBA (música de «Compases extraños»), ▶ en la tarjeta «Serie armónica» (data-path seriearmonica; «Ir a
  ejercicios» → ?practice=seriearmonica). index.html: una entrada en INTROS y otra en EJERCICIOS (bloque ivg) y, en
  «APUNTES EN LAS FICHAS», VIDEOS.seriearmonica y TEMA_VIDEO seriearmonica (sin 👍 no lo ven los alumnos). (2) copias GE
  la-tonalidad e indica-la-tonalidad en MP4 a 60 fps (el mismo .mp4 que en teoriaathome + una línea en su index.html).
- 29-sep 14:24 · Intros didácticas · EN CURSO · (1) vídeo GP nuevo EN PRUEBA: intros/serie-armonica/ (▶ en la tarjeta
  «Serie armónica», data-path seriearmonica) + index.html: solo el bloque ivg (INTROS y EJERCICIOS) y VIDEOS/TEMA_VIDEO de
  «APUNTES EN LAS FICHAS»; (2) MP4 a 60 fps de las copias GE la-tonalidad e indica-la-tonalidad (su .mp4 + una línea en
  su index.html). Parto de a98c829.
- 29-sep 13:08 · Intros didácticas · HECHO · commits 4f3f78e y cf0ca47 (EN CURSO en 01a1080) · (1) intros/*/motor.js: modo
  MP4 (si el index.html de un vídeo declara window.VIDEO_MP4 = '<fichero>.mp4' y window.ENLACES_MP4 = zonas pulsables de sus
  carteles, se reproduce ese vídeo grabado a 60 fps en vez de dibujarlo en directo; ?svg = modo de siempre; ?fps = contador) y
  el primero grabado: la copia GE escalas-mayores (escalas_mayores_60.mp4, 10 MB, + una línea en su index.html).
  (2) index.html: bloques ivg (vídeos GE/GP) e ivf (tarjeta «Compases») con SIN_GIRO = true (la caja del vídeo sale ya
  grande y plana, sin volteo, fundidos ni desenfoque) + bloque CSS «VÍDEOS SIN VOLTEO» antes de </body>; para volver al
  giro, SIN_GIRO = false. Seguiré grabando el resto de vídeos a MP4, con su EN CURSO.
- 29-sep 12:46 · Intros didácticas · EN CURSO · (1) vídeos en MP4 a 60 fps, fluidos en cualquier pantalla: motor.js nuevo en
  todas las intros (modo MP4 solo si su index.html declara window.VIDEO_MP4; si no, igual que siempre) y el primero grabado,
  la copia GE escalas-mayores (escalas_mayores_60.mp4 + una línea en su index.html); (2) después, index.html: las tarjetas
  de vídeo (bloques ivg e ivf) se abren y cierran sin volteo ni desenfoque de fondo. Nada más. Parto de a305fb5.
- 29-sep 12:08 · Intros didácticas · HECHO · commit e8b837a (EN CURSO en e7aac70) · todos los vídeos de intros/: la foto del
  conservatorio y el velo salen del SVG a dos capas propias (index.html: #fondoCapa y #velo; escenas.js: solo la línea del
  velo, que ahora cambia style.opacity) y dibujo.js mide bien los textos con espaciado entre letras (había un Chrome, el de la
  pantalla del aula de Iago, que no lo contaba y los carteles se quedaban cortos) y ajusta el texto a su cartel. Mismo aspecto;
  el pintado por fotograma baja de ~31 a ~2 ms en los fundidos del título y de ~2 a ~0,5 ms en el resto (medido a 4K).
  Si hacéis un vídeo nuevo, usad este index.html y este dibujo.js (script: _herramientas/motor34.py en el Escritorio de Iago).
- 29-sep 12:00 · Intros didácticas · HECHO · commit 2c466e1 (EN CURSO en df084e7) · intros/: indice-acustico y modos (vídeos de
  Grado Profesional EN PRUEBA, música de «Compases extraños»; ▶ en las tarjetas «Índice acústico» y «Modos», data-path
  indiceacustico y modos) y copias de 3 vídeos GE nuevos EN PRUEBA: acordes (tarjeta «Acordes», data-path acordes),
  enarmonias (tarjeta «Enarmonías», enarmoniapro) e inversion-acordes (dentro de «Inversión»); cada copia lleva su
  INTRO_CFG de Teoría PRO · las 10 copias GE ya subidas, al día con teoriaathome 8358889 · index.html: bloque ivg (INTROS,
  EJERCICIOS y APUNTES desde los vídeos) y, en «APUNTES EN LAS FICHAS», solo VIDEOS/TEMA_VIDEO de estos vídeos (sin 👍 no
  los ven los alumnos). Subido con GitHub Desktop (clon en el Escritorio de Iago, _github-claude/): los mp3 que pasan por el
  Mac llevan metadatos C2PA en la cabecera ID3 (audio idéntico). Espejo de Dropbox igual que GitHub.
- 29-sep 08:39 · Fichas y rediseño · HECHO · commit ebb4361 · index.html · ficha del alumno: «No lo sé hacer / tengo dudas» como
  texto + hasta 3 botones con contorno rosa (Apuntes · Vídeo · Practicar ejercicios sueltos) en pintaAlu y en el
  bloque «APUNTES EN LAS FICHAS» (ApxFicha); en las preguntas test (fonógrafo y demás temas del Libro 2GP), «Apuntes»
  (el Libro 2GP en PDF si no hay apuntes web) y «Ver portal interactivo»; ventana «Vamos a practicar esto» con la
  estética nueva (fpModalPracticar); vídeos con 👍 en la ficha (lista propia dentro de ApxFicha: NO toca INTROS, ivg-*,
  ivf-* ni intros/); revisión del profesor: &ej=N centra el ejercicio y rótulo con la estética nueva. Parto de
  c244f8a.
  AVISO para «Intros didácticas»: en la ficha, «Vídeo» enseña a los alumnos los vídeos del tema ya publicados o con 👍.
  El 👍 no lo pueden leer las cuentas de alumno, así que va copiado en VERIFICADOS (bloque «APUNTES EN LAS FICHAS»):
  al dar un 👍 nuevo o publicar un vídeo, añadidlo también ahí (y a VIDEOS si es un vídeo nuevo).
- 29-sep 06:50 · Intros didácticas · HECHO · commit 5725e4c · index.html: en el bloque «VÍDEOS DE GRADO ELEMENTAL EN LAS
  TARJETAS DE REPASO» (ivg-*), «La tonalidad» sale también en el menú de la tarjeta «Tonalidades» (4 vídeos, como en GE;
  lo pide Iago). Solo cambian 2 líneas de ese bloque (INTROS y su comentario). Partí de 1b82288.
- 28-sep 20:33 · Intros didácticas · HECHO · commits 9b5a04c, 24ac2bd, f1f0c11, 40d97e2, 6dc0d38, 62260b2, 19c1911,
  dbc3efc, e305faa, ed6a8a5 y 7465347 (una carpeta de intros/ cada uno) y d915f15 (index.html) · vídeos de Grado Elemental
  TAL CUAL (EN PRUEBA: solo Tester y Protester) en las tarjetas de REPASO «Intervalos», «Inversión», «Escalas» y
  «Tonalidades» · carpetas nuevas intros/intervalos/, intervalos-compuestos/, inversion-intervalos/, inversion-compuestos/,
  indica-la-tonalidad/, indica-la-armadura/, tonalidades-vecinas/, escalas-menores/, escalas-mayores/, otras-escalas/ y
  la-tonalidad/ (esta sin menú) · index.html: solo un bloque nuevo «VÍDEOS DE GRADO ELEMENTAL EN LAS TARJETAS DE REPASO»
  (ivg-*) justo antes de </body>; no toca ivf-*, ni «TARJETA QUE GIRA», ni nada más. Partí de b0c2986.
- 28-sep 09:19 · Fichas y rediseño · HECHO · commit 9ae4de9 · index.html: (1) ficha del alumno, APUNTES: antes una ventana
  «¿Necesitas mirar los apuntes?» y, abiertos, «‹ Volver» bloqueado 1 minuto, sin ✕ (bloque «APUNTES EN LAS FICHAS»;
  solo Protester); (2) VER APUNTES sin la ✕ de la derecha (un <style> al final); (3) tarjeta Compases que gira con ▶:
  un <style> APARTE al final (no toca el bloque ivf-*) que quita el desenfoque y el ▶/«VER APUNTES» de la copia que
  gira, desvanece la cara de delante al girar y hace que la ✕ responda al primer clic con la estética nueva.
- 28-sep 08:46 · Fichas y rediseño · HECHO · commit f67c1b5 · index.html: apuntes nuevos con las respuestas de Iago (?v=2: apuntes.js,
  apuntes-kit.js, apuntes-2gp.js; solo Protester), Cadencias → gp-cadencias (tarjeta y ficha) y la línea «LM piel»
  tras `<meta charset>` (index.html, compases.html, modulacion.html; no hace nada sin la cuenta de prueba). No toca
  las tarjetas, `ivf-*` ni intros/.
- 28-sep 08:20 · Intros didácticas · HECHO · commit a27fb17 · intros/compases-extranos/escenas.js: el rótulo del título
  («GRADO PROFESIONAL · UNIDAD 1») pasa de dorado a rosa (una línea). No toca index.html ni nada más.
- 27-sep 21:57 · Apuntes en fichas · HECHO · commit fbb9132 · index.html: botones «APUNTES» / «VER VÍDEO» / «¿Dudas? Ver
  APUNTES» en la fila de «No lo sé hacer…» de la ficha del alumno (pintaAlu: `class="fp-ayuda"` + 1 línea
  `ApxFicha.pinta`; bloque ApxFicha entre VER APUNTES e `ivf-*`). Misma puerta que VER APUNTES (solo Protester).
  No toca las tarjetas ni el bloque `ivf-*` (reutiliza su intro `intros/compases-extranos/` en un visor propio).
- 27-sep 14:15 · Fichas y rediseño · HECHO · commit 00cf7ad · index.html: FIX guardado de fichas (punto de control completo
  para todos los tipos, ruedas del índice/tonalidades/transporte/enarmonías con la respuesta al volver, «hechos»
  reales). Solo toca funciones de la ficha del alumno; no toca tarjetas ni el bloque `ivf-*`.
- 27-sep 10:20 · Intros didácticas · HECHO · crea este fichero y añade un aviso al
  principio de index.html (solo un comentario, tras `<meta charset>`) · mismo commit
- 27-sep 10:09 · Intros didácticas · HECHO · index.html: bloque `ivf-*` (botón ▶ en la
  tarjeta «Compases») · commit 2a45fe0
- 27-sep 10:07 · Intros didácticas · HECHO · intros/compases-extranos/ (13 ficheros,
  intro de 4:48) · commit cb78844
- «Intros didácticas» sigue ahora con vídeos de Grado Elemental (otro repositorio). En
  teoriapro no tocará nada más sin apuntarlo antes aquí.
