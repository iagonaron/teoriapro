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
- 6-oct 09:20 · Fichas y rediseño · HECHO · commit 3514f37 (EN CURSO en f695e96, parto de 65b43e9) · index.html. PANEL
  DEL PROFESOR: los botones del final del generador de fichas quedan iguales que en elemental (teoriaathome,
  .pp-actions / .pp-btn): mismo orden y textos —«▶ Previsualizar como alumno», «Generar PDF (alumno + solución)»,
  «Preparar envío a alumnos», la principal la última— y la misma forma (raya encima, 14 px en negrita, relleno 10×16,
  esquinas de 11 px, 10 px de separación); el dorado se queda, liso. Clases nuevas .fp-b / .fp-b.primary (la fila
  .fp-pie) y .fp-cab (cabecera de «Revisar ficha», a donde sube «🧹 Limpiar ficha»). Los id no cambian (fpSimular,
  fpPdf, fpEnviar, fpLimpiar, fpValor). La regla .fp-enviar NO se toca: la siguen usando los botones del alumno
  («Siguiente», «Enviar al profesor»). «Puntuación… vale 2,5 puntos», con coma. Si se cambia la fila del final en un
  generador, cambiarla igual en el otro. Espejo de Dropbox al día; nota: APPs/LMATHOME GP (github
  lmpro)/LEEME-6-oct-2026-generador-botones-del-final-iguales.txt (la misma en la carpeta de GE).
- 3-oct 14:30 · Fichas y rediseño · HECHO · commit 65b43e9 (EN CURSO en d5613e6, parto de c5bef86) · index.html. FICHA
  CORREGIDA EN TARJETAS: la pantalla final de la ficha (al terminarla, en ?revision=…&alu=1 —digital y &papel=1— y en
  la revisión del profesor ?revision=…&s=…) pinta una tarjeta por ejercicio con el % y su icono arriba a la derecha (✓
  verde 100 · triángulo amarillo 50–99 · triángulo rojo <50), la leyenda arriba y, en los suspensos, abajo a la
  derecha: «Hey, soy Iago. Aquí tienes apuntes, vídeo y ejercicios para practicar» (sustituye a «practica esto,
  anda»). Bloque nuevo «FICHA CORREGIDA EN TARJETAS» (<style id=lmf-corr-css> + window.LmfCorr), antes de «FILA DE
  AYUDA DE LA FICHA»; si se borra, la pantalla vuelve sola a las filas de antes. (1) «Apuntes en fichas», OJO: vuestro
  bloque ApxFicha corre ahora también con ?revision=… (antes solo con ?fichaId) y gana ApxFicha.recursos(tipo, cb),
  que da a la ficha corregida lo que ESA cuenta puede abrir (apuntes, Libro y portal con vuestra misma puerta
  soloTester; vídeos, con la suya); desde ahí se abren «libres» (3.er dato de abrirApuntes / abrirApuntesYa /
  abrirLibro / abrirLibroYa / elegirVideo): sin la ventanita ni el minuto. En ?revision=…&alu=1 la cuenta del enlace
  se guarda en apx_cuenta_<tema>, igual que ?cuenta= en una ficha. La fila de ayuda de la ficha del alumno NO cambia
  (mismas pruebas, misma salida). (2) En la revisión de una ficha DIGITAL el % de cada tarjeta es el GUARDADO con la
  entrega (payload.ejercicios[k].pct), no uno recalculado (ya era así aquí). (3) El rótulo «Tu ficha N corregida ·
  nota X» del alumno ya solo sale si dice algo que no esté en «Puntuación» (sin nota, anulados o reclamación). (4)
  Ficha EN PAPEL corregida: negro lo impreso y rojo lo que se escribe; las casillas verdes de los test pasan a rojo
  (LmfCorr.rojo) y la cadencia lleva escrita su respuesta en rojo, como en el PDF de soluciones. (5) El profesor puede
  abrir la ficha en papel de un alumno: ?revision=papel:<alumno>&s=…&papel=1&curso=…&n=…&pct=…&nota=… (lee la ficha
  con suite_ficha_ver; sin funciones nuevas en la base). (6) ?practice=escala_mayor / escala_menor / escala_otras baja
  a la tarjeta de esa familia. (7) SOLUCIÓN (también el PDF de soluciones): en el índice acústico la nota impresa sale
  negra (antes roja; en rojo, solo el índice) y «Construye una serie» de dodecafonismo lleva una serie de ejemplo en
  rojo con el rótulo «(Este es un ejemplo)» (fpPintaDodeA; el ejemplo no se guarda con la ficha). Pendiente: la serie
  armónica resuelta sigue con todas las notas en negro. Para volver atrás: git revert 65b43e9. Espejo de Dropbox igual
  que GitHub (la versión anterior, en APPs/_PARA BORRAR/3-oct-2026-teoria-antes-de-ficha-en-tarjetas/GP-index.html).
- 3-oct 11:45 · Fichas y rediseño · HECHO · commit c5bef86 (EN CURSO en f869850) · index.html (window.PapelFichas): el
  PDF de papel con nombres lleva UNA sola ficha sin nombre (antes dos). Iago: «solo quiero una copia a mayores vacía,
  sin nombre»; si alguien se pasa a papel después de generar la ficha, esa hoja es para él (el Diario móvil lo avisará
  con «+1» en el icono de papel). Para volver a dos: SIN_NOMBRE = 2 en window.PapelFichas, o git revert c5bef86.
  Espejo de Dropbox igual que GitHub.
- 3-oct 11:05 · Fichas y rediseño · HECHO · commit bd04603 (EN CURSO en 5c22d81, parto de 3d7881f) · index.html. (1)
  GENERADOR, ficha en papel (bloque «FICHAS EN PAPEL», window.PapelFichas, fpConstruirPDF y window.__PAPEL_CFG): el
  botón «Guardar el PDF» hace UN PDF con una ficha por cada alumno que va en papel, con su nombre y su grupo escritos,
  sus ejercicios de refuerzo al final (pestaña «REFUERZO ★» arriba a la derecha de la tarjeta) y 2 fichas más sin
  nombre; cada ficha empieza en hoja nueva (pensado para imprimir a doble cara). En la lista de refuerzo, los alumnos
  de papel salen con 📄. El contexto se pide a suite_ficha_profe_contexto_v2 (trae quién va en papel y cuenta también
  las fichas corregidas en papel); si no existiera, usa el de siempre y el PDF sale como antes (un ejemplar). (2)
  ALUMNO: ruta nueva ?revision=<ficha>:<cuenta>&alu=1&papel=1 = su ficha «en formato solución» (respuesta correcta de
  cada ejercicio, la nota y el % que puso Iago en cada uno; solo los ejercicios de refuerzo que traía su hoja); la
  pide a suite_ficha_solucion_papel. El enlace lo manda la app Fichas en papel al poner la nota. La revisión digital
  de siempre (?revision=…&alu=1) no cambia (comprobado: sale idéntica). Base de datos: solo funciones NUEVAS (no se ha
  tocado ninguna de las de antes). Para volver atrás: git revert bd04603. Espejo de Dropbox igual que GitHub (la
  versión anterior, en APPs/_PARA BORRAR/3-oct-2026-teoria-antes-de-papel-con-nombre/GP-index.html).
- 1-oct 09:42 · Fichas y rediseño · HECHO · commit 0e18a87 (EN CURSO antes, parto de d34940e) · index.html (bloque «FICHAS EN
  PAPEL», window.PapelFichas): el PDF de la ficha en papel lleva UN solo ejemplar; el nombre sigue diciendo cuántas copias
  hacer («Ficha N · 2 GP · X copias.pdf»). Iago: «si un alumno se pasa a papel a mitad de semana, en la copistería pido
  una más». Para volver a la ficha repetida X veces: git revert 0e18a87. Espejo de Dropbox igual que GitHub.
- 30-sep 20:30 · Intros didácticas · HECHO · commit 462601c (EN CURSO en a91cbe7) · intros/*/*.mp3 (23 audios) e
  intros/*/*_60.mp4 y *_1440.mp4 (12 vídeos): MÁS MARGEN EN EL AUDIO (Iago: «noto un pelín distorsionada mi voz… algo
  más de margen»). Misma mezcla, 2 dB más baja (−18 LUFS), picos a −3,5 dB, filtro suave por debajo de 60 Hz y MP3 a
  192 kbps; en los MP4 solo cambia la pista de audio (AAC hecho desde la mezcla): el vídeo es idéntico (comprobado paquete a
  paquete). Mismos tiempos; no toca index.html, escenas ni tiempos. Para volver al audio de antes: git revert 462601c.
  Espejo de Dropbox igual que GitHub (lo de antes, en APPs/_PARA BORRAR/30-sep-2026-noche-audio-antes-de-mas-margen).
- 30-sep 09:40 · Intros didácticas · HECHO · commit 517ae10 (EN CURSO en 491e460) · correcciones de Iago («Corregir claude» y las de ayer) y PUBLICACIÓN
  de todos los vídeos para alumnos (Iago: «puedes hacer públicos todos los vídeos»; Nuevas grafías no está en el portal):
  intros/{acordes,inversion-acordes,indice-acustico,serie-armonica,cadencias-pro,modulacion}/escenas.js ·
  intros/modos/ (escenas.js, datos.js, tiempos.js, guion.js, modos.mp3: las tres improvisaciones de «¡escúchalos!»
  montadas con el pipe, enteras, como pedía el AVISO de 4e222e6; se conserva el cambio de 3f8dff8 y el orden de la
  tabla jónico·dórico·frigio·lidio·mixolidio·eólico·locrio) · intros/dodecafonismo/ (escenas.js, dodecafonismo.mp3) ·
  intros/acordes-avanzados/ (escenas.js, datos.js, tiempos.js, guion.js, acordes_avanzados.mp3) · intros/transporte/
  (escenas.js, transporte.mp3) · index.html: solo dentro de los bloques «VÍDEOS DE GRADO ELEMENTAL EN LAS TARJETAS DE
  REPASO» (ivg-*) y «APUNTES EN LAS FICHAS» (VIDEOS/VERIFICADOS): `prueba: true` → `alumnos: true` (nunca invitados),
  «Ir a ejercicios» abre los ejercicios de su vídeo, duraciones de Modos y Acordes avanzados. Parto de 4e222e6.
  Para volver a «solo Tester/Protester»: en esos dos bloques, `alumnos: true` → `prueba: true` (y VERIFICADOS como
  estaba). Espejo de Dropbox igual que GitHub.
- 29-sep 23:40 · Fichas y rediseño · HECHO · solo este fichero · AVISO para «Intros didácticas» · vídeo «Modos» (intros/modos,
  EN PRUEBA): Iago ha aprobado las tres improvisaciones de «¡escúchalos!» (Re dórico 8,8 s · Re lidio 8,8 s · Re frigio
  7,0 s) y quiere que las montéis VOSOTROS con vuestro pipe (tiempos.js y datos.js son vuestros): van en lugar de los
  acordes de SON_DOR/SON_LID/SON_FRI, enteras y desde el mismo t0; lo de después se corre (el vídeo crece unos 11 s).
  WAV, referencias e instrucciones en Dropbox: APPs/LMATHOME GP (github lmpro)/VIDEOS INTRODUCTORIOS GP/
  LEEME-29-sep-2026-musica-modos-escuchalos.txt y _MONTAJE (no se sube)/MODOS/musica-escuchalos/. Grabad el MP4 de
  «Modos» cuando la música esté dentro. Conservad también el otro cambio de esta noche (3f8dff8: las tarjetas sin notas
  ni acordes, solo el modo y sus palabras). «Fichas y rediseño» ya no toca intros/modos.
- 29-sep 22:06 · Fichas y rediseño · HECHO · commit 3f8dff8 (EN CURSO en 200434b) · intros/modos/escenas.js (vídeo «Modos»,
  EN PRUEBA): las tres tarjetas de «¡escúchalos!» ya no llevan la línea de acordes («Re m → Sol», «Re → Mi», «Re m → Mi♭»):
  solo el nombre del modo y sus palabras (tarjeta de 380 de alto, palabras desde y + 180). Para deshacer: el bloque marcado
  «(29-sep-2026, Iago)». PENDIENTE, sin tocar el repo: tres improvisaciones (dórico, lidio, frigio) para sustituir los
  acordes de SON_DOR/SON_LID/SON_FRI, en revisión por Iago; si las aprueba, habrá que rehacer modos.mp3, tiempos.js y
  datos.js: se apuntará aquí antes de tocarlos.
- 29-sep 20:51 · Intros didácticas · HECHO · commit 36b0ac8 (EN CURSO en 8cbe86c) · tanda 1440-A (copias GE):
  intros/intervalos, intervalos-compuestos, inversion-intervalos, inversion-compuestos, escalas-menores y otras-escalas pasan
  a MP4 1440p60 con audio 256k (<slug>_1440.mp4 + window.VIDEO_MP4 en su index.html). Para volver al modo de siempre en un
  vídeo: borrar esa línea de su index.html (o abrirlo con ?svg).
- 29-sep 20:48 · Intros didácticas · EN CURSO · vídeos en MP4 1440p a 60 fps (audio 256k), tanda 1440-A (copias GE):
  intros/intervalos, intervalos-compuestos, inversion-intervalos, inversion-compuestos, escalas-menores y otras-escalas: cada
  una, su <slug>_1440.mp4 + una línea en su index.html (window.VIDEO_MP4). Nada más. Parto de aaf6a70.
- 29-sep 20:22 · Intros didácticas · HECHO · commit 3d3459c (EN CURSO en 6fb16a5) · vídeos GP nuevos EN PRUEBA (solo
  Tester/Protester): intros/acordes-avanzados/ (4:34), intros/cadencias-pro/ (4:07), intros/modulacion/ (5:28) e
  intros/transporte/ (7:28), con ▶ en sus tarjetas; index.html: bloque ivg (INTROS + EJERCICIOS: acordespro_id, cadencias,
  modulacion, transporte_escrito → pestaña «Escrito»), VIDEOS/TEMA_VIDEO de «APUNTES EN LAS FICHAS» y el título del ▶.
  No toca lo de escalas con bemoles (7f5c46e). Para quitarlos: sus líneas en INTROS/EJERCICIOS/VIDEOS/TEMA_VIDEO.
- 29-sep 20:18 · Intros didácticas · EN CURSO · vídeos GP nuevos EN PRUEBA (solo Tester/Protester): intros/acordes-avanzados/,
  intros/cadencias-pro/, intros/modulacion/ e intros/transporte/ (▶ en las tarjetas «Acordes avanzado», «Cadencias»,
  «Modulación» y «Transporte») + index.html: bloque ivg (INTROS y EJERCICIOS), VIDEOS/TEMA_VIDEO de «APUNTES EN LAS FICHAS»
  y el título del ▶ («Vídeos de …» en vez de «Vídeos de repaso (Grado Elemental)»). Parto de 7f5c46e (escalas con bemoles:
  no lo toco).
- 29-sep 17:47 · Fichas y rediseño · HECHO · commit 8719679 · index.html · ESCALAS MAYORES con bemoles: las tónicas eran solo teclas
  blancas (de las mayores, solo Fa lleva bemoles). Para las mayores se añaden Si♭, Mi♭, La♭ y Re♭ (escItem7, que usan
  la práctica y las fichas); sin dobles alteraciones. Menores y otras, igual.
- 29-sep 16:49 · Intros didácticas · HECHO · commits c3efba3 y f1d3a66 (EN CURSO en 0a4e631) · (1) vídeo GP nuevo EN
  PRUEBA: intros/dodecafonismo/ (▶ en la tarjeta «Dodecafonismo», solo Protester) + index.html (bloque ivg y VIDEOS/
  TEMA_VIDEO); (2) MP4 de las copias GE: indica-la-armadura y tonalidades-vecinas (60 fps) y escalas-mayores (1440p60,
  audio 256k); (3) intros/*/motor.js (las 18 + dodecafonismo): cursor escondido mientras suena; (4) index.html, bloques
  ivg e ivf: pulsar fuera del vídeo ya no lo cierra y el cursor se esconde a los 2,5 s. Para deshacer: motor.js e
  index.html del commit 0c2bc07.
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
