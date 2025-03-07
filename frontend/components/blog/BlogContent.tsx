"use client";
import { Form, Input } from "antd";
import dynamic from "next/dynamic";
import React, { useMemo } from "react";

type Props = {};

const BlogContent = (props: Props) => {
  const [form] = Form.useForm();
  const handleFormSubmit = (values: any) => {
    console.log("values", values);
  };
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill-new"), { ssr: false }),
    []
  );

  return (
    <>
      <div className="p-6 bg-white dark:bg-[#1e293b] shadow-md rounded-md">
        <p className="text-[22px] text-secondaryShade dark:text-primaryShade font-bold uppercase mb-6">
          Blog Content
        </p>
        <Form
          className="themed-form"
          onFinish={handleFormSubmit}
          layout="vertical"
          form={form}
        >
          {/* title */}
          <div className="grid grid-cols-fluid-1 gap-4">
            <Form.Item
              label={<span>Title (Turkish)</span>}
              name="titleTr"
              rules={[{ required: true, message: "Title is required!" }]}
            >
              <Input size="large" placeholder="Enter title in Turkish" />
            </Form.Item>
            <Form.Item
              label={<span>Title (English)</span>}
              name="titleEn"
              rules={[{ required: true, message: "Title is required!" }]}
            >
              <Input size="large" placeholder="Enter title in English" />
            </Form.Item>
            <Form.Item
              label={<span>Title (Russian)</span>}
              name="titleRu"
              rules={[{ required: true, message: "Title is required!" }]}
            >
              <Input size="large" placeholder="Enter title in Russian" />
            </Form.Item>
          </div>

          {/* content */}
          <div className="grid grid-cols-fluid-1 gap-4">
            <Form.Item
              rules={[{ required: true, message: "Content is required!" }]}
              label={<span>Content (Turkish)</span>}
              name="generalInformationTr"
            >
              <ReactQuill
                className="themed-quill"
                theme="snow"
                placeholder="Enter Content in Turkish"
              />
            </Form.Item>
            <Form.Item
              label={<span>Content (English)</span>}
              name="generalInformationEn"
              rules={[{ required: true, message: "Content is required!" }]}
            >
              <ReactQuill
                className="themed-quill"
                theme="snow"
                placeholder="Enter Content in English"
              />
            </Form.Item>
            <Form.Item
              rules={[{ required: true, message: "Content is required!" }]}
              label={<span>Content (Russian)</span>}
              name="generalInformationRu"
            >
              <ReactQuill
                className="themed-quill"
                theme="snow"
                placeholder="Enter generalInformation in Russian"
              />
            </Form.Item>
          </div>
        </Form>

        {/* Submit Button */}
        <button
          type="button"
          className="ml-auto px-6 py-2 rounded-md text-white cursor-pointer flex items-center justify-center bg-secondaryShade dark:bg-primaryShade border border-secondaryShade dark:border-primaryShade hover:bg-transparent hover:text-secondaryShade dark:hover:bg-transparent dark:hover:text-primaryShade transition-colors duration-300"
        >
          <p className="uppercase font-medium">Submit</p>
        </button>
      </div>
    </>
  );
};

export default BlogContent;
