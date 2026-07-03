# World Quant 2.0 Upgrade Notes

## Dixon-Coles API

Endpoint:

```text
/api/v1/match-matrix?lambda_h=1.42&lambda_a=1.08&rho=-0.18&max_goals=5
```

Response shape:

```json
{
  "heatmap_data": [[0, 0, 10.69], [1, 0, 6.73]],
  "top_prediction": "1:1",
  "top_probability": 15.16,
  "inputs": {
    "lambda_h": 1.42,
    "lambda_a": 1.08,
    "rho": -0.18,
    "max_goals": 5
  },
  "model": "dixon-coles"
}
```

The Python reference implementation is in `tools/dixon_coles.py`.

The running Node server exposes the API directly. By default it uses a JavaScript implementation with the same formula so the local server and lightweight deployments stay stable. To force the Python engine:

```powershell
$env:MATRIX_ENGINE="python"
$env:PYTHON="python"
npm start
```

Cloudflare Pages has a matching edge function at:

```text
functions/api/v1/match-matrix.js
```

It uses the same Dixon-Coles formula and does not require Python.

Health check:

```text
/api/v1/health
```

## Frontend Heatmap

The single-match analysis panel calls `/api/v1/match-matrix` with the selected match's current `lambda_h` and `lambda_a`.

ECharts is vendored locally at:

```text
assets/vendor/echarts.min.js
```

This avoids runtime dependency on jsDelivr or other overseas CDNs.

## Future xG Integration

When API-Football, StatsBomb, Opta, or another source is available, update the Python or server-side lambda builder before calling `generate_score_matrix`.

Recommended formula:

```python
lambda_h = weighted_home_attack_xg * opponent_away_defense_factor * lineup_factor * rest_factor * venue_factor
lambda_a = weighted_away_attack_xg * opponent_home_defense_factor * lineup_factor * rest_factor * travel_factor
```

Use a weighted recent window rather than a flat average, for example 45% last 5 matches, 35% season baseline, 20% opponent-strength adjustment. Injuries and confirmed starters should move `lineup_factor`; travel and rest days should move `rest_factor` / `travel_factor`.

## Mainland China Access

Cloudflare Pages, Workers, and free tunnels are not guaranteed to open reliably in mainland China. This cannot be solved by changing frontend code alone.

For stable mainland access, use one of these deployment paths:

- Mainland China server + ICP filing + mainland CDN.
- Hong Kong or Singapore server with China-optimized CDN acceleration.
- Keep all runtime assets local: JS libraries, icons, images, JSON snapshots, and fonts.

## Cloudflare Commands

Cloudflare Pages:

```powershell
npm run deploy:pages
```

API smoke test:

```powershell
npm run smoke:matrix
node tools/smoke_matrix.mjs https://your-domain.example
```

Cloudflare Workers:

```powershell
npx wrangler deploy
```

If deploying this exact Node/Python API, use a Node-capable server instead of pure Cloudflare Pages static hosting. Cloudflare Workers cannot execute this Python script directly; either keep the JavaScript matrix implementation in a Worker or move the Python API to a separate backend.
