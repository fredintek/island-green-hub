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

export const prepareFileUpload = (
  values: any,
  key: string,
  formData: FormData,
  tag: string,
  filesToDelete: string[],
  targetPath?: string
) => {
  if (!values[key]?.[0]?.url) {
    formData.append("files", values[key]?.[0]?.originFileObj);
    formData.append("tags", tag);

    if (targetPath && filesToDelete?.length > 0) {
      filesToDelete?.push(targetPath?.split("uploads/")?.pop() as string);
    }
    return null; // Indicates file needs to be uploaded
  }
  return values[key][0]?.url; // Return existing URL if available
};

export const extractedPath = (url: string) =>
  `/uploads/${url.split("/uploads/")[1]}`;

export const splitText = (target: string | string[]): string =>
  Array.isArray(target) ? target?.join(",") : target;

export const validateArray = (
  arr: any[] | undefined | null
): any[] | undefined => {
  if (
    !arr ||
    arr.every((item) => item === undefined || item === null || item === "")
  ) {
    return undefined;
  }
  return arr;
};

export const ensureArray = (value: any) =>
  Array.isArray(value) ? value : [value];
