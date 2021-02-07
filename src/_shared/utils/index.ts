import { lowerCase, get } from "lodash";
type FormatNumberOptionType = {
  style?: "currency" | "unit" | "percent" | "decimal";
  currency?: string;
  notation?: "standard" | "compact";
  minimumFractionDigits?: number;
  maximumSignificantDigits?: number;
  locale?: string;
};

const defaultFormatOptions: FormatNumberOptionType = {
  style: "decimal",
  maximumSignificantDigits: 21,
  minimumFractionDigits: 3,
  notation: "standard",
};
export const formatNumber = (
  value: string | number,
  options: FormatNumberOptionType = defaultFormatOptions
) => {
  try {
    return new Intl.NumberFormat(options?.locale ?? "en", {
      style: options?.style ?? "decimal",
      currency: options?.currency ?? "USD",
      notation: options?.notation ?? "standard",
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: options?.minimumFractionDigits ?? 3,
      maximumSignificantDigits: options?.maximumSignificantDigits ?? 12,
    }).format(parseFloat((value as string) ?? 0));
  } catch (e) {
    return value;
  }
};

export interface CreateActionType {
  START: string;
  SUCCESS: string;
  ERROR: string;
  END: string;
}

export const createActionType = (
  type: string,
  entity = "app"
): CreateActionType => ({
  START: `@@${lowerCase(entity)}/${type}_START`,
  SUCCESS: `@@${lowerCase(entity)}/${type}_SUCCESS`,
  ERROR: `@@${lowerCase(entity)}/${type}_ERROR`,
  END: `@@${lowerCase(entity)}/${type}_END`,
});

export const createActionString = (type: string, entity = "app"): string =>
  `@@${lowerCase(entity)}/${type}`;

export const arrayToByExchange = (exchanges: any[]) => {
  return exchanges.reduce((accumulator: any, current: any) => {
    return Object.assign({}, accumulator, {
      [get(current, "exchange")]: current,
    });
  }, {});
};
export const arrayToBySymbol = (symbols: any[]) => {
  return symbols.reduce((accumulator: any, current: any) => {
    return Object.assign({}, accumulator, {
      [get(current, "symbol")]: current,
    });
  }, {});
};

export const transforms = [
  { label: "No transform", value: "none" },
  { label: "Change", value: "diff" },
  { label: "% Change", value: "rdiff" },
  { label: "% Increment", value: "rdiff_from" },
  { label: "Cumulative", value: "cumul" },
  { label: "Normalize", value: "normalize" },
];
