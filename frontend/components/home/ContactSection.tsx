import React, { useEffect, useState } from "react";
import { Upload, UploadProps } from "antd";
import { DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import {
  useCreateSectionMutation,
  useGetSectionByTypeQuery,
  useRemoveLinkFromSectionContentMutation,
} from "@/redux/api/sectionApiSlice";
import { useDeleteFileFromCloudinaryMutation } from "@/redux/api/cloudinaryApiSlice";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";
import { toast } from "react-toastify";

const { Dragger } = Upload;

type Props = {};

const ContactSection = (props: Props) => {
  const [videoFileList, setVideoFileList] = useState<any>([]);
  const [uploadVideoLoading, setUploadVideoLoading] = useState<boolean>(false);

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
        // console.log("INFO FILE:uploading", info.file, info.fileList);
        setVideoFileList(info.fileList);
      }
    },
    // onDrop(e) {
    //   console.log("Dropped files", e.dataTransfer.files);
    // },
    listType: "picture-card",
    accept: "video/mp4",
  };

  const {
    data: getSectionData,
    isLoading: getSectionIsLoading,
    isError: getSectionIsError,
    error: getSectionError,
    refetch: getSectionRefetch,
  } = useGetSectionByTypeQuery("contact", {
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
    deleteFileFromCloudinaryFn,
    {
      isError: deleteFileFromCloudinaryIsError,
      isLoading: deleteFileFromCloudinaryIsLoading,
      isSuccess: deleteFileFromCloudinaryIsSuccess,
      error: deleteFileFromCloudinaryError,
      data: deleteFileFromCloudinaryData,
    },
  ] = useDeleteFileFromCloudinaryMutation();

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

  const handleSubmit = async () => {
    const videosToUpload = videoFileList?.map(
      (fileObj: any) => fileObj.originFileObj
    );

    try {
      const uploadedVideos = await uploadToCloudinary(
        videosToUpload,
        setUploadVideoLoading
      );
      setVideoFileList([]);

      const data = {
        page: getSectionData?.data?.page?.id,
        type: getSectionData?.data?.type,
        sortId: getSectionData?.data?.sortId,
        content: uploadedVideos,
      };
      await createSectionFn(data).unwrap();
    } catch (error) {
      console.error("Error during file upload:", error);
    }
  };

  const handleDeleteVideo = async (publicId: string) => {
    try {
      await deleteFileFromCloudinaryFn({
        publicId,
        resourceType: "video",
      }).unwrap();
      await removeLinkFn({
        sectionId: getSectionData.data.id,
        link: publicId,
      }).unwrap();
    } catch (error) {
      console.error("Error during file upload:", error);
    }
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
    if (deleteFileFromCloudinaryIsSuccess) {
      // toast.success(deleteFileFromCloudinaryData.message);
      getSectionRefetch();
    }

    if (deleteFileFromCloudinaryIsError) {
      const customError = deleteFileFromCloudinaryError as {
        data: any;
        status: number;
      };
      toast.error(customError.data.message);
    }
  }, [
    deleteFileFromCloudinaryIsSuccess,
    deleteFileFromCloudinaryIsError,
    deleteFileFromCloudinaryError,
    deleteFileFromCloudinaryData,
  ]);

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
            {getSectionData?.data?.content?.map(
              (obj: { publicId: string; url: string }) => (
                <>
                  <DeleteOutlined
                    onClick={() => handleDeleteVideo(obj.publicId)}
                    className="text-base self-end cursor-pointer text-red-500"
                  />
                  <div className="bg-gray-300 w-full h-full rounded-md">
                    <video
                      className="w-full block h-full object-cover rounded-md"
                      autoPlay
                      loop
                      muted
                      preload="none"
                      playsInline
                    >
                      <source src={obj.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </>
              )
            )}
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
          uploadVideoLoading ||
          createSectionIsLoading ||
          deleteFileFromCloudinaryIsLoading ||
          removeLinkIsLoading
        }
      >
        {uploadVideoLoading ||
        createSectionIsLoading ||
        deleteFileFromCloudinaryIsLoading ||
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
