# ⚡ FC 27 TRADING DESK PRO
### Terminal de Economía, Alertas Diarias y Operaciones de Mercado para 2 Operadores

Bienvenido a tu terminal interactiva de trading para **EA SPORTS FC 27**, diseñada específicamente para ti y tu compañero de club. Esta plataforma digitaliza y automatiza al 100% las estrategias del **Manual Integral de Economía y Operaciones de Mercado**.

---

## 🚀 Cómo Usar la Web

No necesitas instalar servidores ni librerías complejas.
1. Abre la carpeta `FC27 TG` en tu escritorio.
2. Haz **doble clic en `index.html`** (se abrirá en tu navegador favorito: Chrome, Edge, Safari, Firefox).
3. ¡Listo! Todo funciona directamente en local.

---

## 🌟 Funcionalidades Principales

### 1. 🔥 Radar en Vivo: ¿Qué hacemos hoy y ahora?
- **Detección Automática:** Detecta en tiempo real el día de la semana y la hora peninsular española (**CET**).
- **Fase de Mercado en Curso:** Te dice si estás en *Sell-off Post-Champions*, *Absorción Residual*, *Expansión Rivals* o *Choque Promocional*.
- **Semáforo y 3 Pilares:**
  - 🟢 **¿Qué comprar hoy?**
  - 🔵 **¿Qué vender hoy?**
  - 🔴 **¿Qué evitar / Regla de oro de riesgo?**
- **Cuenta atrás en vivo:** Tiempo restante para el próximo hito crítico de EA (19:00 CET contenido diario / 09:00 CET Rivals / Squad Battles).
- **Botón "📲 Copiar Aviso para WhatsApp / Telegram":** Con un solo clic genera un mensaje formateado con emojis y viñetas para que se lo envíes a tu amigo al chat.
- **Simulador de Días:** Botones para ver qué hacer cualquier otro día de la semana para planificar compras por adelantado.

---

### 2. 🎯 Catálogo de Jugadores & Compras Relevantes
- **Ejemplos Reales:** Cartas Meta (Mbappé, Vinícius, Saliba, Valverde, Theo), Medias Fodder (83 a 88+ Prístinos), TOTWs inelásticos a descarte y filtros de Marquesinas / BPM.
- **Semáforo en Vivo:** Cada carta te indica si hoy toca:
  - 🟢 **COMPRAR HOY** (activo en su suelo semanal).
  - 🟡 **VIGILAR / PREPARAR** (cerca del precio de soporte).
  - 🔴 **ESPERAR (TECHO)** (demasiado caro o en riesgo).
  - 🟣 **VENDER HOY** (momento óptimo de salida escalonada).
- **Enlaces Directos 1-Clic a FUTBIN y FUTGG:** Botones directos en cada carta para cotejar su gráfica en vivo en las webs de mercado oficiales.
- **Edición Rápida de Precios:** Si ves que un jugador ha subido o bajado en Futbin, haz clic en el icono ✏️ al lado del precio para actualizarlo y la web recalcula al momento el Break-Even, Tax y ROI.
- **Botón "➕ Añadir a Cartera":** Te abre el modal con todos los datos precargados para registrar la compra.

---

### 3. 🏷️ Sistema Estricto de Certeza en 4 Niveles
Para no confundir nunca una norma oficial del juego con una simple hipótesis de mercado:

| Nivel | Etiqueta | Significado | Ejemplos en FC 27 |
| :---: | :--- | :--- | :--- |
| **1** | 🟢 **CONFIRMADO EA** | Reglas y horarios oficiales de Electronic Arts. | Comisión EA Tax (5%), fórmula Break-Even ($P_v = P_c / 0.95$), recompensas Rivals (jueves 09:00 CET), límite de 100 cartas en SBC Storage, salida de TOTW (miércoles 19:00 CET). |
| **2** | 🔵 **PATRÓN HISTÓRICO** | Tendencias recurrentes y probadas. | Sell-off masivo de Champions (domingo/lunes), rebote de precios tras cobro de Rivals, congelación de oferta de TOTW saliente. |
| **3** | 🟡 **HIPÓTESIS A VIGILAR** | Dependiente del contenido de SBCs. | Martes como suelo técnico, absorción de medias 83-88 según Iconos, descorrelación de Holográficos Prístinos (&ge;88 OVR). |
| **4** | 🔴 **SEÑAL NO CONFIRMADA** | Sugerencias operativas concretas. | "Comprar Saliba por debajo de 128k", "Entrar en 84s a 1.300 monedas en subasta". |

---

### 4. 💼 Cartera Compartida de Inversiones (Tú y tu Amigo)
- **Asignador de Presupuesto (Regla 25 / 35 / 25 / 15):**
  - Introduces vuestras monedas totales y te calcula automáticamente los topes recomendados:
    - 25% en Cartas Meta.
    - 35% en Medias Fodder SBC.
    - 25% en TOTW Inelásticos a descarte.
    - 15% en Liquidez Fluida de seguridad.
- **Gestión de Posiciones:**
  - Registra: Quién compró (Yo, Amigo, 50/50), precio de compra, cantidad y objetivo de venta.
  - Métricas automáticas: Monedas invertidas, Break-Even, valor bruto, retención de EA (5%) y ganancia neta estimada.
  - Botón de **"✅ Vendido"** para auditar beneficios reales conseguidos.
  - **Sincronización:** Guarda todo en `localStorage` y te permite exportar/importar un archivo JSON con 1 clic para compartir la cartera con tu amigo.

---

### 5. 🧮 Calculadora Oficial de Retención EA Tax y Break-Even
- Basada estrictamente en la fórmula del manual:
  $$P_v \times (1 - 0{,}05) \ge P_c \implies P_v = \frac{P_c}{0{,}95} \approx P_c \times 1{,}05263$$
- Si una operación proyecta un ROI neto menor al 10%, la calculadora emite una alerta preventiva (**⚠️ Margen Estrecho**) según el protocolo de gestión patrimonial del manual.

---

### 6. 📈 Gráficos Interactivos (Chart.js)
- **Onda Sinusoidal Semanal:** Comportamiento de cartas Meta vs. Medias SBC a lo largo de los 7 días.
- **Soportes vs. Techos Fodder:** Ratios para 83, 84, 85, 86, 87 y 88+ Prístinos.
- **Radar Multivariable:** Comparativa de oportunidades Martes (Zona de Compra) vs. Jueves (Zona de Venta).
- **Distribución de Capital:** Gráfico doughnut de asignación de activos.

---

### 7. 🤖 Predictor de Marquesinas con IA (Gemini 2.5 Flash + Google Search)
- **Automatizado con GitHub Actions:** Se ejecuta cada martes a las 02:30 CET (justo cuando empieza la ventana de pujas masivas).
- **Investigación en Vivo:** Gemini busca en internet el calendario real del fin de semana y las Marquesinas de la semana pasada, seleccionando 4 partidos de 4 ligas distintas.
- **Salida Directa:** Genera `public/data/marquesinas.json` con precios recomendados de compra (oros a 600-700m, platas a 250-500m) y venta para el jueves a las 19:15 CET.
- **Botón `📋 Copiar para WhatsApp`:** Formatea las 4 predicciones con sus precios y estrategias para enviárselo a tu amigo.

### 8. ⚡ Sincronización de Precios en Vivo (Vercel Serverless Function)
- **Endpoint `/api/prices`:** Consulta en segundo plano los precios de FUT.GG con cabeceras de navegador.
- **Caché en el Edge (5 min):** No satura servidores ni agota límites; la web consulta `/api/prices` cada 5 minutos y actualiza los precios y Break-Evens en directo.
- **Respaldo inteligente:** Si el endpoint no estuviera disponible, la web continúa funcionando con los datos locales sin romperse.

---

## 🔑 Configuración del Predictor Automático (1 minuto)

Para que el robot semanal de GitHub Actions pueda consultar a Gemini:

1. Entra en [**aistudio.google.com**](https://aistudio.google.com/) y pulsa en **"Get API key"** (es 100% gratuita).
2. Ve a tu repositorio en GitHub: [**github.com/varokaballa/fc27-trading-desk**](https://github.com/varokaballa/fc27-trading-desk).
3. Entra en **Settings** > **Secrets and variables** > **Actions**.
4. Haz clic en **New repository secret**:
   - **Name:** `GEMINI_API_KEY`
   - **Secret:** *(Pega tu clave de API)*
5. Pulsa en **Add secret**. ¡Listo! A partir de ese momento, todos los martes se actualizará solo, o puedes ir a la pestaña **Actions** en GitHub y ejecutarlo manualmente cuando quieras dándole a **Run workflow**.

---

### 9. 🐍 Script Complementario en Python (`sync_prices.py`)
Si deseas ver una tabla rápida de resumen en la consola o actualizar `prices.json` mediante scripts:
```bash
python sync_prices.py
```
