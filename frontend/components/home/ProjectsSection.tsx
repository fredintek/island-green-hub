"use client";
import React, { useEffect } from "react";
import { Table, Switch } from "antd";
import { toast } from "react-toastify";
import {
  useGetPageBySlugQuery,
  useUpdatePageMutation,
} from "@/redux/api/pageApiSlice";

type Props = {};

const ProjectsSection = (props: Props) => {
  const {
    data: getAllProjectsData,
    isLoading: getAllProjectsIsLoading,
    isError: getAllProjectsIsError,
    error: getAllProjectsError,
    refetch: getAllProjectsRefetch,
  } = useGetPageBySlugQuery("projects", {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });

  const [
    updatePageFn,
    {
      isError: updatePageIsError,
      isLoading: updatePageIsLoading,
      isSuccess: updatePageIsSuccess,
      error: updatePageError,
      data: updatePageData,
    },
  ] = useUpdatePageMutation();

  const handleSwitchIsHomePage = async (record: any, checkValue: boolean) => {
    try {
      await updatePageFn({
        id: record?.id,
        isProjectHomePage: checkValue,
      }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const projectsColumn = [
    {
      title: "Title (tr)",
      dataIndex: "title",
      key: "titleTr",
      render: (text: any, record: any) => {
        return <p>{text["tr"]}</p>;
      },
    },
    {
      title: "Title (en)",
      dataIndex: "title",
      key: "titleEn",
      render: (text: any, record: any) => {
        return <p>{text["en"]}</p>;
      },
    },
    {
      title: "Title (ru)",
      dataIndex: "title",
      key: "titleRu",
      render: (text: any, record: any) => {
        return <p>{text["ru"]}</p>;
      },
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      render: (text: any, record: any) => (
        <Switch
          loading={updatePageIsLoading}
          defaultChecked={record?.isProjectHomePage}
          onChange={(checked: boolean) => {
            handleSwitchIsHomePage(record, checked);
          }}
        />
      ),
    },
  ];

  useEffect(() => {
    if (updatePageIsSuccess) {
      toast.success("updated successfully");
      getAllProjectsRefetch();
    }

    if (updatePageIsError) {
      const customError = updatePageError as {
        data: any;
        status: number;
      };
      toast.error(customError.data.message);
    }
  }, [updatePageIsSuccess, updatePageIsError, updatePageError, updatePageData]);

  return (
    <>
      <div className="p-6 bg-white dark:bg-[#1e293b] shadow-md rounded-md">
        <p className="text-[22px] text-secondaryShade dark:text-primaryShade font-bold uppercase mb-6">
          Projects Section
        </p>

        {/* NEW PROJECTS SECTION */}
        <Table
          columns={projectsColumn}
          dataSource={getAllProjectsData?.subPages || []}
          scroll={{ x: 768 }}
          className=""
        />
      </div>
    </>
  );
};

export default ProjectsSection;
