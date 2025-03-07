import { useUpdatePageMutation } from "@/redux/api/pageApiSlice";
import { Page } from "@/utils/interfaces";
import { Form, Input } from "antd";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

type Props = {
  pageData?: Partial<Page>;
  refetchEditedData?: any;
};

const ProjectTitle = ({ pageData, refetchEditedData }: Props) => {
  const [form] = Form.useForm();

  const [
    updatePageFn,
    {
      isLoading: updatePageIsLoading,
      isError: updatePageIsError,
      isSuccess: updatePageIsSuccess,
      error: updatePageError,
      data: updatePageData,
    },
  ] = useUpdatePageMutation();

  const handleSubmit = async (values: any) => {
    const targetData = {
      id: pageData?.id,
      title: {
        tr: values.projectTitleTr,
        en: values.projectTitleEn,
        ru: values.projectTitleRu,
      },
    };

    try {
      await updatePageFn(targetData).unwrap();
    } catch (error) {
      console.error("Error updating page:", error);
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      projectTitleTr: pageData?.title?.tr || "",
      projectTitleEn: pageData?.title?.en || "",
      projectTitleRu: pageData?.title?.ru || "",
    });
  }, [pageData]);

  useEffect(() => {
    if (updatePageIsSuccess) {
      toast.success("Title updated successfully");
      refetchEditedData(updatePageData?.slug);
    }

    if (updatePageIsError) {
      const customErrorV1 = updatePageError as {
        data: any;
        status: number;
      };
      const customErrorV2 = updatePageError as {
        message: string | string[];
        error: string;
        statusCode: number;
      };
      toast.error(customErrorV1.data.message || customErrorV2.message);
    }
  }, [updatePageIsSuccess, updatePageIsError, updatePageError, updatePageData]);

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <div className="grid grid-cols-fluid-1 gap-4">
        <Form.Item
          label="Project Title (Turkish)"
          name="projectTitleTr"
          rules={[{ required: true, message: "Project Title is required!" }]}
        >
          <Input size="large" placeholder="Enter Project Title in Turkish" />
        </Form.Item>
        <Form.Item
          label="Project Title (English)"
          name="projectTitleEn"
          rules={[{ required: true, message: "Project Title is required!" }]}
        >
          <Input size="large" placeholder="Enter Project Title in English" />
        </Form.Item>
        <Form.Item
          label="Project Title (Russian)"
          name="projectTitleRu"
          rules={[{ required: true, message: "Project Title is required!" }]}
        >
          <Input size="large" placeholder="Enter Project Title in Russian" />
        </Form.Item>
      </div>

      {/* Submit Button */}
      <button
        onClick={() => form.submit()}
        type="button"
        className="ml-auto px-6 py-2 rounded-md text-white cursor-pointer flex items-center justify-center bg-secondaryShade dark:bg-primaryShade border border-secondaryShade dark:border-primaryShade hover:bg-transparent hover:text-secondaryShade dark:hover:bg-transparent dark:hover:text-primaryShade transition-colors duration-300"
        disabled={updatePageIsLoading}
      >
        {updatePageIsLoading ? (
          <div className="animate-spin border-t-2 border-white border-solid rounded-full w-5 h-5"></div> // Spinner
        ) : (
          <p className="uppercase font-medium">Save</p>
        )}
      </button>
    </Form>
  );
};

export default ProjectTitle;
