"use client";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";
import { useDeleteFileFromCloudinaryMutation } from "@/redux/api/cloudinaryApiSlice";
import { useGetPageBySlugQuery } from "@/redux/api/pageApiSlice";
import { useUpdateProjectHouseMutation } from "@/redux/api/projectHouseApiSlice";
import { Page } from "@/utils/interfaces";
import { EditOutlined, InboxOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Input, Modal, Upload } from "antd";
import Dragger from "antd/es/upload/Dragger";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  pageData?: Partial<Page>;
  refetchEditedData?: any;
};

const ProjectHouse = ({ pageData, refetchEditedData }: Props) => {
  const [form] = Form.useForm();
  const params = useParams() as { locale: string; slug: string };
  // Dynamically load the ReactQuill component (to prevent SSR issues)
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill-new"), { ssr: false }),
    []
  );
  const [record, setRecord] = useState<any>(null);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const [projectHomeImageList, setProjectHomeImageList] = useState<any>([]);
  const [projectHouseGallery, setProjectHouseGallery] = useState<any>([]);
  const [projectHouseCoverImageFileList, setProjectHouseCoverImageFileList] =
    useState<any>([]);
  const [
    projectHouseDisplayImageFileList,
    setProjectHouseDisplayImageFileList,
  ] = useState<any>([]);

  const [isCoverImageUploadToCloud, setIsCoverImageUploadToCloud] =
    useState<boolean>(false);
  const [isDisplayImageUploadToCloud, setIsDisplayImageUploadToCloud] =
    useState<boolean>(false);
  const [isHomeImageUploadToCloud, setIsHomeImageUploadToCloud] =
    useState<boolean>(false);
  const [isGalleryImageUploadToCloud, setIsGalleryImageUploadToCloud] =
    useState<boolean>(false);

  const { data: getPageBySlugData } = useGetPageBySlugQuery(params.slug, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });

  const [
    deleteFileFromCloudinaryFn,
    { isLoading: deleteFileFromCloudinaryIsLoading },
  ] = useDeleteFileFromCloudinaryMutation();

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

  const handleSubmit = async (values: any) => {
    try {
      let coverImage;
      let displayImage;
      let gallery = [];
      let homeImages = [];

      /**
       * Cover Image
       */
      if (!values.projectHouseCoverImage?.[0]?.url) {
        coverImage = await uploadToCloudinary(
          values.projectHouseCoverImage[0]?.originFileObj,
          setIsCoverImageUploadToCloud
        );
        if (values.projectHouseCoverImage?.[0]?.uid) {
          await deleteFileFromCloudinaryFn({
            publicId: values.projectHouseCoverImage[0]?.uid,
          }).unwrap();
        }
      } else {
        coverImage = {
          publicId: values.projectHouseCoverImage[0]?.uid,
          url: values.projectHouseCoverImage[0]?.url,
        };
      }

      /**
       * Display Image
       */
      if (!values.projectHouseDisplayImage?.[0]?.url) {
        displayImage = await uploadToCloudinary(
          values.projectHouseDisplayImage[0]?.originFileObj,
          setIsDisplayImageUploadToCloud
        );
        if (values.projectHouseDisplayImage?.[0]?.uid) {
          await deleteFileFromCloudinaryFn({
            publicId: values.projectHouseDisplayImage[0]?.uid,
          }).unwrap();
        }
      } else {
        displayImage = {
          publicId: values.projectHouseDisplayImage[0]?.uid,
          url: values.projectHouseDisplayImage[0]?.url,
        };
      }

      /**
       * Home Images
       */
      for (const value of values.projectHomeImage) {
        let imageData;

        if (!value?.url) {
          // Upload new image to Cloudinary
          imageData = await uploadToCloudinary(
            value?.originFileObj,
            setIsHomeImageUploadToCloud
          );

          // Delete old image if `uid` exists
          if (value?.uid) {
            await deleteFileFromCloudinaryFn({
              publicId: value.uid,
            }).unwrap();
          }
        } else {
          // Keep existing image data
          imageData = {
            publicId: value.uid,
            url: value.url,
          };
        }

        // Collect processed image data
        homeImages.push(imageData);
      }

      /**
       * Gallery
       */
      if (values?.projectHouseGallery?.length > 0) {
        for (const value of values.projectHouseGallery) {
          let imageData;

          if (!value?.url) {
            // Upload new image to Cloudinary
            imageData = await uploadToCloudinary(
              value?.originFileObj,
              setIsGalleryImageUploadToCloud
            );

            // Delete old image if `uid` exists
            if (value?.uid) {
              await deleteFileFromCloudinaryFn({
                publicId: value.uid,
              }).unwrap();
            }
          } else {
            // Keep existing image data
            imageData = {
              publicId: value.uid,
              url: value.url,
            };
          }

          // Collect processed image data
          gallery.push({ imageUrl: imageData });
        }
      }

      // DATA
      const targetData = {
        id: record?.id,
        coverImage,
        displayImage,
        gallery,
        homeImages,
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
        homeText: {
          en: values.projectHomeContentEn,
          tr: values.projectHomeContentTr,
          ru: values.projectHomeContentRu,
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
      const coverImage = record.coverImage
        ? [
            {
              url: record.coverImage.url,
              uid: record.coverImage.publicId,
              name: "image",
              status: "done",
            },
          ]
        : [];
      const displayImage = record.displayImage
        ? [
            {
              url: record.displayImage.url,
              uid: record.displayImage.publicId,
              name: "image",
              status: "done",
            },
          ]
        : [];
      const homeImages = record.homeImages
        ? record?.homeImages?.map((img: any) => ({
            url: img.url,
            uid: img.publicId,
            name: "image",
            status: "done",
          }))
        : [];
      const gallery = record.gallery
        ? record?.gallery?.map((img: any) => ({
            url: img.url,
            uid: img.publicId,
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
        projectHomeContentTr: record.homeText?.tr,
        projectHomeContentEn: record.homeText?.en,
        projectHomeContentRu: record.homeText?.ru,
        projectHouseGallery: gallery,
        projectHomeImage: homeImages,
        projectHouseDisplayImage: displayImage,
        projectHouseCoverImage: coverImage,
      });

      setProjectHouseCoverImageFileList(coverImage);

      setProjectHouseDisplayImageFileList(displayImage);

      setProjectHomeImageList(homeImages);

      setProjectHouseGallery(gallery);
    }
  }, [record, form]);

  useEffect(() => {
    if (updateProjectHouseIsSuccess) {
      toast.success("Project house updated successfully");
      refetchEditedData(getPageBySlugData?.slug);
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

  return (
    <>
      <div className="flex flex-wrap gap-6">
        {getPageBySlugData?.projectHouse?.map((obj: any) => (
          <div className="flex items-center gap-1">
            <p>{obj.title.en}</p>
            <EditOutlined
              onClick={() => {
                setRecord(obj);
                setIsOpenModal(true);
              }}
            />
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

          <button
            onClick={() => form.submit()}
            type="button"
            className="ml-auto mt-4 px-6 py-2 rounded-md text-white cursor-pointer flex items-center justify-center bg-secondaryShade dark:bg-primaryShade border border-secondaryShade dark:border-primaryShade hover:bg-transparent hover:text-secondaryShade dark:hover:bg-transparent dark:hover:text-primaryShade transition-colors duration-300"
            disabled={
              isCoverImageUploadToCloud ||
              isDisplayImageUploadToCloud ||
              isHomeImageUploadToCloud ||
              isGalleryImageUploadToCloud ||
              deleteFileFromCloudinaryIsLoading ||
              updateProjectHouseIsLoading
            }
          >
            {isCoverImageUploadToCloud ||
            isDisplayImageUploadToCloud ||
            isHomeImageUploadToCloud ||
            isGalleryImageUploadToCloud ||
            deleteFileFromCloudinaryIsLoading ||
            updateProjectHouseIsLoading ? (
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
