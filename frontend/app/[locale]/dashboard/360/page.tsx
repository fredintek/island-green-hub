"use client";
import {
  useCreateBulk360PageMutation,
  useGetPageBySlugQuery,
  useLazyGetPageByIdQuery,
  useDeletePageMutation,
  useUpdateBulk360PageMutation,
} from "@/redux/api/pageApiSlice";
import { Page } from "@/utils/interfaces";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Input, Modal, Popconfirm, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useLocale } from "next-intl";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Props = {};

const page = (props: Props) => {
  const locale = useLocale();
  const [form] = Form.useForm();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [record, setRecord] = useState<any>(null);

  const { data: getAllPageBySlugData, refetch: getAllPageBySlugRefetch } =
    useGetPageBySlugQuery("360", {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnFocus: true,
    });

  const [getLazyPageById] = useLazyGetPageByIdQuery();

  const [
    createBulk360PageFn,
    {
      isLoading: createBulk360PageIsLoading,
      isError: createBulk360PageIsError,
      error: createBulk360PageError,
      data: createBulk360PageData,
      isSuccess: createBulk360PageIsSuccess,
    },
  ] = useCreateBulk360PageMutation();

  const [
    updateBulk360PageFn,
    {
      isLoading: updateBulk360PageIsLoading,
      isError: updateBulk360PageIsError,
      error: updateBulk360PageError,
      data: updateBulk360PageData,
      isSuccess: updateBulk360PageIsSuccess,
    },
  ] = useUpdateBulk360PageMutation();

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
          sectionType: "360-product-link",
          title: {
            tr: values.pageTitleTr,
            en: values.pageTitleEn,
            ru: values.pageTitleRu,
          },
          productLink: values.productLink,
        };
        await updateBulk360PageFn(targetData).unwrap();
      } else {
        const targetData = {
          parentPageId: getAllPageBySlugData?.id,
          title: {
            tr: values.pageTitleTr,
            en: values.pageTitleEn,
            ru: values.pageTitleRu,
          },
          productLink: values.productLink,
        };
        await createBulk360PageFn(targetData).unwrap();
      }
      setRecord(null);
      setIsOpenModal(false);
    } catch (error) {
      console.error("Failed to create bulk360", error);
    }
  };

  const column360: ColumnsType<Partial<Page>> = [
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
      form.setFieldsValue({
        pageTitleTr: record.title.tr,
        pageTitleEn: record.title.en,
        pageTitleRu: record.title.ru,
        productLink: record.sections.find(
          (obj: any) => obj.type === "360-product-link"
        ).content,
      });
    }
  }, [record, form]);

  useEffect(() => {
    if (createBulk360PageIsSuccess) {
      toast.success("Page created successfully");
      getAllPageBySlugRefetch();
    }

    if (createBulk360PageIsError) {
      const customError = createBulk360PageError as {
        data: any;
        status: number;
      };
      toast.error(customError.data.message);
    }
  }, [
    createBulk360PageIsSuccess,
    createBulk360PageIsError,
    createBulk360PageError,
    createBulk360PageData,
  ]);

  useEffect(() => {
    if (updateBulk360PageIsSuccess) {
      toast.success("Page updated successfully");
      getAllPageBySlugRefetch();
    }

    if (updateBulk360PageIsError) {
      const customError = updateBulk360PageError as {
        data: any;
        status: number;
      };
      toast.error(customError.data.message);
    }
  }, [
    updateBulk360PageIsSuccess,
    updateBulk360PageIsError,
    updateBulk360PageError,
    updateBulk360PageData,
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
          360 View
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
            columns={column360}
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

          {/* PRODUCT LINK */}
          <Form.Item
            label="Product Link"
            name="productLink"
            rules={[{ required: true, message: "Product Link is required!" }]}
          >
            <Input size="large" placeholder="Enter Product Link" />
          </Form.Item>
          <button
            onClick={() => form.submit()}
            type="button"
            className="ml-auto mt-2 px-6 py-2 rounded-md text-white cursor-pointer flex items-center justify-center bg-secondaryShade dark:bg-primaryShade border border-secondaryShade dark:border-primaryShade hover:bg-transparent hover:text-secondaryShade dark:hover:bg-transparent dark:hover:text-primaryShade transition-colors duration-300"
            disabled={createBulk360PageIsLoading}
          >
            {createBulk360PageIsLoading ? (
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
