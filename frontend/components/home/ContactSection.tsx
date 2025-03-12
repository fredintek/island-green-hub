import React, { useEffect, useState } from "react";
import { Popconfirm, Upload, UploadProps } from "antd";
import { DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import {
  useCreateSectionMutation,
  useDeleteFileMutation,
  useGetSectionByTypeQuery,
  useRemoveLinkFromSectionContentMutation,
  useUploadFileMutation,
} from "@/redux/api/sectionApiSlice";
import { useDeleteFileFromCloudinaryMutation } from "@/redux/api/cloudinaryApiSlice";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";
import { toast } from "react-toastify";
import { useGetPageBySlugQuery } from "@/redux/api/pageApiSlice";

const { Dragger } = Upload;

type Props = {};

const ContactSection = (props: Props) => {
  const [videoFileList, setVideoFileList] = useState<any>([]);

  const draggerProps: UploadProps = {
    name: "file",
    multiple: false,
    beforeUpload(file) {
      if (!file.type.startsWith("video/")) {
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        setVideoFileList(info.fileList);
      }
    },
    listType: "picture-card",
    accept: "video/mp4",
    maxCount: 1,
  };

  const { data: getPageBySlugData } = useGetPageBySlugQuery("home", {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });

  const { data: getSectionData, refetch: getSectionRefetch } =
    useGetSectionByTypeQuery("home-contact", {
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
    removeLinkFn,
    {
      isError: removeLinkIsError,
      isLoading: removeLinkIsLoading,
      isSuccess: removeLinkIsSuccess,
      error: removeLinkError,
      data: removeLinkData,
    },
  ] = useRemoveLinkFromSectionContentMutation();

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

  const handleDeleteVideo = async (filename: string) => {
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
    videoFileList?.map((fileObj: any) =>
      formData.append("files", fileObj.originFileObj)
    );

    try {
      const uploadedVideos = await uploadFileFn(formData).unwrap();
      const data = {
        page: getPageBySlugData?.id,
        type: "home-contact",
        sortId: 3,
        content: uploadedVideos,
      };
      await createSectionFn(data).unwrap();
    } catch (error) {
      console.error("Error file upload:", error);
    }

    setVideoFileList([]);
  };

  useEffect(() => {
    if (createSectionIsSuccess) {
      toast.success(createSectionData.message);
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
      toast.success(removeLinkData.message);
      getSectionRefetch();
    }

    if (removeLinkIsError) {
      const customError = removeLinkError as { data: any; status: number };
      toast.error(customError.data.message);
    }
  }, [removeLinkIsSuccess, removeLinkIsError, removeLinkError, removeLinkData]);

  useEffect(() => {
    if (deleteFileIsSuccess) {
      // toast.success(deleteFileData.message);
      getSectionRefetch();
    }

    if (deleteFileIsError) {
      const customError = deleteFileError as {
        data: any;
        status: number;
      };
      toast.error(customError.data.message);
    }
  }, [deleteFileIsSuccess, deleteFileIsError, deleteFileError, deleteFileData]);

  return (
    <div className="p-6 bg-white dark:bg-[#1e293b] shadow-md rounded-md">
      <p className="text-[22px] text-secondaryShade dark:text-primaryShade font-bold uppercase mb-6">
        Contact Section
      </p>

      {/* content */}
      <div className="">
        {(getSectionData?.data?.content?.length as number) > 0 && (
          <div className="bg-white dark:bg-[#1e293b] max-w-[300px] w-full aspect-video p-1 flex flex-col gap-2">
            <p className="text-lg text-black dark:text-gray-300 font-medium capitalize">
              Existing Video
            </p>
            {getSectionData?.data?.content?.map((url: string) => (
              <>
                <Popconfirm
                  title="Are you sure you want to"
                  onConfirm={() => handleDeleteVideo(url)}
                >
                  <DeleteOutlined className="text-base self-end cursor-pointer text-red-500" />
                </Popconfirm>
                <div className="bg-gray-300 w-full h-full rounded-md">
                  <video
                    className="w-full block h-full object-cover rounded-md"
                    autoPlay
                    loop
                    muted
                    preload="none"
                    playsInline
                  >
                    <source src={url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </>
            ))}
          </div>
        )}
        <div className="mt-2">
          <p className="text-lg text-black dark:text-gray-300 font-medium capitalize mb-2">
            Upload New Video
          </p>
          <div className="border-2 border-secondaryShade dark:border-primaryShade border-dashed rounded-xl w-full">
            <Dragger fileList={videoFileList} {...draggerProps} className="">
              <p className="ant-upload-drag-icon">
                <InboxOutlined className="!text-secondaryShade dark:!text-primaryShade" />
              </p>
              <p className="ant-upload-text !text-black dark:!text-gray-300">
                Click or drag video to this area to upload
              </p>
            </Dragger>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        type="button"
        className="ml-auto mt-3 px-6 py-2 rounded-md text-white cursor-pointer flex items-center justify-center bg-secondaryShade dark:bg-primaryShade border border-secondaryShade dark:border-primaryShade hover:bg-transparent hover:text-secondaryShade dark:hover:bg-transparent dark:hover:text-primaryShade transition-colors duration-300"
        disabled={
          deleteFileIsLoading ||
          createSectionIsLoading ||
          uploadFileIsLoading ||
          removeLinkIsLoading
        }
      >
        {deleteFileIsLoading ||
        createSectionIsLoading ||
        uploadFileIsLoading ||
        removeLinkIsLoading ? (
          <div className="animate-spin border-t-2 border-white border-solid rounded-full w-5 h-5"></div> // Spinner
        ) : (
          <p className="uppercase font-medium">Submit</p>
        )}
      </button>
    </div>
  );
};

export default ContactSection;
