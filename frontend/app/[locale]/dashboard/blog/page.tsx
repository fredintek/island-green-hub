"use client";
import {
  useCreatePageMutation,
  useDeletePageMutation,
  useGetPageBySlugQuery,
  useUpdatePageMutation,
} from "@/redux/api/pageApiSlice";
import {
  DeleteOutlined,
  EditOutlined,
  InboxOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Form, Input, Modal, Popconfirm, Table, Tooltip, Upload } from "antd";
import { useLocale } from "next-intl";
import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  useCreateSectionMutation,
  useDeleteFileMutation,
  useLazyGetSectionByPageIdQuery,
  useUpdateSectionMutation,
  useUploadFileMutation,
} from "@/redux/api/sectionApiSlice";
import { toast } from "react-toastify";
import { useDeleteFileFromCloudinaryMutation } from "@/redux/api/cloudinaryApiSlice";
import { ensureArray } from "../projects/add-project/page";
import { usePathname } from "next/navigation";
const { Dragger } = Upload;

type Props = {};

const page = (props: Props) => {
  // Dynamically load the ReactQuill component (to prevent SSR issues)
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill-new"), { ssr: false }),
    []
  );
  const nextPath = usePathname();
  const locale = nextPath.split("/")[1] as "en" | "tr" | "ru";
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [blogFileList, setBlogFileList] = useState<any>([]);
  const [editingPage, setEditingPage] = useState<any | null>(null);
  const { data: getAllPageBySlugData, refetch: getAllPageBySlugRefetch } =
    useGetPageBySlugQuery("blog", {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnFocus: true,
    });

  const [getSectionByPageIdFn] = useLazyGetSectionByPageIdQuery();
  const [
    createPageFn,
    {
      isError: createPageIsError,
      isLoading: createPageIsLoading,
      isSuccess: createPageIsSuccess,
      error: createPageError,
      data: createPageData,
    },
  ] = useCreatePageMutation();

  const [updatePageFn, { isLoading: updatePageIsLoading }] =
    useUpdatePageMutation();

  const [
    deletePageFn,
    {
      isError: deletePageIsError,
      isSuccess: deletePageIsSuccess,
      error: deletePageError,
      data: deletePageData,
    },
  ] = useDeletePageMutation();

  const [
    createSectionFn,
    {
      isError: createSectionIsError,
      isLoading: createSectionIsLoading,
      isSuccess: createSectionIsSuccess,
      error: createSectionError,
      data: createSectionData,
    },
  ] = useCreateSectionMutation();

  const [
    updateSectionFn,
    {
      isError: updateSectionIsError,
      isLoading: updateSectionIsLoading,
      isSuccess: updateSectionIsSuccess,
      error: updateSectionError,
      data: updateSectionData,
    },
  ] = useUpdateSectionMutation();

  const [
    deleteFileFromCloudinaryFn,
    { isLoading: deleteFileFromCloudinaryIsLoading },
  ] = useDeleteFileFromCloudinaryMutation();

  const [uploadFileFn, { isLoading: uploadFileIsLoading }] =
    useUploadFileMutation();

  const [deleteFileFn, { isLoading: deleteFileIsLoading }] =
    useDeleteFileMutation();

  const handleEdit = async (record: any) => {
    const sections = await getSectionByPageIdFn(record?.id).unwrap();
    const targetSection = sections?.data.find((obj: any) =>
      obj.type.includes("blogContent")
    );
    setEditingPage({
      ...record,
      sectionId: targetSection?.id,
      content: targetSection?.content,
      type: targetSection?.type,
      sortId: targetSection?.sortId,
    });
    setOpenModal(true);
    setBlogFileList(
      targetSection?.content?.blogImages?.map((img: any) => ({
        uid: img,
        name: "image",
        status: "done",
        url: img,
      }))
    );
    form.setFieldsValue({
      pageTitleTr: record?.title?.tr,
      pageTitleEn: record?.title?.en,
      pageTitleRu: record?.title?.ru,
      blogTitleTr: targetSection?.content?.blogTitle?.tr,
      blogTitleEn: targetSection?.content?.blogTitle?.en,
      blogTitleRu: targetSection?.content?.blogTitle?.ru,
      blogContentTr: targetSection?.content?.blogContent?.tr,
      blogContentEn: targetSection?.content?.blogContent?.en,
      blogContentRu: targetSection?.content?.blogContent?.ru,
      blogImages: targetSection?.content?.blogImages?.map((img: any) => ({
        uid: img,
        name: "image",
        status: "done",
        url: img,
      })),
    });
  };

  const handleUploadChange = ({ fileList }: any) => {
    setBlogFileList(fileList);
    form.setFieldsValue({ blogImages: fileList });
  };

  const handleFormSubmit = async (values: any) => {
    if (editingPage) {
      const prepareUpload = (value: any, formData: FormData, tag: string) => {
        if (!value.url) {
          formData.append("files", value.originFileObj);
          formData.append("tags", tag);

          return null;
        }
        return value.url;
      };
      try {
        let formData = new FormData();
        let blogImages: string[] = [];
        for (const value of values.blogImages) {
          const arr = prepareUpload(value, formData, "blogImages");

          if (arr) {
            blogImages.push(arr);
          }
        }
        const isBlogFormDataEmpty = formData.entries().next().done;
        if (!isBlogFormDataEmpty) {
          const arr = await uploadFileFn(formData).unwrap();
          ensureArray(arr.blogImages)?.forEach((img: string) =>
            blogImages.push(img)
          );
        }

        // update page
        const updatedPage = await updatePageFn({
          id: editingPage.id,
          title: {
            tr: values.pageTitleTr,
            en: values.pageTitleEn,
            ru: values.pageTitleRu,
          },
          parentPage: getAllPageBySlugData?.id,
        }).unwrap();
        // update section for target page
        if (updatedPage?.id) {
          const updatedSection = await updateSectionFn({
            id: editingPage?.sectionId,
            page: updatedPage?.id,
            type: `${values.blogTitleEn}-blogContent`,
            sortId: 0,
            content: {
              blogTitle: {
                tr: values.blogTitleTr,
                en: values.blogTitleEn,
                ru: values.blogTitleRu,
              },
              blogContent: {
                tr: values.blogContentTr,
                en: values.blogContentEn,
                ru: values.blogContentRu,
              },
              blogImages,
            },
          }).unwrap();

          if (updatedSection?.content) {
            // delete old images
            Promise.all(
              editingPage?.content?.blogImages?.map(async (img: string) => {
                const target = img.split("uploads/").pop();
                await deleteFileFn({ filename: target }).unwrap();
              })
            );
          }
        }

        setOpenModal(false);
        setEditingPage(null);
        setBlogFileList([]);
        form.resetFields();
      } catch (error) {
        console.error("error", error);
      }
    } else {
      try {
        // create page
        const createdPage = await createPageFn({
          title: {
            tr: values.pageTitleTr,
            en: values.pageTitleEn,
            ru: values.pageTitleRu,
          },
          parentPage: getAllPageBySlugData?.id,
        }).unwrap();

        const formData = new FormData();
        values?.blogImages?.map((obj: any) =>
          formData.append("files", obj.originFileObj)
        );

        // create section for target page
        if (createdPage?.data) {
          await createSectionFn({
            page: createdPage.data.id,
            type: `${values.blogTitleEn}-blogContent`,
            sortId: 0,
            content: {
              blogTitle: {
                tr: values.blogTitleTr,
                en: values.blogTitleEn,
                ru: values.blogTitleRu,
              },
              blogContent: {
                tr: values.blogContentTr,
                en: values.blogContentEn,
                ru: values.blogContentRu,
              },
              blogImages: await uploadFileFn(formData).unwrap(),
            },
          }).unwrap();
        }
        setOpenModal(false);
        setEditingPage(null);
        setBlogFileList([]);
        form.resetFields();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDeletePage = async (record: any) => {
    const sections = await getSectionByPageIdFn(record?.id).unwrap();
    const targetSection = sections?.data.find((obj: any) =>
      obj.type.includes("blogContent")
    );
    try {
      await deletePageFn(record?.id).unwrap();
      await Promise.all(
        targetSection?.content?.blogImages?.map((img: string) => {
          const target = img.split("uploads/").pop();
          return deleteFileFn({ filename: target }).unwrap();
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const blogColumn = [
    {
      title: "Name",
      dataIndex: "title",
      key: "title",
      render: (text: any, record: any) => text[locale],
    },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: any) => (
        <div className="flex items-center gap-4 text-lg text-gray-500">
          <button type="button" className="cursor-pointer">
            <Tooltip>
              <EditOutlined onClick={() => handleEdit(record)} />
            </Tooltip>
          </button>
          <button type="button" className="cursor-pointer">
            <Popconfirm
              onConfirm={() => handleDeletePage(record)}
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
    if (createSectionIsSuccess) {
      getAllPageBySlugRefetch();
    }
    if (createPageIsError) {
      const customError = createPageError as { data: any; status: number };
      toast.error(customError.data.message);
    }
  }, [createPageIsSuccess, createPageIsError, createPageError, createPageData]);

  useEffect(() => {
    if (createSectionIsSuccess) {
      toast.success("Page created successfully");
      getAllPageBySlugRefetch();
    }

    if (createSectionIsError) {
      const customError = createSectionError as {
        data: any;
        status: number;
      };
      toast.error(customError.data.message);
    }
  }, [
    createSectionIsSuccess,
    createSectionIsError,
    createSectionError,
    createSectionData,
  ]);

  useEffect(() => {
    if (updateSectionIsSuccess) {
      toast.success("Page updated successfully");
      setOpenModal(false);
      setBlogFileList([]);
      setEditingPage(null);
      getAllPageBySlugRefetch();
    }

    if (updateSectionIsError) {
      const customError = updateSectionError as {
        data: any;
        status: number;
      };
      toast.error(customError.data.message);
    }
  }, [
    updateSectionIsSuccess,
    updateSectionIsError,
    updateSectionError,
    updateSectionData,
  ]);

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

  return (
    <section className="flex flex-col gap-10">
      <div className="p-6 bg-white dark:bg-[#1e293b] shadow-md rounded-md">
        <p className="text-[22px] text-secondaryShade dark:text-primaryShade font-bold uppercase mb-6">
          Blog Section
        </p>

        <div>
          <button
            onClick={() => {
              setOpenModal(true);
              setEditingPage(null);
              setBlogFileList([]);
              form.resetFields();
            }}
            type="button"
            className="mb-4 px-6 py-2 rounded-md text-white cursor-pointer flex gap-2 items-center justify-center bg-secondaryShade dark:bg-primaryShade border border-secondaryShade dark:border-primaryShade hover:bg-transparent hover:text-secondaryShade dark:hover:bg-transparent dark:hover:text-primaryShade transition-colors duration-300"
          >
            <PlusOutlined className="text-lg" />
            <p className="uppercase font-medium text-sm">Add Page</p>
          </button>
          <Table
            columns={blogColumn}
            dataSource={getAllPageBySlugData?.subPages || []}
            scroll={{ x: 768 }}
            className=""
          />
        </div>
      </div>

      {/* add/edit Blog */}
      <Modal
        onCancel={() => {
          setOpenModal(false);
          setEditingPage(null);
          setBlogFileList([]);
          form.resetFields();
        }}
        onClose={() => {
          setOpenModal(false);
          setEditingPage(null);
          setBlogFileList([]);
          form.resetFields();
        }}
        open={openModal}
        width={{
          xs: "100%",
        }}
        footer={null}
      >
        <Form onFinish={handleFormSubmit} layout="vertical" form={form}>
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

          {/* BLOG TITLE */}
          <div className="grid grid-cols-fluid-1 gap-4">
            <Form.Item
              label="Blog Title (Turkish)"
              name="blogTitleTr"
              rules={[{ required: true, message: "Blog Title is required!" }]}
            >
              <Input size="large" placeholder="Enter Blog Title in Turkish" />
            </Form.Item>
            <Form.Item
              label="Blog Title (English)"
              name="blogTitleEn"
              rules={[{ required: true, message: "Blog Title is required!" }]}
            >
              <Input size="large" placeholder="Enter Blog Title in English" />
            </Form.Item>
            <Form.Item
              label="Blog Title (Russian)"
              name="blogTitleRu"
              rules={[{ required: true, message: "Blog Title is required!" }]}
            >
              <Input size="large" placeholder="Enter Blog Title in Russian" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-fluid-1 gap-4">
            <Form.Item
              rules={[{ required: true, message: "Blog Content is required!" }]}
              label="Blog Content(Turkish)"
              name="blogContentTr"
            >
              <ReactQuill
                theme="snow"
                placeholder="Enter blog content in Turkish"
              />
            </Form.Item>
            <Form.Item
              label="Blog Content(English)"
              name="blogContentEn"
              rules={[{ required: true, message: "Blog Content is required!" }]}
            >
              <ReactQuill
                theme="snow"
                placeholder="Enter blog content in English"
              />
            </Form.Item>
            <Form.Item
              rules={[{ required: true, message: "Blog Content is required!" }]}
              label="Blog Content(Russian)"
              name="blogContentRu"
            >
              <ReactQuill
                theme="snow"
                placeholder="Enter blog content in Russian"
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Upload Blog Images (2)"
            name="blogImages"
            valuePropName="fileList"
            getValueFromEvent={(e) => e?.fileList}
            rules={[
              { required: true, message: "Please upload at least one image!" },
            ]}
          >
            <div className="border-2 border-secondaryShade dark:border-primaryShade border-dashed rounded-xl max-w-[600px]">
              <Dragger
                name="file"
                multiple={true}
                beforeUpload={() => false}
                maxCount={2}
                listType="picture-card"
                accept="image/*"
                fileList={blogFileList}
                onChange={handleUploadChange}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined className="!text-secondaryShade dark:!text-primaryShade" />
                </p>
                <p className="ant-upload-text !text-black dark:!text-gray-300">
                  Click or drag file to this area to upload
                </p>
              </Dragger>
            </div>
          </Form.Item>
        </Form>
        <button
          onClick={() => form.submit()}
          type="button"
          className="ml-auto mt-2 px-6 py-2 rounded-md text-white cursor-pointer flex items-center justify-center bg-secondaryShade dark:bg-primaryShade border border-secondaryShade dark:border-primaryShade hover:bg-transparent hover:text-secondaryShade dark:hover:bg-transparent dark:hover:text-primaryShade transition-colors duration-300"
          disabled={
            createPageIsLoading ||
            createSectionIsLoading ||
            updatePageIsLoading ||
            updateSectionIsLoading ||
            uploadFileIsLoading ||
            deleteFileIsLoading
          }
        >
          {createPageIsLoading ||
          createSectionIsLoading ||
          updatePageIsLoading ||
          updateSectionIsLoading ||
          uploadFileIsLoading ||
          deleteFileIsLoading ? (
            <div className="animate-spin border-t-2 border-white border-solid rounded-full w-5 h-5"></div> // Spinner
          ) : (
            <p className="uppercase font-medium">
              {editingPage ? "Save" : "Submit"}
            </p>
          )}
        </button>
      </Modal>
    </section>
  );
};

export default page;
