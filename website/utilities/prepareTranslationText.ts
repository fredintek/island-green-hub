export const prepareTranslationText = (text: string) => {
  return text.split(" ").join("_").toUpperCase();
};
