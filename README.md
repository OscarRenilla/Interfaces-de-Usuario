# Interfaces-de-Usuario

- **original-plantilla**: Proyecto inicial original, base plantilla 
    - Accesibilidad en interfaces.docx.pdf -> Instrucciones del proyecto 
    - https://interfaces-de-usuario.netlify.app 
- **resulto**: Proyecto resulto 
    - https://interfaces-de-usuario-resuelto.netlify.app
    ## Resolución de los ejercicios evaluables (E1–E7)

Autor: Óscar Renilla Rodríguez

Solo se ha modificado la carpeta `public/`. No se ha tocado `pages/`, `data/`,
`next.config.js` ni `package.json`. Todo el código está comentado línea a línea.

| Ejercicio | Qué hace | Archivo |
|---|---|---|
| E1 Dictar un cliente | Rellena nombre, ciudad y email por voz (convierte "arroba" y "punto" en `@` y `.`). Con "guardar" valida los datos y hace `POST /api/customers`. Si falla la red, no se pierde lo escrito. | `evaluables/e1-voz-formulario.html` |
| E2 Filtrar productos | Carga `/api/products` y pinta una tabla. Voz: "stock bajo", "todos" y "buscar …". Muestra "Sin coincidencias" si no hay resultados. | `evaluables/e2-voz-productos.html` |
| E3 Movimiento del brazo | Compara fotogramas de la cámara (umbral 600, bloqueo de 1 s) y cambia de producto en `<erp-tarjeta>`. Al retroceder desde el primero salta al último. | `evaluables/e3-movimiento-productos.html` |
| E4 Estado con la mano | El índice mueve un puntero (con efecto espejo) y la pinza hace clic una sola vez por gesto. Cada botón envía `PUT /api/orders?id=1`. | `evaluables/e4-mano-pedidos.html` |
| E5 Componente `<erp-insignia>` | Etiqueta con color por estado (`pending`, `paid`, `shipped`, `cancelled`). Atributo `estado`, evento `cambio` y un único listener de clic aunque se reconecte. | `componentes/erp-insignia.js`, `evaluables/e5-componente-insignia.html` |
| E6 Pruebas y paquete | 7 pruebas unitarias (las 4 pedidas más ciclo completo, cambio visual y reconexión). Documentación del componente y paquete generado con `npm run empaquetar`. | `evaluables/e6-pruebas-paquete.html`, `componentes/README.md`, `dist/erp-componentes.js` |
| E7 Proyecto integrado | Lista de pedidos con `<erp-insignia>`, filtro por voz ("pagados" / "todos") y tarjeta de realidad aumentada sobre la mano. La pinza pasa al siguiente pedido. | `evaluables/e7-proyecto-integrado.html` |

### Decisiones y extras
- **Seguridad:** los textos que vienen del servidor se escapan (`Ayudas.escapar` / `textContent`) y el estado de la insignia se valida contra la lista antes de usarlo.
- **Errores:** los permisos denegados, la falta de Internet y los fallos de red o HTTP se muestran en pantalla (`#msg`), sin romper la página.
- **Accesibilidad:** `<erp-insignia>` se puede usar con teclado (Tab, Enter y espacio), tiene `role="button"` y `aria-label` con el estado.
- **Sin duplicados:** la pinza solo cuenta al cerrarse (`pinzaAntes`) y se reinicia si desaparece la mano. Las insignias no duplican eventos al reconectarse.
- **Página del paquete:** `componentes/prueba-paquete.html` carga únicamente `dist/erp-componentes.js` y comprueba que están las dos etiquetas.

### Cómo probarlo
1. `start.bat` (Windows) o `./start.sh` (Linux/Mac) y abrir `http://localhost:3000` en Chrome o Edge.
2. E3, E4 y E7 necesitan cámara e Internet (descargan MediaPipe). E1, E2 y E7 necesitan micrófono.
3. Tras cada cambio, guardar y pulsar F5.
4. `npm test` pasa las pruebas del proyecto (68 correctas).