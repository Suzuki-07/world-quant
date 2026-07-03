const payload = {
  ok: true,
  service: "world-quant",
  model: "dixon-coles",
  runtime: "cloudflare-pages-functions"
};

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8"
};

export function onRequestOptions() {
  return new Response(null, { status: 204, headers });
}

export function onRequestGet() {
  return new Response(JSON.stringify(payload), { status: 200, headers });
}
