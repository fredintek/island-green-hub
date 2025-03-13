import {
  useDeleteFileMutation,
  useGetSectionByPageIdQuery,
  useUpdateSectionMutation,
  useUploadFileMutation,
} from "@/redux/api/sectionApiSlice";
import { prepareFileUpload } from "@/utils";
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
  const [pageContentData, setPageContentData] = useState<any>({});

  const { data: getSectionByTypeData } = useGetSectionByPageIdQuery(
    pageData?.id || pageContentData?.id,
    {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }
  );

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

  const [uploadFileFn, { isLoading: uploadFileIsLoading }] =
    useUploadFileMutation();

  const [deleteFileFn, { isLoading: deleteFileIsLoading }] =
    useDeleteFileMutation();

  const handleUploadChange = ({ fileList }: any) => {
    setProjectFileList([fileList]);
    form.setFieldsValue({ projectImages: [...fileList] });
  };

  const handleUploadChangePdf = ({ fileList }: any) => {
    setProjectPdfList([fileList]);
    form.setFieldsValue({ projectPdf: [...fileList] });
  };

  const handleSubmit = async (values: any) => {
    const targetSection = getSectionByTypeData?.data?.find((section: any) =>
      section.type.includes("productContent")
    );
    try {
      /** Upload new image if needed */

      let imgFormData = new FormData();
      let pdfFormData = new FormData();
      let filesToDelete: string[] = [];

      let projectImages = prepareFileUpload(
        values,
        "projectImages",
        imgFormData,
        "projectImages",
        filesToDelete,
        targetSection?.content?.image
      );
      let pdfImage = prepareFileUpload(
        values,
        "projectPdf",
        pdfFormData,
        "projectPdf",
        filesToDelete,
        targetSection?.content?.pdf
      );

      // Upload files if needed
      if (!pdfImage) pdfImage = await uploadFileFn(pdfFormData).unwrap();
      if (!projectImages)
        projectImages = await uploadFileFn(imgFormData).unwrap();

      // Ensure correct format after upload
      pdfImage = typeof pdfImage === "string" ? pdfImage : pdfImage?.projectPdf;
      projectImages =
        typeof projectImages === "string"
          ? projectImages
          : projectImages?.projectImages;

      /** Construct final data */
      const targetData = {
        id: targetSection?.id,
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
      await Promise.all(
        filesToDelete?.map(async (filename) => {
          const target = filename.split("uploads/").pop();
          return await deleteFileFn({ filename: target }).unwrap();
        })
      );
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  useEffect(() => {
    const targetSection = getSectionByTypeData?.data?.find((section: any) =>
      section.type.includes("productContent")
    );
    if (targetSection) {
      setProjectFileList([
        {
          uid: targetSection?.content?.image,
          name: "image",
          status: "done",
          url: targetSection?.content?.image,
        },
      ]);

      setProjectPdfList([
        {
          uid: targetSection?.content?.pdf,
          name: "pdf",
          status: "done",
          url: targetSection?.content?.pdf,
        },
      ]);

      form.setFieldsValue({
        projectImages: [
          {
            uid: targetSection?.content?.image,
            name: "image",
            status: "done",
            url: targetSection?.content?.image,
          },
        ],
        projectPdf: [
          {
            uid: targetSection?.content?.pdf,
            name: "pdf",
            status: "done",
            url: targetSection?.content?.pdf,
          },
        ],
        projectContentTr: targetSection?.content?.description?.tr,
        projectContentEn: targetSection?.content?.description?.en,
        projectContentRu: targetSection?.content?.description?.ru,
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

  useEffect(() => {
    if (pageData) {
      setPageContentData(pageData);
    }
  }, [pageData]);

  if (!getSectionByTypeData?.data) return null;
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
          uploadFileIsLoading || updateSectionIsLoading || deleteFileIsLoading
        }
      >
        {uploadFileIsLoading ||
        updateSectionIsLoading ||
        deleteFileIsLoading ? (
          <div className="animate-spin border-t-2 border-white border-solid rounded-full w-5 h-5"></div> // Spinner
        ) : (
          <p className="uppercase font-medium">Save</p>
        )}
      </button>
    </Form>
  );
};

export default ProjectContent;
