const FD_BASE = "https://api.football-data.org/v4";

export default async function handler(req, res) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const token = process.env.FOOTBALL_API_KEY || process.env.VITE_FOOTBALL_API_KEY || "";
    const url = new URL(req.url || "/", "http://localhost");
    let path = (url.searchParams.get("path") || "").replace(/^\/+/, "");
    url.searchParams.delete("path");
    const qs = url.searchParams.toString();
    const apiUrl = `${FD_BASE}/${path}${qs ? `?${qs}` : ""}`;
    const apiRes = await fetch(apiUrl, { headers: { "X-Auth-Token": token } });
    const text = await apiRes.text();
    return res.status(apiRes.status).setHeader("Content-Type", "application/json").send(text);
  } catch (err) {
    return res
      .status(500)
      .setHeader("Content-Type", "application/json")
      .send(JSON.stringify({ error: String((err && err.message) || err) }));
  }
}
