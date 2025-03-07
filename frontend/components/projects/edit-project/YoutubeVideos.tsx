import {
  useGetSectionByTypeQuery,
  useUpdateSectionMutation,
} from "@/redux/api/sectionApiSlice";
import { Page } from "@/utils/interfaces";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  pageData?: Partial<Page>;
  refetchEditedData?: any;
};

const YoutubeVideos = ({ pageData, refetchEditedData }: Props) => {
  const [form] = Form.useForm();
  const [videoLinks, setVideoLinks] = useState<string[]>([""]);

  const { data: getSectionByTypeData } = useGetSectionByTypeQuery(
    "project-youtube-videos",
    {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }
  );

  const [
    updateSectionFn,
    {
      data: updateSectionData,
      isLoading: updateSectionIsLoading,
      isError: updateSectionIsError,
      isSuccess: updateSectionIsSuccess,
      error: updateSectionError,
    },
  ] = useUpdateSectionMutation();

  // Handle adding a new video input field
  const addVideoField = () => {
    setVideoLinks([...videoLinks, ""]);
  };

  // Handle removing a video input field
  const removeVideoField = (index: number) => {
    const updatedLinks = videoLinks.filter((_, i) => i !== index);
    setVideoLinks(updatedLinks);
  };

  // Handle change in video inputs
  const handleVideoChange = (index: number, value: string) => {
    const updatedLinks = [...videoLinks];
    updatedLinks[index] = value;
    setVideoLinks(updatedLinks);
  };

  const handleSubmit = async (values: any) => {
    console.log("Submitted values:", values);
    // Handle API submission here
    try {
      await updateSectionFn({
        id: getSectionByTypeData.data.id,
        content: values.youtubeVideos,
      }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (getSectionByTypeData?.data?.content) {
      form.setFieldsValue({
        youtubeVideos: getSectionByTypeData.data.content,
      });
      setVideoLinks(getSectionByTypeData.data.content);
    }
  }, [getSectionByTypeData, form]);

  useEffect(() => {
    if (updateSectionIsSuccess) {
      toast.success("Videos updated successfully");
      refetchEditedData(getSectionByTypeData?.data?.page?.slug);
    }

    if (updateSectionIsError) {
      const customErrorV1 = updateSectionError as {
        data: any;
        status: number;
      };
      const customErrorV2 = updateSectionError as {
        message: string | string[];
        error: string;
        statusCode: number;
      };
      toast.error(customErrorV1.data.message || customErrorV2.message);
    }
  }, [
    updateSectionIsSuccess,
    updateSectionIsError,
    updateSectionError,
    updateSectionData,
  ]);

  return (
    <div>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        {videoLinks.map((link: string, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <Form.Item name={["youtubeVideos", index]} className="flex-grow">
              <Input
                size="large"
                placeholder="Enter YouTube video link"
                value={link}
                onChange={(e) => handleVideoChange(index, e.target.value)}
              />
            </Form.Item>
            {index > 0 && (
              <Button
                type="default"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeVideoField(index)}
              />
            )}
          </div>
        ))}
        <Button type="dashed" icon={<PlusOutlined />} onClick={addVideoField}>
          Add Video Link
        </Button>
      </Form>

      <button
        onClick={() => form.submit()}
        type="button"
        className="ml-auto mt-4 px-6 py-2 rounded-md text-white cursor-pointer flex items-center justify-center bg-secondaryShade dark:bg-primaryShade border border-secondaryShade dark:border-primaryShade hover:bg-transparent hover:text-secondaryShade dark:hover:bg-transparent dark:hover:text-primaryShade transition-colors duration-300"
        disabled={updateSectionIsLoading}
      >
        {updateSectionIsLoading ? (
          <div className="animate-spin border-t-2 border-white border-solid rounded-full w-5 h-5"></div> // Spinner
        ) : (
          <p className="uppercase font-medium">Save</p>
        )}
      </button>
    </div>
  );
};

export default YoutubeVideos;
