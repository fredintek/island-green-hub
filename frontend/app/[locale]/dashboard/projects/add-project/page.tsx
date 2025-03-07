"use client";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";
import {
  useCreateBulkProjectPageMutation,
  useGetPageBySlugQuery,
} from "@/redux/api/pageApiSlice";
import { DeleteOutlined, InboxOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload } from "antd";
import Dragger from "antd/es/upload/Dragger";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

type Props = {};

export const validateArray = (
  arr: any[] | undefined | null
): any[] | undefined => {
  if (
    !arr ||
    arr.every((item) => item === undefined || item === null || item === "")
  ) {
    return undefined;
  }
  return arr;
};

const page = (props: Props) => {
  // Dynamically load the ReactQuill component (to prevent SSR issues)
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill-new"), { ssr: false }),
    []
  );
  const [projectFileList, setProjectFileList] = useState<any>([]);
  const [projectPdfList, setProjectPdfList] = useState<any>([]);
  const [projectHomeImageList, setProjectHomeImageList] = useState<any>([]);
  const [projectHouseGallery, setProjectHouseGallery] = useState<any>([]);
  const [projectHouseCoverImageFileList, setProjectHouseCoverImageFileList] =
    useState<any>([]);
  const [
    projectHouseDisplayImageFileList,
    setProjectHouseDisplayImageFileList,
  ] = useState<any>([]);
  const [stage2Images, setStage2Images] = useState<any>([]);
  const [videoLinks, setVideoLinks] = useState<string[]>([""]);
  const [form] = Form.useForm();

  const { data: getAllPageBySlugData, refetch: getAllPageBySlugRefetch } =
    useGetPageBySlugQuery("projects", {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnFocus: true,
    });

  const [
    createBulkProjectFn,
    {
      isError: createBulkProjectIsError,
      isLoading: createBulkProjectIsLoading,
      isSuccess: createBulkProjectIsSuccess,
      error: createBulkProjectError,
      data: createBulkProjectData,
    },
  ] = useCreateBulkProjectPageMutation();

  const handleUploadChange = ({ fileList }: any) => {
    setProjectFileList(fileList);
    form.setFieldsValue({ projectImages: fileList });
  };

  const handleUploadChangePdf = ({ fileList }: any) => {
    setProjectPdfList(fileList);
    form.setFieldsValue({ projectPdf: fileList });
  };

  const handleUploadChangeHomeImage = ({ fileList }: any) => {
    setProjectHomeImageList(fileList);
    form.setFieldsValue({ projectHomeImage: fileList });
  };

  const handleUploadChangeProjectHouseCoverImage = ({ fileList }: any) => {
    setProjectHouseCoverImageFileList(fileList);
    form.setFieldsValue({ projectHouseCoverImage: fileList });
  };

  const handleUploadChangeProjectHouseDisplayImage = ({ fileList }: any) => {
    setProjectHouseDisplayImageFileList(fileList);
    form.setFieldsValue({ projectHouseDisplayImage: fileList });
  };

  // Handle adding a new video input field
  const addVideoField = () => {
    setVideoLinks([...videoLinks, ""]);
  };

  // Handle removing a video input field
  const removeVideoField = (index: number) => {
    const updatedLinks = videoLinks.filter((_, i) => i !== index);
    setVideoLinks(updatedLinks);
    form.setFieldsValue({ youtubeVideos: updatedLinks });
  };

  // Handle change in video inputs
  const handleVideoChange = (index: number, value: string) => {
    const updatedLinks = [...videoLinks];
    updatedLinks[index] = value;
    setVideoLinks(updatedLinks);
    form.setFieldsValue({ youtubeVideos: updatedLinks });
  };

  const handleSubmit = async (values: any) => {
    // console.log("Received values of form: ", values);
    /**
     * properties to upload
     * projectImage*, projectPdf*, [projectHomeImage]*, projectHouseCoverImage*
     * projectHouseDisplayImage*, [projectHouseGallery], [stage2Images]
     */
    try {
      let projectHouseGallery: { publicId: string; url: string }[];
      let stage2Images:
        | { publicId: string; url: string }
        | { publicId: string; url: string }[];
      projectHouseGallery = values?.projectHouseGallery
        ? ((await uploadToCloudinary(
            values?.projectHouseGallery?.map(
              (fileObj: any) => fileObj.originFileObj
            )
          )) as { publicId: string; url: string }[])
        : [];

      stage2Images = values?.stage2Images
        ? await uploadToCloudinary(
            values?.stage2Images?.map((fileObj: any) => fileObj.originFileObj)
          )
        : [];

      const projectHomeImages = await uploadToCloudinary(
        values?.projectHomeImage?.map((fileObj: any) => fileObj.originFileObj)
      );

      const projectHouseCoverImage = await uploadToCloudinary(
        values?.projectHouseCoverImage[0]?.originFileObj
      );

      const projectImage = await uploadToCloudinary(
        values?.projectImages[0]?.originFileObj
      );

      const projectPdf = await uploadToCloudinary(
        values?.projectPdf[0]?.originFileObj
      );

      const projectHouseDisplayImage = await uploadToCloudinary(
        values?.projectHouseDisplayImage[0]?.originFileObj
      );

      const data = {
        parentPageId: getAllPageBySlugData?.id,
        projectTitle: {
          en: values?.projectTitleEn,
          ru: values?.projectTitleRu,
          tr: values?.projectTitleTr,
        },
        projectImage: projectImage,
        projectPdf: projectPdf,
        productLink: values.productLink,
        projectContent: {
          en: values.projectContentEn,
          ru: values.projectContentRu,
          tr: values.projectContentTr,
        },
        projectHouseTitle: {
          en: values.projectHouseTitleEn,
          ru: values.projectHouseTitleRu,
          tr: values.projectHouseTitleTr,
        },
        projectHomeImage: projectHomeImages,
        projectHouseCoverImage: projectHouseCoverImage,
        projectHouseDisplayImage: projectHouseDisplayImage,
        projectHomeContent: {
          en: values.projectHomeContentEn,
          ru: values.projectHomeContentRu,
          tr: values.projectHomeContentTr,
        },
        projectGeneralInfo: {
          en: values.projectGeneralInfoEn,
          ru: values.projectGeneralInfoRu,
          tr: values.projectGeneralInfoTr,
        },
        projectFeatures: {
          en: values.projectFeaturesEn,
          ru: values.projectFeaturesRu,
          tr: values.projectFeaturesTr,
        },
        optionalProjectFeatures: {
          en: values.optionalProjectFeaturesEn,
          ru: values.optionalProjectFeaturesRu,
          tr: values.optionalProjectFeaturesTr,
        },
        projectHouseGallery: projectHouseGallery?.map((obj) => ({
          imageUrl: obj,
        })),
        stage2Images: stage2Images,
        projectLocation: values.projectLocation,
        youtubeVideos: validateArray(values.youtubeVideos),
      };
      await createBulkProjectFn(data).unwrap();
      form.resetFields();
      setProjectFileList([]);
      setProjectPdfList([]);
      setProjectHomeImageList([]);
      setProjectHouseGallery([]);
      setStage2Images([]);
      setVideoLinks(["", ""]);

      //   console.log("DATA TO SUBMIT", data);
    } catch (error) {
      console.log("ERROR", error);
      console.error(error);
    }
  };

  useEffect(() => {
    if (createBulkProjectIsSuccess) {
      toast.success("Page created successfully");
      getAllPageBySlugRefetch();
    }

    if (createBulkProjectIsError) {
      const customErrorV1 = createBulkProjectError as {
        data: any;
        status: number;
      };
      const customErrorV2 = createBulkProjectError as {
        message: string | string[];
        error: string;
        statusCode: number;
      };
      toast.error(customErrorV1.data.message || customErrorV2.message);
    }
  }, [
    createBulkProjectIsSuccess,
    createBulkProjectIsError,
    createBulkProjectError,
    createBulkProjectData,
  ]);

  return (
    <section className="flex flex-col gap-10">
      <div className="p-6 bg-white dark:bg-[#1e293b] shadow-md rounded-md">
        <p className="text-[22px] text-secondaryShade dark:text-primaryShade font-bold uppercase mb-6">
          Add Project
        </p>

        <Form onFinish={handleSubmit} layout="vertical" form={form}>
          {/* PROJECT TITLE */}
          <div className="grid grid-cols-fluid-1 gap-4">
            <Form.Item
              label="Project Title (Turkish)"
              name="projectTitleTr"
              rules={[
                { required: true, message: "Project Title is required!" },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter Project Title in Turkish"
              />
            </Form.Item>
            <Form.Item
              label="Project Title (English)"
              name="projectTitleEn"
              rules={[
                { required: true, message: "Project Title is required!" },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter Project Title in English"
              />
            </Form.Item>
            <Form.Item
              label="Project Title (Russian)"
              name="projectTitleRu"
              rules={[
                { required: true, message: "Project Title is required!" },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter Project Title in Russian"
              />
            </Form.Item>
          </div>

          {/* PROJECT CONTENT */}
          <div>
            <p className="text-base text-secondaryShade dark:text-primaryShade font-bold uppercase mb-6">
              Project Content
            </p>

            <div className="flex flex-col gap-10">
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
                  >
                    <PlusOutlined />
                  </Upload>
                </Form.Item>
              </div>

              {/* PRODUCT LINK */}
              <Form.Item
                rules={[
                  { required: true, message: "Product Link is required!" },
                ]}
                label="Product Link"
                name="productLink"
              >
                <Input
                  size="large"
                  placeholder="Enter Project Title in Turkish"
                />
              </Form.Item>
            </div>

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

          {/* PROJECT HOUSE */}
          <div>
            <p className="text-base text-secondaryShade dark:text-primaryShade font-bold uppercase mb-6">
              Project Houses
            </p>

            {/* project house titles */}
            <div className="grid grid-cols-fluid-1 gap-4">
              <Form.Item
                label="Project House Title (Turkish)"
                name="projectHouseTitleTr"
                rules={[
                  {
                    required: true,
                    message: "Project House Title is required!",
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter Project House Title in Turkish"
                />
              </Form.Item>
              <Form.Item
                label="Project House Title (English)"
                name="projectHouseTitleEn"
                rules={[
                  {
                    required: true,
                    message: "Project House Title is required!",
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter Project House Title in English"
                />
              </Form.Item>
              <Form.Item
                label="Project House Title (Russian)"
                name="projectHouseTitleRu"
                rules={[
                  {
                    required: true,
                    message: "Project House Title is required!",
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter Project House Title in Russian"
                />
              </Form.Item>
            </div>

            {/* project house cover image and display image and home images */}
            <div className="flex items-center gap-10">
              <Form.Item
                label="Project House Cover Image"
                name="projectHouseCoverImage"
                valuePropName="fileList"
                getValueFromEvent={(e) => e?.fileList}
                rules={[
                  {
                    required: true,
                    message: "Project House Cover Image is required!",
                  },
                ]}
              >
                <Upload
                  name="file"
                  multiple={false}
                  beforeUpload={() => false}
                  listType="picture-card"
                  accept="image/*"
                  fileList={projectHouseCoverImageFileList}
                  onChange={handleUploadChangeProjectHouseCoverImage}
                  maxCount={1}
                >
                  <PlusOutlined />
                </Upload>
              </Form.Item>

              <Form.Item
                label="Project House Display Image"
                name="projectHouseDisplayImage"
                valuePropName="fileList"
                getValueFromEvent={(e) => e?.fileList}
                rules={[
                  {
                    required: true,
                    message: "Project House Display Image is required!",
                  },
                ]}
              >
                <Upload
                  name="file"
                  multiple={false}
                  beforeUpload={() => false}
                  listType="picture-card"
                  accept="image/*"
                  fileList={projectHouseDisplayImageFileList}
                  onChange={handleUploadChangeProjectHouseDisplayImage}
                  maxCount={1}
                >
                  <PlusOutlined />
                </Upload>
              </Form.Item>

              {/* project home images */}
              <Form.Item
                label="Upload Project Home Images (2)"
                name="projectHomeImage"
                valuePropName="fileList"
                getValueFromEvent={(e) => e?.fileList}
                rules={[
                  {
                    required: true,
                    message: "Project Home Image is required!",
                  },
                ]}
              >
                <Upload
                  name="file"
                  multiple={true}
                  beforeUpload={() => false}
                  listType="picture-card"
                  accept="image/*"
                  fileList={projectHomeImageList}
                  onChange={handleUploadChangeHomeImage}
                  maxCount={2}
                >
                  <PlusOutlined />
                </Upload>
              </Form.Item>
            </div>

            {/* project home content */}
            <div className="grid grid-cols-fluid-1 gap-4">
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Project Home Content is required!",
                  },
                ]}
                label="Project Home Content(Turkish)"
                name="projectHomeContentTr"
              >
                <ReactQuill
                  theme="snow"
                  placeholder="Enter project home content in Turkish"
                />
              </Form.Item>
              <Form.Item
                label="Project Home Content(English)"
                name="projectHomeContentEn"
                rules={[
                  {
                    required: true,
                    message: "Project Home Content is required!",
                  },
                ]}
              >
                <ReactQuill
                  theme="snow"
                  placeholder="Enter project home content in English"
                />
              </Form.Item>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Project Home Content is required!",
                  },
                ]}
                label="Project Home Content(Russian)"
                name="projectHomeContentRu"
              >
                <ReactQuill
                  theme="snow"
                  placeholder="Enter project home content in Russian"
                />
              </Form.Item>
            </div>

            {/* project house general info */}
            <div className="grid grid-cols-fluid-1 gap-4">
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Project General Info is required!",
                  },
                ]}
                label="Project General Info(Turkish)"
                name="projectGeneralInfoTr"
              >
                <ReactQuill
                  theme="snow"
                  placeholder="Enter project general info in Turkish"
                />
              </Form.Item>
              <Form.Item
                label="Project General Info(English)"
                name="projectGeneralInfoEn"
                rules={[
                  {
                    required: true,
                    message: "Project General Info is required!",
                  },
                ]}
              >
                <ReactQuill
                  theme="snow"
                  placeholder="Enter project general info in English"
                />
              </Form.Item>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Project General Info is required!",
                  },
                ]}
                label="Project General Info(Russian)"
                name="projectGeneralInfoRu"
              >
                <ReactQuill
                  theme="snow"
                  placeholder="Enter project general info in Russian"
                />
              </Form.Item>
            </div>

            {/* project house features */}
            <div className="grid grid-cols-fluid-1 gap-4">
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Project features is required!",
                  },
                ]}
                label="Project Features(Turkish)"
                name="projectFeaturesTr"
              >
                <ReactQuill
                  theme="snow"
                  placeholder="Enter project features in Turkish"
                />
              </Form.Item>
              <Form.Item
                label="Project Features(English)"
                name="projectFeaturesEn"
                rules={[
                  {
                    required: true,
                    message: "Project features is required!",
                  },
                ]}
              >
                <ReactQuill
                  theme="snow"
                  placeholder="Enter project features in English"
                />
              </Form.Item>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Project features is required!",
                  },
                ]}
                label="Project Features(Russian)"
                name="projectFeaturesRu"
              >
                <ReactQuill
                  theme="snow"
                  placeholder="Enter project features in Russian"
                />
              </Form.Item>
            </div>

            {/* project house optional features */}
            <div className="grid grid-cols-fluid-1 gap-4">
              <Form.Item
                label="Optional Project Features(Turkish)"
                name="optionalProjectFeaturesTr"
              >
                <ReactQuill
                  theme="snow"
                  placeholder="Enter optional project features in Turkish"
                />
              </Form.Item>
              <Form.Item
                label="Optional Project Features(English)"
                name="optionalProjectFeaturesEn"
              >
                <ReactQuill
                  theme="snow"
                  placeholder="Enter optional project features in English"
                />
              </Form.Item>
              <Form.Item
                label="Optional Project Features(Russian)"
                name="optionalProjectFeaturesRu"
              >
                <ReactQuill
                  theme="snow"
                  placeholder="Enter optional project features in Russian"
                />
              </Form.Item>
            </div>

            {/* project house gallery */}
            <div>
              <p className="text-sm text-black dark:text-gray-300 capitalize mb-2">
                Upload project house gallery
              </p>
              <div className="border-2 border-secondaryShade dark:border-primaryShade border-dashed rounded-xl w-full">
                <Form.Item
                  name="projectHouseGallery"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => e?.fileList}
                >
                  <Dragger
                    name="file"
                    multiple={true}
                    beforeUpload={(file) => false}
                    onChange={(info) => {
                      setProjectHouseGallery(info.fileList);
                    }}
                    listType="picture-card"
                    accept="image/*"
                    className=""
                    fileList={projectHouseGallery}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined className="!text-secondaryShade dark:!text-primaryShade" />
                    </p>
                    <p className="ant-upload-text !text-black dark:!text-gray-300">
                      Click or drag file to this area to upload
                    </p>
                  </Dragger>
                </Form.Item>
              </div>
            </div>
          </div>

          {/* OPTIONAL SECTIONS */}
          <div className="flex flex-col gap-4 mt-4">
            <p className="text-base text-secondaryShade dark:text-primaryShade font-bold uppercase mt-2">
              Optional Sections
            </p>
            {/* stage 2 */}
            <div>
              <p className="text-sm text-black dark:text-gray-300 capitalize mb-2">
                Upload stage 2 images
              </p>
              <div className="border-2 border-secondaryShade dark:border-primaryShade border-dashed rounded-xl w-full">
                <Form.Item
                  name="stage2Images"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => e?.fileList}
                >
                  <Dragger
                    name="file"
                    multiple={true}
                    beforeUpload={(file) => false}
                    onChange={(info) => {
                      setStage2Images(info.fileList);
                    }}
                    listType="picture-card"
                    accept="image/*"
                    className=""
                    fileList={stage2Images}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined className="!text-secondaryShade dark:!text-primaryShade" />
                    </p>
                    <p className="ant-upload-text !text-black dark:!text-gray-300">
                      Click or drag file to this area to upload
                    </p>
                  </Dragger>
                </Form.Item>
              </div>
            </div>

            {/* location */}
            <Form.Item label="Project Location" name="projectLocation">
              <Input
                size="large"
                placeholder="Enter project location from google maps"
              />
            </Form.Item>

            {/* youtube videos */}
            <div className="">
              <p className="mb-2">YouTube Videos</p>
              {videoLinks.map((link, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Form.Item
                    name={["youtubeVideos", index]}
                    className="flex-grow"
                  >
                    <Input
                      size="large"
                      placeholder="Enter YouTube video link"
                      value={link}
                      onChange={(e) => handleVideoChange(index, e.target.value)}
                    />
                  </Form.Item>
                  {index > 0 && (
                    <Button
                      type="default"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeVideoField(index)}
                    />
                  )}
                </div>
              ))}
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={addVideoField}
              >
                Add Video Link
              </Button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={() => form.submit()}
            type="button"
            className="ml-auto mt-4 px-6 py-2 rounded-md text-white cursor-pointer flex items-center justify-center bg-secondaryShade dark:bg-primaryShade border border-secondaryShade dark:border-primaryShade hover:bg-transparent hover:text-secondaryShade dark:hover:bg-transparent dark:hover:text-primaryShade transition-colors duration-300"
          >
            {createBulkProjectIsLoading ? (
              <div className="animate-spin border-t-2 border-white border-solid rounded-full w-5 h-5"></div> // Spinner
            ) : (
              <p className="uppercase font-medium">Submit</p>
            )}
          </button>
        </Form>
      </div>
    </section>
  );
};

export default page;
