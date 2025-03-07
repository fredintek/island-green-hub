"use client";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";
import { useDeleteFileFromCloudinaryMutation } from "@/redux/api/cloudinaryApiSlice";
import {
  useCreateBulkAboutPageMutation,
  useDeletePageMutation,
  useGetPageBySlugQuery,
  useLazyGetPageByIdQuery,
  useUpdateBulkAboutPageMutation,
} from "@/redux/api/pageApiSlice";
import { Page } from "@/utils/interfaces";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Input, Modal, Popconfirm, Table, Upload } from "antd";
import { ColumnsType } from "antd/es/table";
import { useLocale } from "next-intl";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

type Props = {};

const page = (props: Props) => {
  // Dynamically load the ReactQuill component (to prevent SSR issues)
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill-new"), { ssr: false }),
    []
  );
  const locale = useLocale();
  const [form] = Form.useForm();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [record, setRecord] = useState<any>(null);
  const [contentImage, setContentImage] = useState<any>([]);
  const [isContentImageUploadToCloud, setIsContentImageUploadToCloud] =
    useState<boolean>(false);

  const { data: getAllPageBySlugData, refetch: getAllPageBySlugRefetch } =
    useGetPageBySlugQuery("about", {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnFocus: true,
    });

  const [getLazyPageById] = useLazyGetPageByIdQuery();

  const [
    deletePageFn,
    {
      isLoading: deletePageIsLoading,
      isError: deletePageIsError,
      error: deletePageError,
      data: deletePageData,
      isSuccess: deletePageIsSuccess,
    },
  ] = useDeletePageMutation();

  const [
    createBulkAboutPageFn,
    {
      isLoading: createBulkAboutPageIsLoading,
      isError: createBulkAboutPageIsError,
      error: createBulkAboutPageError,
      data: createBulkAboutPageData,
      isSuccess: createBulkAboutPageIsSuccess,
    },
  ] = useCreateBulkAboutPageMutation();

  const [
    deleteFileFromCloudinaryFn,
    { isLoading: deleteFileFromCloudinaryIsLoading },
  ] = useDeleteFileFromCloudinaryMutation();

  const [
    updateBulkAboutPageFn,
    {
      isLoading: updateBulkAboutPageIsLoading,
      isError: updateBulkAboutPageIsError,
      error: updateBulkAboutPageError,
      data: updateBulkAboutPageData,
      isSuccess: updateBulkAboutPageIsSuccess,
    },
  ] = useUpdateBulkAboutPageMutation();

  const handleUploadContentImage = ({ fileList }: any) => {
    setContentImage(fileList);
    form.setFieldsValue({ contentImage: fileList });
  };

  const handleEdit = async (record: Partial<Page>) => {
    setIsOpenModal(true);
    try {
      const singlePage = await getLazyPageById(record?.id).unwrap();
      setRecord(singlePage);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (record: Partial<Page>) => {
    try {
      await deletePageFn(record?.id).unwrap();
    } catch (error) {
      console.error("Failed to delete page", error);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (record) {
        const targetData = {
          id: record?.id,
          title: {
            tr: values.pageTitleTr,
            en: values.pageTitleEn,
            ru: values.pageTitleRu,
          },
          content: {
            text: {
              en: values.pageContentEn,
              tr: values.pageContentTr,
              ru: values.pageContentRu,
            },
            image: values?.contentImage[0]?.url
              ? {
                  publicId: values?.contentImage[0]?.publicId,
                  url: values?.contentImage[0]?.url,
                }
              : await uploadToCloudinary(
                  values?.contentImage[0]?.originFileObj,
                  setIsContentImageUploadToCloud
                ),
          },
          sectionType: values.pageTitleEn,
        };

        const targetSection = record?.sections?.find(
          (obj: any) => obj.type === record?.title?.en
        );

        if (!values?.contentImage[0]?.url) {
          await deleteFileFromCloudinaryFn({
            publicId: targetSection?.content?.image?.publicId,
          }).unwrap();
        }
        await updateBulkAboutPageFn(targetData).unwrap();
      } else {
        const targetData = {
          title: {
            tr: values.pageTitleTr,
            en: values.pageTitleEn,
            ru: values.pageTitleRu,
          },
          content: {
            text: {
              en: values.pageContentEn,
              tr: values.pageContentTr,
              ru: values.pageContentRu,
            },
            image: await uploadToCloudinary(
              values?.contentImage[0]?.originFileObj,
              setIsContentImageUploadToCloud
            ),
          },
          sectionType: values.pageTitleEn,
          parentPageId: getAllPageBySlugData?.id,
        };

        await createBulkAboutPageFn(targetData).unwrap();
      }
      setIsOpenModal(false);
      setRecord(null);
    } catch (error) {
      console.error(error);
    }
  };

  const columnAbout: ColumnsType<Partial<Page>> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => text[locale],
    },

    {
      title: "Action",
      key: "action",
      render: (text: any, record: Partial<Page>) => (
        <div className="flex items-center gap-4 text-lg text-gray-500">
          <button type="button" className="cursor-pointer">
            <EditOutlined onClick={() => handleEdit(record)} />
          </button>
          <button type="button" className="cursor-pointer">
            <Popconfirm
              onConfirm={() => handleDelete(record)}
              title="Are you sure you want to delete this project?"
            >
              <DeleteOutlined />
            </Popconfirm>
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (record) {
      const targetSection = record?.sections?.find(
        (item: any) => item.type === record.title.en
      );
      form.setFieldsValue({
        pageTitleTr: record.title.tr,
        pageTitleEn: record.title.en,
        pageTitleRu: record.title.ru,
        pageContentTr: targetSection?.content?.text?.tr,
        pageContentEn: targetSection?.content?.text?.en,
        pageContentRu: targetSection?.content?.text?.ru,
        contentImage: [
          {
            uid: targetSection?.content?.image.publicId,
            name: "image",
            status: "done",
            url: targetSection?.content?.image.url,
          },
        ],
      });
    }
  }, [record, form]);

  useEffect(() => {
    if (deletePageIsSuccess) {
      toast.success("Page deleted successfully");
      getAllPageBySlugRefetch();
    }

    if (deletePageIsError) {
      const customError = deletePageError as {
        data: any;
        status: number;
      };
      toast.error(customError.data.message);
    }
  }, [deletePageIsSuccess, deletePageIsError, deletePageError, deletePageData]);

  useEffect(() => {
    if (createBulkAboutPageIsSuccess) {
      toast.success("Page created successfully");
      getAllPageBySlugRefetch();
    }

    if (createBulkAboutPageIsError) {
      const customError = createBulkAboutPageError as {
        data: any;
        status: number;
      };
      toast.error(customError.data.message);
    }
  }, [
    createBulkAboutPageIsSuccess,
    createBulkAboutPageIsError,
    createBulkAboutPageError,
    createBulkAboutPageData,
  ]);

  useEffect(() => {
    if (updateBulkAboutPageIsSuccess) {
      toast.success("Page updated successfully");
      getAllPageBySlugRefetch();
    }

    if (updateBulkAboutPageIsError) {
      const customError = updateBulkAboutPageError as {
        data: any;
        status: number;
      };
      toast.error(customError.data.message);
    }
  }, [
    updateBulkAboutPageIsSuccess,
    updateBulkAboutPageIsError,
    updateBulkAboutPageError,
    updateBulkAboutPageData,
  ]);

  return (
    <section className="flex flex-col gap-10">
      <div className="p-6 bg-white dark:bg-[#1e293b] shadow-md rounded-md">
        <p className="text-[22px] text-secondaryShade dark:text-primaryShade font-bold uppercase mb-6">
          About Us
        </p>

        <div>
          <button
            onClick={() => {
              setIsOpenModal(true);
              setRecord(null);
            }}
            type="button"
            className="mb-4 px-6 py-2 rounded-md text-white cursor-pointer flex gap-2 items-center justify-center bg-secondaryShade dark:bg-primaryShade border border-secondaryShade dark:border-primaryShade hover:bg-transparent hover:text-secondaryShade dark:hover:bg-transparent dark:hover:text-primaryShade transition-colors duration-300"
          >
            <PlusOutlined className="text-lg" />
            <p className="uppercase font-medium text-sm">Add Page</p>
          </button>

          <Table
            columns={columnAbout}
            dataSource={getAllPageBySlugData?.subPages || []}
            scroll={{ x: 768 }}
            className=""
          />
        </div>
      </div>

      {/* add/edit 360 view */}
      <Modal
        onCancel={() => {
          setIsOpenModal(false);
          setRecord(null);
          form.resetFields();
        }}
        onClose={() => {
          setIsOpenModal(false);
          setRecord(null);
          form.resetFields();
        }}
        open={isOpenModal}
        width={{
          xs: "100%",
        }}
        footer={null}
      >
        <Form onFinish={handleSubmit} layout="vertical" form={form}>
          {/* PAGE TITLE */}
          <div className="grid grid-cols-fluid-1 gap-4">
            <Form.Item
              label="Page Title (Turkish)"
              name="pageTitleTr"
              rules={[{ required: true, message: "Page Title is required!" }]}
            >
              <Input size="large" placeholder="Enter Page Title in Turkish" />
            </Form.Item>
            <Form.Item
              label="Page Title (English)"
              name="pageTitleEn"
              rules={[{ required: true, message: "Page Title is required!" }]}
            >
              <Input size="large" placeholder="Enter Page Title in English" />
            </Form.Item>
            <Form.Item
              label="Page Title (Russian)"
              name="pageTitleRu"
              rules={[{ required: true, message: "Page Title is required!" }]}
            >
              <Input size="large" placeholder="Enter Page Title in Russian" />
            </Form.Item>
          </div>

          {/* PAGE CONTENT */}
          <div className="grid grid-cols-fluid-1 gap-4">
            <Form.Item
              rules={[{ required: true, message: "Page Content is required!" }]}
              label="Page Content(Turkish)"
              name="pageContentTr"
            >
              <ReactQuill
                theme="snow"
                placeholder="Enter page content in Turkish"
              />
            </Form.Item>
            <Form.Item
              label="Page Content(English)"
              name="pageContentEn"
              rules={[{ required: true, message: "Page Content is required!" }]}
            >
              <ReactQuill
                theme="snow"
                placeholder="Enter page content in English"
              />
            </Form.Item>
            <Form.Item
              rules={[{ required: true, message: "Page Content is required!" }]}
              label="Page Content(Russian)"
              name="pageContentRu"
            >
              <ReactQuill
                theme="snow"
                placeholder="Enter page content in Russian"
              />
            </Form.Item>
          </div>

          {/* project home images */}
          <Form.Item
            label="Upload Content Image"
            name="contentImage"
            valuePropName="fileList"
            getValueFromEvent={(e) => e?.fileList}
            rules={[
              {
                required: true,
                message: "Content Image is required!",
              },
            ]}
          >
            <Upload
              name="file"
              multiple={false}
              beforeUpload={() => false}
              listType="picture-card"
              accept="image/*"
              fileList={contentImage}
              onChange={handleUploadContentImage}
              maxCount={1}
            >
              <PlusOutlined />
            </Upload>
          </Form.Item>

          <button
            onClick={() => form.submit()}
            type="button"
            className="ml-auto mt-2 px-6 py-2 rounded-md text-white cursor-pointer flex items-center justify-center bg-secondaryShade dark:bg-primaryShade border border-secondaryShade dark:border-primaryShade hover:bg-transparent hover:text-secondaryShade dark:hover:bg-transparent dark:hover:text-primaryShade transition-colors duration-300"
            disabled={
              isContentImageUploadToCloud ||
              createBulkAboutPageIsLoading ||
              deleteFileFromCloudinaryIsLoading
            }
          >
            {isContentImageUploadToCloud ||
            createBulkAboutPageIsLoading ||
            deleteFileFromCloudinaryIsLoading ? (
              <div className="animate-spin border-t-2 border-white border-solid rounded-full w-5 h-5"></div> // Spinner
            ) : (
              <p className="uppercase font-medium">
                {record ? "Save" : "Submit"}
              </p>
            )}
          </button>
        </Form>
      </Modal>
    </section>
  );
};

export default page;
