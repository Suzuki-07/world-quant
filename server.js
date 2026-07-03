const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const root = __dirname;
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "0.0.0.0";
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json"
};

function jsonResponse(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-cache",
    "Access-Control-Allow-Origin": "*"
  });
  response.end(JSON.stringify(payload));
}

function clampNumber(value, min, max, fallback) {
  if (value === null || value === undefined || value === "") return fallback;
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function factorial(number) {
  let result = 1;
  for (let index = 2; index <= number; index += 1) result *= index;
  return result;
}

function poissonProbability(lambda, goals) {
  return (Math.pow(lambda, goals) * Math.exp(-lambda)) / factorial(goals);
}

function dixonColesCorrection(homeGoals, awayGoals, lambdaH, lambdaA, rho) {
  if (homeGoals === 0 && awayGoals === 0) return 1 - lambdaH * lambdaA * rho;
  if (homeGoals === 0 && awayGoals === 1) return 1 + lambdaH * rho;
  if (homeGoals === 1 && awayGoals === 0) return 1 + lambdaA * rho;
  if (homeGoals === 1 && awayGoals === 1) return 1 - rho;
  return 1;
}

function generateScoreMatrix(lambdaH, lambdaA, rho = -0.1, maxGoals = 5) {
  const matrix = [];
  let total = 0;

  for (let homeGoals = 0; homeGoals < maxGoals; homeGoals += 1) {
    const row = [];
    for (let awayGoals = 0; awayGoals < maxGoals; awayGoals += 1) {
      const baseProbability = poissonProbability(lambdaH, homeGoals) * poissonProbability(lambdaA, awayGoals);
      const correction = dixonColesCorrection(homeGoals, awayGoals, lambdaH, lambdaA, rho);
      const probability = Math.max(0, baseProbability * correction);
      row.push(probability);
      total += probability;
    }
    matrix.push(row);
  }

  const heatmapData = [];
  let topPrediction = "0:0";
  let topProbability = -1;

  matrix.forEach((row, homeGoals) => {
    row.forEach((probability, awayGoals) => {
      const normalized = total > 0 ? probability / total : 0;
      heatmapData.push([awayGoals, homeGoals, Math.round(normalized * 10000) / 100]);
      if (normalized > topProbability) {
        topProbability = normalized;
        topPrediction = `${homeGoals}:${awayGoals}`;
      }
    });
  });

  return {
    heatmap_data: heatmapData,
    top_prediction: topPrediction,
    top_probability: Math.round(topProbability * 10000) / 100,
    inputs: {
      lambda_h: lambdaH,
      lambda_a: lambdaA,
      rho,
      max_goals: maxGoals
    },
    model: "dixon-coles"
  };
}

function runPythonMatrix(lambdaH, lambdaA, rho, maxGoals) {
  return new Promise((resolve, reject) => {
    const pythonCommand = process.env.PYTHON || "python";
    const scriptPath = path.join(root, "tools", "dixon_coles.py");
    const child = spawn(pythonCommand, [
      scriptPath,
      "--lambda-h", String(lambdaH),
      "--lambda-a", String(lambdaA),
      "--rho", String(rho),
      "--max-goals", String(maxGoals)
    ], { windowsHide: true });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr || `Python exited with ${code}`));
        return;
      }
      try {
        resolve(JSON.parse(stdout));
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function handleMatchMatrix(requestUrl, response) {
  const lambdaH = clampNumber(requestUrl.searchParams.get("lambda_h"), 0.05, 6, 1.35);
  const lambdaA = clampNumber(requestUrl.searchParams.get("lambda_a"), 0.05, 6, 1.1);
  const rho = clampNumber(requestUrl.searchParams.get("rho"), -0.5, 0.5, -0.1);
  const maxGoals = Math.round(clampNumber(requestUrl.searchParams.get("max_goals"), 2, 9, 5));

  if (process.env.MATRIX_ENGINE === "python") {
    try {
      jsonResponse(response, 200, await runPythonMatrix(lambdaH, lambdaA, rho, maxGoals));
      return;
    } catch (error) {
      jsonResponse(response, 200, {
        ...generateScoreMatrix(lambdaH, lambdaA, rho, maxGoals),
        engine_warning: `Python matrix engine unavailable, used JS fallback: ${error.message}`
      });
      return;
    }
  }

  jsonResponse(response, 200, generateScoreMatrix(lambdaH, lambdaA, rho, maxGoals));
}

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  const requestPath = decodeURIComponent(requestUrl.pathname);

  if (requestPath === "/api/v1/match-matrix") {
    await handleMatchMatrix(requestUrl, response);
    return;
  }

  if (requestPath === "/api/v1/health") {
    jsonResponse(response, 200, {
      ok: true,
      service: "world-quant",
      model: "dixon-coles",
      runtime: "node"
    });
    return;
  }

  const relativePath = requestPath === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
  const pathSegments = relativePath.split(/[\\/]+/);
  const filePath = path.resolve(root, relativePath);

  if (!filePath.startsWith(root) || pathSegments.some((segment) => segment.startsWith("."))) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500);
      response.end(error.code === "ENOENT" ? "Not found" : "Server error");
      return;
    }

    response.writeHead(200, {
      "Content-Type": mime[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-cache"
    });
    response.end(content);
  });
});

function localAddresses() {
  const os = require("os");
  return Object.values(os.networkInterfaces())
    .flat()
    .filter((item) => item && item.family === "IPv4" && !item.internal)
    .map((item) => item.address);
}

server.listen(port, host, () => {
  console.log(`World Cup Quant Desk: http://127.0.0.1:${port}`);
  localAddresses().forEach((address) => {
    console.log(`LAN access: http://${address}:${port}`);
  });
});
