export type BirthInput = {
  name: string;
  dateOfBirth: Date;
  timeOfBirth: string;
  latitude: number;
  longitude: number;
  timeZone: string;
};

type JsonObject = Record<string, unknown>;

function providerConfig() {
  const apiKey = process.env.KUNDLI_API_KEY;
  const baseUrl = process.env.KUNDLI_API_BASE_URL || "https://kundliapi.com";
  if (!apiKey) throw new Error("Kundli API is not configured");
  return { apiKey, baseUrl: baseUrl.replace(/\/$/, "") };
}

export function astrologyProviderConfigured(): boolean {
  return Boolean(process.env.KUNDLI_API_KEY);
}

function timezoneOffsetHours(timeZone: string, date: Date): number {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const representedAsUtc = Date.UTC(
    Number(values.year), Number(values.month) - 1, Number(values.day),
    Number(values.hour), Number(values.minute), Number(values.second),
  );
  return (representedAsUtc - date.getTime()) / 3_600_000;
}

function requestBody(input: BirthInput) {
  const [hour, min] = input.timeOfBirth.split(":").map(Number);
  return {
    name: input.name,
    day: input.dateOfBirth.getUTCDate(),
    month: input.dateOfBirth.getUTCMonth() + 1,
    year: input.dateOfBirth.getUTCFullYear(),
    hour,
    min,
    lat: input.latitude,
    lon: input.longitude,
    tzone: timezoneOffsetHours(input.timeZone, input.dateOfBirth),
    lang: "en",
    labelLang: "en",
  };
}

async function callProvider(path: string, body: JsonObject): Promise<JsonObject> {
  const config = providerConfig();
  const response = await fetch(`${config.baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Api-Key": config.apiKey },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(20_000),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Kundli API request failed (${response.status})`);
  const json = await response.json();
  if (!json || typeof json !== "object") throw new Error("Kundli API returned invalid JSON");
  return json as JsonObject;
}

function nestedObject(value: unknown): JsonObject {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const object = value as JsonObject;
  return object.data && typeof object.data === "object" && !Array.isArray(object.data)
    ? object.data as JsonObject
    : object;
}

function arrayAt(object: JsonObject, keys: string[]): JsonObject[] {
  for (const key of keys) {
    const value = object[key];
    if (Array.isArray(value)) return value.filter((item): item is JsonObject => Boolean(item) && typeof item === "object");
  }
  return [];
}

function text(value: unknown, fallback = "Unknown"): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

const PLANET_NAMES: Record<string, string> = {
  Su: "Sun", Mo: "Moon", Ma: "Mars", Me: "Mercury", Ju: "Jupiter",
  Ve: "Venus", Sa: "Saturn", Ra: "Rahu", Ke: "Ketu",
};

export async function generateVedicChart(input: BirthInput) {
  const body = requestBody(input);
  const [astroRaw, planetsRaw, chartRaw] = await Promise.all([
    callProvider("/v1/astro/get_astro_data", body),
    callProvider("/v1/planet/get_all_planet_data", body),
    callProvider("/v1/chart/get_lagna_chart", body),
  ]);
  const astro = nestedObject(astroRaw);
  const planetsObject = nestedObject(planetsRaw);
  const chartObject = nestedObject(chartRaw);
  const chartData = nestedObject(chartObject.chartData || chartObject);
  const planets = arrayAt(planetsObject, ["planets", "planetData", "data"]);
  const chart = arrayAt(chartData, ["chart", "houses"]);
  const sun = planets.find((planet) => text(planet.name, "") === "Sun");
  const moon = planets.find((planet) => text(planet.name, "") === "Moon");
  const ascendant = nestedObject(astro.ascendant || planetsObject.ascendant);

  const houses = chart.length > 0
    ? chart.map((house, index) => ({
        house: typeof house.house === "number" ? house.house : index + 1,
        sign: text(house.rashi || house.sign),
        grahas: arrayAt(house, ["planets"]).map((planet) => {
          const name = text(planet.name);
          return PLANET_NAMES[name] || name;
        }).concat(house.ascendant === true ? ["Ascendant"] : []),
      }))
    : Array.from({ length: 12 }, (_, index) => ({
        house: index + 1,
        sign: "Unknown",
        grahas: planets
          .filter((planet) => Number(planet.house) === index + 1)
          .map((planet) => text(planet.name)),
      }));

  return {
    sunSign: text(sun?.sign || astro.sun_sign || astro.sunSign),
    moonSign: text(moon?.sign || astro.moon_sign || astro.moonSign || astro.rashi),
    ascendant: text(ascendant.sign || ascendant.rashi || astro.ascendant_sign || astro.ascendant),
    nakshatra: text(moon?.nakshatra || astro.nakshatra),
    houses,
    generatedFor: input.name,
    chartType: "vedic" as const,
    provenance: { provider: "kundliapi.com", calculatedAt: new Date().toISOString(), engineVersion: "v1" },
    providerData: { astro: astroRaw, planets: planetsRaw, chart: chartRaw },
  };
}

export async function calculateVedicCompatibility(first: BirthInput, second: BirthInput) {
  const raw = await callProvider("/v1/kundali/match", {
    boy: requestBody(first),
    girl: requestBody(second),
  });
  const data = nestedObject(raw);
  const scoreValue = data.total_score ?? data.totalScore ?? data.score ?? data.total;
  const totalScore = typeof scoreValue === "number" ? scoreValue : Number(scoreValue);
  if (!Number.isFinite(totalScore)) throw new Error("Kundli API returned an invalid compatibility score");
  const categorySource = nestedObject(data.categories || data.guna_milan || data.ashtakoota || data);
  const definitions = [
    ["Varna", 1, ["varna"]], ["Vashya", 2, ["vashya"]], ["Tara", 3, ["tara"]],
    ["Yoni", 4, ["yoni"]], ["Maitri", 5, ["maitri", "graha_maitri"]],
    ["Gana", 6, ["gana"]], ["Bhakoot", 7, ["bhakoot"]], ["Nadi", 8, ["nadi"]],
  ] as const;
  const categories = definitions.map(([name, maxScore, keys]) => {
    const rawCategory = keys.map((key) => categorySource[key]).find((value) => value !== undefined);
    const object = nestedObject(rawCategory);
    const value = typeof rawCategory === "number" ? rawCategory : object.score ?? object.obtained ?? 0;
    return {
      name,
      maxScore,
      score: Math.max(0, Math.min(maxScore, Number(value) || 0)),
      description: text(object.description, `${name} compatibility`),
    };
  });
  return { overallScore: Math.round((totalScore / 36) * 1000) / 10, categories, providerData: raw };
}

function stripHtml(value: unknown): string {
  return text(value, "No guidance available").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateSignPrediction(sign: string, type: "daily" | "weekly" | "monthly") {
  const normalizedSign = sign.replace(/\s*\(.+\)$/, "").trim().toLowerCase();
  const raw = await callProvider("/v1/horoscope/get_horoscope", { sign: normalizedSign, lang: "en" });
  const data = nestedObject(raw);
  const horoscope = nestedObject(data.horoscope || data);
  const categories = nestedObject(horoscope.categories);
  const tags = nestedObject(horoscope[`${type}tag`]);
  const scores = Object.values(tags).map(Number).filter(Number.isFinite);
  const average = scores.length ? scores.reduce((sum, value) => sum + value, 0) / scores.length : 60;
  return {
    summary: stripHtml(horoscope[type] || categories.general),
    health: stripHtml(categories.health),
    career: stripHtml(categories.career || categories.business),
    love: stripHtml(categories.love),
    finance: stripHtml(categories.finance || categories.wealth),
    luckyColor: text(horoscope.luckyColor || horoscope.lucky_color, "Not provided"),
    luckyNumber: Number(horoscope.luckyNumber || horoscope.lucky_number) || 0,
    luckyDirection: text(horoscope.luckyDirection || horoscope.lucky_direction, "Not provided"),
    overallRating: Math.max(1, Math.min(5, Math.round(average / 20))),
    provenance: { provider: "kundliapi.com", calculatedAt: new Date().toISOString(), engineVersion: "v1" },
  };
}
