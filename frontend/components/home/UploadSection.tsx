"use client";
import React, { useEffect, useState } from "react";
import { Popconfirm, Upload, UploadProps } from "antd";
import { DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import {
  useCreateSectionMutation,
  useDeleteFileMutation,
  useGetSectionByTypeQuery,
  useRemoveLinkFromSectionContentMutation,
  useUploadFileMutation,
} from "@/redux/api/sectionApiSlice";
import { getImagePath } from "@/utils";
import { useGetPageBySlugQuery } from "@/redux/api/pageApiSlice";

const { Dragger } = Upload;

type Props = {};

const UploadSection = (props: Props) => {
  const draggerProps: UploadProps = {
    name: "file",
    multiple: true,
    beforeUpload(file) {
      return false;
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        // console.log("INFO FILE:uploading", info.file, info.fileList);
        setHeroFileList(info.fileList);
      }
    },
    listType: "picture-card",
    accept: "image/*",
  };
  const [heroFileList, setHeroFileList] = useState<any>([]);

  const { data: getSectionData, refetch: getSectionRefetch } =
    useGetSectionByTypeQuery("home-hero", {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnFocus: true,
    });

  const { data: getPageBySlugData } = useGetPageBySlugQuery("home", {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });

  const [
    createSectionFn,
    {
      isError: createSectionIsError,
      isLoading: createSectionIsLoading,
      isSuccess: createSectionIsSuccess,
      error: createSectionError,
      data: createSectionData,
    },
  ] = useCreateSectionMutation();

  const [
    uploadFileFn,
    {
      isError: uploadFileIsError,
      isLoading: uploadFileIsLoading,
      isSuccess: uploadFileIsSuccess,
      error: uploadFileError,
      data: uploadFileData,
    },
  ] = useUploadFileMutation();

  const [
    deleteFileFn,
    {
      isError: deleteFileIsError,
      isLoading: deleteFileIsLoading,
      isSuccess: deleteFileIsSuccess,
      error: deleteFileError,
      data: deleteFileData,
    },
  ] = useDeleteFileMutation();

  const [
    removeLinkFn,
    {
      isError: removeLinkIsError,
      isLoading: removeLinkIsLoading,
      isSuccess: removeLinkIsSuccess,
      error: removeLinkError,
      data: removeLinkData,
    },
  ] = useRemoveLinkFromSectionContentMutation();

  const handleDeleteFile = async (filename: string) => {
    const target = filename.split("uploads/").pop();
    try {
      await deleteFileFn({ filename: target }).unwrap();
      await removeLinkFn({
        sectionId: getSectionData.data.id,
        link: filename,
      }).unwrap();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    heroFileList?.map((fileObj: any) => {
      formData.append("files", fileObj.originFileObj);
    });
    try {
      const uploadedImages = await uploadFileFn(formData).unwrap();

      const data = {
        page: getPageBySlugData?.id,
        type: "home-hero",
        sortId: 0,
        content: [...getSectionData?.data?.content, ...uploadedImages],
      };
      await createSectionFn(data).unwrap();
    } catch (error) {
      console.error("Error file upload:", error);
    }

    setHeroFileList([]);
  };

  useEffect(() => {
    if (createSectionIsSuccess) {
      toast.success(createSectionData?.message);
      getSectionRefetch();
    }

    if (createSectionIsError) {
      const customError = createSectionError as { data: any; status: number };
      toast.error(customError.data.message);
    }
  }, [
    createSectionIsSuccess,
    createSectionIsError,
    createSectionError,
    createSectionData,
  ]);

  useEffect(() => {
    if (uploadFileIsSuccess) {
      toast.success(uploadFileData?.message);
    }

    if (uploadFileIsError) {
      const customError = uploadFileError as { data: any; status: number };
      toast.error(customError.data.message);
    }
  }, [uploadFileIsSuccess, uploadFileIsError, uploadFileError, uploadFileData]);

  useEffect(() => {
    if (removeLinkIsSuccess) {
      getSectionRefetch();
    }

    if (removeLinkIsError) {
      const customError = removeLinkError as { data: any; status: number };
      toast.error(customError.data.message);
    }
  }, [removeLinkIsSuccess, removeLinkIsError, removeLinkError, removeLinkData]);

  useEffect(() => {
    if (deleteFileIsSuccess) {
      toast.success(deleteFileData.message);
      getSectionRefetch();
    }

    if (deleteFileIsError) {
      const customError = deleteFileError as {
        data: any;
        status: number;
      };
      toast.error(customError?.data?.message || "error deleting file");
    }
  }, [deleteFileIsSuccess, deleteFileIsError, deleteFileError, deleteFileData]);

  return (
    <div className="flex flex-col p-6 bg-white dark:bg-[#1e293b] shadow-md rounded-md">
      <p className="text-[22px] text-secondaryShade dark:text-primaryShade font-bold uppercase mb-2">
        Hero Section
      </p>

      <div className="flex flex-col gap-6">
        {/* default hero images */}
        {(getSectionData?.data?.content?.length as number) > 0 && (
          <div>
            <p className="text-lg text-black dark:text-gray-300 font-medium capitalize mb-2">
              Existing Hero Images
            </p>
            <div className="flex flex-wrap gap-10">
              {getSectionData?.data?.content?.map(
                (url: string, idx: number) => (
                  <div
                    key={idx}
                    className="relative max-w-[300px] w-full aspect-video rounded-md overflow-hidden"
                  >
                    <img
                      src={url}
                      alt="default-image"
                      className="w-full h-full object-cover"
                    />
                    {getSectionData?.data?.content?.length > 1 && (
                      <Popconfirm
                        title="Are you sure you want to"
                        onConfirm={() => handleDeleteFile(url)}
                      >
                        <DeleteOutlined className="text-red-500 text-lg absolute top-2 right-2 cursor-pointer" />
                      </Popconfirm>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* upload new hero images */}
        <div>
          <p className="text-lg text-black dark:text-gray-300 font-medium capitalize mb-2">
            Upload New Hero images
          </p>
          <div className="border-2 border-secondaryShade dark:border-primaryShade border-dashed rounded-xl w-full">
            <Dragger fileList={heroFileList} {...draggerProps} className="">
              <p className="ant-upload-drag-icon">
                <InboxOutlined className="!text-secondaryShade dark:!text-primaryShade" />
              </p>
              <p className="ant-upload-text !text-black dark:!text-gray-300">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint !text-black dark:!text-gray-300">
                Support for a single or bulk upload. Strictly prohibited from
                uploading company data or other banned files.
              </p>
            </Dragger>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          type="button"
          className="ml-auto px-6 py-2 rounded-md text-white cursor-pointer flex items-center justify-center bg-secondaryShade dark:bg-primaryShade border border-secondaryShade dark:border-primaryShade hover:bg-transparent hover:text-secondaryShade dark:hover:bg-transparent dark:hover:text-primaryShade transition-colors duration-300"
          disabled={
            uploadFileIsLoading || createSectionIsLoading || deleteFileIsLoading
          }
        >
          {uploadFileIsLoading ||
          createSectionIsLoading ||
          deleteFileIsLoading ? (
            <div className="animate-spin border-t-2 border-white border-solid rounded-full w-5 h-5"></div> // Spinner
          ) : (
            <p className="uppercase font-medium">Submit</p>
          )}
        </button>
      </div>
    </div>
  );
};

export default UploadSection;
