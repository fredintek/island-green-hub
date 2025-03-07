import {
  useGetSectionByTypeQuery,
  useUpdateSectionMutation,
} from "@/redux/api/sectionApiSlice";
import { Page } from "@/utils/interfaces";
import { Form, Input } from "antd";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

type Props = {
  pageData?: Partial<Page>;
  refetchEditedData?: any;
};

const ProductLink = ({ pageData, refetchEditedData }: Props) => {
  const [form] = Form.useForm();

  const {
    data: getSectionByTypeData,
    isLoading: getSectionByTypeIsLoading,
    isError: getSectionByTypeIsError,
    isSuccess: getSectionByTypeIsSuccess,
    error: getSectionByTypeError,
  } = useGetSectionByTypeQuery("project-product-link", {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });

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
    const targetData = {
      id: pageData?.sections?.find(
        (section) => section.type === "project-product-link"
      )?.id,
      content: values.productLink,
    };

    try {
      await updateSectionFn(targetData).unwrap();
    } catch (error) {
      console.error("Error updating page:", error);
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      productLink: pageData?.sections?.find(
        (section) => section.type === "project-product-link"
      )?.content,
    });
  }, [[pageData]]);

  useEffect(() => {
    if (updateSectionIsSuccess) {
      toast.success("Product Link updated successfully");
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
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        label="Product Link"
        name="productLink"
        rules={[{ required: true, message: "Product Link is required!" }]}
      >
        <Input size="large" placeholder="Enter Product Link in Turkish" />
      </Form.Item>

      {/* Submit Button */}
      <button
        onClick={() => form.submit()}
        type="button"
        className="ml-auto px-6 py-2 rounded-md text-white cursor-pointer flex items-center justify-center bg-secondaryShade dark:bg-primaryShade border border-secondaryShade dark:border-primaryShade hover:bg-transparent hover:text-secondaryShade dark:hover:bg-transparent dark:hover:text-primaryShade transition-colors duration-300"
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

export default ProductLink;
