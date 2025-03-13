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

export const getImagePath = (filename: string) => {
  // const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  return `${backendUrl}/uploads/${filename}`;
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
