"use client";
import { DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import { Upload, UploadProps } from "antd";
import React from "react";
const { Dragger } = Upload;

type Props = {};

const defaultImages = [
  "https://images.unsplash.com/photo-1737741772139-5f8a9d4dd078?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1737901685093-c5e05706efcf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNnx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1736230990003-a98eea26ea1f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0MHx8fGVufDB8fHx8fA%3D%3D",
];

const Stage = (props: Props) => {
  const generateUploadProps = (
    maxCount: number | undefined,
    multiple: boolean,
    existingFiles: any[]
  ): UploadProps => ({
    name: "file",
    multiple,
    beforeUpload: () => false,
    listType: "picture-card",
    accept: "image/*",
    maxCount,
    fileList: existingFiles.map((url, index) => ({
      uid: String(index),
      name: `image-${index}.png`,
      status: "done",
      url,
    })),
  });

  return (
    <div className="p-6 bg-white dark:bg-[#1e293b] shadow-md rounded-md">
      <p className="text-[22px] text-secondaryShade dark:text-primaryShade font-bold uppercase mb-4">
        Stages
      </p>
      {/* gallery */}
      <div className="flex flex-col gap-6 mt-6">
        {/* default hero images */}
        {(defaultImages?.length as number) > 0 && (
          <div>
            <p className="text-lg text-black dark:text-gray-300 font-medium capitalize mb-2">
              Existing images
            </p>
            <div className="grid grid-cols-fluid gap-4">
              {defaultImages?.map((image) => (
                <div
                  key={image}
                  className="relative w-full aspect-video rounded-md overflow-hidden"
                >
                  <img
                    src={image}
                    alt="default-image"
                    className="w-full h-full object-cover"
                  />
                  {defaultImages?.length > 1 ? (
                    <DeleteOutlined className="text-red-500 text-lg absolute top-2 right-2 cursor-pointer" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* upload new hero images */}
        <div>
          <p className="text-lg text-black dark:text-gray-300 font-medium capitalize mb-2">
            Upload New images
          </p>
          <div className="border-2 border-secondaryShade dark:border-primaryShade border-dashed rounded-xl w-full">
            <Dragger {...generateUploadProps(undefined, true, [])} className="">
              <p className="ant-upload-drag-icon">
                <InboxOutlined className="!text-secondaryShade dark:!text-primaryShade" />
              </p>
              <p className="ant-upload-text !text-black dark:!text-gray-300">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint !text-black dark:!text-gray-300">
                Support for a single or bulk upload. Strictly prohibited from
                uploading company data or other banned files.
              </p>
            </Dragger>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          className="ml-auto px-6 py-2 rounded-md text-white cursor-pointer flex items-center justify-center bg-secondaryShade dark:bg-primaryShade border border-secondaryShade dark:border-primaryShade hover:bg-transparent hover:text-secondaryShade dark:hover:bg-transparent dark:hover:text-primaryShade transition-colors duration-300"
        >
          <p className="uppercase font-medium">Save</p>
        </button>
      </div>
    </div>
  );
};

export default Stage;
