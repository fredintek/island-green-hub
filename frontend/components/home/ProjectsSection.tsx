"use client";
import React, { useEffect } from "react";
import { Table, Switch } from "antd";
import { ProjectHouse } from "@/utils/interfaces";
import { ColumnsType } from "antd/es/table";
import {
  useGetAllProjectHouseQuery,
  useUpdateIsHomePageMutation,
} from "@/redux/api/projectHouseApiSlice";
import { toast } from "react-toastify";

type Props = {};

const ProjectsSection = (props: Props) => {
  const {
    data: getAllProjectHouseData,
    isLoading: getAllProjectHouseIsLoading,
    isError: getAllProjectHouseIsError,
    error: getAllProjectHouseError,
    refetch: getAllProjectHouseRefetch,
  } = useGetAllProjectHouseQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });

  const [
    updateIsHomePageFn,
    {
      isError: updateIsHomePageIsError,
      isLoading: updateIsHomePageIsLoading,
      isSuccess: updateIsHomePageIsSuccess,
      error: updateIsHomePageError,
      data: updateIsHomePageData,
    },
  ] = useUpdateIsHomePageMutation();

  const handleSwitchIsHomePage = async (
    record: ProjectHouse,
    checkValue: boolean
  ) => {
    try {
      await updateIsHomePageFn({
        projectHouseId: record.id,
        isHomePage: checkValue,
      }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const projectsColumn: ColumnsType<ProjectHouse> = [
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
      dataIndex: "action",
      render: (text, record) => (
        <Switch
          loading={updateIsHomePageIsLoading}
          defaultChecked={record?.isHomePage}
          onChange={(checked: boolean) => {
            handleSwitchIsHomePage(record, checked);
          }}
        />
      ),
    },
  ];

  useEffect(() => {
    if (updateIsHomePageIsSuccess) {
      toast.success(updateIsHomePageData.message);
      getAllProjectHouseRefetch();
    }

    if (updateIsHomePageIsError) {
      const customError = updateIsHomePageError as {
        data: any;
        status: number;
      };
      toast.error(customError.data.message);
    }
  }, [
    updateIsHomePageIsSuccess,
    updateIsHomePageIsError,
    updateIsHomePageError,
    updateIsHomePageData,
  ]);

  return (
    <>
      <div className="p-6 bg-white dark:bg-[#1e293b] shadow-md rounded-md">
        <p className="text-[22px] text-secondaryShade dark:text-primaryShade font-bold uppercase mb-6">
          Projects Section
        </p>

        {/* NEW PROJECTS SECTION */}
        <Table
          columns={projectsColumn}
          dataSource={getAllProjectHouseData || []}
          scroll={{ x: 768 }}
          className=""
        />
      </div>
    </>
  );
};

export default ProjectsSection;
