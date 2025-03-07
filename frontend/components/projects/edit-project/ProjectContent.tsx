import { uploadToCloudinary } from "@/lib/cloudinaryUpload";
import { useDeleteFileFromCloudinaryMutation } from "@/redux/api/cloudinaryApiSlice";
import {
  useGetSectionByTypeQuery,
  useUpdateSectionMutation,
} from "@/redux/api/sectionApiSlice";
import { Page } from "@/utils/interfaces";
import { PlusOutlined } from "@ant-design/icons";
import { Form, Upload } from "antd";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  pageData?: Partial<Page>;
  refetchEditedData?: any;
};

const ProjectContent = ({ pageData, refetchEditedData }: Props) => {
  // Dynamically load the ReactQuill component (to prevent SSR issues)
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill-new"), { ssr: false }),
    []
  );

  const [form] = Form.useForm();
  const [projectFileList, setProjectFileList] = useState<any>([]);
  const [projectPdfList, setProjectPdfList] = useState<any>([]);
  const [isImageUploadToCloud, setIsImageUploadToCloud] =
    useState<boolean>(false);
  const [isPdfUploadToCloud, setIsPdfUploadToCloud] = useState<boolean>(false);

  const { data: getSectionByTypeData } = useGetSectionByTypeQuery(
    "project-content",
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

  const handleUploadChange = ({ fileList }: any) => {
    setProjectFileList([fileList]);
    form.setFieldsValue({ projectImages: [...fileList] });
  };

  const handleUploadChangePdf = ({ fileList }: any) => {
    setProjectPdfList([fileList]);
    form.setFieldsValue({ projectPdf: [...fileList] });
  };

  const handleSubmit = async (values: any) => {
    let projectImages;
    let pdfImage;

    try {
      /** Upload new image if needed */
      if (!values.projectImages?.[0]?.url) {
        projectImages = await uploadToCloudinary(
          values.projectImages[0]?.originFileObj,
          setIsImageUploadToCloud
        );
        if (values.projectImages?.[0]?.uid) {
          await deleteFileFromCloudinaryFn({
            publicId: values.projectImages[0]?.uid,
          }).unwrap();
        }
      } else {
        projectImages = {
          publicId: values.projectImages[0]?.uid,
          url: values.projectImages[0]?.url,
        };
      }

      /** Upload new PDF if needed */
      if (!values.projectPdf?.[0]?.url) {
        pdfImage = await uploadToCloudinary(
          values.projectPdf[0]?.originFileObj,
          setIsPdfUploadToCloud
        );
        if (values.projectPdf?.[0]?.uid) {
          await deleteFileFromCloudinaryFn({
            publicId: values.projectPdf[0]?.uid,
            resourceType: "raw",
          }).unwrap();
        }
      } else {
        pdfImage = {
          publicId: values.projectPdf[0]?.uid,
          url: values.projectPdf[0]?.url,
        };
      }

      /** Construct final data */
      const targetData = {
        id: getSectionByTypeData?.data?.id,
        content: {
          description: {
            en: values.projectContentEn,
            tr: values.projectContentTr,
            ru: values.projectContentRu,
          },
          image: projectImages,
          pdf: pdfImage,
        },
      };
      await updateSectionFn(targetData).unwrap();
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  useEffect(() => {
    if (getSectionByTypeData?.data?.content) {
      setProjectFileList([
        {
          uid: getSectionByTypeData?.data?.content?.image?.publicId,
          name: "image",
          status: "done",
          url: getSectionByTypeData?.data?.content?.image?.url,
        },
      ]);

      setProjectPdfList([
        {
          uid: getSectionByTypeData?.data?.content?.pdf?.publicId,
          name: "pdf",
          status: "done",
          url: getSectionByTypeData?.data?.content?.pdf?.url,
        },
      ]);

      form.setFieldsValue({
        projectImages: [
          {
            uid: getSectionByTypeData?.data?.content?.image?.publicId,
            name: "image",
            status: "done",
            url: getSectionByTypeData?.data?.content?.image?.url,
          },
        ],
        projectPdf: [
          {
            uid: getSectionByTypeData?.data?.content?.pdf?.publicId,
            name: "pdf",
            status: "done",
            url: getSectionByTypeData?.data?.content?.pdf?.url,
          },
        ],
        projectContentTr: getSectionByTypeData?.data?.content?.description?.tr,
        projectContentEn: getSectionByTypeData?.data?.content?.description?.en,
        projectContentRu: getSectionByTypeData?.data?.content?.description?.ru,
      });
    }
  }, [getSectionByTypeData, form]);

  useEffect(() => {
    if (updateSectionIsSuccess) {
      toast.success("Project Content updated successfully");
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
    <Form onFinish={handleSubmit} form={form} layout="vertical">
      <div className="flex flex-col gap-10">
        {/* images */}
        <div className="flex gap-10">
          <Form.Item
            label="Upload Project Image"
            name="projectImages"
            valuePropName="fileList"
            getValueFromEvent={(e) => e?.fileList}
            rules={[
              {
                required: true,
                message: "You must upload an image!",
              },
            ]}
          >
            <Upload
              name="file"
              multiple={false}
              beforeUpload={() => false}
              listType="picture-card"
              accept="image/*"
              fileList={projectFileList}
              onChange={handleUploadChange}
              maxCount={1}
            >
              <PlusOutlined />
            </Upload>
          </Form.Item>

          <Form.Item
            label="Upload Project PDF"
            name="projectPdf"
            valuePropName="fileList"
            getValueFromEvent={(e) => e?.fileList}
            rules={[
              {
                required: true,
                message: "Project PDF is required!",
              },
            ]}
          >
            <Upload
              name="file"
              multiple={false}
              beforeUpload={() => false}
              listType="picture-card"
              accept="application/pdf"
              fileList={projectPdfList}
              onChange={handleUploadChangePdf}
              maxCount={1}
            >
              <PlusOutlined />
            </Upload>
          </Form.Item>
        </div>

        {/* content */}
        <div className="grid grid-cols-fluid-1 gap-4">
          <Form.Item
            rules={[
              { required: true, message: "Project Content is required!" },
            ]}
            label="Project Content(Turkish)"
            name="projectContentTr"
          >
            <ReactQuill
              theme="snow"
              placeholder="Enter project content in Turkish"
            />
          </Form.Item>
          <Form.Item
            label="Project Content(English)"
            name="projectContentEn"
            rules={[
              { required: true, message: "Project Content is required!" },
            ]}
          >
            <ReactQuill
              theme="snow"
              placeholder="Enter project content in English"
            />
          </Form.Item>
          <Form.Item
            rules={[
              { required: true, message: "Project Content is required!" },
            ]}
            label="Project Content(Russian)"
            name="projectContentRu"
          >
            <ReactQuill
              theme="snow"
              placeholder="Enter project content in Russian"
            />
          </Form.Item>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={() => form.submit()}
        type="button"
        className="ml-auto px-6 py-2 rounded-md text-white cursor-pointer flex items-center justify-center bg-secondaryShade dark:bg-primaryShade border border-secondaryShade dark:border-primaryShade hover:bg-transparent hover:text-secondaryShade dark:hover:bg-transparent dark:hover:text-primaryShade transition-colors duration-300"
        disabled={
          deleteFileFromCloudinaryIsLoading ||
          updateSectionIsLoading ||
          isImageUploadToCloud ||
          isPdfUploadToCloud
        }
      >
        {deleteFileFromCloudinaryIsLoading ||
        updateSectionIsLoading ||
        isImageUploadToCloud ||
        isPdfUploadToCloud ? (
          <div className="animate-spin border-t-2 border-white border-solid rounded-full w-5 h-5"></div> // Spinner
        ) : (
          <p className="uppercase font-medium">Save</p>
        )}
      </button>
    </Form>
  );
};

export default ProjectContent;
