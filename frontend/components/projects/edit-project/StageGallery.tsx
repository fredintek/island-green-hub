import { uploadToCloudinary } from "@/lib/cloudinaryUpload";
import { useDeleteFileFromCloudinaryMutation } from "@/redux/api/cloudinaryApiSlice";
import {
  useGetSectionByTypeQuery,
  useUpdateSectionMutation,
} from "@/redux/api/sectionApiSlice";
import { Page } from "@/utils/interfaces";
import { InboxOutlined } from "@ant-design/icons";
import { Form } from "antd";
import Dragger from "antd/es/upload/Dragger";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  pageData?: Partial<Page>;
  refetchEditedData?: any;
};

const StageGallery = ({ pageData, refetchEditedData }: Props) => {
  const [form] = Form.useForm();
  const [stage2Images, setStage2Images] = useState<any>([]);
  const [isImageUploadToCloud, setIsImageUploadToCloud] =
    useState<boolean>(false);

  const { data: getSectionByTypeData } = useGetSectionByTypeQuery(
    "project-stage2-images",
    {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }
  );

  const [
    deleteFileFromCloudinaryFn,
    { isLoading: deleteFileFromCloudinaryIsLoading },
  ] = useDeleteFileFromCloudinaryMutation();

  const [
    updateSectionFn,
    {
      data: updateSectionData,
      isLoading: updateSectionIsLoading,
      isError: updateSectionIsError,
      isSuccess: updateSectionIsSuccess,
      error: updateSectionError,
    },
  ] = useUpdateSectionMutation();

  const handleSubmit = async (values: any) => {
    try {
      let stage2Images = [];

      for (const value of values.stage2Images) {
        let imageData;

        if (!value?.url) {
          // Upload new image to Cloudinary
          imageData = await uploadToCloudinary(
            value?.originFileObj,
            setIsImageUploadToCloud
          );

          // Delete old image if `uid` exists
          if (value?.uid) {
            await deleteFileFromCloudinaryFn({
              publicId: value.uid,
            }).unwrap();
          }
        } else {
          // Keep existing image data
          imageData = {
            publicId: value.uid,
            url: value.url,
          };
        }

        // Collect processed image data
        stage2Images.push(imageData);
      }
      await updateSectionFn({
        id: getSectionByTypeData?.data?.id,
        content: stage2Images,
      }).unwrap();

      // You can now use `stage2Images` to submit the final data
    } catch (error) {
      console.error("Error processing images:", error);
    }
  };

  useEffect(() => {
    if (getSectionByTypeData?.data?.content) {
      setStage2Images(
        getSectionByTypeData?.data?.content?.map((img: any) => ({
          uid: img.publicId,
          name: "image",
          status: "done",
          url: img.url,
        }))
      );

      form.setFieldsValue({
        stage2Images: getSectionByTypeData?.data?.content?.map((img: any) => ({
          uid: img.publicId,
          name: "image",
          status: "done",
          url: img.url,
        })),
      });
    }
  }, [getSectionByTypeData, form]);

  useEffect(() => {
    if (updateSectionIsSuccess) {
      toast.success("Gallery updated successfully");
      refetchEditedData(getSectionByTypeData?.data?.page?.slug);
    }

    if (updateSectionIsError) {
      const customErrorV1 = updateSectionError as {
        data: any;
        status: number;
      };
      const customErrorV2 = updateSectionError as {
        message: string | string[];
        error: string;
        statusCode: number;
      };
      toast.error(customErrorV1.data.message || customErrorV2.message);
    }
  }, [
    updateSectionIsSuccess,
    updateSectionIsError,
    updateSectionError,
    updateSectionData,
  ]);

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <div className="border-2 border-secondaryShade dark:border-primaryShade border-dashed rounded-xl w-full">
        <Form.Item
          name="stage2Images"
          valuePropName="fileList"
          getValueFromEvent={(e) => e?.fileList}
        >
          <Dragger
            name="file"
            multiple={true}
            beforeUpload={(file) => false}
            onChange={(info) => {
              setStage2Images(info.fileList);
            }}
            listType="picture-card"
            accept="image/*"
            className=""
            fileList={stage2Images}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined className="!text-secondaryShade dark:!text-primaryShade" />
            </p>
            <p className="ant-upload-text !text-black dark:!text-gray-300">
              Click or drag file to this area to upload
            </p>
          </Dragger>
        </Form.Item>
      </div>

      <button
        onClick={() => form.submit()}
        type="button"
        className="ml-auto mt-4 px-6 py-2 rounded-md text-white cursor-pointer flex items-center justify-center bg-secondaryShade dark:bg-primaryShade border border-secondaryShade dark:border-primaryShade hover:bg-transparent hover:text-secondaryShade dark:hover:bg-transparent dark:hover:text-primaryShade transition-colors duration-300"
        disabled={
          isImageUploadToCloud ||
          deleteFileFromCloudinaryIsLoading ||
          updateSectionIsLoading
        }
      >
        {isImageUploadToCloud ||
        deleteFileFromCloudinaryIsLoading ||
        updateSectionIsLoading ? (
          <div className="animate-spin border-t-2 border-white border-solid rounded-full w-5 h-5"></div> // Spinner
        ) : (
          <p className="uppercase font-medium">Save</p>
        )}
      </button>
    </Form>
  );
};

export default StageGallery;
