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

1. **BUSCA las Marquesinas del JUEVES PASADO**: Investiga cuáles fueron los 4 partidos de las Marquesinas de la semana pasada. Los 8 clubes que aparecieron la semana pasada NO pueden repetir esta semana (a menos que tengan un derbi/clásico de nivel "Bombazo" o "Clásico Mundial" como El Clásico, Old Firm, Superclásico, etc.).

2. **BUSCA el CALENDARIO REAL de partidos del próximo fin de semana** (viernes a domingo) en:
   - Top 5 Ligas Europeas: LaLiga, Premier League, Serie A, Bundesliga, Ligue 1
   - Ligas secundarias: Liga MX, MLS, Eredivisie, Liga Portugal, Scottish Premiership, Superliga Argentina, Brasileirão, Süper Lig, Belgian Pro League, Allsvenskan, etc.
   
3. **SELECCIONA 4 PARTIDOS de 4 LIGAS DIFERENTES** que maximicen el beneficio de trading para cartas de oro (golds) y plata (silvers). Prioriza:
   - Derbis locales y clásicos históricos (máxima demanda)
   - Rivalidades regionales intensas
   - Partidos con aficiones grandes y activas en FUT
   - Variedad geográfica (EA suele mezclar ligas grandes con alguna liga menor)
   - Patrones históricos de EA (suelen incluir 2 ligas top + 1-2 ligas secundarias)

4. **Para cada partido incluye**:
   - Liga
   - Equipo local y visitante
   - Nivel de certeza:
     * "green" → 🟢 CLÁSICO FIJO: derbi/clásico de nivel mundial, prácticamente seguro
     * "blue" → 🔵 MUY PROBABLE: patrón rotacional fuerte, rivalidad conocida
     * "yellow" → 🟡 ESPECULATIVO: encaja en el patrón pero no es seguro
   - Precio objetivo de compra para golds: entre 600-700 monedas (puja masiva en madrugada)
   - Precio objetivo de venta para golds a las 19:15 CET del jueves: entre 1200-2500 monedas
   - Precio objetivo de compra para silvers: entre 250-500 monedas
   - Precio objetivo de venta para silvers a las 19:15 CET: entre 800-1800 monedas
   - Breakeven de golds (precio de compra × 1.05 por el 5% de impuesto EA)
   - ROI estimado en porcentaje para golds
   - Nota de estrategia breve explicando por qué este partido y cuándo comprar

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
      "breakeven_gold": 683,
      "roi_gold_pct": 238,
      "strategy": "Explicación breve de la estrategia de compra"
    }
  ]
}

Devuelve EXACTAMENTE 4 predicciones, cada una de una liga diferente. Sé preciso con los equipos reales y los partidos reales del calendario.`;

async function main() {
  try {
    console.log(`🔮 Generando predicciones de Marquesinas para la semana ${currentWeek}...`);
    console.log(`📅 Fecha: ${isoDate}\n`);

    let text = null;
    const attempts = [
      { model: "gemini-2.0-flash", search: true },
      { model: "gemini-2.0-flash", search: false },
      { model: "gemini-1.5-flash", search: false },
      { model: "gemini-3.8-flash", search: false }
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
          console.log(`✅ Respuesta obtenida con ${att.model}`);
          break;
        }
      } catch (err) {
        console.warn(`⚠️ No disponible con ${att.model}: ${err.message}`);
      }
    }

    if (!text) {
      console.warn("⚠️ Ningún modelo respondió a tiempo. Manteniendo datos de Marquesinas existentes.");
      process.exit(0);
    }

    const data = JSON.parse(text);

    // Ensure output directory exists and write to data/
    const dataDir = path.resolve("./data");
    fs.mkdirSync(dataDir, { recursive: true });

    const jsonStr = JSON.stringify(data, null, 2);
    fs.writeFileSync(path.join(dataDir, "marquesinas.json"), jsonStr, "utf-8");

    console.log(`✅ Predicciones generadas exitosamente`);
    console.log(`📁 Archivo guardado en: data/marquesinas.json`);
    console.log(`\n📊 Resumen de predicciones:`);

    for (const p of data.predictions) {
      console.log(`   ${p.certainty_label} — ${p.league}: ${p.home} vs ${p.away} | Gold: ${p.gold_buy}→${p.gold_sell} | ROI: ${p.roi_gold_pct}%`);
    }
  } catch (error) {
    console.error("❌ Error generando predicciones:", error.message);
    console.warn("⚠️ Manteniendo predicciones existentes para evitar interrumpir la web.");
    process.exit(0);
  }
}

main();
