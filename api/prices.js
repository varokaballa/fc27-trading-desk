// Vercel Serverless Function – FC 27 live prices via FUT.GG
// Cache-Control: 5-min edge cache with 60s stale-while-revalidate

const PLAYERS = [
  { eaId: 231747, name: "K. Mbappé", rating: 91, position: "ST", category: "meta" },
  { eaId: 252371, name: "Vinícius Jr.", rating: 90, position: "LW", category: "meta" },
  { eaId: 241928, name: "W. Saliba", rating: 87, position: "CB", category: "meta" },
  { eaId: 253293, name: "F. Valverde", rating: 88, position: "CM", category: "meta" },
  { eaId: 239682, name: "Theo Hernández", rating: 87, position: "LB", category: "meta" },
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

    // FUT.GG typically nests the price under a platform key (e.g. "ps", "xbox", or a
    // combined console key). Walk the response to find the first numeric price value.
    if (json && typeof json === "object") {
      // Try common shapes: json.price, json.data.price, or first platform object
      if (typeof json.price === "number") return json.price;

      const data = json.data ?? json;
      if (typeof data.price === "number") return data.price;

      // Iterate platform keys and grab the first LCPrice / price we find
      for (const key of Object.keys(data)) {
        const entry = data[key];
        if (entry && typeof entry === "object") {
          const p = entry.LCPrice ?? entry.lcPrice ?? entry.price ?? entry.Price;
          if (typeof p === "number" && p > 0) return p;

          // One more level deep (some responses nest prices inside an array)
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

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const results = await Promise.all(
    PLAYERS.map(async (player) => {
      const price = await fetchPlayerPrice(player.eaId);
      const breakEven = price > 0 ? Math.ceil(price / 0.95) : 0;
      const target10ROI = price > 0 ? Math.ceil((price * 1.1) / 0.95) : 0;

      return {
        eaId: player.eaId,
        name: player.name,
        rating: player.rating,
        position: player.position,
        category: player.category,
        price,
        breakEven,
        target10ROI,
      };
    })
  );

  res.status(200).json({
    status: "ok",
    updatedAt: new Date().toISOString(),
    data: results,
  });
};
