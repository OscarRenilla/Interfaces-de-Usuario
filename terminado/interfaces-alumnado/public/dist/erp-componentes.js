/* erp-insignia.js */
/* Autor: Óscar Renilla Rodríguez */
/**
 * <erp-insignia>: etiqueta de estado (EJERCICIO E5: COMPLETADO).
 * Propiedad: estado (defecto "pending"): pending | paid | shipped | cancelled
 * Evento: "cambio" -> detail { estado }
 */
const ESTADOS_INSIGNIA = ['pending', 'paid', 'shipped', 'cancelled']; // estados validos, en el orden del ciclo
const COLORES_INSIGNIA = {                                            // colores de la tabla del enunciado
  pending:   { fondo: '#fff0cc', texto: '#8a5a00' },                  // pendiente: amarillo
  paid:      { fondo: '#d6f5e0', texto: '#17753a' },                  // pagado: verde
  shipped:   { fondo: '#dbe7ff', texto: '#1d4ed8' },                  // enviado: azul
  cancelled: { fondo: '#fbdada', texto: '#a12222' },                  // cancelado: rojo
};

class ErpInsignia extends HTMLElement {            // componente nuevo
  constructor() {                                  // al crearse
    super();                                       // iniciar clase base
    this.attachShadow({ mode: 'open' });           // zona interna aislada
  }
  // TODO 1: lista de atributos vigilados
  static get observedAttributes() { return ['estado']; } // si cambia "estado", se avisa al componente
  attributeChangedCallback() { this.pintar(); }    // al cambiar el atributo, volvemos a dibujar

  // TODO 2: propiedad estado con valor por defecto 'pending'
  get estado() {                                   // leer el estado
    const v = this.getAttribute('estado');         // valor del atributo HTML (o null)
    return ESTADOS_INSIGNIA.includes(v) ? v : 'pending'; // si no esta en la lista, devolvemos 'pending'
  }
  set estado(v) { this.setAttribute('estado', v); } // escribir el estado (dispara attributeChangedCallback)

  connectedCallback() {                            // al entrar en la pagina
    this.pintar();                                 // dibujar
    // TODO 3: un unico listener de clic por componente (evita duplicados al reconectar)
    if (!this._escucha) {                          // solo la primera vez que se conecta
      this.addEventListener('click', () => this.siguiente()); // clic: pasa al siguiente estado
      this.addEventListener('keydown', (e) => {    // teclado: Enter o espacio hacen lo mismo que el clic
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.siguiente(); } // evitamos que el espacio haga scroll
      });
      this.setAttribute('role', 'button');         // los lectores de pantalla lo anuncian como boton
      this.setAttribute('tabindex', '0');          // se puede enfocar con el tabulador
      this._escucha = true;                        // recordamos que ya esta preparado
    }
  }
  siguiente() {                                    // pasa al estado siguiente y avisa
    const i = ESTADOS_INSIGNIA.indexOf(this.estado); // posicion actual en la lista
    const estado = ESTADOS_INSIGNIA[(i + 1) % ESTADOS_INSIGNIA.length]; // siguiente (tras el ultimo vuelve al primero)
    this.estado = estado;                          // guardamos el nuevo estado
    this.dispatchEvent(new CustomEvent('cambio', { // lanzamos nuestro evento propio
      detail: { estado },                          // dato que viaja con el evento
      bubbles: true,                               // sube por los elementos padre
      composed: true,                              // atraviesa el Shadow DOM
    }));
  }
  pintar() {                                       // dibuja el HTML interno
    // TODO 4: <style> + <span> con los colores del estado actual
    const c = COLORES_INSIGNIA[this.estado];       // colores de fondo y texto
    this.setAttribute('aria-label', 'Estado: ' + this.estado + '. Pulsa para cambiar'); // texto para lectores de pantalla
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: inline-block; border-radius: 999px; }
        :host(:focus-visible) { outline: 3px solid #2b5cff; outline-offset: 2px; }
        span { display: inline-block; padding: 4px 12px; border-radius: 999px; cursor: pointer;
               font: 600 .9rem system-ui, sans-serif; background: ${c.fondo}; color: ${c.texto}; }
      </style>
      <span>${this.estado}</span>`;                // el estado sale siempre de la lista validada
  }
}
customElements.define('erp-insignia', ErpInsignia); // registra <erp-insignia>

/* erp-tarjeta.js */
/**
 * <erp-tarjeta>: tarjeta con un titulo y un numero grande.
 * Propiedades: titulo (defecto "Sin titulo"), valor (defecto "0"), color (defecto "#2b5cff")
 * Evento: "seleccionada" (al hacer clic), con detail { titulo, valor }
 * Uso: <erp-tarjeta titulo="Clientes" valor="12"></erp-tarjeta>
 */
class ErpTarjeta extends HTMLElement {            // nuestro componente = una clase que extiende HTMLElement
  static get observedAttributes() {               // lista de atributos que vigilamos
    return ['titulo', 'valor', 'color'];          // si cambian, se avisa al componente
  }
  constructor() {                                 // se ejecuta al crear el componente
    super();                                      // obligatorio: inicia la clase base
    this.attachShadow({ mode: 'open' });          // zona interna aislada (Shadow DOM) para HTML y CSS propios
  }
  get titulo() { return this.getAttribute('titulo') || 'Sin titulo'; } // leer titulo (o valor por defecto)
  set titulo(v) { this.setAttribute('titulo', v); } // escribir titulo
  get valor() { return this.getAttribute('valor') || '0'; } // leer valor (defecto 0)
  set valor(v) { this.setAttribute('valor', v); }   // escribir valor
  get color() { return this.getAttribute('color') || '#2b5cff'; } // leer color (defecto azul)
  set color(v) { this.setAttribute('color', v); }   // escribir color
  connectedCallback() {                           // se ejecuta cuando el componente entra en la pagina
    this.pintar();                                // dibujamos su contenido
    if(!this._escucha) this.addEventListener('click', () => {        // al hacer clic sobre el componente...
      this.dispatchEvent(new CustomEvent('seleccionada', { // ...lanzamos nuestro propio evento
        detail: { titulo: this.titulo, valor: this.valor }, // datos que viajan con el evento
        bubbles: true,                            // el evento sube por los elementos padre
        composed: true,                           // y atraviesa el Shadow DOM
      }));
    });
    this._escucha=true; // No duplica eventos al reconectar.
  }
  attributeChangedCallback() { this.pintar(); }   // si cambia un atributo, volvemos a dibujar
  seguro(s) { return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); } // Texto, nunca HTML ejecutable.
  pintar() {                                      // dibuja el HTML interno
    this.shadowRoot.innerHTML = `
      <style>
        .t { background:#fff; border-left:6px solid ${/^#[0-9a-f]{3,8}$/i.test(this.color)?this.color:'#2b5cff'}; border-radius:10px; padding:14px;
             box-shadow:0 1px 3px rgba(0,0,0,.15); cursor:pointer; font-family:system-ui,sans-serif; }
        small { color:#6b7488; }
        b { display:block; font-size:1.8rem; }
      </style>
      <div class="t"><small>${this.seguro(this.titulo)}</small><b>${this.seguro(this.valor)}</b></div>`;
  }
}
customElements.define('erp-tarjeta', ErpTarjeta); // registramos la etiqueta <erp-tarjeta> en el navegador
