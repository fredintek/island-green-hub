import * as fs from 'fs';
import { join } from 'path';
import { resizeImage } from './resizeBuffer';

export const uploadImageFile = async (file: Express.Multer.File) => {
  let resizedImage: Buffer<ArrayBufferLike>;
  const buffer = file.buffer;
  const filename = `${Date.now()}-${file.originalname}`;

  // Define the upload directory
  const uploadDir = join(process.cwd(), 'uploads');

  // make sure the upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Define the filepath
  const filePath = join(uploadDir, filename);

  // Now resize the image file buffer
  try {
    resizedImage = await resizeImage(buffer);
  } catch (error) {
    console.error('Error resizing image', error);
    throw error;
  }

  // Write the resized image to the file system
  fs.writeFileSync(filePath, resizedImage);

  return filename;
};

export const deleteImageFile = async (filename: string): Promise<boolean> => {
  const filePath = join(process.cwd(), 'uploads', filename);

  try {
    await fs.promises.unlink(filePath);
    return true;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.error('File not found:', filename);
      return false;
    }

    console.error('Error deleting image:', error);
    return false;
  }
};
