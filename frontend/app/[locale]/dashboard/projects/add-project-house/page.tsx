"use client";
import { useGetPageBySlugQuery } from "@/redux/api/pageApiSlice";
import { useCreateProjectHouseMutation } from "@/redux/api/projectHouseApiSlice";
import {
  useDeleteFileMutation,
  useUploadFileMutation,
} from "@/redux/api/sectionApiSlice";
import { useAppSelector } from "@/redux/store";
import { InboxOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Input, Select, Upload } from "antd";
import Dragger from "antd/es/upload/Dragger";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
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

export const ensureArray = (value: any) =>
  Array.isArray(value) ? value : [value];

const page = (props: Props) => {
  // Dynamically load the ReactQuill component (to prevent SSR issues)
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill-new"), { ssr: false }),
    []
  );
  const nextPath = usePathname();
  const locale = nextPath.split("/")[1] as "en" | "tr" | "ru";
  const currentReduxUser = useAppSelector((state) => state.auth.user);
  const [projectHouseGallery, setProjectHouseGallery] = useState<any>([]);
  const [projectHouseCoverImageFileList, setProjectHouseCoverImageFileList] =
    useState<any>([]);
  const [
    projectHouseDisplayImageFileList,
    setProjectHouseDisplayImageFileList,
  ] = useState<any>([]);
  const [form] = Form.useForm();

  const { data: getProjects, refetch: getAllPageBySlugRefetch } =
    useGetPageBySlugQuery("projects", {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnFocus: true,
    });

  const [
    createProjectHouseFn,
    {
      isError: createProjectHouseIsError,
      isLoading: createProjectHouseIsLoading,
      isSuccess: createProjectHouseIsSuccess,
      error: createProjectHouseError,
      data: createProjectHouseData,
    },
  ] = useCreateProjectHouseMutation();

  const [
    uploadFileFn,
    {
      isError: uploadFileIsError,
      isLoading: uploadFileIsLoading,
      isSuccess: uploadFileIsSuccess,
      error: uploadFileError,
      data: uploadFileData,
    },
  ] = useUploadFileMutation();

  const handleUploadChangeProjectHouseCoverImage = ({ fileList }: any) => {
    setProjectHouseCoverImageFileList(fileList);
    form.setFieldsValue({ projectHouseCoverImage: fileList });
  };

  const handleUploadChangeProjectHouseDisplayImage = ({ fileList }: any) => {
    setProjectHouseDisplayImageFileList(fileList);
    form.setFieldsValue({ projectHouseDisplayImage: fileList });
  };

  const handleSubmit = async (values: any) => {
    if (currentReduxUser?.role !== "admin") {
      toast.error("You cannot perform this action");
      return;
    }
    /**
     * properties to upload
     * projectHouseCoverImage*
     * projectHouseDisplayImage*, [projectHouseGallery]
     */
    try {
      let formData = new FormData();
      let tags: string[] = [];
      let files: File[] = [];

      // Helper function to add files and tags
      const addFilesWithTags = (fileList: any[], tag: string) => {
        fileList?.forEach((fileObj) => {
          files.push(fileObj.originFileObj);
          tags.push(tag);
        });
      };

      addFilesWithTags(values?.projectHouseGallery, "projectHouseGallery");
      addFilesWithTags(
        values?.projectHouseCoverImage,
        "projectHouseCoverImage"
      );
      addFilesWithTags(
        values?.projectHouseDisplayImage,
        "projectHouseDisplayImage"
      );

      // Append files as a single array
      files.forEach((file) => formData.append("files", file));

      // Append the tags array as a JSON string
      formData.append("tags", JSON.stringify(tags));

      const uploadedFiles = await uploadFileFn(formData).unwrap();

      const data = {
        projectPage: values?.projectPage,
        title: {
          en: values.projectHouseTitleEn,
          ru: values.projectHouseTitleRu,
          tr: values.projectHouseTitleTr,
        },
        coverImage: uploadedFiles["projectHouseCoverImage"],
        displayImage: uploadedFiles["projectHouseDisplayImage"],
        generalInfo: {
          en: values.projectGeneralInfoEn,
          ru: values.projectGeneralInfoRu,
          tr: values.projectGeneralInfoTr,
        },
        features: {
          en: values.projectFeaturesEn,
          ru: values.projectFeaturesRu,
          tr: values.projectFeaturesTr,
        },
        optionalFeatures: {
          en: values.optionalProjectFeaturesEn,
          ru: values.optionalProjectFeaturesRu,
          tr: values.optionalProjectFeaturesTr,
        },
        gallery: validateArray(
          ensureArray(uploadedFiles["projectHouseGallery"])
        ),
      };
      await createProjectHouseFn(data).unwrap();
      form.resetFields();
      setProjectHouseGallery([]);
      setProjectHouseCoverImageFileList([]);
      setProjectHouseDisplayImageFileList([]);

      //   console.log("DATA TO SUBMIT", data);
    } catch (error) {
      console.log("ERROR", error);
      console.error(error);
    }
  };

  useEffect(() => {
    if (createProjectHouseIsSuccess) {
      toast.success("Page created successfully");
      getAllPageBySlugRefetch();
    }

    if (createProjectHouseIsError) {
      const customErrorV1 = createProjectHouseError as {
        data: any;
        status: number;
      };
      const customErrorV2 = createProjectHouseError as {
        message: string | string[];
        error: string;
        statusCode: number;
      };
      toast.error(customErrorV1.data.message || customErrorV2.message);
    }
  }, [
    createProjectHouseIsSuccess,
    createProjectHouseIsError,
    createProjectHouseError,
    createProjectHouseData,
  ]);

  useEffect(() => {
    // if (uploadFileIsSuccess) {
    //   toast.success(uploadFileData?.message);
    // }

    if (uploadFileIsError) {
      const customError = uploadFileError as { data: any; status: number };
      toast.error(customError.data.message + ",Each file cannot exceed 10MB");
    }
  }, [uploadFileIsSuccess, uploadFileIsError, uploadFileError, uploadFileData]);

  return (
    <section className="flex flex-col gap-10">
      <div className="p-6 bg-white dark:bg-[#1e293b] shadow-md rounded-md">
        <p className="text-[22px] text-secondaryShade dark:text-primaryShade font-bold uppercase mb-6">
          Add Project House
        </p>

        <Form onFinish={handleSubmit} layout="vertical" form={form}>
          {/* PROJECT HOUSE */}
          <div>
            {/* project house titles */}
            <div className="grid grid-cols-fluid-1 gap-4">
              <Form.Item
                label="Project Page"
                name="projectPage"
                rules={[
                  {
                    required: true,
                    message: "Project Page is required!",
                  },
                ]}
              >
                <Select
                  size="large"
                  placeholder="Enter Project Page"
                  options={getProjects?.subPages?.map((page: any) => ({
                    label: page.title[locale],
                    value: page?.id,
                  }))}
                />
              </Form.Item>
            </div>

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

          {/* Submit Button */}
          <button
            onClick={() => form.submit()}
            type="button"
            disabled={createProjectHouseIsLoading || uploadFileIsLoading}
            className="ml-auto mt-4 px-6 py-2 rounded-md text-white cursor-pointer flex items-center justify-center bg-secondaryShade dark:bg-primaryShade border border-secondaryShade dark:border-primaryShade hover:bg-transparent hover:text-secondaryShade dark:hover:bg-transparent dark:hover:text-primaryShade transition-colors duration-300"
          >
            {createProjectHouseIsLoading || uploadFileIsLoading ? (
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
