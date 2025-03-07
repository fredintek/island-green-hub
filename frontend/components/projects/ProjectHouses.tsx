"use client";
import {
  Form,
  Input,
  Modal,
  Popconfirm,
  Table,
  Tooltip,
  Upload,
  UploadProps,
} from "antd";
import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  DeleteOutlined,
  EditOutlined,
  InboxOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { Dragger } = Upload;

type Props = {};

const defaultImages1 = [
  "https://images.unsplash.com/photo-1736779580644-6b4268af4642?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8",
];

const defaultImages2 = [
  "https://images.unsplash.com/photo-1735945205189-ead34d91cf69?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNXx8fGVufDB8fHx8fA%3D%3D",
];

const defaultImages3 = [
  "https://images.unsplash.com/photo-1737741772139-5f8a9d4dd078?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1737901685093-c5e05706efcf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNnx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1736230990003-a98eea26ea1f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0MHx8fGVufDB8fHx8fA%3D%3D",
];

const ProjectHouses = (props: Props) => {
  // Dynamically load the ReactQuill component (to prevent SSR issues)
  const [form] = Form.useForm();
  const [editingProject, setEditingProject] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill-new"), { ssr: false }),
    []
  );

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

  const handleFormSubmit = (values: any) => {
    console.log("values", values);
  };

  const handleEdit = (record: any) => {
    form.setFieldsValue(record);
    setEditingProject(record);
    setOpenModal(true);
  };

  const handleDelete = (record: any) => {
    console.log("delete", record);
  };

  const [projectsHouseData, setProjectsHouseData] = useState([
    {
      key: "1",
      titleTr: "Başlık TR",
      contentTr: "İçerik TR",
      titleEn: "Title EN",
      titleRu: "Заголовок RU",
      contentEn: "Content EN",
      contentRu: "Содержание RU",
      generalInformationEn: "General Info EN",
      generalInformationTr: "Genel Bilgi TR",
      generalInformationRu: "Общая информация RU",
      featuresEn: "Features EN",
      featuresTr: "Özellikler TR",
      featuresRu: "Особенности RU",
      optionalFeaturesEn: "Optional Features EN",
      optionalFeaturesTr: "İsteğe Bağlı Özellikler TR",
      optionalFeaturesRu: "Дополнительные функции RU",
      displayImage: "https://via.placeholder.com/100",
      gallery: [
        "https://via.placeholder.com/100",
        "https://via.placeholder.com/100",
        "https://via.placeholder.com/100",
      ],
    },
  ]);

  const projectsHouseColumn = [
    {
      title: "Title (tr)",
      dataIndex: "titleTr",
      key: "titleTr",
    },
    {
      title: "Title (en)",
      dataIndex: "titleEn",
      key: "titleEn",
    },
    {
      title: "Title (ru)",
      dataIndex: "titleRu",
      key: "titleRu",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <div className="flex items-center gap-4 text-lg text-gray-500">
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => handleEdit(record)}
          >
            <Tooltip title="Edit">
              <EditOutlined />
            </Tooltip>
          </button>
          <button type="button" className="cursor-pointer">
            <Popconfirm
              title="Are you sure you want to delete this project?"
              onConfirm={() => handleDelete(record)}
            >
              <DeleteOutlined />
            </Popconfirm>
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="p-6 bg-white dark:bg-[#1e293b] shadow-md rounded-md">
        <p className="text-[22px] text-secondaryShade dark:text-primaryShade font-bold uppercase mb-4">
          Project Houses
        </p>

        <div>
          <button
            onClick={() => {
              setOpenModal(true);
              setEditingProject(null);
              form.resetFields();
            }}
            type="button"
            className="mb-4 px-6 py-2 rounded-md text-white cursor-pointer flex gap-2 items-center justify-center bg-secondaryShade dark:bg-primaryShade border border-secondaryShade dark:border-primaryShade hover:bg-transparent hover:text-secondaryShade dark:hover:bg-transparent dark:hover:text-primaryShade transition-colors duration-300"
          >
            <PlusOutlined className="text-lg" />
            <p className="uppercase font-medium text-sm">Add</p>
          </button>
          <Table
            columns={projectsHouseColumn}
            dataSource={projectsHouseData}
            scroll={{ x: 768 }}
            className=""
          />
        </div>

        {/* ============== content =================== */}
      </div>

      <Modal
        onCancel={() => {
          setOpenModal(false);
          setEditingProject(null);
        }}
        onClose={() => {
          setOpenModal(false);
          setEditingProject(null);
        }}
        open={openModal}
        width={{
          xs: "100%",
        }}
        footer={null}
      >
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

          {/* general information */}
          <div className="grid grid-cols-fluid-1 gap-4">
            <Form.Item
              rules={[
                { required: true, message: "General Information is required!" },
              ]}
              label={<span>General Information (Turkish)</span>}
              name="generalInformationTr"
            >
              <ReactQuill
                className="themed-quill"
                theme="snow"
                placeholder="Enter General Information in Turkish"
              />
            </Form.Item>
            <Form.Item
              label={<span>General Information (English)</span>}
              name="generalInformationEn"
              rules={[
                { required: true, message: "General Information is required!" },
              ]}
            >
              <ReactQuill
                className="themed-quill"
                theme="snow"
                placeholder="Enter General Information in English"
              />
            </Form.Item>
            <Form.Item
              rules={[
                { required: true, message: "General Information is required!" },
              ]}
              label={<span>General Information (Russian)</span>}
              name="generalInformationRu"
            >
              <ReactQuill
                className="themed-quill"
                theme="snow"
                placeholder="Enter generalInformation in Russian"
              />
            </Form.Item>
          </div>

          {/* features */}
          <div className="grid grid-cols-fluid-1 gap-4">
            <Form.Item
              rules={[{ required: true, message: "Features is required!" }]}
              label={<span>Features (Turkish)</span>}
              name="featuresTr"
            >
              <ReactQuill
                className="themed-quill"
                theme="snow"
                placeholder="Enter features in Turkish"
              />
            </Form.Item>
            <Form.Item
              label={<span>Features (English)</span>}
              name="featuresEn"
              rules={[{ required: true, message: "Features is required!" }]}
            >
              <ReactQuill
                className="themed-quill"
                theme="snow"
                placeholder="Enter features in English"
              />
            </Form.Item>
            <Form.Item
              rules={[{ required: true, message: "Features is required!" }]}
              label={<span>Features (Russian)</span>}
              name="featuresRu"
            >
              <ReactQuill
                className="themed-quill"
                theme="snow"
                placeholder="Enter features in Russian"
              />
            </Form.Item>
          </div>

          {/* optional features */}
          <div className="grid grid-cols-fluid-1 gap-4">
            <Form.Item
              label={<span>Optional Features (Turkish)</span>}
              name="optionalFeaturesTr"
            >
              <ReactQuill
                className="themed-quill"
                theme="snow"
                placeholder="Enter optional Features in Turkish"
              />
            </Form.Item>
            <Form.Item
              label={<span>Optional Features (English)</span>}
              name="optionalFeaturesEn"
            >
              <ReactQuill
                className="themed-quill"
                theme="snow"
                placeholder="Enter optional Features in English"
              />
            </Form.Item>
            <Form.Item
              label={<span>Optional Features (Russian)</span>}
              name="optionalFeaturesRu"
            >
              <ReactQuill
                className="themed-quill"
                theme="snow"
                placeholder="Enter optional Features in Russian"
              />
            </Form.Item>
          </div>
        </Form>

        {/* display image */}
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-fluid-1 gap-4">
            {(defaultImages1?.length as number) > 0 && (
              <div>
                <p className="text-lg text-black dark:text-gray-300 font-medium capitalize mb-2">
                  Existing Display Images
                </p>
                <div className="grid grid-cols-fluid gap-4">
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
            )}

            {(defaultImages2?.length as number) > 0 && (
              <div>
                <p className="text-lg text-black dark:text-gray-300 font-medium capitalize mb-2">
                  Existing Cover Images
                </p>
                <div className="grid grid-cols-fluid gap-4">
                  {defaultImages2?.map((image) => (
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
            )}
          </div>

          <div className="grid grid-cols-fluid-1 gap-4">
            {/* upload new display images */}
            <div>
              <p className="text-lg text-black dark:text-gray-300 font-medium capitalize mb-2">
                Upload New Display image
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

            {/* upload new cover images */}
            <div>
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
        </div>

        {/* gallery */}
        <div className="flex flex-col gap-6 mt-6">
          {/* default hero images */}
          {(defaultImages3?.length as number) > 0 && (
            <div>
              <p className="text-lg text-black dark:text-gray-300 font-medium capitalize mb-2">
                Existing gallery Images
              </p>
              <div className="grid grid-cols-fluid gap-4">
                {defaultImages3?.map((image) => (
                  <div
                    key={image}
                    className="relative w-full aspect-video rounded-md overflow-hidden"
                  >
                    <img
                      src={image}
                      alt="default-image"
                      className="w-full h-full object-cover"
                    />
                    {defaultImages3?.length > 1 ? (
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
              Upload New gallery images
            </p>
            <div className="border-2 border-secondaryShade dark:border-primaryShade border-dashed rounded-xl w-full">
              <Dragger
                {...generateUploadProps(undefined, true, [])}
                className=""
              >
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
      </Modal>
    </>
  );
};

export default ProjectHouses;
