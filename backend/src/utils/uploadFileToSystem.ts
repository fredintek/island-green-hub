import * as fs from 'fs';
import { join } from 'path';
import { resizeImage } from './resizeBuffer';

export const getFileUpload = async (file: Express.Multer.File) => {
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

  if (
    file.mimetype.startsWith('application/pdf') ||
    file.mimetype.startsWith('video/')
  ) {
    // Write the resized image to the file system
    fs.writeFileSync(filePath, buffer);
  } else {
    // Now resize the image file buffer
    try {
      resizedImage = await resizeImage(buffer);
    } catch (error) {
      console.error('Error resizing image', error);
      throw error;
    }

    // Write the resized image to the file system
    fs.writeFileSync(filePath, resizedImage);
  }
  return `${process.env.API_URL}/uploads/${filename}`;
};

export const deleteServerFile = (filename: string): boolean => {
  const filePath = join(process.cwd(), 'uploads', filename);

  try {
    fs.unlink(filePath, (err) => console.log('file deletion error', err));
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
