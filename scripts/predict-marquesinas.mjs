import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("❌ Falta la variable de entorno GEMINI_API_KEY");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const today = new Date();
const isoDate = today.toISOString().split("T")[0];

// Calculate ISO week
function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

const currentWeek = getISOWeek(today);

const prompt = `Eres un analista experto del mercado de EA SPORTS FC 27 Ultimate Team y un predictor especializado en el SBC semanal "Marquesinas Semanales" (Marquee Matchups).

Tu objetivo es predecir los 4 partidos que EA seleccionará para las Marquesinas de esta semana, que se publican cada JUEVES a las 19:00 CET.

Hoy es ${isoDate} (semana ${currentWeek}).

INSTRUCCIONES PASO A PASO:

1. **BUSCA las Marquesinas del JUEVES PASADO**: Investiga qué partidos salieron la semana pasada y excluye esos clubes a menos que sea un derbi mundial irrepetible.
2. **BUSCA el CALENDARIO REAL de partidos del próximo fin de semana** (viernes a domingo) en Top 5 Ligas (Premier, LaLiga, Serie A, Bundesliga, Ligue 1) y ligas secundarias.
3. **SELECCIONA 4 PARTIDOS de 4 LIGAS DIFERENTES**:
   - Prioriza derbis locales históricos (Rheinderby, Derbi de Turín/Milán, Clásicos, etc.).
   - Partidos con gran afición y demanda de cartas de oro común y plata.
   - Variedad: 3 ligas top y 1 liga secundaria o gran duelo.
4. **Calcula precios y break-even con la tasa EA (+5.263% en compras de 600-650m)**.

FORMATO DE RESPUESTA (JSON estricto):

{
  "week": "${currentWeek}",
  "generatedAt": "${today.toISOString()}",
  "predictions": [
    {
      "league": "Nombre de la liga",
      "home": "Equipo local",
      "away": "Equipo visitante",
      "certainty": "green|blue|yellow",
      "certainty_label": "🟢 CLÁSICO FIJO | 🔵 MUY PROBABLE | 🟡 ESPECULATIVO",
      "gold_buy": 650,
      "gold_sell": 2200,
      "silver_buy": 400,
      "silver_sell": 1500,
      "breakeven_gold": 685,
      "roi_gold_pct": 238,
      "strategy": "Explicación breve de la estrategia de compra"
    }
  ]
}

Devuelve EXACTAMENTE 4 predicciones, cada una de una liga diferente.`;

async function main() {
  try {
    console.log(`🔮 Generando predicciones de Marquesinas para la semana ${currentWeek}...`);
    console.log(`📅 Fecha: ${isoDate}\n`);

    let text = null;
    const attempts = [
      { model: "gemini-3.8-flash", search: true },
      { model: "gemini-3.8-flash", search: false },
      { model: "gemini-3.8-pro", search: true },
      { model: "gemini-3.8-pro", search: false },
      { model: "gemini-2.5-flash", search: true },
      { model: "gemini-2.0-flash", search: true }
    ];

    for (const att of attempts) {
      try {
        console.log(`🔄 Intentando generar con ${att.model} (Google Search: ${att.search})...`);
        const config = { responseMimeType: "application/json" };
        if (att.search) {
          config.tools = [{ googleSearch: {} }];
        }
        const response = await ai.models.generateContent({
          model: att.model,
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config,
        });
        if (response && response.text) {
          text = response.text;
          console.log(`✅ Predicción obtenida exitosamente usando ${att.model} (Search: ${att.search})`);
          break;
        }
      } catch (err) {
        console.warn(`⚠️ No disponible con ${att.model} (Search: ${att.search}): ${err.message}`);
      }
    }

    const dataDir = path.resolve("./data");
    fs.mkdirSync(dataDir, { recursive: true });
    const targetFile = path.join(dataDir, "marquesinas.json");

    if (!text) {
      console.warn("⚠️ Ningún modelo de IA pudo generar el JSON en este momento.");
      // Check existing file
      if (fs.existsSync(targetFile)) {
        const existing = JSON.parse(fs.readFileSync(targetFile, "utf-8"));
        if (existing.week === currentWeek) {
          console.log(`ℹ️ La predicción existente ya corresponde a la semana actual (${currentWeek}).`);
          process.exit(0);
        }
      }
      console.warn("⚠️ Manteniendo predicciones existentes verificadas para evitar sobreescritura errónea.");
      process.exit(0);
    }

    const data = JSON.parse(text);
    const jsonStr = JSON.stringify(data, null, 2);
    fs.writeFileSync(targetFile, jsonStr, "utf-8");

    console.log(`✅ Predicciones generadas exitosamente`);
    console.log(`📁 Archivo guardado en: data/marquesinas.json`);
    console.log(`\n📊 Resumen de predicciones (${data.week}):`);

    for (const p of data.predictions) {
      console.log(`   ${p.certainty_label} — ${p.league}: ${p.home} vs ${p.away} | Gold: ${p.gold_buy}→${p.gold_sell} | ROI: ${p.roi_gold_pct}%`);
    }
  } catch (error) {
    console.error("❌ Error generando predicciones:", error.message);
    process.exit(0);
  }
}

main();
