import { ensureArray } from "@/app/[locale]/dashboard/projects/add-project/page";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";
import { useDeleteFileFromCloudinaryMutation } from "@/redux/api/cloudinaryApiSlice";
import {
  useDeleteFileMutation,
  useGetSectionByPageIdQuery,
  useGetSectionByTypeQuery,
  useUpdateSectionMutation,
  useUploadFileMutation,
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
  const [pageContentData, setPageContentData] = useState<any>({});

  const { data: getSectionByTypeData } = useGetSectionByPageIdQuery(
    pageData?.id || pageContentData?.id,
    {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }
  );

  const [uploadFileFn, { isLoading: uploadFileIsLoading }] =
    useUploadFileMutation();

  const [deleteFileFn, { isLoading: deleteFileIsLoading }] =
    useDeleteFileMutation();

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
    const targetSection = getSectionByTypeData?.data?.find((section: any) =>
      section.type.includes("productStage2Images")
    );

    const prepareUpload = (value: any, formData: FormData, tag: string) => {
      if (!value.url) {
        formData.append("files", value.originFileObj);
        formData.append("tags", tag);

        return null;
      }
      return value.url;
    };
    try {
      let formData = new FormData();
      let stage2Images: string[] = [];
      for (const value of values.stage2Images) {
        const arr = prepareUpload(value, formData, "stage2Images");

        if (arr) {
          stage2Images.push(arr);
        }
      }
      const isFormDataEmpty = formData.entries().next().done;
      if (!isFormDataEmpty) {
        const arr = await uploadFileFn(formData).unwrap();
        ensureArray(arr.stage2Images)?.forEach((img: string) =>
          stage2Images.push(img)
        );
      }
      await updateSectionFn({
        id: targetSection?.id,
        content: stage2Images,
      }).unwrap();

      // delete old files
      await Promise.all(
        targetSection?.content?.map(async (content: string) => {
          const target = content.split("uploads/").pop();
          return await deleteFileFn({ filename: target }).unwrap();
        })
      );

      // You can now use `stage2Images` to submit the final data
    } catch (error) {
      console.error("Error processing images:", error);
    }
  };

  useEffect(() => {
    const targetSection = getSectionByTypeData?.data?.find((section: any) =>
      section.type.includes("productStage2Images")
    );
    if (targetSection) {
      setStage2Images(
        targetSection?.content?.map((img: any) => ({
          uid: img,
          name: "image",
          status: "done",
          url: img,
        }))
      );

      form.setFieldsValue({
        stage2Images: targetSection?.content?.map((img: any) => ({
          uid: img,
          name: "image",
          status: "done",
          url: img,
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

  useEffect(() => {
    if (pageData) {
      setPageContentData(pageData);
    }
  }, [pageData]);

  if (!getSectionByTypeData?.data) return null;
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
