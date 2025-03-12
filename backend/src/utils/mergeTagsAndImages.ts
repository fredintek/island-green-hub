export const mergeImagesWithTags = (imagesArr: string[], tagsArr: string[]) => {
  return tagsArr.reduce(
    (acc, tag, index) => {
      if (!acc[tag]) {
        acc[tag] = imagesArr[index];
      } else if (Array.isArray(acc[tag])) {
        acc[tag].push(imagesArr[index]);
      } else {
        acc[tag] = [acc[tag], imagesArr[index]];
      }
      return acc;
    },
    {} as Record<string, string | string[]>,
  );
};
