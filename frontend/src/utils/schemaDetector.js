// ============================================================
// InsightFlow - Dynamic CSV Schema Detector
// ============================================================

const METRIC_KEYWORDS = [
  "sales",
  "sale",
  "revenue",
  "total revenue",
  "net revenue",
  "net sales",
  "amount",
  "total amount",
  "order amount",
  "transaction amount",
  "transaction value",
  "value",
  "income",
  "profit",
  "price",
  "total",
  "earnings",
];

const DATE_KEYWORDS = [
  "date",
  "datetime",
  "timestamp",
  "time",
  "order date",
  "sale date",
  "sales date",
  "transaction date",
  "purchase date",
  "created at",
  "created date",
];

const CATEGORY_KEYWORDS = [
  "category",
  "product",
  "product name",
  "product category",
  "item",
  "item name",
  "type",
  "segment",
  "region",
  "area",
  "territory",
  "city",
  "state",
  "country",
  "department",
  "salesperson",
  "customer",
  "customer name",
  "brand",
  "status",
];

const ID_KEYWORDS = [
  "id",
  "identifier",
  "uuid",
  "code",
  "number",
  "no",
];

export function normalizeKey(key) {
  return String(key || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

export function parseNumeric(value) {
  if (
    value === null ||
    value === undefined ||
    String(value).trim() === ""
  ) {
    return null;
  }

  // Handle values such as:
  // ₹1,250
  // $1,250.50
  // 1,250
  // 25%
  const cleaned = String(value)
    .trim()
    .replace(/,/g, "")
    .replace(/[₹$€£¥]/g, "")
    .replace(/\s/g, "");

  const number = Number(cleaned);

  return Number.isFinite(number) ? number : null;
}

export function isNumericValue(value) {
  return parseNumeric(value) !== null;
}

export function isDateLike(value) {
  if (
    value === null ||
    value === undefined ||
    String(value).trim() === ""
  ) {
    return false;
  }

  const text = String(value).trim();

  // Don't treat ordinary numbers as dates.
  if (/^\d+(\.\d+)?$/.test(text)) {
    return false;
  }

  const timestamp = Date.parse(text);

  return !Number.isNaN(timestamp);
}

function getNonEmptyValues(data, key) {
  return data
    .map((row) => row?.[key])
    .filter(
      (value) =>
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
    );
}

function keywordScore(key, keywords) {
  const normalized = normalizeKey(key);

  if (keywords.includes(normalized)) {
    return 100;
  }

  let score = 0;

  for (const keyword of keywords) {
    if (
      normalized.includes(keyword) ||
      keyword.includes(normalized)
    ) {
      score = Math.max(score, 70);
    }
  }

  return score;
}

function numericRatio(data, key) {
  const values = getNonEmptyValues(data, key);

  if (!values.length) {
    return 0;
  }

  const numericCount = values.filter(isNumericValue).length;

  return numericCount / values.length;
}

function dateRatio(data, key) {
  const values = getNonEmptyValues(data, key);

  if (!values.length) {
    return 0;
  }

  const dateCount = values.filter(isDateLike).length;

  return dateCount / values.length;
}

function uniqueRatio(data, key) {
  const values = getNonEmptyValues(data, key).map((value) =>
    String(value).trim()
  );

  if (!values.length) {
    return 0;
  }

  return new Set(values).size / values.length;
}

function getColumnStats(data, key) {
  const values = getNonEmptyValues(data, key);

  const numeric = values.filter(isNumericValue).length;
  const dates = values.filter(isDateLike).length;

  return {
    key,
    total: data.length,
    nonEmpty: values.length,
    numericCount: numeric,
    dateCount: dates,
    numericRatio: values.length ? numeric / values.length : 0,
    dateRatio: values.length ? dates / values.length : 0,
    uniqueCount: new Set(values.map(String)).size,
    uniqueRatio: uniqueRatio(data, key),
  };
}

// ============================================================
// Detect numeric metric
// ============================================================

export function detectMetricKey(data = []) {
  if (!data.length) {
    return null;
  }

  const keys = Object.keys(data[0] || {});

  if (!keys.length) {
    return null;
  }

  const candidates = keys
    .map((key) => {
      const stats = getColumnStats(data, key);

      let score = 0;

      score += keywordScore(key, METRIC_KEYWORDS);

      // Strongly prefer numeric columns.
      if (stats.numericRatio >= 0.9) {
        score += 60;
      } else if (stats.numericRatio >= 0.7) {
        score += 40;
      } else if (stats.numericRatio >= 0.5) {
        score += 20;
      } else {
        score -= 100;
      }

      // Dates shouldn't be selected as metrics.
      if (stats.dateRatio >= 0.8) {
        score -= 100;
      }

      // IDs should generally not become metrics.
      const normalized = normalizeKey(key);

      if (
        ID_KEYWORDS.some((keyword) =>
          normalized === keyword ||
          normalized.endsWith(` ${keyword}`)
        )
      ) {
        score -= 40;
      }

      return {
        key,
        score,
        stats,
      };
    })
    .sort((a, b) => b.score - a.score);

  return candidates[0]?.stats.numericRatio >= 0.5
    ? candidates[0].key
    : null;
}

// ============================================================
// Detect date column
// ============================================================

export function detectDateKey(data = []) {
  if (!data.length) {
    return null;
  }

  const keys = Object.keys(data[0] || {});

  const candidates = keys
    .map((key) => {
      const stats = getColumnStats(data, key);

      let score = keywordScore(key, DATE_KEYWORDS);

      if (stats.dateRatio >= 0.9) {
        score += 80;
      } else if (stats.dateRatio >= 0.7) {
        score += 50;
      } else if (stats.dateRatio >= 0.5) {
        score += 25;
      }

      if (stats.numericRatio >= 0.9) {
        score -= 80;
      }

      return {
        key,
        score,
        stats,
      };
    })
    .sort((a, b) => b.score - a.score);

  const best = candidates[0];

  if (!best || best.stats.dateRatio < 0.5) {
    return null;
  }

  return best.key;
}

// ============================================================
// Detect categorical column
// ============================================================

export function detectCategoryKey(
  data = [],
  metricKey = null,
  dateKey = null
) {
  if (!data.length) {
    return null;
  }

  const keys = Object.keys(data[0] || {});

  const candidates = keys
    .filter(
      (key) =>
        key !== metricKey &&
        key !== dateKey
    )
    .map((key) => {
      const stats = getColumnStats(data, key);

      let score = keywordScore(
        key,
        CATEGORY_KEYWORDS
      );

      // Categorical columns should not be mostly numeric.
      if (stats.numericRatio >= 0.8) {
        score -= 100;
      }

      // Avoid columns with nearly every row unique.
      if (
        stats.uniqueRatio > 0.95 &&
        stats.uniqueCount > 20
      ) {
        score -= 50;
      }

      // Prefer useful categorical cardinality.
      if (
        stats.uniqueCount >= 2 &&
        stats.uniqueCount <= 20
      ) {
        score += 25;
      }

      return {
        key,
        score,
        stats,
      };
    })
    .sort((a, b) => b.score - a.score);

  const best = candidates[0];

  if (!best) {
    return null;
  }

  if (
    best.stats.uniqueCount < 2 ||
    best.stats.uniqueCount > 50
  ) {
    return null;
  }

  return best.key;
}

// ============================================================
// Detect all useful columns
// ============================================================

export function detectSchema(data = []) {
  const metricKey = detectMetricKey(data);

  const dateKey = detectDateKey(data);

  const categoryKey = detectCategoryKey(
    data,
    metricKey,
    dateKey
  );

  const keys = data.length
    ? Object.keys(data[0] || {})
    : [];

  const columns = keys.map((key) =>
    getColumnStats(data, key)
  );

  const numericColumns = columns
    .filter(
      (column) =>
        column.numericRatio >= 0.7 &&
        column.key !== metricKey
    )
    .map((column) => column.key);

  const categoricalColumns = columns
    .filter(
      (column) =>
        column.key !== metricKey &&
        column.key !== dateKey &&
        column.numericRatio < 0.7 &&
        column.uniqueCount >= 2
    )
    .map((column) => column.key);

  return {
    metricKey,
    dateKey,
    categoryKey,
    numericColumns,
    categoricalColumns,
    columns,
  };
}

export function formatColumnLabel(key) {
  if (!key) {
    return "";
  }

  return String(key)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}