import * as sharp from 'sharp';

/**
 * Resizes an image to a target file size.
 * @param fileBuffer - The raw file buffer.
 * @param targetSize - The desired file size in MB (default is 2MB).
 * @default targetSize 2
 */
export const resizeImage = async (
  fileBuffer: Buffer | Uint8Array, // Using Uint8Array instead of ArrayBuffer
  targetSize: number = 2,
) => {
  // Resize the image to a maximum width of 1200 pixels and maintain aspect ratio
  let resizedImage = await sharp(fileBuffer)
    .resize({
      width: 1200,
      height: 1200,
      fit: sharp.fit.inside,
      withoutEnlargement: true,
      withoutReduction: true,
    })
    .toFormat('jpeg')
    .jpeg({ quality: 80 })
    .toBuffer();

  // get filesize
  let fileSize = resizedImage?.length / (1024 * 1024);

  if (fileSize > targetSize) {
    let quality: number = 80;
    while (fileSize > targetSize && quality > 20) {
      quality -= 10;
      resizedImage = await sharp(fileBuffer)
        .resize({
          width: 1200,
          height: 1200,
          fit: sharp.fit.inside,
          withoutEnlargement: true,
          withoutReduction: true,
        })
        .toFormat('jpeg')
        .jpeg({ quality })
        .toBuffer();

      fileSize = resizedImage?.length / (1024 * 1024);
    }
  }
  return resizedImage;
};
