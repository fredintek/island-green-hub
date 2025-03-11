export function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

export const equalValues = (first: any, second: any) => {
  if (first === second) return true;
  if (typeof first !== "object" || typeof second !== "object") return false;

  const firstKeys = Object.keys(first);
  const secondKeys = Object.keys(second);

  if (firstKeys.length !== secondKeys.length) return false;

  for (const key of firstKeys) {
    if (!secondKeys.includes(key) || !equalValues(first[key], second[key]))
      return false;
  }

  return true;
};
