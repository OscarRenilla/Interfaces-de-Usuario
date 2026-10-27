<!-- Autor: Óscar Renilla Rodríguez -->
# Componentes
## erp-tarjeta
| Propiedad | Defecto | Descripcion |
|---|---|---|
| titulo | Sin titulo | Texto pequeno |
| valor | 0 | Numero grande |
| color | #2b5cff | Color del borde |

Evento `seleccionada` (detail: titulo, valor).
Despues de `npm run empaquetar`: `<script src="/dist/erp-componentes.js"></script>`.

## erp-insignia
Etiqueta de estado con color. Se puede cambiar con el ratón o con el teclado (Enter o espacio) y avisa con un evento.

| Propiedad | Defecto | Descripción |
|---|---|---|
| estado | pending | Estado que se muestra: `pending`, `paid`, `shipped` o `cancelled`. Cualquier otro valor se trata como `pending`. Se puede poner como atributo HTML o como propiedad de JavaScript (`insignia.estado = 'paid'`). |

Colores: `pending` fondo `#fff0cc` y texto `#8a5a00`; `paid` fondo `#d6f5e0` y texto `#17753a`; `shipped` fondo `#dbe7ff` y texto `#1d4ed8`; `cancelled` fondo `#fbdada` y texto `#a12222`.

### Evento `cambio`
Se lanza cada vez que el usuario hace clic (o pulsa Enter o espacio) y la insignia pasa al estado siguiente. El ciclo es `pending` → `paid` → `shipped` → `cancelled` → `pending`.

| Dato | Descripción |
|---|---|
| `detail.estado` | El estado NUEVO (por ejemplo `'paid'`). |

El evento tiene `bubbles: true` y `composed: true`, así que se puede escuchar en el propio elemento o en `document`.

### Ejemplo de uso
```html
<erp-insignia></erp-insignia>                 <!-- muestra pending -->
<erp-insignia estado="paid"></erp-insignia>   <!-- muestra paid -->

<script type="module">
  await import('/componentes/erp-insignia.js');           // registra la etiqueta
  document.addEventListener('cambio', (e) => {            // escucha el evento
    console.log('Nuevo estado:', e.detail.estado);
  });
</script>
```
Con el paquete: ejecuta `npm run empaquetar` y carga solo `<script src="/dist/erp-componentes.js"></script>` (no cargues a la vez el paquete y los ficheros originales).

### Pruebas (en `/evaluables/e6-pruebas-paquete.html`)
1. El estado por defecto es `pending`.
2. Lee el estado del atributo (`estado="paid"` da `paid`).
3. Un estado inválido (`xyz`) devuelve `pending`.
4. Al hacer clic se lanza `cambio` y pasa a `paid`.
5. El ciclo completo vuelve a `pending`.
6. El cambio se ve en el dibujo (texto y color).
7. Reconectar el componente no duplica los eventos.
