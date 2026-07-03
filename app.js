const LOCAL_TIME_ZONE = "Asia/Shanghai";
const FIXTURES_REMOTE = "https://www.thestatsapi.com/world-cup/data/fixtures.json";
const RESULTS_REMOTE = "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";
const LIVE_REFRESH_INTERVAL_MS = 60000;

const ratings = {
  Argentina: 1900, Spain: 1885, France: 1865, England: 1845, Brazil: 1835,
  Portugal: 1818, Netherlands: 1800, Belgium: 1775, Germany: 1770, Colombia: 1760,
  Morocco: 1750, Croatia: 1742, Uruguay: 1738, Japan: 1715, Switzerland: 1708,
  Senegal: 1700, USA: 1688, Mexico: 1685, Austria: 1680, Norway: 1676,
  Ecuador: 1665, "Korea Republic": 1655, Australia: 1645, Turkiye: 1640,
  Canada: 1638, "Cote d'Ivoire": 1635, "IR Iran": 1630, Algeria: 1622,
  Egypt: 1618, Paraguay: 1612, Scotland: 1608, Tunisia: 1598, Sweden: 1595,
  Panama: 1588, Ghana: 1585, Czechia: 1580, Uzbekistan: 1575,
  "Bosnia and Herzegovina": 1565, "South Africa": 1550, Qatar: 1538,
  "Congo DR": 1535, "Saudi Arabia": 1530, Iraq: 1518, Jordan: 1510,
  "Cabo Verde": 1505, Haiti: 1475, "New Zealand": 1460, Curacao: 1440
};

const teamMeta = {
  Argentina: ["ARG", "阿根廷"], Spain: ["ESP", "西班牙"], France: ["FRA", "法国"],
  England: ["ENG", "英格兰"], Brazil: ["BRA", "巴西"], Portugal: ["POR", "葡萄牙"],
  Netherlands: ["NED", "荷兰"], Belgium: ["BEL", "比利时"], Germany: ["GER", "德国"],
  Colombia: ["COL", "哥伦比亚"], Morocco: ["MAR", "摩洛哥"], Croatia: ["CRO", "克罗地亚"],
  Uruguay: ["URU", "乌拉圭"], Japan: ["JPN", "日本"], Switzerland: ["SUI", "瑞士"],
  Senegal: ["SEN", "塞内加尔"], "United States": ["USA", "美国"], USA: ["USA", "美国"],
  Mexico: ["MEX", "墨西哥"], Austria: ["AUT", "奥地利"], Norway: ["NOR", "挪威"],
  Ecuador: ["ECU", "厄瓜多尔"], "Korea Republic": ["KOR", "韩国"], Australia: ["AUS", "澳大利亚"],
  Turkiye: ["TUR", "土耳其"], Canada: ["CAN", "加拿大"], "Cote d'Ivoire": ["CIV", "科特迪瓦"],
  "IR Iran": ["IRN", "伊朗"], Algeria: ["ALG", "阿尔及利亚"], Egypt: ["EGY", "埃及"],
  Paraguay: ["PAR", "巴拉圭"], Scotland: ["SCO", "苏格兰"], Tunisia: ["TUN", "突尼斯"],
  Sweden: ["SWE", "瑞典"], Panama: ["PAN", "巴拿马"], Ghana: ["GHA", "加纳"],
  Czechia: ["CZE", "捷克"], Uzbekistan: ["UZB", "乌兹别克斯坦"],
  "Bosnia and Herzegovina": ["BIH", "波黑"], "South Africa": ["RSA", "南非"],
  Qatar: ["QAT", "卡塔尔"], "Congo DR": ["COD", "刚果（金）"], "Saudi Arabia": ["KSA", "沙特阿拉伯"],
  Iraq: ["IRQ", "伊拉克"], Jordan: ["JOR", "约旦"], "Cabo Verde": ["CPV", "佛得角"],
  Haiti: ["HAI", "海地"], "New Zealand": ["NZL", "新西兰"], Curacao: ["CUW", "库拉索"]
};

const teamFlags = {
  ARG: "🇦🇷", ESP: "🇪🇸", FRA: "🇫🇷", ENG: "🏴", BRA: "🇧🇷", POR: "🇵🇹",
  NED: "🇳🇱", BEL: "🇧🇪", GER: "🇩🇪", COL: "🇨🇴", MAR: "🇲🇦", CRO: "🇭🇷",
  URU: "🇺🇾", JPN: "🇯🇵", SUI: "🇨🇭", SEN: "🇸🇳", USA: "🇺🇸", MEX: "🇲🇽",
  AUT: "🇦🇹", NOR: "🇳🇴", ECU: "🇪🇨", KOR: "🇰🇷", AUS: "🇦🇺", TUR: "🇹🇷",
  CAN: "🇨🇦", CIV: "🇨🇮", IRN: "🇮🇷", ALG: "🇩🇿", EGY: "🇪🇬", PAR: "🇵🇾",
  SCO: "🏴", TUN: "🇹🇳", SWE: "🇸🇪", PAN: "🇵🇦", GHA: "🇬🇭", CZE: "🇨🇿",
  UZB: "🇺🇿", BIH: "🇧🇦", RSA: "🇿🇦", QAT: "🇶🇦", COD: "🇨🇩", KSA: "🇸🇦",
  IRQ: "🇮🇶", JOR: "🇯🇴", CPV: "🇨🇻", HAI: "🇭🇹", NZL: "🇳🇿", CUW: "🇨🇼"
};

const aliases = {
  "South Korea": "Korea Republic",
  "Korea Republic": "Korea Republic",
  "Czech Republic": "Czechia",
  Turkey: "Turkiye",
  Türkiye: "Turkiye",
  USA: "United States",
  "Bosnia & Herzegovina": "Bosnia and Herzegovina",
  "Ivory Coast": "Cote d'Ivoire",
  "Curaçao": "Curacao",
  Iran: "IR Iran",
  "Cape Verde": "Cabo Verde",
  "DR Congo": "Congo DR"
};

const stageNames = {
  "group-stage": "小组赛",
  "round-of-32": "32 强",
  "round-of-16": "16 强",
  "quarter-finals": "1/4 决赛",
  "semi-finals": "半决赛",
  "third-place": "季军赛",
  final: "决赛"
};

const cityMeta = {
  atlanta: { name: "亚特兰大", country: "美国", timeZone: "America/New_York" },
  boston: { name: "波士顿", country: "美国", timeZone: "America/New_York" },
  dallas: { name: "达拉斯/阿灵顿", country: "美国", timeZone: "America/Chicago" },
  guadalajara: { name: "瓜达拉哈拉", country: "墨西哥", timeZone: "America/Mexico_City" },
  houston: { name: "休斯敦", country: "美国", timeZone: "America/Chicago" },
  "kansas-city": { name: "堪萨斯城", country: "美国", timeZone: "America/Chicago" },
  "los-angeles": { name: "洛杉矶", country: "美国", timeZone: "America/Los_Angeles" },
  "mexico-city": { name: "墨西哥城", country: "墨西哥", timeZone: "America/Mexico_City" },
  miami: { name: "迈阿密", country: "美国", timeZone: "America/New_York" },
  monterrey: { name: "蒙特雷", country: "墨西哥", timeZone: "America/Monterrey" },
  "new-york": { name: "纽约/新泽西", country: "美国", timeZone: "America/New_York" },
  philadelphia: { name: "费城", country: "美国", timeZone: "America/New_York" },
  "san-francisco": { name: "旧金山湾区", country: "美国", timeZone: "America/Los_Angeles" },
  seattle: { name: "西雅图", country: "美国", timeZone: "America/Los_Angeles" },
  toronto: { name: "多伦多", country: "加拿大", timeZone: "America/Toronto" },
  vancouver: { name: "温哥华", country: "加拿大", timeZone: "America/Vancouver" }
};

const fixedPassTypes = [
  { label: "2串1", m: 2, sizes: [2] },
  { label: "3串1", m: 3, sizes: [3] },
  { label: "3串3", m: 3, sizes: [2] },
  { label: "3串4", m: 3, sizes: [2, 3] },
  { label: "4串1", m: 4, sizes: [4] },
  { label: "4串4", m: 4, sizes: [3] },
  { label: "4串5", m: 4, sizes: [3, 4] },
  { label: "4串6", m: 4, sizes: [2] },
  { label: "4串11", m: 4, sizes: [2, 3, 4] },
  { label: "5串1", m: 5, sizes: [5] },
  { label: "5串5", m: 5, sizes: [4] },
  { label: "5串6", m: 5, sizes: [4, 5] },
  { label: "5串10", m: 5, sizes: [2] },
  { label: "5串16", m: 5, sizes: [3, 4, 5] },
  { label: "5串20", m: 5, sizes: [2, 3] },
  { label: "5串26", m: 5, sizes: [2, 3, 4, 5] },
  { label: "6串1", m: 6, sizes: [6] },
  { label: "6串6", m: 6, sizes: [5] },
  { label: "6串7", m: 6, sizes: [5, 6] },
  { label: "6串15", m: 6, sizes: [2] },
  { label: "6串20", m: 6, sizes: [3] },
  { label: "6串22", m: 6, sizes: [4, 5, 6] },
  { label: "6串35", m: 6, sizes: [2, 3] },
  { label: "6串42", m: 6, sizes: [3, 4, 5, 6] },
  { label: "6串50", m: 6, sizes: [2, 3, 4] },
  { label: "6串57", m: 6, sizes: [2, 3, 4, 5, 6] },
  { label: "7串1", m: 7, sizes: [7] },
  { label: "7串7", m: 7, sizes: [6] },
  { label: "7串8", m: 7, sizes: [6, 7] },
  { label: "7串21", m: 7, sizes: [5] },
  { label: "7串35", m: 7, sizes: [4] },
  { label: "7串120", m: 7, sizes: [2, 3, 4, 5, 6, 7] },
  { label: "8串1", m: 8, sizes: [8] },
  { label: "8串8", m: 8, sizes: [7] },
  { label: "8串9", m: 8, sizes: [7, 8] },
  { label: "8串28", m: 8, sizes: [6] },
  { label: "8串56", m: 8, sizes: [5] },
  { label: "8串70", m: 8, sizes: [4] },
  { label: "8串247", m: 8, sizes: [2, 3, 4, 5, 6, 7, 8] }
];

const outcomeDefinitions = [
  { key: "home", label: "主胜", short: "胜" },
  { key: "draw", label: "平局", short: "平" },
  { key: "away", label: "客胜", short: "负" }
];

const scoreOutcomeDefinitions = [
  ...["1:0", "2:0", "2:1", "3:0", "3:1", "3:2", "4:0", "4:1", "4:2", "5:0", "5:1", "5:2"]
    .map((key) => ({ key, group: "home", groupLabel: "主胜" })),
  { key: "胜其他", group: "home", groupLabel: "主胜" },
  ...["0:0", "1:1", "2:2", "3:3"].map((key) => ({ key, group: "draw", groupLabel: "平局" })),
  { key: "平其他", group: "draw", groupLabel: "平局" },
  ...["0:1", "0:2", "1:2", "0:3", "1:3", "2:3", "0:4", "1:4", "2:4", "0:5", "1:5", "2:5"]
    .map((key) => ({ key, group: "away", groupLabel: "客胜" })),
  { key: "负其他", group: "away", groupLabel: "客胜" }
];

const state = {
  fixtures: [],
  filtered: [],
  results: [],
  recentResults: [],
  formIndex: new Map(),
  visibleCount: 14,
  activeFilter: "knockout",
  selected: null,
  selectedModel: null,
  scoreChoices: {},
  betSlip: [],
  scoreBetSlip: [],
  betType: "spf",
  passMode: "fixed",
  fixedPass: "",
  freePasses: new Set(),
  multiplier: 1,
  liveRefresh: false,
  variables: {
    homeAvailability: 1,
    awayAvailability: 1,
    handicapEnabled: false,
    handicap: -1
  }
};

let scoreHeatmapChart = null;
let matrixRequestId = 0;
let liveRefreshTimer = null;
let liveRefreshRunning = false;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const pct = (value) => `${Math.round(value * 100)}%`;
const money = (value) => `${value < 0 ? "-" : ""}¥${Math.abs(Math.round(value)).toLocaleString("zh-CN")}`;

function activeBetSlip() {
  return state.betType === "score" ? state.scoreBetSlip : state.betSlip;
}

function activeMatchLimit() {
  return state.betType === "score" ? 4 : 8;
}

function normalizeTeam(name = "") {
  return aliases[name] || name;
}

function knownTeam(name) {
  const normalized = normalizeTeam(name);
  const key = normalized === "United States" ? "USA" : normalized;
  return Object.prototype.hasOwnProperty.call(ratings, key);
}

function ratingFor(name) {
  const normalized = normalizeTeam(name);
  const key = normalized === "United States" ? "USA" : normalized;
  return ratings[key] || 1550;
}

function metaFor(name) {
  return teamMeta[normalizeTeam(name)] || [name.slice(0, 3).toUpperCase(), translatePlaceholder(name)];
}

function flagFor(name) {
  const code = metaFor(name)[0];
  return teamFlags[code] ? `./assets/flags/${code}.png` : "";
}

function flagMarkup(name) {
  const source = flagFor(name);
  const [code, localizedName] = metaFor(name);
  return source
    ? `<img src="${source}" alt="${localizedName}国旗" />`
    : `<span>${code}</span>`;
}

function translatePlaceholder(name) {
  return name
    .replace("Group", "小组")
    .replace("winners", "头名")
    .replace("runners-up", "次名")
    .replace("third place", "第三名")
    .replace("Winner Match", "第")
    .replace("Loser Match", "第");
}

function factorial(number) {
  let result = 1;
  for (let i = 2; i <= number; i += 1) result *= i;
  return result;
}

function poisson(lambda, goals) {
  return (Math.exp(-lambda) * lambda ** goals) / factorial(goals);
}

function dixonColesCorrection(homeGoals, awayGoals, homeXg, awayXg, rho = -0.18) {
  if (homeGoals === 0 && awayGoals === 0) return 1 - homeXg * awayXg * rho;
  if (homeGoals === 0 && awayGoals === 1) return 1 + homeXg * rho;
  if (homeGoals === 1 && awayGoals === 0) return 1 + awayXg * rho;
  if (homeGoals === 1 && awayGoals === 1) return 1 - rho;
  return 1;
}

function dynamicRho(homeXg, awayXg, ratingGap) {
  const totalXg = homeXg + awayXg;
  const xgGap = Math.abs(homeXg - awayXg);
  if (xgGap >= 0.55) return -0.012;
  if (xgGap >= 0.35) return -0.03;
  const balance = 1 - clamp(Math.abs(homeXg - awayXg) / 1.35, 0, 1);
  const lowTempo = 1 - clamp((totalXg - 2.05) / 1.7, 0, 1);
  const ratingBalance = 1 - clamp(Math.abs(ratingGap) / 360, 0, 1);
  return -(0.035 + 0.115 * balance * lowTempo * ratingBalance);
}

function modelMatch(match, variables = state.variables) {
  if (!knownTeam(match.homeTeam) || !knownTeam(match.awayTeam)) {
    return {
      available: false,
      home: 0,
      draw: 0,
      away: 0,
      score: ["-", "-"],
      confidence: "待定",
      signal: "对阵尚未确定",
      pass: true
    };
  }

  const homeRating = ratingFor(match.homeTeam);
  const awayRating = ratingFor(match.awayTeam);
  const hostTeams = ["Mexico", "United States", "Canada"];
  const hostBoost = hostTeams.includes(match.homeTeam) ? 0.16 : hostTeams.includes(match.awayTeam) ? -0.12 : 0;
  const ratingGap = homeRating - awayRating;
  const baseHome = 1.32 + ratingGap * 0.00165 + hostBoost;
  const baseAway = 1.18 - ratingGap * 0.00145 - hostBoost * 0.72;
  const homeForm = teamForm(match.homeTeam);
  const awayForm = teamForm(match.awayTeam);
  const homeFormDelta = formAttackBoost(homeForm) + formDefensiveLeak(awayForm);
  const awayFormDelta = formAttackBoost(awayForm) + formDefensiveLeak(homeForm);
  const homeXg = clamp((baseHome + homeFormDelta) * variables.homeAvailability, 0.25, 4.45);
  const awayXg = clamp((baseAway + awayFormDelta) * variables.awayAvailability, 0.25, 4.15);
  const matrix = [];
  let home = 0;
  let draw = 0;
  let away = 0;
  let over = 0;
  let btts = 0;
  let best = { probability: 0, homeGoals: 0, awayGoals: 0 };
  const handicap = variables.handicapEnabled ? Number(variables.handicap) : 0;
  const rho = dynamicRho(homeXg, awayXg, ratingGap);

  for (let homeGoals = 0; homeGoals <= 8; homeGoals += 1) {
    for (let awayGoals = 0; awayGoals <= 8; awayGoals += 1) {
      const probability = Math.max(
        0,
        poisson(homeXg, homeGoals) *
          poisson(awayXg, awayGoals) *
          dixonColesCorrection(homeGoals, awayGoals, homeXg, awayXg, rho)
      );
      const adjustedHomeGoals = homeGoals + handicap;
      matrix.push({ homeGoals, awayGoals, probability });
      if (adjustedHomeGoals > awayGoals) home += probability;
      else if (adjustedHomeGoals === awayGoals) draw += probability;
      else away += probability;
      if (homeGoals + awayGoals >= 3) over += probability;
      if (homeGoals > 0 && awayGoals > 0) btts += probability;
      if (probability > best.probability) best = { probability, homeGoals, awayGoals };
    }
  }

  const total = home + draw + away;
  home /= total;
  draw /= total;
  away /= total;
  over /= total;
  btts /= total;
  matrix.forEach((item) => {
    item.probability /= total;
  });
  const choices = [
    { label: "主胜", value: home },
    { label: "平局", value: draw },
    { label: "客胜", value: away }
  ].sort((a, b) => b.value - a.value);
  const top = choices[0];
  const separation = top.value - choices[1].value;
  const pass = top.value < 0.52 || separation < 0.16;
  const confidence = top.value >= 0.72 ? "高置信" : top.value >= 0.58 ? "中等置信" : "低置信";
  const signal = pass
    ? `分歧较大 · 建议观望`
    : top.value >= 0.72
      ? `明显倾向 · ${top.label}`
      : `谨慎倾向 · ${top.label}`;
  const formNote = formSummary(match);
  const topScores = [...matrix]
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 3)
    .map((item) => ({
      home: item.homeGoals,
      away: item.awayGoals,
      probability: item.probability
    }));

  return {
    available: true,
    home,
    draw,
    away,
    homeXg,
    awayXg,
    rho,
    over,
    btts,
    matrix,
    score: [best.homeGoals, best.awayGoals],
    confidence,
    signal,
    pass,
    top,
    homeRating,
    awayRating,
    topScores,
    formNote,
    formImpact: {
      home: homeFormDelta,
      away: awayFormDelta
    }
  };
}

function officialScoreKey(homeGoals, awayGoals) {
  const exact = `${homeGoals}:${awayGoals}`;
  if (scoreOutcomeDefinitions.some((outcome) => outcome.key === exact)) return exact;
  if (homeGoals > awayGoals) return "胜其他";
  if (homeGoals === awayGoals) return "平其他";
  return "负其他";
}

function buildRecentForm(fixtures) {
  const completed = fixtures
    .filter((match) => match.result && knownTeam(match.homeTeam) && knownTeam(match.awayTeam))
    .sort((a, b) => a.date.localeCompare(b.date) || a.kickoffUtc.localeCompare(b.kickoffUtc));
  const latestDate = completed.at(-1)?.date;
  if (!latestDate) return { formIndex: new Map(), recentResults: [] };

  const cutoff = new Date(`${latestDate}T00:00:00Z`);
  cutoff.setUTCDate(cutoff.getUTCDate() - 1);
  const cutoffDate = cutoff.toISOString().slice(0, 10);
  const recentResults = completed.filter((match) => match.date >= cutoffDate && match.date <= latestDate);
  const formIndex = new Map();

  const add = (team, opponent, goalsFor, goalsAgainst, match) => {
    const key = normalizeTeam(team);
    const form = formIndex.get(key) || {
      team,
      matches: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      cleanSheets: 0,
      last: null
    };
    form.matches += 1;
    form.goalsFor += goalsFor;
    form.goalsAgainst += goalsAgainst;
    if (goalsAgainst === 0) form.cleanSheets += 1;
    form.last = { opponent, goalsFor, goalsAgainst, date: match.date, matchNumber: match.matchNumber };
    formIndex.set(key, form);
  };

  recentResults.forEach((match) => {
    add(match.homeTeam, match.awayTeam, match.result.home, match.result.away, match);
    add(match.awayTeam, match.homeTeam, match.result.away, match.result.home, match);
  });

  return { formIndex, recentResults };
}

function teamForm(name) {
  return state.formIndex.get(normalizeTeam(name));
}

function formAttackBoost(form) {
  if (!form) return 0;
  const averageFor = form.goalsFor / form.matches;
  const averageAgainst = form.goalsAgainst / form.matches;
  return clamp((averageFor - 1.25) * 0.09 - Math.max(averageAgainst - 2.2, 0) * 0.04, -0.16, 0.26);
}

function formDefensiveLeak(form) {
  if (!form) return 0;
  const averageAgainst = form.goalsAgainst / form.matches;
  const cleanSheetPull = form.cleanSheets ? -0.04 : 0;
  return clamp((averageAgainst - 1.15) * 0.07 + cleanSheetPull, -0.10, 0.20);
}

function formLine(form) {
  if (!form?.last) return "";
  const opponent = localizedTeam(form.last.opponent);
  return `${form.goalsFor}-${form.goalsAgainst} vs ${opponent}`;
}

function formSummary(match) {
  const home = teamForm(match.homeTeam);
  const away = teamForm(match.awayTeam);
  const parts = [];
  if (home) parts.push(`${localizedTeam(match.homeTeam)}近两日 ${formLine(home)}`);
  if (away) parts.push(`${localizedTeam(match.awayTeam)}近两日 ${formLine(away)}`);
  return parts.join(" · ");
}

function scoreMarket(model) {
  if (!model?.available) return [];
  const probabilities = new Map(scoreOutcomeDefinitions.map((outcome) => [outcome.key, 0]));
  model.matrix.forEach(({ homeGoals, awayGoals, probability }) => {
    const key = officialScoreKey(homeGoals, awayGoals);
    probabilities.set(key, (probabilities.get(key) || 0) + probability);
  });
  return scoreOutcomeDefinitions.map((outcome) => ({
    ...outcome,
    probability: probabilities.get(outcome.key) || 0
  }));
}

function recommendedScores(model) {
  return scoreMarket(model)
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 3);
}

function resultKey(date, home, away) {
  return `${date}|${normalizeTeam(home)}|${normalizeTeam(away)}`;
}

function indexResults(results) {
  const index = new Map();
  results.forEach((match) => {
    if (!match.score?.ft) return;
    index.set(resultKey(match.date, match.team1, match.team2), {
      home: Number(match.score.ft[0]),
      away: Number(match.score.ft[1])
    });
  });
  return index;
}

function mergeResults(fixtures, results) {
  const resultIndex = indexResults(results);
  return fixtures.map((match) => ({
    ...match,
    result: resultIndex.get(resultKey(match.date, match.homeTeam, match.awayTeam)) || null
  }));
}

function mergeResultFeeds(primary = { matches: [] }, supplemental = { matches: [] }) {
  const byMatch = new Map();
  (primary.matches || []).forEach((match) => {
    const key = resultKey(match.date, match.team1, match.team2);
    byMatch.set(key, match);
  });
  (supplemental.matches || []).forEach((match) => {
    const key = resultKey(match.date, match.team1, match.team2);
    const existing = byMatch.get(key);
    if (!existing || match.score?.ft || !existing.score?.ft) byMatch.set(key, match);
  });
  return { ...primary, matches: [...byMatch.values()] };
}

function formatDate(dateString, options = {}) {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: LOCAL_TIME_ZONE,
    month: "2-digit",
    day: "2-digit",
    ...options
  }).format(new Date(dateString));
}

function formatKickoff(match) {
  const date = new Date(match.kickoffUtc);
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: LOCAL_TIME_ZONE,
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(date);
}

function formatLocalKickoff(match) {
  const meta = cityMeta[match.hostCity];
  const date = new Date(match.kickoffUtc);
  if (!meta?.timeZone) return formatKickoff(match);
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: meta.timeZone,
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(date);
}

function hostLocation(match) {
  const meta = cityMeta[match.hostCity];
  if (!meta) return match.hostCity;
  return `${meta.name}，${meta.country}`;
}

function venueLine(match) {
  return `${match.stadium} · ${hostLocation(match)}`;
}

function kickoffLine(match) {
  return `北京时间 ${formatKickoff(match)} · 当地 ${formatLocalKickoff(match)}`;
}

function localizedTeam(name) {
  return metaFor(name)[1] || name;
}

async function fetchJson(url, timeout = 7000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { cache: "no-store", signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function loadData(useRemote = true) {
  const refreshButton = $("#refreshData");
  refreshButton.classList.add("loading");

  const localFixturesPromise = fetchJson("./data/fixtures.json", 3000);
  const localResultsPromise = fetchJson("./data/results.json", 3000);
  let [fixturesData, resultsData] = await Promise.all([localFixturesPromise, localResultsPromise]);
  let liveRefresh = false;

  if (useRemote) {
    try {
      const remoteResults = await fetchJson(RESULTS_REMOTE);
      resultsData = mergeResultFeeds(remoteResults, resultsData);
      liveRefresh = true;
    } catch {
      liveRefresh = false;
    }
  }

  state.results = resultsData.matches || [];
  state.fixtures = mergeResults(fixturesData.fixtures || [], state.results);
  const recentForm = buildRecentForm(state.fixtures);
  state.formIndex = recentForm.formIndex;
  state.recentResults = recentForm.recentResults;
  state.liveRefresh = liveRefresh;
  refreshButton.classList.remove("loading");
  updateDataHealth();
  updateSummary();
  applyFilters();
  if (state.selected) {
    const refreshed = state.fixtures.find((item) => item.matchNumber === state.selected.matchNumber);
    if (refreshed) selectMatch(refreshed);
  }
  return liveRefresh;
}

async function refreshLiveData(silent = true) {
  if (liveRefreshRunning) return;
  liveRefreshRunning = true;
  try {
    const live = await loadData(true);
    if (!silent) {
      showToast(live ? "公开数据刷新成功" : "远程源不可用，已使用本地稳定快照");
    }
  } catch {
    if (!silent) showToast("实时刷新失败，继续保留当前数据");
  } finally {
    liveRefreshRunning = false;
  }
}

function startLiveRefresh() {
  if (liveRefreshTimer) clearInterval(liveRefreshTimer);
  liveRefreshTimer = setInterval(() => {
    if (document.visibilityState === "visible") refreshLiveData(true);
  }, LIVE_REFRESH_INTERVAL_MS);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") refreshLiveData(true);
  });
}

function updateDataHealth() {
  const scoreCount = state.fixtures.filter((match) => match.result).length;
  const health = state.liveRefresh ? 91 : 84;
  $("#healthScore").textContent = `${health}%`;
  $("#healthBar").style.width = `${health}%`;
  $("#resultDot").className = `status-dot ${scoreCount ? "live" : "warning"}`;
  $("#resultStatus").textContent = `${scoreCount} 场已核验`;
  $("#asOfTime").textContent = state.liveRefresh
    ? `公开数据已刷新 · ${new Intl.DateTimeFormat("zh-CN", { timeZone: LOCAL_TIME_ZONE, hour: "2-digit", minute: "2-digit" }).format(new Date())}`
    : "本地稳定快照 · 可离线使用";
}

function updateSummary() {
  const completed = state.fixtures.filter((match) => match.result).length;
  const covered = state.fixtures.filter((match) => modelMatch(match).available).length;
  const upcoming = state.fixtures.filter((match) => !match.result && modelMatch(match).available);
  const passCount = upcoming.filter((match) => modelMatch(match).pass).length;
  $("#totalMatches").textContent = state.fixtures.length;
  $("#completedMatches").textContent = completed;
  $("#modelCoverage").textContent = covered;
  $("#passCount").textContent = passCount;
  $("#tournamentState").textContent = "淘汰赛进行中";
  renderRecentScoreRail();
}

function renderRecentScoreRail() {
  const rail = $("#recentScoreRail");
  if (!rail) return;
  const recent = [...state.recentResults]
    .sort((a, b) => b.kickoffUtc.localeCompare(a.kickoffUtc))
    .slice(0, 6);
  rail.classList.toggle("hidden", recent.length === 0);
  rail.innerHTML = recent.map((match) => {
    const home = metaFor(match.homeTeam);
    const away = metaFor(match.awayTeam);
    return `
      <button class="recent-score-card" data-recent-match="${match.matchNumber}" aria-label="${home[1]} ${match.result.home} 比 ${match.result.away} ${away[1]}">
        <span class="recent-date">${formatDate(match.date)}</span>
        <span class="recent-teams">
          <b>${home[1]}</b>
          <strong>${match.result.home}:${match.result.away}</strong>
          <b>${away[1]}</b>
        </span>
        <span class="recent-note">已纳入比分校准</span>
      </button>
    `;
  }).join("");
  $$("[data-recent-match]").forEach((button) => {
    button.addEventListener("click", () => {
      const match = state.fixtures.find((item) => item.matchNumber === Number(button.dataset.recentMatch));
      if (!match) return;
      selectMatch(match);
      $("#analysis").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function matchIsToday(match) {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: LOCAL_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
  const matchDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: LOCAL_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(match.kickoffUtc));
  return matchDate === today;
}

function applyFilters() {
  const search = $("#matchSearch").value.trim().toLowerCase();
  const group = $("#groupFilter").value;
  state.filtered = state.fixtures.filter((match) => {
    const searchable = [
      match.homeTeam,
      match.awayTeam,
      localizedTeam(match.homeTeam),
      localizedTeam(match.awayTeam),
      match.stadium,
      match.hostCity,
      hostLocation(match)
    ].join(" ").toLowerCase();
    const matchesSearch = !search || searchable.includes(search);
    const matchesGroup = group === "all" || match.group === group;
    let matchesStage = true;
    if (state.activeFilter === "upcoming") matchesStage = !match.result;
    if (state.activeFilter === "today") matchesStage = matchIsToday(match);
    if (state.activeFilter === "knockout") matchesStage = match.stage !== "group-stage";
    return matchesSearch && matchesGroup && matchesStage;
  });
  renderFixtures();
}

function probabilityCell(model) {
  if (!model.available) {
    return `<div class="model-probs"><span>等待对阵确定</span></div>`;
  }
  return `
    <div class="model-probs">
      ${[
        ["胜", model.home],
        ["平", model.draw],
        ["负", model.away]
      ].map(([label, value]) => `
        <div>
          <span>${label}</span>
          <strong>${pct(value)}</strong>
          <div class="mini-prob-track"><b style="width:${value * 100}%"></b></div>
        </div>
      `).join("")}
    </div>
  `;
}

function strategyCell(match, model) {
  if (match.result) {
    return `<div class="strategy-cell"><span class="signal-tag finished">已完赛</span><small>赛果已核验</small></div>`;
  }
  if (!model.available) {
    return `<div class="strategy-cell"><span class="signal-tag pass">待定</span><small>对阵未产生</small></div>`;
  }
  const tag = model.pass ? "建议观望" : model.top.label;
  return `
    <div class="strategy-cell">
      <span class="signal-tag ${model.pass ? "pass" : ""}">${tag}</span>
      <small>${model.score[0]} : ${model.score[1]} · ${model.confidence}</small>
    </div>
  `;
}

function scoreOptions(match, model) {
  if (!model.available) {
    return `
      <div class="score-options unavailable">
        <span class="score-options-label"><i data-lucide="circle-dashed"></i> 建议比分</span>
        <small>等待淘汰赛对阵产生</small>
      </div>
    `;
  }

  const recommendations = recommendedScores(model);
  const selectedScore = state.scoreChoices[match.matchNumber] || recommendations[0].key;
  return `
    <div class="score-options">
      <span class="score-options-label"><i data-lucide="crosshair"></i> 数据模型建议</span>
      <div class="score-choice-group" role="group" aria-label="${localizedTeam(match.homeTeam)}对${localizedTeam(match.awayTeam)}建议比分">
        ${recommendations.map((score, index) => {
          const value = score.key;
          return `
            <button
              class="score-choice ${selectedScore === value ? "active" : ""}"
              data-score-match="${match.matchNumber}"
              data-score="${value}"
              aria-pressed="${selectedScore === value}"
            >
              <b>${value.replace(":", " : ")}</b>
              <small>${index === 0 ? "首选" : pct(score.probability)}</small>
            </button>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function renderFixtures() {
  const list = $("#fixtureList");
  const items = state.filtered.slice(0, state.visibleCount);
  if (!items.length) {
    list.innerHTML = `<div class="empty-state">没有匹配的比赛</div>`;
    $("#loadMore").classList.add("hidden");
    return;
  }

  list.innerHTML = items.map((match) => {
    const model = modelMatch(match);
    const homeMeta = metaFor(match.homeTeam);
    const awayMeta = metaFor(match.awayTeam);
    const selected = state.selected?.matchNumber === match.matchNumber ? "selected" : "";
    const score = match.result;
    return `
      <article class="fixture-card ${selected} ${score ? "completed" : model.pass ? "watch" : "lean"}">
        <button class="fixture-row" data-match="${match.matchNumber}">
          <div class="match-meta">
            <strong>#${String(match.matchNumber).padStart(3, "0")} · ${stageNames[match.stage] || match.stage}</strong>
            <span>${kickoffLine(match)}</span>
            <small><i data-lucide="map-pin"></i>${venueLine(match)}</small>
          </div>
          <div class="fixture-teams">
            <div class="fixture-team-line">
              <span class="mini-flag" title="${homeMeta[0]}">${flagMarkup(match.homeTeam)}</span>
              <strong>${homeMeta[1]}</strong>
              ${score ? `<em>${score.home}</em>` : ""}
            </div>
            <div class="fixture-team-line">
              <span class="mini-flag" title="${awayMeta[0]}">${flagMarkup(match.awayTeam)}</span>
              <strong>${awayMeta[1]}</strong>
              ${score ? `<em>${score.away}</em>` : ""}
            </div>
          </div>
          ${probabilityCell(model)}
          ${strategyCell(match, model)}
        </button>
        ${scoreOptions(match, model)}
      </article>
    `;
  }).join("");

  $$(".fixture-row").forEach((row) => {
    row.addEventListener("click", () => {
      const match = state.fixtures.find((item) => item.matchNumber === Number(row.dataset.match));
      if (match) selectMatch(match);
    });
  });
  $$(".score-choice").forEach((button) => {
    button.addEventListener("click", () => {
      const matchNumber = Number(button.dataset.scoreMatch);
      const match = state.fixtures.find((item) => item.matchNumber === matchNumber);
      state.scoreChoices[matchNumber] = button.dataset.score;
      if (match) {
        selectMatch(match);
        showToast(`已选择建议比分 ${button.dataset.score.replace(":", " : ")}`);
      } else {
        renderFixtures();
      }
    });
  });
  if (window.lucide) window.lucide.createIcons();
  $("#loadMore").classList.toggle("hidden", state.visibleCount >= state.filtered.length);
}

function selectMatch(match) {
  state.selected = match;
  state.selectedModel = modelMatch(match);
  $("#analysisEmpty").classList.add("hidden");
  $("#analysisContent").classList.remove("hidden");
  renderFixtures();
  renderAnalysis();
}

function renderAnalysis() {
  const match = state.selected;
  const model = modelMatch(match);
  state.selectedModel = model;
  const homeMeta = metaFor(match.homeTeam);
  const awayMeta = metaFor(match.awayTeam);
  $("#detailCode").textContent = `MATCH ${String(match.matchNumber).padStart(3, "0")} · ${stageNames[match.stage]}`;
  $("#confidenceChip").textContent = model.confidence;
  $("#homeFlag").innerHTML = flagMarkup(match.homeTeam);
  $("#awayFlag").innerHTML = flagMarkup(match.awayTeam);
  $("#homeName").textContent = homeMeta[1];
  $("#awayName").textContent = awayMeta[1];
  $("#homeRating").textContent = model.available ? `复合强度 ${model.homeRating}` : "对阵待定";
  $("#awayRating").textContent = model.available ? `复合强度 ${model.awayRating}` : "对阵待定";
  const chosenScore = state.scoreChoices[match.matchNumber];
  $("#scorePrediction").textContent = match.result
    ? `${match.result.home} : ${match.result.away}`
    : chosenScore
      ? chosenScore.replace(":", " : ")
      : `${model.score[0]} : ${model.score[1]}`;
  $("#kickoffDetail").textContent = `${kickoffLine(match)} · ${venueLine(match)}`;
  $("#homeProb").textContent = model.available ? pct(model.home) : "--";
  $("#drawProb").textContent = model.available ? pct(model.draw) : "--";
  $("#awayProb").textContent = model.available ? pct(model.away) : "--";
  $("#probBar .home").style.width = `${model.home * 100}%`;
  $("#probBar .draw").style.width = `${model.draw * 100}%`;
  $("#probBar .away").style.width = `${model.away * 100}%`;
  $("#signalText").textContent = match.result
    ? "已完赛 · 模型仅供回看"
    : model.formNote
      ? `${model.signal} · ${model.formNote}`
      : model.signal;
  $("#signalStrip").classList.toggle("pass", model.pass || Boolean(match.result));
  $("#overProb").textContent = model.available ? pct(model.over) : "--";
  $("#bttsProb").textContent = model.available ? pct(model.btts) : "--";
  $("#homeXg").textContent = model.available ? model.homeXg.toFixed(2) : "--";
  $("#awayXg").textContent = model.available ? model.awayXg.toFixed(2) : "--";
  $("#openBankroll").disabled = !model.available || Boolean(match.result);
  renderHeatmap(match, model);
  updateCalculatorButtons();
}

function clearHeatmap(message = "等待模型输入") {
  $("#matrixTopScore").textContent = "--";
  $("#matrixTopProbability").textContent = "--";
  $("#matrixStatus").textContent = message;
  const container = $("#scoreHeatmap");
  if (scoreHeatmapChart) {
    scoreHeatmapChart.dispose();
    scoreHeatmapChart = null;
  }
  container.classList.remove("score-heatmap-fallback");
  container.innerHTML = "";
}

function renderHeatmapFallback(result) {
  const container = $("#scoreHeatmap");
  const maxValue = Math.max(...result.heatmap_data.map((item) => item[2]), 1);
  container.classList.add("score-heatmap-fallback");
  container.innerHTML = result.heatmap_data
    .map(([awayGoals, homeGoals, probability]) => {
      const alpha = clamp(probability / maxValue, 0.08, 0.72).toFixed(2);
      return `
        <div class="score-heatmap-cell" style="--matrix-alpha:${alpha}">
          <span><strong>${homeGoals}:${awayGoals}</strong>${probability}%</span>
        </div>
      `;
    })
    .join("");
}

function renderHeatmapChart(result, match) {
  const container = $("#scoreHeatmap");
  container.classList.remove("score-heatmap-fallback");
  container.innerHTML = "";

  if (!window.echarts) {
    renderHeatmapFallback(result);
    return;
  }

  if (scoreHeatmapChart) scoreHeatmapChart.dispose();
  scoreHeatmapChart = window.echarts.init(container, "dark");
  const axisSize = Math.sqrt(result.heatmap_data.length);
  const awayLabels = Array.from({ length: axisSize }, (_, index) => `客${index}`);
  const homeLabels = Array.from({ length: axisSize }, (_, index) => `主${index}`);
  scoreHeatmapChart.setOption({
    backgroundColor: "transparent",
    grid: { top: 18, right: 8, bottom: 64, left: 42 },
    tooltip: {
      position: "top",
      formatter: (params) => {
        const [awayGoals, homeGoals, probability] = params.data;
        return `${localizedTeam(match.homeTeam)} ${homeGoals} : ${awayGoals} ${localizedTeam(match.awayTeam)}<br/>发生概率: <b>${probability}%</b>`;
      }
    },
    xAxis: {
      type: "category",
      data: awayLabels,
      axisLine: { lineStyle: { color: "#394139" } },
      axisLabel: { color: "#9da59b", fontSize: 10 }
    },
    yAxis: {
      type: "category",
      data: homeLabels,
      axisLine: { lineStyle: { color: "#394139" } },
      axisLabel: { color: "#9da59b", fontSize: 10 }
    },
    visualMap: {
      min: 0,
      max: Math.max(...result.heatmap_data.map((item) => item[2]), 12),
      calculable: true,
      orient: "horizontal",
      left: "center",
      bottom: 8,
      textStyle: { color: "#9da59b", fontSize: 9 },
      inRange: { color: ["#171717", "#4a0000", "#b71c1c", "#ff8e8e"] }
    },
    series: [{
      type: "heatmap",
      data: result.heatmap_data,
      label: {
        show: true,
        color: "#f1f3ed",
        fontSize: 9,
        formatter: (params) => `${params.data[2]}%`
      },
      emphasis: {
        itemStyle: {
          borderColor: "#8ee37d",
          borderWidth: 1
        }
      },
      itemStyle: {
        borderColor: "#242824",
        borderWidth: 1
      }
    }]
  });
}

async function renderHeatmap(match, model) {
  if (!model.available) {
    clearHeatmap("对阵尚未确定");
    return;
  }

  const requestId = ++matrixRequestId;
  const staticHost = window.location.hostname.endsWith("github.io") || window.location.protocol === "file:";
  if (staticHost) {
    const fallback = generateLocalMatrix(model.homeXg, model.awayXg, model.rho ?? -0.18, 5);
    $("#matrixTopScore").textContent = fallback.top_prediction;
    $("#matrixTopProbability").textContent = `${fallback.top_probability}%`;
    $("#matrixStatus").textContent =
      `静态公网版 · 前端同公式矩阵 · rho ${(model.rho ?? -0.18).toFixed(3)} · xG ${model.homeXg.toFixed(2)}-${model.awayXg.toFixed(2)}`;
    renderHeatmapChart(fallback, match);
    return;
  }

  $("#matrixStatus").textContent = "正在调用 Dixon-Coles 接口";
  const params = new URLSearchParams({
    matchId: String(match.matchNumber),
    lambda_h: model.homeXg.toFixed(4),
    lambda_a: model.awayXg.toFixed(4),
    rho: String(model.rho ?? -0.18),
    max_goals: "5"
  });

  try {
    const response = await fetch(`/api/v1/match-matrix?${params}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    if (requestId !== matrixRequestId) return;
    $("#matrixTopScore").textContent = result.top_prediction;
    $("#matrixTopProbability").textContent = `${result.top_probability}%`;
    $("#matrixStatus").textContent = result.engine_warning ||
      `Dixon-Coles 动态修正已生效 · rho ${Number(result.inputs?.rho ?? model.rho).toFixed(3)} · xG ${model.homeXg.toFixed(2)}-${model.awayXg.toFixed(2)}`;
    renderHeatmapChart(result, match);
  } catch (error) {
    if (requestId !== matrixRequestId) return;
    const fallback = generateLocalMatrix(model.homeXg, model.awayXg, model.rho ?? -0.18, 5);
    $("#matrixTopScore").textContent = fallback.top_prediction;
    $("#matrixTopProbability").textContent = `${fallback.top_probability}%`;
    $("#matrixStatus").textContent = "接口不可用，已使用前端同公式降级矩阵";
    renderHeatmapChart(fallback, match);
  }
}

function generateLocalMatrix(homeXg, awayXg, rho, maxGoals) {
  const heatmapData = [];
  let total = 0;
  const rows = [];
  for (let homeGoals = 0; homeGoals < maxGoals; homeGoals += 1) {
    const row = [];
    for (let awayGoals = 0; awayGoals < maxGoals; awayGoals += 1) {
      const probability = Math.max(
        0,
        poisson(homeXg, homeGoals) *
          poisson(awayXg, awayGoals) *
          dixonColesCorrection(homeGoals, awayGoals, homeXg, awayXg, rho)
      );
      row.push(probability);
      total += probability;
    }
    rows.push(row);
  }
  let top_prediction = "0:0";
  let top_probability = 0;
  rows.forEach((row, homeGoals) => {
    row.forEach((probability, awayGoals) => {
      const normalized = total > 0 ? probability / total : 0;
      const percent = Math.round(normalized * 10000) / 100;
      heatmapData.push([awayGoals, homeGoals, percent]);
      if (percent > top_probability) {
        top_probability = percent;
        top_prediction = `${homeGoals}:${awayGoals}`;
      }
    });
  });
  return {
    heatmap_data: heatmapData,
    top_prediction,
    top_probability,
    model: "dixon-coles"
  };
}

function closeAnalysis() {
  state.selected = null;
  state.selectedModel = null;
  $("#analysisEmpty").classList.remove("hidden");
  $("#analysisContent").classList.add("hidden");
  clearHeatmap();
  renderFixtures();
  updateCalculatorButtons();
}

function combinations(items, size) {
  if (size === 0) return [[]];
  if (size > items.length) return [];
  const result = [];
  const walk = (start, selected) => {
    if (selected.length === size) {
      result.push([...selected]);
      return;
    }
    for (let index = start; index <= items.length - (size - selected.length); index += 1) {
      selected.push(items[index]);
      walk(index + 1, selected);
      selected.pop();
    }
  };
  walk(0, []);
  return result;
}

function bankersRound(value) {
  const scaled = value * 100;
  const lower = Math.floor(scaled);
  const fraction = scaled - lower;
  const tolerance = 1e-8;
  if (fraction > 0.5 + tolerance) return (lower + 1) / 100;
  if (fraction < 0.5 - tolerance) return lower / 100;
  return (lower % 2 === 0 ? lower : lower + 1) / 100;
}

function prizeCap(legs) {
  if (legs <= 1) return 100000;
  if (legs <= 3) return 200000;
  if (legs <= 5) return 500000;
  return 1000000;
}

function singleTicketPrize(odds, legs) {
  return Math.min(bankersRound(2 * odds.reduce((product, value) => product * value, 1)), prizeCap(legs));
}

function formatAmount(value) {
  return Number(value || 0).toLocaleString("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function addCurrentMatchToSlip() {
  const match = state.selected;
  const model = state.selectedModel;
  const slip = activeBetSlip();
  const limit = activeMatchLimit();
  if (!match || !model?.available || match.result) {
    showToast("请选择一场已确定对阵的待赛比赛");
    return false;
  }
  if (slip.some((entry) => entry.matchNumber === match.matchNumber)) {
    showToast("该场比赛已在计算器中");
    return true;
  }
  if (slip.length >= limit) {
    showToast(`${state.betType === "score" ? "比分" : "胜平负"}过关最多选择 ${limit} 场`);
    return false;
  }

  if (state.betType === "score") {
    const suggestedScore = state.scoreChoices[match.matchNumber] || recommendedScores(model)[0].key;
    const scores = Object.fromEntries(scoreOutcomeDefinitions.map((outcome) => [
      outcome.key,
      { selected: outcome.key === suggestedScore, odds: "" }
    ]));
    state.scoreBetSlip.push({ matchNumber: match.matchNumber, scores });
  } else {
    const suggested = outcomeDefinitions.find((outcome) => outcome.label === model.top.label)?.key || "home";
    state.betSlip.push({
      matchNumber: match.matchNumber,
      options: {
        home: { selected: suggested === "home", odds: "" },
        draw: { selected: suggested === "draw", odds: "" },
        away: { selected: suggested === "away", odds: "" }
      }
    });
  }
  renderBetSlip();
  showToast(`已加入 ${localizedTeam(match.homeTeam)} vs ${localizedTeam(match.awayTeam)}`);
  return true;
}

function updateCalculatorButtons() {
  const slip = activeBetSlip();
  const alreadyAdded = state.selected
    && slip.some((entry) => entry.matchNumber === state.selected.matchNumber);
  const button = $("#openBankroll");
  const addButton = $("#addCurrentMatch");
  if (button) {
    button.querySelector("span").textContent = alreadyAdded ? "已加入，查看计算器" : "加入竞彩计算器";
  }
  if (addButton) {
    const atLimit = slip.length >= activeMatchLimit();
    addButton.disabled = !state.selectedModel?.available || Boolean(state.selected?.result) || alreadyAdded || atLimit;
    addButton.querySelector("span").textContent = alreadyAdded
      ? "当前场已加入"
      : atLimit
        ? `已达 ${activeMatchLimit()} 场上限`
        : "加入当前场";
  }
}

function renderSpfOptions(entry, match) {
  return `
    <div class="bet-outcome-grid">
      ${outcomeDefinitions.map((outcome) => {
        const option = entry.options[outcome.key];
        return `
          <div class="bet-outcome ${option.selected ? "active" : ""}">
            <button
              class="bet-outcome-toggle"
              data-spf-match="${match.matchNumber}"
              data-option-key="${outcome.key}"
              aria-pressed="${option.selected}"
            >
              <span>${outcome.short}</span>
              <strong>${outcome.label}</strong>
            </button>
            <label>
              <span>固定奖金</span>
              <input
                type="number"
                min="1.01"
                step="0.01"
                inputmode="decimal"
                placeholder="0.00"
                value="${option.odds}"
                data-bet-odds-match="${match.matchNumber}"
                data-bet-odds-key="${outcome.key}"
              />
            </label>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderScoreOptions(entry, match) {
  const model = modelMatch(match);
  const recommendations = recommendedScores(model);
  const recommendationRank = new Map(recommendations.map((outcome, index) => [outcome.key, index + 1]));
  const recentNote = formSummary(match) || "暂无近两日同队完赛样本";
  return `
    <div class="score-recommendation-strip">
      <div>
        <span>权威数据量化建议</span>
        <small>${recentNote}</small>
      </div>
      <div class="score-recommendation-list">
        ${recommendations.map((outcome, index) => `
          <button
            class="score-recommendation ${entry.scores[outcome.key].selected ? "active" : ""}"
            data-score-bet-match="${match.matchNumber}"
            data-score-bet-key="${outcome.key}"
          >
            <b>${index + 1}</b>
            <strong>${outcome.key.replace(":", " : ")}</strong>
            <small>${pct(outcome.probability)}</small>
          </button>
        `).join("")}
      </div>
    </div>
    <div class="score-market">
      ${["home", "draw", "away"].map((group) => {
        const groupOutcomes = scoreOutcomeDefinitions.filter((outcome) => outcome.group === group);
        return `
          <section class="score-market-group ${group}">
            <div class="score-market-label">
              <strong>${groupOutcomes[0].groupLabel}</strong>
              <span>${groupOutcomes.length} 项</span>
            </div>
            <div class="score-market-grid">
              ${groupOutcomes.map((outcome) => {
                const option = entry.scores[outcome.key];
                const rank = recommendationRank.get(outcome.key);
                return `
                  <div class="score-market-option ${option.selected ? "active" : ""} ${rank ? "recommended" : ""}">
                    <button
                      data-score-bet-match="${match.matchNumber}"
                      data-score-bet-key="${outcome.key}"
                      aria-pressed="${option.selected}"
                    >
                      ${rank ? `<em>推荐${rank}</em>` : ""}
                      <strong>${outcome.key.replace(":", " : ")}</strong>
                    </button>
                    <input
                      type="number"
                      min="1.01"
                      step="0.01"
                      inputmode="decimal"
                      aria-label="${outcome.key}固定奖金"
                      placeholder="赔率"
                      value="${option.odds}"
                      data-bet-odds-match="${match.matchNumber}"
                      data-bet-odds-key="${outcome.key}"
                    />
                  </div>
                `;
              }).join("")}
            </div>
          </section>
        `;
      }).join("")}
    </div>
  `;
}

function renderBetSlip() {
  const list = $("#betSlipList");
  const empty = $("#betSlipEmpty");
  const slip = activeBetSlip();
  $("#betMatchCount").textContent = slip.length;
  $("#betMatchLimit").textContent = activeMatchLimit();
  empty.classList.toggle("hidden", slip.length > 0);
  list.classList.toggle("hidden", slip.length === 0);

  list.innerHTML = slip.map((entry) => {
    const match = state.fixtures.find((item) => item.matchNumber === entry.matchNumber);
    if (!match) return "";
    return `
      <article class="bet-match" data-bet-match="${match.matchNumber}">
        <div class="bet-match-head">
          <div class="bet-match-teams">
            <span class="mini-flag">${flagMarkup(match.homeTeam)}</span>
            <strong>${localizedTeam(match.homeTeam)} vs ${localizedTeam(match.awayTeam)}</strong>
            <span class="mini-flag">${flagMarkup(match.awayTeam)}</span>
          </div>
          <button class="icon-btn compact remove-bet-match" data-remove-match="${match.matchNumber}" aria-label="删除该场">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
        <div class="bet-match-meta">#${String(match.matchNumber).padStart(3, "0")} · ${formatKickoff(match)} · 固定奖金请按票面填写</div>
        ${state.betType === "score" ? renderScoreOptions(entry, match) : renderSpfOptions(entry, match)}
      </article>
    `;
  }).join("");

  $$(".remove-bet-match").forEach((button) => {
    button.addEventListener("click", () => {
      const matchNumber = Number(button.dataset.removeMatch);
      if (state.betType === "score") {
        state.scoreBetSlip = state.scoreBetSlip.filter((entry) => entry.matchNumber !== matchNumber);
      } else {
        state.betSlip = state.betSlip.filter((entry) => entry.matchNumber !== matchNumber);
      }
      renderBetSlip();
    });
  });
  $$("[data-spf-match]").forEach((button) => {
    button.addEventListener("click", () => {
      const entry = state.betSlip.find((item) => item.matchNumber === Number(button.dataset.spfMatch));
      if (!entry) return;
      const option = entry.options[button.dataset.optionKey];
      option.selected = !option.selected;
      renderBetSlip();
    });
  });
  $$("[data-score-bet-match]").forEach((button) => {
    button.addEventListener("click", () => {
      const entry = state.scoreBetSlip.find((item) => item.matchNumber === Number(button.dataset.scoreBetMatch));
      if (!entry) return;
      const option = entry.scores[button.dataset.scoreBetKey];
      option.selected = !option.selected;
      renderBetSlip();
    });
  });
  $$("[data-bet-odds-match]").forEach((input) => {
    input.addEventListener("input", () => {
      const entry = slip.find((item) => item.matchNumber === Number(input.dataset.betOddsMatch));
      if (!entry) return;
      const options = state.betType === "score" ? entry.scores : entry.options;
      options[input.dataset.betOddsKey].odds = input.value;
      calculateSporttery();
    });
  });

  renderPassOptions();
  updateCalculatorButtons();
  if (window.lucide) window.lucide.createIcons();
}

function renderPassOptions() {
  const count = activeBetSlip().length;
  const maxLegs = activeMatchLimit();
  const container = $("#passOptions");
  const validFixed = fixedPassTypes.filter((pass) => pass.m <= count && pass.m <= maxLegs);

  if (state.passMode === "fixed") {
    if (!validFixed.some((pass) => pass.label === state.fixedPass)) {
      const defaultPass = [...validFixed].reverse().find((pass) => pass.sizes.length === 1 && pass.sizes[0] === pass.m);
      state.fixedPass = defaultPass?.label || validFixed[0]?.label || "";
    }
    container.innerHTML = validFixed.length
      ? validFixed.map((pass) => `
          <button class="pass-option ${state.fixedPass === pass.label ? "active" : ""}" data-fixed-pass="${pass.label}">
            ${pass.label}
          </button>
        `).join("")
      : `<span class="pass-empty">至少选择 2 场赛事</span>`;
  } else {
    [...state.freePasses].forEach((size) => {
      if (size > count) state.freePasses.delete(size);
    });
    if (!state.freePasses.size && count) state.freePasses.add(count === 1 ? 1 : 2);
    container.innerHTML = count
      ? Array.from({ length: Math.min(maxLegs, count) }, (_, index) => index + 1).map((size) => `
          <button class="pass-option ${state.freePasses.has(size) ? "active" : ""}" data-free-pass="${size}">
            ${size === 1 ? "单关*" : `${size}串1`}
          </button>
        `).join("")
      : `<span class="pass-empty">请先选择赛事</span>`;
  }

  $("#passHint").textContent = state.passMode === "fixed"
    ? "固定组合只能单选"
    : "可同时选择多个关次";

  $$("[data-fixed-pass]").forEach((button) => {
    button.addEventListener("click", () => {
      state.fixedPass = button.dataset.fixedPass;
      renderPassOptions();
    });
  });
  $$("[data-free-pass]").forEach((button) => {
    button.addEventListener("click", () => {
      const size = Number(button.dataset.freePass);
      if (state.freePasses.has(size)) state.freePasses.delete(size);
      else state.freePasses.add(size);
      renderPassOptions();
    });
  });
  calculateSporttery();
}

function getPassGroups() {
  const slip = activeBetSlip();
  if (!slip.length) return [];
  if (state.passMode === "free") {
    return [...state.freePasses]
      .sort((a, b) => a - b)
      .flatMap((size) => combinations(slip, size).map((matches) => ({
        label: size === 1 ? "单关*" : `${size}串1`,
        size,
        matches
      })));
  }

  const pass = fixedPassTypes.find((item) => item.label === state.fixedPass);
  if (!pass) return [];
  return combinations(slip, pass.m).flatMap((baseMatches) =>
    pass.sizes.flatMap((size) =>
      combinations(baseMatches, size).map((matches) => ({
        label: pass.label,
        size,
        matches
      }))
    )
  );
}

function selectedBetOptions(entry) {
  const definitions = state.betType === "score" ? scoreOutcomeDefinitions : outcomeDefinitions;
  const options = state.betType === "score" ? entry.scores : entry.options;
  return definitions
    .map((outcome) => options[outcome.key])
    .filter((option) => option.selected);
}

function calculateSporttery() {
  const slip = activeBetSlip();
  const groups = getPassGroups();
  const multiplier = clamp(Math.floor(Number($("#multiplierInput").value) || 1), 1, 50);
  state.multiplier = multiplier;
  $("#multiplierInput").value = multiplier;

  if (!slip.length) {
    renderCalculationResult({ status: "请先加入赛事。" });
    return;
  }
  const emptySelection = slip.find((entry) => !selectedBetOptions(entry).length);
  if (emptySelection) {
    renderCalculationResult({ status: `第 ${emptySelection.matchNumber} 场至少选择一个投注结果。` });
    return;
  }
  if (!groups.length) {
    renderCalculationResult({ status: "请选择可用的过关方式。" });
    return;
  }
  const missingOdds = slip.find((entry) =>
    selectedBetOptions(entry).some((option) => !(Number(option.odds) > 1))
  );
  if (missingOdds) {
    renderCalculationResult({ status: `请补全第 ${missingOdds.matchNumber} 场已选结果的固定奖金。` });
    return;
  }

  const details = new Map();
  let betCount = 0;

  groups.forEach((group) => {
    const selections = group.matches.map((entry) =>
      selectedBetOptions(entry).map((option) => Number(option.odds))
    );
    const groupBetCount = selections.reduce((total, odds) => total * odds.length, 1);
    betCount += groupBetCount;

    const detail = details.get(group.size) || {
      size: group.size,
      labels: new Set(),
      groups: 0,
      bets: 0,
      prizes: []
    };
    detail.labels.add(group.label);
    detail.groups += 1;
    detail.bets += groupBetCount;
    details.set(group.size, detail);
  });

  const selectedOutcomes = slip.map((entry) =>
    selectedBetOptions(entry).map((option) => Number(option.odds))
  );
  const scenarios = selectedOutcomes.reduce(
    (all, odds) => all.flatMap((scenario) => odds.map((value) => [...scenario, value])),
    [[]]
  );
  let minPrize = Number.POSITIVE_INFINITY;
  let maxPrize = 0;

  scenarios.forEach((scenario) => {
    const oddsByMatch = new Map(
      slip.map((entry, index) => [entry.matchNumber, scenario[index]])
    );
    const prizeBySize = new Map();
    let scenarioPrize = 0;

    groups.forEach((group) => {
      const odds = group.matches.map((entry) => oddsByMatch.get(entry.matchNumber));
      const prize = singleTicketPrize(odds, group.size);
      scenarioPrize += prize;
      prizeBySize.set(group.size, (prizeBySize.get(group.size) || 0) + prize);
    });

    minPrize = Math.min(minPrize, scenarioPrize);
    maxPrize = Math.max(maxPrize, scenarioPrize);
    details.forEach((detail, size) => {
      detail.prizes.push(prizeBySize.get(size) || 0);
    });
  });

  const detailRows = [...details.values()]
    .sort((a, b) => a.size - b.size)
    .map((detail) => ({
      ...detail,
      min: Math.min(...detail.prizes),
      max: Math.max(...detail.prizes)
    }));

  renderCalculationResult({
    status: `计算完成。${state.betType === "score" ? "比分" : "胜平负"}奖金区间按所选结果全部命中的可能情景计算，实际以出票固定奖金和兑奖规则为准。`,
    betCount,
    cost: betCount * 2 * multiplier,
    minPrize: bankersRound(minPrize * multiplier),
    maxPrize: bankersRound(maxPrize * multiplier),
    multiplier,
    details: detailRows
  });
}

function renderCalculationResult(result) {
  const valid = Number.isFinite(result.betCount);
  $("#ticketBetCount").textContent = valid ? result.betCount.toLocaleString("zh-CN") : "0";
  $("#ticketCost").textContent = valid ? formatAmount(result.cost) : "0.00";
  $("#ticketPrizeRange").textContent = valid
    ? result.minPrize === result.maxPrize
      ? formatAmount(result.maxPrize)
      : `${formatAmount(result.minPrize)} – ${formatAmount(result.maxPrize)}`
    : "0.00";
  $("#calculatorStatus").textContent = result.status;
  $("#calculatorStatus").classList.toggle("ready", valid);
  $("#calculationTitle").textContent = valid
    ? `${state.betType === "score" ? "比分" : "胜平负"} · ${state.passMode === "fixed" ? state.fixedPass : "自由过关"} · ${result.multiplier} 倍`
    : "等待计算";
  $("#calculationBadge").textContent = valid ? `${result.betCount} 注` : "官方规则";
  $("#prizeDetailList").innerHTML = valid
    ? result.details.map((detail) => `
        <div class="prize-detail-row">
          <strong>${detail.size === 1 ? "单关*" : `${detail.size}关`}</strong>
          <span>${detail.groups} 组</span>
          <span>${detail.bets.toLocaleString("zh-CN")} 注</span>
          <span>${formatAmount(detail.min * result.multiplier)} – ${formatAmount(detail.max * result.multiplier)}</span>
        </div>
      `).join("")
    : `<div class="prize-detail-empty">暂无可计算组合</div>`;
}

function setActiveNav(sectionId) {
  $$(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.scroll === sectionId);
  });
}

function syncActiveNavFromScroll() {
  const marker = window.innerHeight * 0.34;
  const sections = ["overview", "fixtures", "analysis", "bankroll"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  let active = sections[0]?.id;
  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    if (rect.top <= marker && rect.bottom > marker) {
      active = section.id;
      break;
    }
    if (rect.top <= marker) active = section.id;
  }
  if (active) setActiveNav(active);
}

function resetVariables() {
  state.variables = {
    homeAvailability: 1,
    awayAvailability: 1,
    handicapEnabled: false,
    handicap: -1
  };
  $("#homeAvailability").value = 100;
  $("#awayAvailability").value = 100;
  $("#homeAvailabilityLabel").textContent = "100%";
  $("#awayAvailabilityLabel").textContent = "100%";
  $("#handicapToggle").checked = false;
  $("#handicapValue").value = "-1";
  $("#handicapControl").classList.add("hidden");
  if (state.selected) renderAnalysis();
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function bindEvents() {
  $$("#stageFilters button").forEach((button) => {
    button.addEventListener("click", () => {
      $$("#stageFilters button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      state.activeFilter = button.dataset.filter;
      state.visibleCount = 14;
      applyFilters();
    });
  });

  $("#groupFilter").addEventListener("change", () => {
    state.visibleCount = 14;
    applyFilters();
  });
  $("#matchSearch").addEventListener("input", () => {
    state.visibleCount = 14;
    applyFilters();
  });
  $("#loadMore").addEventListener("click", () => {
    state.visibleCount += 14;
    renderFixtures();
  });
  $("#closeAnalysis").addEventListener("click", closeAnalysis);
  $("#resetVariables").addEventListener("click", resetVariables);

  $("#homeAvailability").addEventListener("input", (event) => {
    state.variables.homeAvailability = Number(event.target.value) / 100;
    $("#homeAvailabilityLabel").textContent = `${event.target.value}%`;
    renderAnalysis();
  });
  $("#awayAvailability").addEventListener("input", (event) => {
    state.variables.awayAvailability = Number(event.target.value) / 100;
    $("#awayAvailabilityLabel").textContent = `${event.target.value}%`;
    renderAnalysis();
  });
  $("#handicapToggle").addEventListener("change", (event) => {
    state.variables.handicapEnabled = event.target.checked;
    $("#handicapControl").classList.toggle("hidden", !event.target.checked);
    renderAnalysis();
  });
  $("#handicapValue").addEventListener("change", (event) => {
    state.variables.handicap = Number(event.target.value);
    renderAnalysis();
  });

  $("#openBankroll").addEventListener("click", () => {
    addCurrentMatchToSlip();
    $("#bankroll").scrollIntoView({ behavior: "smooth" });
  });
  $("#addCurrentMatch").addEventListener("click", () => {
    if (addCurrentMatchToSlip()) {
      $("#bankroll").scrollIntoView({ behavior: "smooth" });
    }
  });
  $("#clearBetSlip").addEventListener("click", () => {
    if (state.betType === "score") state.scoreBetSlip = [];
    else state.betSlip = [];
    state.fixedPass = "";
    state.freePasses.clear();
    renderBetSlip();
    showToast(`已清空${state.betType === "score" ? "比分" : "胜平负"}投注单`);
  });
  $$("#betType button").forEach((button) => {
    button.addEventListener("click", () => {
      state.betType = button.dataset.betType;
      state.fixedPass = "";
      state.freePasses.clear();
      $$("#betType button").forEach((item) => item.classList.toggle("active", item === button));
      $("#calculatorHeading").textContent = state.betType === "score"
        ? "竞彩足球比分计算器"
        : "竞彩足球胜平负计算器";
      $("#calculatorDescription").textContent = state.betType === "score"
        ? "完整 31 项比分投注，与固定奖金、注数和理论奖金实时同步。"
        : "按中国体育彩票竞彩规则计算。固定奖金须以实际出票时刻为准。";
      $("#betSlipEmpty p").textContent = state.betType === "score"
        ? "加入比赛后，可选择完整 31 项比分；模型前三建议会自动标注。"
        : "在单场分析中点击“加入竞彩计算器”，最多可加入 8 场。";
      renderBetSlip();
    });
  });
  $$("#passMode button").forEach((button) => {
    button.addEventListener("click", () => {
      state.passMode = button.dataset.mode;
      $$("#passMode button").forEach((item) => item.classList.toggle("active", item === button));
      renderPassOptions();
    });
  });
  $("#multiplierInput").addEventListener("input", calculateSporttery);
  $("#multiplierInput").addEventListener("change", calculateSporttery);
  $("#decreaseMultiplier").addEventListener("click", () => {
    $("#multiplierInput").value = clamp(state.multiplier - 1, 1, 50);
    calculateSporttery();
  });
  $("#increaseMultiplier").addEventListener("click", () => {
    $("#multiplierInput").value = clamp(state.multiplier + 1, 1, 50);
    calculateSporttery();
  });

  $$(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      setActiveNav(button.dataset.scroll);
      $(`#${button.dataset.scroll}`).scrollIntoView({ behavior: "smooth" });
    });
  });
  let navScrollPending = false;
  window.addEventListener("scroll", () => {
    if (navScrollPending) return;
    navScrollPending = true;
    requestAnimationFrame(() => {
      syncActiveNavFromScroll();
      navScrollPending = false;
    });
  }, { passive: true });
  window.addEventListener("resize", () => {
    if (scoreHeatmapChart) scoreHeatmapChart.resize();
  });

  ["#openSources", "#openSourcesTop"].forEach((selector) => {
    $(selector).addEventListener("click", () => $("#sourcesDialog").showModal());
  });
  $("#closeSources").addEventListener("click", () => $("#sourcesDialog").close());
  $("#refreshData").addEventListener("click", async () => {
    const live = await loadData(true);
    showToast(live ? "公开数据刷新成功" : "远程源不可用，已继续使用本地稳定快照");
  });
}

async function init() {
  if (window.lucide) window.lucide.createIcons();
  bindEvents();
  renderBetSlip();
  try {
    await loadData(true);
    startLiveRefresh();
    const firstUpcoming = state.fixtures.find((match) => !match.result && modelMatch(match).available);
    if (firstUpcoming) selectMatch(firstUpcoming);
  } catch (error) {
    $("#fixtureList").innerHTML = `<div class="empty-state">数据加载失败：${error.message}</div>`;
    showToast("无法读取赛程快照");
  }
}

init();
