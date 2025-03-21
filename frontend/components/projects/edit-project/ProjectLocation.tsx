import {
  useGetSectionByTypeQuery,
  useUpdateSectionMutation,
} from "@/redux/api/sectionApiSlice";
import { Page } from "@/utils/interfaces";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Form, Input, Tooltip } from "antd";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

type Props = {
  pageData?: Partial<Page>;
};

const ProjectLocation = ({ pageData }: Props) => {
  const [form] = Form.useForm();

  const { data: getSectionByTypeData } = useGetSectionByTypeQuery(
    "productLocation",
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

  const handleSubmit = async (values: any) => {
    try {
      await updateSectionFn({
        id: getSectionByTypeData.data.id,
        content: values.projectLocation,
      }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (getSectionByTypeData?.data?.content) {
      form.setFieldsValue({
        projectLocation: getSectionByTypeData.data.content,
      });
    }
  }, [getSectionByTypeData, form]);

  useEffect(() => {
    if (updateSectionIsSuccess) {
      toast.success("Location updated successfully");
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
    <Form layout="vertical" onFinish={handleSubmit} form={form}>
      <Form.Item
        label={
          <span>
            Project Location{" "}
            <Tooltip title="Enter latitude and longitude separated by a comma (e.g., 40.7128,-74.0060)">
              <InfoCircleOutlined style={{ color: "#1890ff" }} />
            </Tooltip>
          </span>
        }
        name="projectLocation"
      >
        <Input size="large" placeholder="Latitude,Longitude" />
      </Form.Item>

      <button
        onClick={() => form.submit()}
        type="button"
        className="ml-auto mt-4 px-6 py-2 rounded-md text-white cursor-pointer flex items-center justify-center bg-secondaryShade dark:bg-primaryShade border border-secondaryShade dark:border-primaryShade hover:bg-transparent hover:text-secondaryShade dark:hover:bg-transparent dark:hover:text-primaryShade transition-colors duration-300"
        disabled={updateSectionIsLoading}
      >
        {updateSectionIsLoading ? (
          <div className="animate-spin border-t-2 border-white border-solid rounded-full w-5 h-5"></div> // Spinner
        ) : (
          <p className="uppercase font-medium">Save</p>
        )}
      </button>
    </Form>
  );
};

export default ProjectLocation;
