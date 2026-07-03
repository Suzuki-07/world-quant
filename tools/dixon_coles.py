import argparse
import json
import math


def poisson_probability(lam, goals):
    return (math.pow(lam, goals) * math.exp(-lam)) / math.factorial(goals)


def dixon_coles_correction(home_goals, away_goals, lambda_h, lambda_a, rho):
    if home_goals == 0 and away_goals == 0:
        return 1 - lambda_h * lambda_a * rho
    if home_goals == 0 and away_goals == 1:
        return 1 + lambda_h * rho
    if home_goals == 1 and away_goals == 0:
        return 1 + lambda_a * rho
    if home_goals == 1 and away_goals == 1:
        return 1 - rho
    return 1.0


def generate_score_matrix(lambda_h, lambda_a, rho=-0.18, max_goals=5):
    matrix = []
    total = 0.0

    for home_goals in range(max_goals):
        row = []
        for away_goals in range(max_goals):
            base_prob = (
                poisson_probability(lambda_h, home_goals)
                * poisson_probability(lambda_a, away_goals)
            )
            correction = dixon_coles_correction(
                home_goals, away_goals, lambda_h, lambda_a, rho
            )
            probability = max(0.0, base_prob * correction)
            row.append(probability)
            total += probability
        matrix.append(row)

    if total <= 0:
        raise ValueError("score matrix probability total must be greater than zero")

    heatmap_data = []
    top_probability = -1.0
    top_prediction = "0:0"

    for home_goals, row in enumerate(matrix):
        for away_goals, probability in enumerate(row):
            normalized = probability / total
            heatmap_data.append([away_goals, home_goals, round(normalized * 100, 2)])
            if normalized > top_probability:
                top_probability = normalized
                top_prediction = f"{home_goals}:{away_goals}"

    return {
        "heatmap_data": heatmap_data,
        "top_prediction": top_prediction,
        "top_probability": round(top_probability * 100, 2),
        "inputs": {
            "lambda_h": lambda_h,
            "lambda_a": lambda_a,
            "rho": rho,
            "max_goals": max_goals,
        },
        "model": "dixon-coles",
    }


def main():
    parser = argparse.ArgumentParser(description="Generate a Dixon-Coles score matrix.")
    parser.add_argument("--lambda-h", type=float, required=True)
    parser.add_argument("--lambda-a", type=float, required=True)
    parser.add_argument("--rho", type=float, default=-0.18)
    parser.add_argument("--max-goals", type=int, default=5)
    args = parser.parse_args()

    result = generate_score_matrix(
        lambda_h=args.lambda_h,
        lambda_a=args.lambda_a,
        rho=args.rho,
        max_goals=args.max_goals,
    )
    print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    main()
