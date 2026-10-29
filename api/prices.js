// Vercel Serverless Function – FC 27 live prices via FUT.GG
// Cache-Control: 5-min edge cache with 60s stale-while-revalidate

const PLAYERS = [
  { eaId: 231747, name: "K. Mbappé", rating: 91, position: "ST", category: "meta", benchmark: 3280000 },
  { eaId: 252371, name: "Vinícius Jr.", rating: 90, position: "LW", category: "meta", benchmark: 890000 },
  { eaId: 252371, name: "Jude Bellingham", rating: 90, position: "CAM", category: "meta", benchmark: 480000 },
  { eaId: 203376, name: "Virgil van Dijk", rating: 89, position: "CB", category: "meta", benchmark: 320000 },
  { eaId: 253293, name: "F. Valverde", rating: 88, position: "CM", category: "meta", benchmark: 290000 },
  { eaId: 239085, name: "Erling Haaland", rating: 91, position: "ST", category: "meta", benchmark: 180000 },
  { eaId: 271295, name: "Lamine Yamal", rating: 86, position: "RW", category: "meta", benchmark: 165000 },
  { eaId: 241928, name: "W. Saliba", rating: 87, position: "CB", category: "meta", benchmark: 145000 },
  { eaId: 239682, name: "Theo Hernández", rating: 87, position: "LB", category: "meta", benchmark: 120000 },
  { eaId: 243715, name: "Cole Palmer", rating: 85, position: "CAM", category: "meta", benchmark: 85000 },
  { eaId: 257534, name: "Nico Williams", rating: 85, position: "LM", category: "meta", benchmark: 55000 },
  { eaId: 231866, name: "Rodri", rating: 91, position: "CDM", category: "meta", benchmark: 42000 },
];

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

async function fetchPlayerPrice(eaId) {
  try {
    const url = `https://www.fut.gg/api/fut/player-prices/27/${eaId}/`;
    const resp = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
    });

    if (!resp.ok) return 0;

    const json = await resp.json();

    if (json && typeof json === "object") {
      if (typeof json.price === "number" && json.price > 0) return json.price;

      const data = json.data ?? json;
      if (typeof data.price === "number" && data.price > 0) return data.price;

      for (const key of Object.keys(data)) {
        const entry = data[key];
        if (entry && typeof entry === "object") {
          const p = entry.LCPrice ?? entry.lcPrice ?? entry.price ?? entry.Price;
          if (typeof p === "number" && p > 0) return p;

          if (Array.isArray(entry.prices) && entry.prices.length) {
            const latest = entry.prices[entry.prices.length - 1];
            const lp = latest?.LCPrice ?? latest?.lcPrice ?? latest?.price;
            if (typeof lp === "number" && lp > 0) return lp;
          }
        }
      }
    }

    return 0;
  } catch {
    return 0;
  }
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const results = await Promise.all(
    PLAYERS.map(async (player) => {
      const scrapedPrice = await fetchPlayerPrice(player.eaId);
      const price = scrapedPrice > 0 ? scrapedPrice : player.benchmark;
      const breakEven = Math.ceil(price / 0.95);
      const target10ROI = Math.ceil((price * 1.1) / 0.95);

      return {
        eaId: player.eaId,
        name: player.name,
        rating: player.rating,
        position: player.position,
        category: player.category,
        price,
        breakEven,
        target10ROI,
        liveScraped: scrapedPrice > 0,
      };
    })
  );

  res.status(200).json({
    status: "ok",
    updatedAt: new Date().toISOString(),
    data: results,
  });
}
