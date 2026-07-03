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

function poisson(lambda, goals) {
  return (Math.pow(lambda, goals) * Math.exp(-lambda)) / factorial(goals);
}

function correction(homeGoals, awayGoals, lambdaH, lambdaA, rho) {
  if (homeGoals === 0 && awayGoals === 0) return 1 - lambdaH * lambdaA * rho;
  if (homeGoals === 0 && awayGoals === 1) return 1 + lambdaH * rho;
  if (homeGoals === 1 && awayGoals === 0) return 1 + lambdaA * rho;
  if (homeGoals === 1 && awayGoals === 1) return 1 - rho;
  return 1;
}

function generateMatrix(lambdaH, lambdaA, rho, maxGoals) {
  const matrix = [];
  let total = 0;
  for (let homeGoals = 0; homeGoals < maxGoals; homeGoals += 1) {
    const row = [];
    for (let awayGoals = 0; awayGoals < maxGoals; awayGoals += 1) {
      const probability = Math.max(
        0,
        poisson(lambdaH, homeGoals) * poisson(lambdaA, awayGoals) *
          correction(homeGoals, awayGoals, lambdaH, lambdaA, rho)
      );
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
    inputs: { lambda_h: lambdaH, lambda_a: lambdaA, rho, max_goals: maxGoals },
    model: "dixon-coles",
    engine: "vercel-serverless"
  };
}

module.exports = function handler(request, response) {
  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }
  if (request.method !== "GET") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const lambdaH = clampNumber(request.query.lambda_h, 0.05, 6, 1.35);
  const lambdaA = clampNumber(request.query.lambda_a, 0.05, 6, 1.1);
  const rho = clampNumber(request.query.rho, -0.5, 0.5, -0.1);
  const maxGoals = Math.round(clampNumber(request.query.max_goals, 2, 9, 5));
  response.status(200).json(generateMatrix(lambdaH, lambdaA, rho, maxGoals));
};

