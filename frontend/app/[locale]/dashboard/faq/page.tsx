"use client";
import {
  useCreateFaqMutation,
  useDeleteFaqMutation,
  useGetAllFaqsQuery,
  useUpdateFaqMutation,
} from "@/redux/api/faqApislice";
import { Faq } from "@/utils/interfaces";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Input, Modal, Popconfirm, Table, Tooltip, Upload } from "antd";
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
  const [openModal, setOpenModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);

  const {
    data: getAllFaqData,
    isLoading: getAllFaqIsLoading,
    isError: getAllFaqIsError,
    error: getAllFaqError,
    refetch: getAllFaqRefetch,
  } = useGetAllFaqsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });

  const [
    createFaqFn,
    {
      isError: createFaqIsError,
      isLoading: createFaqIsLoading,
      isSuccess: createFaqIsSuccess,
      error: createFaqError,
      data: createFaqData,
    },
  ] = useCreateFaqMutation();

  const [
    updateFaqFn,
    {
      isError: updateFaqIsError,
      isLoading: updateFaqIsLoading,
      isSuccess: updateFaqIsSuccess,
      error: updateFaqError,
      data: updateFaqData,
    },
  ] = useUpdateFaqMutation();

  const [
    deleteFaqFn,
    {
      isError: deleteFaqIsError,
      isLoading: deleteFaqIsLoading,
      isSuccess: deleteFaqIsSuccess,
      error: deleteFaqError,
      data: deleteFaqData,
    },
  ] = useDeleteFaqMutation();

  const handleEdit = (record: Faq) => {
    setEditingFaq(record);
    setOpenModal(true);
  };

  const handleDelete = async (record: Faq) => {
    try {
      await deleteFaqFn(record?.id).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormSubmit = async (values: any) => {
    const targetFaq = {
      question: {
        en: values.questionEn,
        ru: values.questionRu,
        tr: values.questionTr,
      },
      answer: {
        en: values.answerEn,
        ru: values.answerRu,
        tr: values.answerTr,
      },
    };

    try {
      if (editingFaq) {
        await updateFaqFn({ id: editingFaq?.id, ...targetFaq }).unwrap();
      } else {
        await createFaqFn(targetFaq).unwrap();
      }
      setOpenModal(false);
      setEditingFaq(null);
    } catch (error) {
      console.error(error);
    }
  };

  const faqColumn: ColumnsType<Faq> = [
    {
      title: "Question (tr)",
      dataIndex: "question",
      key: "questionTr",
      render: (text, record) => text["tr"],
    },
    {
      title: "Question (en)",
      dataIndex: "question",
      key: "questionEn",
      render: (text, record) => text["en"],
    },
    {
      title: "Question (ru)",
      dataIndex: "question",
      key: "questionRu",
      render: (text, record) => text["ru"],
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Faq) => (
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

  useEffect(() => {
    if (editingFaq) {
      form.setFieldsValue({
        questionTr: editingFaq.question.tr,
        questionEn: editingFaq.question.en,
        questionRu: editingFaq.question.ru,
        answerTr: editingFaq.answer.tr,
        answerEn: editingFaq.answer.en,
        answerRu: editingFaq.answer.ru,
      });
    }
  }, [editingFaq]);

  useEffect(() => {
    if (deleteFaqIsSuccess) {
      toast.success(deleteFaqData.message);
      getAllFaqRefetch();
    }

    if (deleteFaqIsError) {
      const customError = deleteFaqError as { data: any; status: number };
      toast.error(customError.data.message);
    }
  }, [deleteFaqIsSuccess, deleteFaqIsError, deleteFaqError, deleteFaqData]);

  useEffect(() => {
    if (createFaqIsSuccess) {
      toast.success(createFaqData.message);
      getAllFaqRefetch();
    }

    if (createFaqIsError) {
      const customError = createFaqError as { data: any; status: number };
      toast.error(customError.data.message);
    }
  }, [createFaqIsSuccess, createFaqIsError, createFaqError, createFaqData]);

  useEffect(() => {
    if (updateFaqIsSuccess) {
      toast.success(updateFaqData.message);
      getAllFaqRefetch();
    }

    if (updateFaqIsError) {
      const customError = updateFaqError as { data: any; status: number };
      toast.error(customError.data.message);
    }
  }, [updateFaqIsSuccess, updateFaqIsError, updateFaqError, updateFaqData]);

  return (
    <>
      <div className="p-6 bg-white dark:bg-[#1e293b] shadow-md rounded-md">
        <p className="text-[22px] text-secondaryShade dark:text-primaryShade font-bold uppercase mb-6">
          FAQ Section
        </p>

        <div>
          <button
            onClick={() => {
              setOpenModal(true);
              setEditingFaq(null);
              form.resetFields();
            }}
            type="button"
            className="mb-4 px-6 py-2 rounded-md text-white cursor-pointer flex gap-2 items-center justify-center bg-secondaryShade dark:bg-primaryShade border border-secondaryShade dark:border-primaryShade hover:bg-transparent hover:text-secondaryShade dark:hover:bg-transparent dark:hover:text-primaryShade transition-colors duration-300"
          >
            <PlusOutlined className="text-lg" />
            <p className="uppercase font-medium text-sm">Add FAQ</p>
          </button>
          <Table
            columns={faqColumn}
            dataSource={getAllFaqData?.data || []}
            scroll={{ x: 768 }}
            className=""
          />
        </div>
      </div>

      {/* add/edit FAQ */}
      <Modal
        onCancel={() => {
          setOpenModal(false);
          setEditingFaq(null);
        }}
        onClose={() => {
          setOpenModal(false);
          setEditingFaq(null);
        }}
        open={openModal}
        width={{
          xs: "100%",
        }}
        footer={null}
      >
        <Form onFinish={handleFormSubmit} layout="vertical" form={form}>
          <div className="grid grid-cols-fluid-1 gap-4">
            <Form.Item
              label="Question (Turkish)"
              name="questionTr"
              rules={[{ required: true, message: "Question is required!" }]}
            >
              <Input size="large" placeholder="Enter question in Turkish" />
            </Form.Item>
            <Form.Item
              label="Question (English)"
              name="questionEn"
              rules={[{ required: true, message: "Question is required!" }]}
            >
              <Input size="large" placeholder="Enter question in English" />
            </Form.Item>
            <Form.Item
              label="Question (Russian)"
              name="questionRu"
              rules={[{ required: true, message: "Question is required!" }]}
            >
              <Input size="large" placeholder="Enter question in Russian" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-fluid-1 gap-4">
            <Form.Item
              rules={[{ required: true, message: "Answer is required!" }]}
              label="Answer (Turkish)"
              name="answerTr"
            >
              <ReactQuill theme="snow" placeholder="Enter answer in Turkish" />
            </Form.Item>
            <Form.Item
              label="Answer (English)"
              name="answerEn"
              rules={[{ required: true, message: "Answer is required!" }]}
            >
              <ReactQuill theme="snow" placeholder="Enter answer in English" />
            </Form.Item>
            <Form.Item
              rules={[{ required: true, message: "Answer is required!" }]}
              label="Answer (Russian)"
              name="answerRu"
            >
              <ReactQuill theme="snow" placeholder="Enter answer in Russian" />
            </Form.Item>
          </div>
        </Form>
        <button
          onClick={() => form.submit()}
          type="button"
          className="ml-auto px-6 py-2 rounded-md text-white cursor-pointer flex items-center justify-center bg-secondaryShade dark:bg-primaryShade border border-secondaryShade dark:border-primaryShade hover:bg-transparent hover:text-secondaryShade dark:hover:bg-transparent dark:hover:text-primaryShade transition-colors duration-300"
          disabled={
            deleteFaqIsLoading || updateFaqIsLoading || createFaqIsLoading
          }
        >
          {deleteFaqIsLoading || updateFaqIsLoading || createFaqIsLoading ? (
            <div className="animate-spin border-t-2 border-white border-solid rounded-full w-5 h-5"></div> // Spinner
          ) : (
            <p className="uppercase font-medium">
              {editingFaq ? "Save" : "Submit"}
            </p>
          )}
        </button>
      </Modal>
    </>
  );
};

export default page;
