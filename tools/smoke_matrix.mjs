const baseUrl = process.argv[2] || "http://127.0.0.1:4173";
const url = new URL("/api/v1/match-matrix", baseUrl);
url.searchParams.set("lambda_h", "1.42");
url.searchParams.set("lambda_a", "1.08");
url.searchParams.set("rho", "-0.18");
url.searchParams.set("max_goals", "5");

const response = await fetch(url);
if (!response.ok) {
  throw new Error(`Matrix API returned HTTP ${response.status}`);
}

const payload = await response.json();
if (!Array.isArray(payload.heatmap_data) || payload.heatmap_data.length !== 25) {
  throw new Error("Matrix API heatmap_data must contain 25 cells for max_goals=5");
}

if (typeof payload.top_prediction !== "string" || typeof payload.top_probability !== "number") {
  throw new Error("Matrix API top prediction fields are missing or invalid");
}

console.log(JSON.stringify({
  ok: true,
  url: url.toString(),
  top_prediction: payload.top_prediction,
  top_probability: payload.top_probability,
  cells: payload.heatmap_data.length,
  engine: payload.engine || payload.model
}, null, 2));
