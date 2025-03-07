"use client";
import { InboxOutlined } from "@ant-design/icons";
import { Upload, UploadProps } from "antd";
import React from "react";
const { Dragger } = Upload;

type Props = {};

const defaultImages1 = [
  "https://images.unsplash.com/photo-1737741772139-5f8a9d4dd078?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1737901685093-c5e05706efcf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNnx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1736230990003-a98eea26ea1f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0MHx8fGVufDB8fHx8fA%3D%3D",
];

const VideoLinks = (props: Props) => {
  const generateUploadProps = (
    maxCount: number | undefined,
    multiple: boolean,
    existingFiles: any[]
  ): UploadProps => ({
    name: "file",
    multiple,
    beforeUpload: () => false,
    listType: "picture-card",
    accept: "video/*",
    maxCount,
    fileList: existingFiles.map((url, index) => ({
      uid: String(index),
      name: `image-${index}.png`,
      status: "done",
      url,
    })),
  });

  return (
    <>
      <div className="p-6 bg-white dark:bg-[#1e293b] shadow-md rounded-md">
        <p className="text-[22px] text-secondaryShade dark:text-primaryShade font-bold uppercase mb-4">
          Videos
        </p>

        {/* content */}

        {/* existing videos */}
        <div>
          <p className="text-lg text-black dark:text-gray-300 font-medium capitalize mb-2">
            Existing Videos
          </p>
          <div className="grid grid-cols-fluid-1 gap-4">
            {defaultImages1?.map((image) => (
              <div
                key={image}
                className="relative w-full aspect-[16/6] rounded-md overflow-hidden"
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

        {/* upload new videos */}
        <div className="mt-2">
          <p className="text-lg text-black dark:text-gray-300 font-medium capitalize mb-2">
            Upload New cover image
          </p>
          <div className="border-2 border-secondaryShade dark:border-primaryShade border-dashed rounded-xl w-full">
            <Dragger {...generateUploadProps(1, false, [])} className="">
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
    </>
  );
};

export default VideoLinks;
