"use client";
import { extractedPath } from "@/app/[locale]/dashboard/blog/page";
import {
  ensureArray,
  validateArray,
} from "@/app/[locale]/dashboard/projects/add-project/page";
import { baseUrl } from "@/constants";
import { useGetPageBySlugQuery } from "@/redux/api/pageApiSlice";
import {
  useDeleteProjectHouseMutation,
  useUpdateProjectHouseMutation,
} from "@/redux/api/projectHouseApiSlice";
import { useUploadFileMutation } from "@/redux/api/sectionApiSlice";
import { prepareFileUpload } from "@/utils";
import { Page } from "@/utils/interfaces";
import {
  DeleteOutlined,
  EditOutlined,
  InboxOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Form, Input, Modal, Popconfirm, Upload } from "antd";
import Dragger from "antd/es/upload/Dragger";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  pageData?: Partial<Page>;
};

const ProjectHouse = ({ pageData }: Props) => {
  const [form] = Form.useForm();
  const params = useParams() as { locale: string; slug: string };
  // Dynamically load the ReactQuill component (to prevent SSR issues)
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill-new"), { ssr: false }),
    []
  );
  const [record, setRecord] = useState<any>(null);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [projectHouseGallery, setProjectHouseGallery] = useState<any>([]);
  const [projectHouseCoverImageFileList, setProjectHouseCoverImageFileList] =
    useState<any>([]);
  const [
    projectHouseDisplayImageFileList,
    setProjectHouseDisplayImageFileList,
  ] = useState<any>([]);

  const { data: getPageBySlugData } = useGetPageBySlugQuery(params.slug, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });

  const [
    deleteProjectHouse,
    {
      isLoading: deleteProjectHouseLoading,
      isError: deleteProjectHouseIsError,
      error: deleteProjectHouseError,
      data: deleteProjectHouseData,
      isSuccess: deleteProjectHouseIsSuccess,
    },
  ] = useDeleteProjectHouseMutation();

  const [
    updateProjectHouseFn,
    {
      isLoading: updateProjectHouseIsLoading,
      isError: updateProjectHouseIsError,
      error: updateProjectHouseError,
      data: updateProjectHouseData,
      isSuccess: updateProjectHouseIsSuccess,
    },
  ] = useUpdateProjectHouseMutation();

  const [uploadFileFn, { isLoading: uploadFileIsLoading }] =
    useUploadFileMutation();

  const handleUploadChangeProjectHouseCoverImage = ({ fileList }: any) => {
    setProjectHouseCoverImageFileList(fileList);
    form.setFieldsValue({ projectHouseCoverImage: fileList });
  };

  const handleUploadChangeProjectHouseDisplayImage = ({ fileList }: any) => {
    setProjectHouseDisplayImageFileList(fileList);
    form.setFieldsValue({ projectHouseDisplayImage: fileList });
  };

  const handleDeleteProjectHouse = async (id: number) => {
    try {
      await deleteProjectHouse(id).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (values: any) => {
    const prepareUpload = (value: any, formData: FormData, tag: string) => {
      if (!value.url) {
        formData.append("files", value.originFileObj);
        formData.append("tags", tag);

        return null;
      }
      return extractedPath(value.url);
    };
    try {
      let coverImageFormData = new FormData();
      let displayImageFormData = new FormData();

      let projectHouseCoverImage = prepareFileUpload(
        values,
        "projectHouseCoverImage",
        coverImageFormData,
        "projectHouseCoverImage",
        [],
        ""
      );

      let projectHouseDisplayImage = prepareFileUpload(
        values,
        "projectHouseDisplayImage",
        displayImageFormData,
        "projectHouseDisplayImage",
        [],
        ""
      );

      if (!projectHouseCoverImage)
        projectHouseCoverImage = await uploadFileFn(
          coverImageFormData
        ).unwrap();
      if (!projectHouseDisplayImage)
        projectHouseDisplayImage = await uploadFileFn(
          displayImageFormData
        ).unwrap();

      projectHouseCoverImage =
        typeof projectHouseCoverImage === "string"
          ? extractedPath(projectHouseCoverImage)
          : ensureArray(projectHouseCoverImage?.projectHouseCoverImage)?.map(
              (item: string) => extractedPath(item)
            );
      projectHouseDisplayImage =
        typeof projectHouseDisplayImage === "string"
          ? extractedPath(projectHouseDisplayImage)
          : ensureArray(
              projectHouseDisplayImage?.projectHouseDisplayImage
            )?.map((item: string) => extractedPath(item));

      // project house gallery
      let galleryFormData = new FormData();
      let galleryImages: string[] = [];
      for (const value of values.projectHouseGallery) {
        const arr = prepareUpload(
          value,
          galleryFormData,
          "projectHouseGallery"
        );

        if (arr) {
          galleryImages.push(arr);
        }
      }
      const isGalleryFormDataEmpty = galleryFormData.entries().next().done;
      if (!isGalleryFormDataEmpty) {
        const arr = await uploadFileFn(galleryFormData).unwrap();
        ensureArray(arr.projectHouseGallery)?.forEach((img: string) =>
          galleryImages.push(img)
        );
      }

      // DATA
      const targetData = {
        id: record?.id,
        coverImage: ensureArray(projectHouseCoverImage)[0],
        displayImage: ensureArray(projectHouseDisplayImage)[0],
        gallery: validateArray(ensureArray(galleryImages)),
        title: {
          en: values.projectHouseTitleEn,
          tr: values.projectHouseTitleTr,
          ru: values.projectHouseTitleRu,
        },
        generalInfo: {
          en: values.projectGeneralInfoEn,
          tr: values.projectGeneralInfoTr,
          ru: values.projectGeneralInfoRu,
        },
        features: {
          en: values.projectFeaturesEn,
          tr: values.projectFeaturesTr,
          ru: values.projectFeaturesRu,
        },
        optionalFeatures: {
          en: values.optionalProjectFeaturesEn || "",
          tr: values.optionalProjectFeaturesTr || "",
          ru: values.optionalProjectFeaturesRu || "",
        },
      };

      await updateProjectHouseFn(targetData).unwrap();
      setIsOpenModal(false);
      setRecord(null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (record) {
      const coverImage = `${baseUrl}${record.coverImage}`
        ? [
            {
              url: `${baseUrl}${record.coverImage}`,
              uid: `${baseUrl}${record.coverImage}`,
              name: "image",
              status: "done",
            },
          ]
        : [];
      const displayImage = `${baseUrl}${record.displayImage}`
        ? [
            {
              url: `${baseUrl}${record.displayImage}`,
              uid: `${baseUrl}${record.displayImage}`,
              name: "image",
              status: "done",
            },
          ]
        : [];
      const gallery = record.gallery
        ? record?.gallery?.map((img: any) => ({
            url: `${baseUrl}${img}`,
            uid: `${baseUrl}${img}`,
            name: "image",
            status: "done",
          }))
        : [];

      form.setFieldsValue({
        projectHouseTitleTr: record.title.tr,
        projectHouseTitleEn: record.title.en,
        projectHouseTitleRu: record.title.ru,
        projectGeneralInfoTr: record.generalInfo?.tr,
        projectGeneralInfoEn: record.generalInfo?.en,
        projectGeneralInfoRu: record.generalInfo?.ru,
        projectFeaturesTr: record.features?.tr,
        projectFeaturesEn: record.features?.en,
        projectFeaturesRu: record.features?.ru,
        optionalProjectFeaturesTr: record.optionalFeatures?.tr,
        optionalProjectFeaturesEn: record.optionalFeatures?.en,
        optionalProjectFeaturesRu: record.optionalFeatures?.ru,
        projectHouseGallery: gallery,
        projectHouseDisplayImage: displayImage,
        projectHouseCoverImage: coverImage,
      });

      setProjectHouseCoverImageFileList(coverImage);

      setProjectHouseDisplayImageFileList(displayImage);

      setProjectHouseGallery(gallery);
    }
  }, [record, form]);

  useEffect(() => {
    if (updateProjectHouseIsSuccess) {
      toast.success("Project house updated successfully");
      setIsOpenModal(false);
      setRecord(null);
    }

    if (updateProjectHouseIsError) {
      const customErrorV1 = updateProjectHouseError as {
        data: any;
        status: number;
      };
      const customErrorV2 = updateProjectHouseError as {
        message: string | string[];
        error: string;
        statusCode: number;
      };
      toast.error(customErrorV1.data.message || customErrorV2.message);
    }
  }, [
    updateProjectHouseIsSuccess,
    updateProjectHouseIsError,
    updateProjectHouseError,
    updateProjectHouseData,
  ]);

  useEffect(() => {
    if (deleteProjectHouseIsSuccess) {
      toast.success("Project house deleted successfully");
    }

    if (deleteProjectHouseIsError) {
      const customErrorV1 = deleteProjectHouseError as {
        data: any;
        status: number;
      };
      const customErrorV2 = deleteProjectHouseError as {
        message: string | string[];
        error: string;
        statusCode: number;
      };
      toast.error(customErrorV1.data.message || customErrorV2.message);
    }
  }, [
    deleteProjectHouseIsSuccess,
    deleteProjectHouseIsError,
    deleteProjectHouseError,
    deleteProjectHouseData,
  ]);

  return (
    <>
      <div className="flex flex-wrap gap-6">
        {getPageBySlugData?.projectHouse?.map((obj: any) => (
          <div className="flex items-center gap-3">
            <p>{obj.title.en}</p>
            <div className="flex items-center gap-1">
              <EditOutlined
                onClick={() => {
                  setRecord(obj);
                  setIsOpenModal(true);
                }}
              />
              <Popconfirm
                title="Are you sure?"
                onConfirm={() => handleDeleteProjectHouse(obj?.id)}
              >
                <DeleteOutlined />
              </Popconfirm>
            </div>
          </div>
        ))}
      </div>
      <Modal
        onCancel={() => {
          setIsOpenModal(false);
          setRecord(null);
        }}
        onClose={() => {
          setIsOpenModal(false);
          setRecord(null);
        }}
        open={isOpenModal}
        width={{
          xs: "100%",
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
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

          <button
            onClick={() => form.submit()}
            type="button"
            className="ml-auto mt-4 px-6 py-2 rounded-md text-white cursor-pointer flex items-center justify-center bg-secondaryShade dark:bg-primaryShade border border-secondaryShade dark:border-primaryShade hover:bg-transparent hover:text-secondaryShade dark:hover:bg-transparent dark:hover:text-primaryShade transition-colors duration-300"
            disabled={uploadFileIsLoading || updateProjectHouseIsLoading}
          >
            {uploadFileIsLoading || updateProjectHouseIsLoading ? (
              <div className="animate-spin border-t-2 border-white border-solid rounded-full w-5 h-5"></div> // Spinner
            ) : (
              <p className="uppercase font-medium">Save</p>
            )}
          </button>
        </Form>
      </Modal>
    </>
  );
};

export default ProjectHouse;
