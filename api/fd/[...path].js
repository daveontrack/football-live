const FD_BASE = "https://api.football-data.org/v4";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const token = process.env.FOOTBALL_API_KEY;
  if (!token) {
    return res.status(500).json({ error: "FOOTBALL_API_KEY not configured on Vercel" });
  }

  const path = (req.query.path || []).join("/");
  const urlObj = new URL(req.url, "http://localhost");
  const qs = urlObj.search;
  const url = `${FD_BASE}/${path}${qs}`;

  try {
    const apiRes = await fetch(url, {
      headers: { "X-Auth-Token": token },
    });
    const data = await apiRes.json();
    return res.status(apiRes.status).json(data);
  } catch (err) {
    return res.status(502).json({ error: "Failed to fetch from football-data.org" });
  }
}
