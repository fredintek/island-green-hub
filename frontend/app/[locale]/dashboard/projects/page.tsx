"use client";
import { Link } from "@/i18n/routing";
import {
  useDeleteBulkProjectMutation,
  useGetPageBySlugQuery,
} from "@/redux/api/pageApiSlice";
import { Page } from "@/utils/interfaces";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Popconfirm, Table, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { useLocale } from "next-intl";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

type Props = {};

const page = (props: Props) => {
  const locale = useLocale();
  const {
    data: getAllPageBySlugData,
    isLoading: getAllPageBySlugIsLoading,
    isError: getAllPageBySlugIsError,
    error: getAllPageBySlugError,
    refetch: getAllPageBySlugRefetch,
  } = useGetPageBySlugQuery("projects", {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [
    deleteBulkProjectFn,
    {
      isLoading: deleteBulkProjectIsLoading,
      isError: deleteBulkProjectIsError,
      error: deleteBulkProjectError,
      data: deleteBulkProjectData,
      isSuccess: deleteBulkProjectIsSuccess,
    },
  ] = useDeleteBulkProjectMutation();

  const handleDeletePage = async (record: any) => {
    try {
      await deleteBulkProjectFn(record?.id);
    } catch (error) {
      console.error("error", error);
    }
  };

  const projectColumn: ColumnsType<Partial<Page>> = [
    {
      title: "Name",
      dataIndex: "title",
      key: "title",
      render: (text, record) => text[locale],
    },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: Partial<Page>) => (
        <div className="flex items-center gap-4 text-lg text-gray-500">
          <Link
            href={`projects/edit-project/${record?.slug}`}
            className="cursor-pointer"
          >
            <EditOutlined />
          </Link>
          {deleteBulkProjectIsLoading ? (
            <div className="animate-spin border-t-2 border-white border-solid rounded-full w-5 h-5"></div>
          ) : (
            <button type="button" className="cursor-pointer">
              <Popconfirm
                onConfirm={() => handleDeletePage(record)}
                title="Are you sure you want to delete this project?"
              >
                <DeleteOutlined />
              </Popconfirm>
            </button>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (deleteBulkProjectIsSuccess) {
      toast.success("Page deleted successfully");
      getAllPageBySlugRefetch();
    }

    if (deleteBulkProjectIsError) {
      const customErrorV1 = deleteBulkProjectError as {
        data: any;
        status: number;
      };
      const customErrorV2 = deleteBulkProjectError as {
        message: string | string[];
        error: string;
        statusCode: number;
      };
      toast.error(customErrorV1.data.message || customErrorV2.message);
    }
  }, [
    deleteBulkProjectIsSuccess,
    deleteBulkProjectIsError,
    deleteBulkProjectError,
    deleteBulkProjectData,
  ]);

  return (
    <section className="flex flex-col gap-10">
      <div className="p-6 bg-white dark:bg-[#1e293b] shadow-md rounded-md">
        <p className="text-[22px] text-secondaryShade dark:text-primaryShade font-bold uppercase mb-6">
          Project Section
        </p>

        <Link
          href={`projects/add-project`}
          className="mb-4 w-fit px-6 py-2 rounded-md text-white cursor-pointer flex gap-2 items-center justify-center bg-secondaryShade dark:bg-primaryShade border border-secondaryShade dark:border-primaryShade hover:bg-transparent hover:text-secondaryShade dark:hover:bg-transparent dark:hover:text-primaryShade transition-colors duration-300"
        >
          <PlusOutlined className="text-lg" />
          <p className="uppercase font-medium text-sm">Add Page</p>
        </Link>
        <Table
          columns={projectColumn}
          dataSource={getAllPageBySlugData?.subPages || []}
          scroll={{ x: 768 }}
          className=""
        />
      </div>
    </section>
  );
};

export default page;
