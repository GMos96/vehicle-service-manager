import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ServiceLogType } from "@/types/service-logs";

dayjs.extend(customParseFormat);

export interface ParsedReceipt {
  serviceDate?: string;
  mileage?: number;
  repairCost?: number;
  serviceType?: ServiceLogType;
}

// date formats tried in order; dayjs strict mode rejects invalid dates
const DATE_FORMATS = [
  "MM/DD/YYYY",
  "M/D/YYYY",
  "MM/DD/YY",
  "M/D/YY",
  "YYYY-MM-DD",
  "MMMM D, YYYY",
  "MMM D, YYYY",
  "MMMM DD YYYY",
  "MMM DD YYYY",
];

function extractDate(text: string): string | undefined {
  // Capture anything that looks like a date (digits+separators or month names)
  const candidates = text.match(
    /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},?\s+\d{4}\b|\b\d{1,4}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/gi,
  ) ?? [];

  const today = dayjs();
  for (const candidate of candidates) {
    for (const fmt of DATE_FORMATS) {
      const d = dayjs(candidate, fmt, true);
      if (d.isValid() && !d.isAfter(today)) {
        return d.format("YYYY-MM-DD");
      }
    }
  }
  return undefined;
}

function extractMileage(text: string): number | undefined {
  // keyword-anchored patterns
  const kwPatterns = [
    /(?:odometer|mileage|current\s+miles?)[:\s]*([0-9,]{3,7})/i,
    /([0-9,]{3,7})\s*(?:miles?|mi)\.?\s*(?:on|at|in)/i,
  ];
  for (const re of kwPatterns) {
    const m = text.match(re);
    if (m) {
      const val = parseInt(m[1].replace(/,/g, ""), 10);
      if (val > 0 && val < 999_999) return val;
    }
  }
  return undefined;
}

function extractCost(text: string): number | undefined {
  // prefer "total" or "amount due" line
  const totalMatch = text.match(
    /(?:total|amount\s+due|grand\s+total)[:\s]*\$?\s*([0-9,]+(?:\.\d{2})?)/i,
  );
  if (totalMatch) {
    const val = parseFloat(totalMatch[1].replace(/,/g, ""));
    if (isFinite(val) && val > 0) return Math.round(val);
  }

  // fallback: collect all dollar amounts and take the max
  const amounts: number[] = [];
  for (const m of text.matchAll(/\$\s*([0-9,]+(?:\.\d{2})?)/g)) {
    const val = parseFloat(m[1].replace(/,/g, ""));
    if (isFinite(val) && val > 0) amounts.push(val);
  }
  if (amounts.length > 0) return Math.round(Math.max(...amounts));

  return undefined;
}

const SERVICE_KEYWORDS: [RegExp, ServiceLogType][] = [
  // OIL_CHANGE_ROTATION must come before OIL_CHANGE and TIRE_ROTATION so it wins on combined receipts
  [
    /oil\s*(?:change|&|and)\s*(?:&|and\s*)?\s*(?:tire\s*rot|rotate|lube\s*(?:and\s*)?rot)/i,
    ServiceLogType.OIL_CHANGE_ROTATION,
  ],
  [/lube\s*(?:and|&|n)\s*rot/i, ServiceLogType.OIL_CHANGE_ROTATION],
  [/oil\s*change|lube|motor\s*oil|engine\s*oil/i, ServiceLogType.OIL_CHANGE],
  [/tire\s*rot(?:ation)?|rotate\s*tires?/i, ServiceLogType.TIRE_ROTATION],
];

function extractServiceType(text: string): ServiceLogType | undefined {
  for (const [re, type] of SERVICE_KEYWORDS) {
    if (re.test(text)) return type;
  }
  return undefined;
}

export function parseReceiptText(text: string): ParsedReceipt {
  return {
    serviceDate: extractDate(text),
    mileage: extractMileage(text),
    repairCost: extractCost(text),
    serviceType: extractServiceType(text),
  };
}
