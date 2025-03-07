"use client";
import { iconClasses } from "@/constants/icon-classes.constant";
import {
  useCreateSectionMutation,
  useGetSectionByTypeQuery,
} from "@/redux/api/sectionApiSlice";
import { MultiLanguage } from "@/utils/interfaces";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Form, Input, Modal, Popconfirm, Select, Table, Tooltip } from "antd";
import TextArea from "antd/es/input/TextArea";
import { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Props = {};

type Reason = {
  title: MultiLanguage;
  text: MultiLanguage;
  icon: string;
};

const ReasonSection = (props: Props) => {
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [editingReason, setEditingReason] = useState<Reason | null>(null);
  const [reasonIndex, setReasonIndex] = useState<number | null>(null);

  const {
    data: getSectionData,
    isLoading: getSectionIsLoading,
    isError: getSectionIsError,
    error: getSectionError,
    refetch: getSectionRefetch,
  } = useGetSectionByTypeQuery("reason", {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });

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

  const iconOptions = iconClasses.map((icon) => ({
    value: icon,
    label: <span className={`${icon} text-2xl text-red-500`} />,
  }));

  const handleEdit = (record: Reason) => {
    setEditingReason(record);
    setOpenModal(true);
    setReasonIndex(getSectionData?.data?.content.indexOf(record));
  };

  const handleFormSubmit = async (values: any) => {
    const targetReason = {
      title: {
        en: values.titleEn,
        ru: values.titleRu,
        tr: values.titleTr,
      },
      text: {
        en: values.contentEn,
        ru: values.contentRu,
        tr: values.contentTr,
      },
      icon: values.icon,
    };

    const existingContent = getSectionData?.data?.content || [];

    // Find and update the existing object if it exists
    const updatedContent = existingContent.map((item: any, index: number) => {
      if (index === reasonIndex) {
        return { ...item, ...targetReason };
      }
      return item; // Keep other objects unchanged
    });
    const data = {
      page: getSectionData?.data?.page?.id,
      type: getSectionData?.data?.type,
      sortId: getSectionData?.data?.sortId,
      content: updatedContent,
    };

    try {
      await createSectionFn(data).unwrap();
      setOpenModal(false);
      setEditingReason(null);
      setReasonIndex(null);
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  const reasonsColumn: ColumnsType<Reason> = [
    {
      title: "Title (tr)",
      dataIndex: "title",
      key: "titleTr",
      render: (text, record) => {
        return <p>{text["tr"]}</p>;
      },
    },
    {
      title: "Title (en)",
      dataIndex: "title",
      key: "titleEn",
      render: (text, record) => {
        return <p>{text["en"]}</p>;
      },
    },
    {
      title: "Title (ru)",
      dataIndex: "title",
      key: "titleRu",
      render: (text, record) => {
        return <p>{text["ru"]}</p>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Reason) => (
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
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (editingReason) {
      form.setFieldsValue({
        titleTr: editingReason.title.tr,
        titleEn: editingReason.title.en,
        titleRu: editingReason.title.ru,
        contentTr: editingReason.text.tr,
        contentEn: editingReason.text.en,
        contentRu: editingReason.text.ru,
        icon: editingReason.icon,
      });
    }
  }, [editingReason]);

  useEffect(() => {
    if (createSectionIsSuccess) {
      toast.success(createSectionData.message);
      getSectionRefetch();
    }

    if (createSectionIsError) {
      const customError = createSectionError as { data: any; status: number };
      toast.error(customError.data.message);
    }
  }, [
    createSectionIsSuccess,
    createSectionIsError,
    createSectionError,
    createSectionData,
  ]);

  return (
    <>
      <div className="p-6 bg-white dark:bg-[#1e293b] shadow-md rounded-md">
        <p className="text-[22px] text-secondaryShade dark:text-primaryShade font-bold uppercase mb-6">
          Reasons Section
        </p>

        {/* content */}
        <Table
          columns={reasonsColumn}
          dataSource={getSectionData?.data?.content || []}
          scroll={{ x: 768 }}
        />
      </div>

      {/* add/edit project */}
      <Modal
        onCancel={() => {
          setOpenModal(false);
          setEditingReason(null);
          setReasonIndex(null);
        }}
        onClose={() => {
          setOpenModal(false);
          setEditingReason(null);
          setReasonIndex(null);
        }}
        open={openModal}
        width={{
          xs: "100%",
        }}
        footer={null}
        className="normal-modal"
      >
        <Form onFinish={handleFormSubmit} layout="vertical" form={form}>
          <div className="grid grid-cols-fluid-1 gap-4">
            <Form.Item
              label="Title (Turkish)"
              name="titleTr"
              rules={[{ required: true, message: "Title is required!" }]}
            >
              <Input size="large" placeholder="Enter title in Turkish" />
            </Form.Item>
            <Form.Item
              label="Title (English)"
              name="titleEn"
              rules={[{ required: true, message: "Title is required!" }]}
            >
              <Input size="large" placeholder="Enter title in English" />
            </Form.Item>
            <Form.Item
              label="Title (Russian)"
              name="titleRu"
              rules={[{ required: true, message: "Title is required!" }]}
            >
              <Input size="large" placeholder="Enter title in Russian" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-fluid-1 gap-4">
            <Form.Item
              rules={[{ required: true, message: "Content is required!" }]}
              label="Content (Turkish)"
              name="contentTr"
            >
              <TextArea
                style={{ resize: "none" }}
                rows={10}
                placeholder="Enter content in Turkish"
              />
            </Form.Item>
            <Form.Item
              label="Content (English)"
              name="contentEn"
              rules={[{ required: true, message: "Content is required!" }]}
            >
              <TextArea
                style={{ resize: "none" }}
                rows={10}
                placeholder="Enter content in English"
              />
            </Form.Item>
            <Form.Item
              rules={[{ required: true, message: "Content is required!" }]}
              label="Content (Russian)"
              name="contentRu"
            >
              <TextArea
                style={{ resize: "none" }}
                rows={10}
                placeholder="Enter content in Russian"
              />
            </Form.Item>
          </div>

          {/* icon */}
          <Form.Item
            rules={[{ required: true, message: "Icon is required!" }]}
            label="Select Icon"
            name="icon"
          >
            <Select
              options={iconOptions}
              size="large"
              className="w-full max-w-[900px]"
              placeholder="Select an icon"
            />
          </Form.Item>

          <button
            onClick={() => form.submit()}
            type="button"
            className="ml-auto mt-4 px-6 py-2 rounded-md text-white cursor-pointer flex items-center justify-center bg-secondaryShade dark:bg-primaryShade border border-secondaryShade dark:border-primaryShade hover:bg-transparent hover:text-secondaryShade dark:hover:bg-transparent dark:hover:text-primaryShade transition-colors duration-300"
          >
            <p className="uppercase font-medium">save</p>
          </button>
        </Form>
      </Modal>
    </>
  );
};

export default ReasonSection;
