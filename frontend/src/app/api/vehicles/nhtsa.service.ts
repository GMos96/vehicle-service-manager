const REQUEST_TIMEOUT_MS = 5000;

export class NhtsaUnavailableError extends Error {}

async function fetchJson(url: string): Promise<any> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new NhtsaUnavailableError(`NHTSA request failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof NhtsaUnavailableError) {
      throw error;
    }
    throw new NhtsaUnavailableError("NHTSA request failed");
  } finally {
    clearTimeout(timeout);
  }
}

export type DecodedVin = {
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  warning?: string;
};

export async function decodeVin(vin: string): Promise<DecodedVin> {
  const json = await fetchJson(
    `https://vpic.nhtsa.gov/api/vehicles/DecodeVinValues/${encodeURIComponent(vin)}?format=json`,
  );
  const result = json?.Results?.[0] ?? {};

  const decoded: DecodedVin = {};
  if (result.ModelYear) decoded.year = parseInt(result.ModelYear, 10) || undefined;
  if (result.Make) decoded.make = result.Make;
  if (result.Model) decoded.model = result.Model;
  if (result.Trim) decoded.trim = result.Trim;

  if (result.ErrorCode && result.ErrorCode !== "0") {
    decoded.warning = result.ErrorText || "VIN could not be fully decoded";
  }

  return decoded;
}

export type Recall = {
  campaignNumber: string;
  component: string;
  summary: string;
  consequence?: string;
  remedy?: string;
  reportReceivedDate: string;
};

export async function getRecallsByVehicle(
  make: string,
  model: string,
  modelYear: number,
): Promise<Recall[]> {
  const json = await fetchJson(
    `https://api.nhtsa.gov/recalls/recallsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${modelYear}`,
  );

  const results = json?.results ?? [];
  return results.map((r: any) => ({
    campaignNumber: r.NHTSACampaignNumber,
    component: r.Component,
    summary: r.Summary,
    consequence: r.Consequence,
    remedy: r.Remedy,
    reportReceivedDate: r.ReportReceivedDate,
  }));
}
