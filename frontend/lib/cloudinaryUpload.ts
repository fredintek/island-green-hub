import axios from "axios";
import { toast } from "react-toastify";

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const uploadToCloudinary = async (
  files: File | File[],
  setLoading?: (loading: boolean) => void
): Promise<
  { publicId: string; url: string } | { publicId: string; url: string }[]
> => {
  if (!files) throw new Error("No file provided");

  setLoading && setLoading(true); // Set loading state to true

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET || "");

    // Determine resource type based on file type
    const resourceType = file.type.includes("pdf") ? "raw" : "auto";

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          params: { resource_type: resourceType },
        }
      );

      return {
        publicId: response.data.public_id,
        url: response.data.secure_url,
      };
    } catch (error) {
      toast.error("Error uploading file");
      throw error;
    }
  };

  // If input is a single file, return a single URL
  if (!Array.isArray(files)) {
    const result = await uploadFile(files);
    setLoading && setLoading(false); // Set loading state to false once done
    return result;
  }

  // If input is an array, return an array of URLs
  const uploadPromises = files.map(uploadFile);

  try {
    const result = await Promise.all(uploadPromises);
    setLoading && setLoading(false); // Set loading state to false once done
    // toast.success("Files uploaded successfully!");
    return result;
  } catch (error) {
    setLoading && setLoading(false); // Set loading state to false even on error
    toast.error("Error uploading files");
    throw error;
  }
};

export const deleteFromCloudinary = async (
  publicId: string,
  setLoading: (loading: boolean) => void
): Promise<void> => {
  setLoading(true); // Set loading state to true

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/destroy`,
      {
        public_id: publicId,
        upload_preset: CLOUDINARY_UPLOAD_PRESET,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data.result === "ok") {
      toast.success(`Successfully deleted image`);
    } else {
      toast.error("Failed to delete image");
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    toast.error("Error deleting image");
  } finally {
    setLoading(false); // Set loading state to false after deletion
  }
};
