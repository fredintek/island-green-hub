"use client";
import {
  useCreateCommunicationMutation,
  useGetAllCommunicationQuery,
  useUpdateCommunicationMutation,
} from "@/redux/api/communicationApiSlice";
import { stripHtml } from "@/utils";
import { Form, Input } from "antd";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

type Props = {};

const page = (props: Props) => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  // Dynamically load the ReactQuill component (to prevent SSR issues)
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill-new"), { ssr: false }),
    []
  );

  const {
    data: getAllCommunicationData,
    isLoading: getAllCommunicationIsLoading,
    isError: getAllCommunicationIsError,
    error: getAllCommunicationError,
    refetch: getAllCommunicationRefetch,
  } = useGetAllCommunicationQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });

  const [
    createCommunicationFn,
    {
      isError: createCommunicationIsError,
      isLoading: createCommunicationIsLoading,
      isSuccess: createCommunicationIsSuccess,
      error: createCommunicationError,
      data: createCommunicationData,
    },
  ] = useCreateCommunicationMutation();

  const [
    updateCommunicationFn,
    {
      isError: updateCommunicationIsError,
      isLoading: updateCommunicationIsLoading,
      isSuccess: updateCommunicationIsSuccess,
      error: updateCommunicationError,
      data: updateCommunicationData,
    },
  ] = useUpdateCommunicationMutation();

  const handleFormSubmit = async (values: any) => {
    const cleanedData = {
      telephone: stripHtml(values.telephone),
      email: stripHtml(values.email),
      location: stripHtml(values.location),
    };
    try {
      if (isEditing) {
        await updateCommunicationFn({
          id: getAllCommunicationData.data[0]?.id,
          phoneNumber: cleanedData.telephone.split(","),
          email: cleanedData.email.split(","),
          address: cleanedData.location.split(","),
        }).unwrap();
      } else {
        await createCommunicationFn({
          phoneNumber: cleanedData.telephone.split(","),
          email: cleanedData.email.split(","),
          address: cleanedData.location.split(","),
        }).unwrap();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (getAllCommunicationData?.data?.length > 0) {
      setIsEditing(true);
      form.setFieldsValue({
        telephone: getAllCommunicationData.data[0].phoneNumber?.join(","),
        email: getAllCommunicationData.data[0].email?.join(","),
        location: getAllCommunicationData.data[0].address?.join(","),
      });
    } else {
      setIsEditing(false);
    }
  }, [getAllCommunicationData]);

  useEffect(() => {
    if (createCommunicationIsSuccess) {
      getAllCommunicationRefetch();
      toast.success(createCommunicationData.message);
    }

    if (createCommunicationIsError) {
      const customError = createCommunicationError as {
        data: any;
        status: number;
      };
      toast.error(
        Array.isArray(customError.data.message)
          ? customError.data.message.join(",")
          : customError.data.message
      );
    }
  }, [
    createCommunicationIsSuccess,
    createCommunicationIsError,
    createCommunicationError,
    createCommunicationData,
  ]);

  useEffect(() => {
    if (updateCommunicationIsSuccess) {
      getAllCommunicationRefetch();
      toast.success(updateCommunicationData.message);
    }

    if (updateCommunicationIsError) {
      const customError = updateCommunicationError as {
        data: any;
        status: number;
      };
      toast.error(
        Array.isArray(customError.data.message)
          ? customError.data.message.join(",")
          : customError.data.message
      );
    }
  }, [
    updateCommunicationIsSuccess,
    updateCommunicationIsError,
    updateCommunicationError,
    updateCommunicationData,
  ]);

  return (
    <>
      <div className="p-6 bg-white dark:bg-[#1e293b] shadow-md rounded-md">
        <p className="text-[22px] text-secondaryShade dark:text-primaryShade font-bold uppercase mb-6">
          Communication Section
        </p>

        {/* content */}
        <Form
          className="themed-form"
          onFinish={handleFormSubmit}
          layout="vertical"
          form={form}
        >
          <div className="grid grid-cols-fluid-1 gap-4">
            <Form.Item
              rules={[{ required: true, message: "Telephone is required!" }]}
              label={<span>Telephone Numbers</span>}
              name="telephone"
            >
              <ReactQuill
                className="themed-quill"
                theme="snow"
                placeholder="Enter telephone"
              />
            </Form.Item>
            <Form.Item
              label={<span>Emails</span>}
              name="email"
              rules={[{ required: true, message: "Email is required!" }]}
            >
              <ReactQuill
                className="themed-quill"
                theme="snow"
                placeholder="Enter email"
              />
            </Form.Item>
            <Form.Item
              rules={[{ required: true, message: "Location is required!" }]}
              label={<span>Locations</span>}
              name="location"
            >
              <ReactQuill
                className="themed-quill"
                theme="snow"
                placeholder="Enter location"
              />
            </Form.Item>
          </div>
        </Form>
        <button
          onClick={() => form.submit()}
          type="button"
          className="ml-auto px-6 py-2 rounded-md text-white cursor-pointer flex items-center justify-center bg-secondaryShade dark:bg-primaryShade border border-secondaryShade dark:border-primaryShade hover:bg-transparent hover:text-secondaryShade dark:hover:bg-transparent dark:hover:text-primaryShade transition-colors duration-300"
          disabled={
            updateCommunicationIsLoading || createCommunicationIsLoading
          }
        >
          {updateCommunicationIsLoading || createCommunicationIsLoading ? (
            <div className="animate-spin border-t-2 border-white border-solid rounded-full w-5 h-5"></div> // Spinner
          ) : (
            <p className="uppercase font-medium">
              {isEditing ? "Save" : "Submit"}
            </p>
          )}
        </button>
      </div>
    </>
  );
};

export default page;
