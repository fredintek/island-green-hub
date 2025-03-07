"use client";
import React, { useMemo, useState } from "react";
import { InboxOutlined, LinkOutlined } from "@ant-design/icons";
import { Form, Upload, UploadProps } from "antd";
import dynamic from "next/dynamic";
const { Dragger } = Upload;

type Props = {};

const defaultImages1 = [
  "https://images.unsplash.com/photo-1736779580644-6b4268af4642?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8",
];

const DisplayContent = (props: Props) => {
  const [form] = Form.useForm();
  // Dynamically load the ReactQuill component (to prevent SSR issues)
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill-new"), { ssr: false }),
    []
  );
  const [pdfFile, setPdfFile] = useState<string | null>(
    "https://www.example.com/sample.pdf"
  );

  const handleFormSubmit = (values: any) => {
    console.log("values", values);
  };

  const draggerProps: UploadProps = {
    name: "file",
    multiple: false,
    beforeUpload(file) {
      console.log("File selected:", file);
      return false;
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log("INFO FILE:uploading", info.file, info.fileList);
      }
      if (status === "done") {
        console.log("INFO FILE:done", info.file);
      } else if (status === "error") {
        console.log("INFO FILE:error", info.file);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    listType: "picture-card",
    maxCount: 1,
    accept: "image/*",
  };

  const pdfDraggerProps: UploadProps = {
    name: "file",
    accept: ".pdf",
    beforeUpload(file) {
      if (file.type !== "application/pdf") {
        return Upload.LIST_IGNORE;
      }

      const fileURL = URL.createObjectURL(file);
      setPdfFile(fileURL);
      return false;
    },
    showUploadList: false,
  };

  return (
    <div className="p-6 bg-white dark:bg-[#1e293b] shadow-md rounded-md">
      <p className="text-[22px] text-secondaryShade dark:text-primaryShade font-bold uppercase mb-4">
        Display Content
      </p>

      {/* content */}
      <div>
        <div className="flex flex-col gap-3">
          {(defaultImages1?.length as number) > 0 && (
            <div>
              <p className="text-lg text-black dark:text-gray-300 font-medium capitalize mb-2">
                Existing Display Content Image
              </p>
              <div className="grid grid-cols-fluid gap-4">
                {defaultImages1?.map((image) => (
                  <div
                    key={image}
                    className="relative max-w-[300px] w-full aspect-square rounded-md overflow-hidden"
                  >
                    <img
                      src={image}
                      alt="default-image"
                      className="w-full h-full object-cover"
                    />
                    {/* <DeleteOutlined className="text-red-500 text-lg absolute top-2 right-2 cursor-pointer" /> */}
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="text-lg text-black dark:text-gray-300 font-medium capitalize">
            Upload Image
          </p>
          <div className="border-2 border-secondaryShade dark:border-primaryShade border-dashed rounded-xl w-full">
            <Dragger {...draggerProps} className="">
              <p className="ant-upload-drag-icon">
                <InboxOutlined className="!text-secondaryShade dark:!text-primaryShade" />
              </p>
              <p className="ant-upload-text !text-black dark:!text-gray-300">
                Click or drag file to this area to upload
              </p>
            </Dragger>
          </div>
        </div>
      </div>

      <div className="flex flex-col mt-6">
        <p className="text-lg text-black dark:text-gray-300 font-medium capitalize mb-2">
          Content
        </p>
        <Form
          className="themed-form"
          onFinish={handleFormSubmit}
          layout="vertical"
          form={form}
        >
          <div className="grid grid-cols-fluid-1 gap-4">
            <Form.Item
              rules={[{ required: true, message: "Content is required!" }]}
              label={<span>Content (Turkish)</span>}
              name="contentTr"
            >
              <ReactQuill
                className="themed-quill"
                theme="snow"
                placeholder="Enter content in Turkish"
              />
            </Form.Item>
            <Form.Item
              label={<span>Content (English)</span>}
              name="contentEn"
              rules={[{ required: true, message: "Content is required!" }]}
            >
              <ReactQuill
                className="themed-quill"
                theme="snow"
                placeholder="Enter content in English"
              />
            </Form.Item>
            <Form.Item
              rules={[{ required: true, message: "Content is required!" }]}
              label={<span>Content (Russian)</span>}
              name="contentRu"
            >
              <ReactQuill
                className="themed-quill"
                theme="snow"
                placeholder="Enter content in Russian"
              />
            </Form.Item>
          </div>
        </Form>
      </div>

      <div className="flex flex-col mt-6">
        <p className="text-lg text-black dark:text-gray-300 font-medium capitalize mb-2">
          Upload Pdf
        </p>

        {/* Existing PDF Section */}
        {pdfFile && (
          <div className="mb-4">
            <p className="text-sm text-black dark:text-gray-300 font-medium capitalize mb-1">
              Current PDF
            </p>
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
              <a
                href={pdfFile}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm dark:text-blue-400 underline"
              >
                <span>View PDF</span>
                <LinkOutlined className="text-blue-500 text-sm ml-1" />
              </a>
            </div>
          </div>
        )}

        {/* Upload New PDF */}
        <div className="border-2 border-secondaryShade dark:border-primaryShade border-dashed rounded-xl w-full">
          <Dragger {...pdfDraggerProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined className="!text-secondaryShade dark:!text-primaryShade" />
            </p>
            <p className="ant-upload-text !text-black dark:!text-gray-300">
              Click or drag PDF to this area to upload
            </p>
            <p className="ant-upload-hint !text-black dark:!text-gray-300">
              Only PDF files are allowed.
            </p>
          </Dragger>
        </div>
      </div>

      <button
        onClick={() => console.log("")}
        type="button"
        className="mt-4 ml-auto px-6 py-2 rounded-md text-white cursor-pointer flex items-center justify-center bg-secondaryShade dark:bg-primaryShade border border-secondaryShade dark:border-primaryShade hover:bg-transparent hover:text-secondaryShade dark:hover:bg-transparent dark:hover:text-primaryShade transition-colors duration-300"
      >
        <p className="uppercase font-medium">Submit</p>
      </button>
    </div>
  );
};

export default DisplayContent;
