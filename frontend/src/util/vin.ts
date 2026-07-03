// Excludes I, O, Q per VIN spec (they're disallowed to avoid confusion with 1/0).
export const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/i;

export function isValidVinFormat(vin: string): boolean {
  return VIN_REGEX.test(vin.trim());
}
