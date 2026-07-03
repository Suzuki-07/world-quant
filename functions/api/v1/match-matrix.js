const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store"
};

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8"
    }
  });
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

  if (total <= 0) {
    throw new Error("score matrix probability total must be greater than zero");
  }

  const heatmapData = [];
  let topPrediction = "0:0";
  let topProbability = -1;

  matrix.forEach((row, homeGoals) => {
    row.forEach((probability, awayGoals) => {
      const normalized = probability / total;
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
    model: "dixon-coles",
    engine: "cloudflare-pages-functions"
  };
}

export function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export function onRequestGet(context) {
  const url = new URL(context.request.url);
  const lambdaH = clampNumber(url.searchParams.get("lambda_h"), 0.05, 6, 1.35);
  const lambdaA = clampNumber(url.searchParams.get("lambda_a"), 0.05, 6, 1.1);
  const rho = clampNumber(url.searchParams.get("rho"), -0.5, 0.5, -0.1);
  const maxGoals = Math.round(clampNumber(url.searchParams.get("max_goals"), 2, 9, 5));

  try {
    return jsonResponse(generateScoreMatrix(lambdaH, lambdaA, rho, maxGoals));
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}
