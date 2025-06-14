export function generatePageTitle(title: string, suffix = "Apolo") {
  return `${title} | ${suffix}`;
}

export function formatSymbol(symbol: string, format = "base-type") {
  const arr = symbol.split("_");
  const type = arr[0];
  const base = arr[1];
  const quote = arr[2];

  return format
    .replace("type", type)
    .replace("base", base)
    .replace("quote", quote);
}


export function formatAssetPrice(price: number): string {
  return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}