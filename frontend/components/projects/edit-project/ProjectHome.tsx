import { ensureArray } from "@/app/[locale]/dashboard/projects/add-project/page";
import {
  useLazyGetPageByIdQuery,
  useUpdatePageMutation,
} from "@/redux/api/pageApiSlice";
import {
  useDeleteFileMutation,
  useGetSectionByPageIdQuery,
  useUpdateSectionMutation,
  useUploadFileMutation,
} from "@/redux/api/sectionApiSlice";
import { prepareFileUpload } from "@/utils";
import { Page } from "@/utils/interfaces";
import { PlusOutlined } from "@ant-design/icons";
import { Form, Upload } from "antd";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  pageData?: Partial<Page>;
  refetchEditedData?: any;
};

const ProjectContent = ({ pageData, refetchEditedData }: Props) => {
  // Dynamically load the ReactQuill component (to prevent SSR issues)
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill-new"), { ssr: false }),
    []
  );

  const [form] = Form.useForm();
  const [projectHomeImageList, setProjectHomeImageList] = useState<any>([]);
  const [pageContentData, setPageContentData] = useState<any>({});

  const { data: getSectionByTypeData } = useGetSectionByPageIdQuery(
    pageData?.id || pageContentData?.id,
    {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }
  );

  const handleUploadChangeHomeImage = ({ fileList }: any) => {
    setProjectHomeImageList(fileList);
    form.setFieldsValue({ projectHomeImage: fileList });
  };

  const [getPageByIdFn] = useLazyGetPageByIdQuery();

  const [
    updatePageFn,
    {
      isLoading: updatePageIsLoading,
      isError: updatePageIsError,
      isSuccess: updatePageIsSuccess,
      error: updatePageError,
      data: updatePageData,
    },
  ] = useUpdatePageMutation();

  const [uploadFileFn, { isLoading: uploadFileIsLoading }] =
    useUploadFileMutation();

  const [deleteFileFn, { isLoading: deleteFileIsLoading }] =
    useDeleteFileMutation();

  const handleSubmit = async (values: any) => {
    const targetPage = await getPageByIdFn(pageData?.id).unwrap();
    try {
      /** Upload new image if needed */

      const prepareUpload = (value: any, formData: FormData, tag: string) => {
        if (!value.url) {
          formData.append("files", value.originFileObj);
          formData.append("tags", tag);

          return null;
        }
        return value.url;
      };

      let formData = new FormData();
      let projectHomeImages: string[] = [];

      for (const value of values.projectHomeImage) {
        const arr = prepareUpload(value, formData, "projectHomeImage");

        if (arr) {
          projectHomeImages.push(arr);
        }
      }

      const isFormDataEmpty = formData.entries().next().done;
      if (!isFormDataEmpty) {
        const arr = await uploadFileFn(formData).unwrap();
        ensureArray(arr.projectHomeImage)?.forEach((img: string) =>
          projectHomeImages.push(img)
        );
      }

      /** Construct final data */
      const targetData = {
        id: targetPage?.id,
        projectHomeImages,
        projectHomeText: {
          en: values.projectHomeTextEn,
          tr: values.projectHomeTextTr,
          ru: values.projectHomeTextRu,
        },
      };
      await updatePageFn(targetData).unwrap();
      if (targetPage?.projectHomeImages) {
        // delete old images
        Promise.all(
          targetPage?.projectHomeImages?.map(async (img: string) => {
            const target = img.split("uploads/").pop();
            await deleteFileFn({ filename: target }).unwrap();
          })
        );
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  useEffect(() => {
    const runFunc = async () => {
      try {
        const targetPage = await getPageByIdFn(pageData?.id).unwrap();
        if (targetPage) {
          setProjectHomeImageList(
            targetPage?.projectHomeImages.map((img: string) => ({
              uid: img,
              name: img,
              status: "done",
              url: img,
            }))
          );

          // Set form values
          form.setFieldsValue({
            projectHomeTextTr: targetPage?.projectHomeText?.tr,
            projectHomeTextEn: targetPage?.projectHomeText?.en,
            projectHomeTextRu: targetPage?.projectHomeText?.ru,
            projectHomeImage: targetPage?.projectHomeImages.map(
              (img: string) => ({
                uid: img,
                name: img,
                status: "done",
                url: img,
              })
            ),
          });
        }
      } catch (error) {
        console.error("Error getting page:", error);
      }
    };

    if (pageData?.id) {
      runFunc();
    }
  }, [pageData?.id, form]);

  useEffect(() => {
    if (updatePageIsSuccess) {
      toast.success("Project Content updated successfully");
      refetchEditedData(getSectionByTypeData?.data?.page?.slug);
    }

    if (updatePageIsError) {
      const customErrorV1 = updatePageError as {
        data: any;
        status: number;
      };
      const customErrorV2 = updatePageError as {
        message: string | string[];
        error: string;
        statusCode: number;
      };
      toast.error(customErrorV1.data.message || customErrorV2.message);
    }
  }, [updatePageIsSuccess, updatePageIsError, updatePageError, updatePageData]);

  useEffect(() => {
    if (pageData) {
      setPageContentData(pageData);
    }
  }, [pageData]);

  if (!getSectionByTypeData?.data) return null;
  return (
    <Form onFinish={handleSubmit} form={form} layout="vertical">
      <div className="flex flex-col gap-10">
        {/* images */}
        <div className="flex gap-10">
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
            name="projectHomeTextTr"
          >
            <ReactQuill
              theme="snow"
              placeholder="Enter project home content in Turkish"
            />
          </Form.Item>
          <Form.Item
            label="Project Home Content(English)"
            name="projectHomeTextEn"
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
            name="projectHomeTextRu"
          >
            <ReactQuill
              theme="snow"
              placeholder="Enter project home content in Russian"
            />
          </Form.Item>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={() => form.submit()}
        type="button"
        className="ml-auto px-6 py-2 rounded-md text-white cursor-pointer flex items-center justify-center bg-secondaryShade dark:bg-primaryShade border border-secondaryShade dark:border-primaryShade hover:bg-transparent hover:text-secondaryShade dark:hover:bg-transparent dark:hover:text-primaryShade transition-colors duration-300"
        disabled={
          uploadFileIsLoading || updatePageIsLoading || deleteFileIsLoading
        }
      >
        {uploadFileIsLoading || updatePageIsLoading || deleteFileIsLoading ? (
          <div className="animate-spin border-t-2 border-white border-solid rounded-full w-5 h-5"></div> // Spinner
        ) : (
          <p className="uppercase font-medium">Save</p>
        )}
      </button>
    </Form>
  );
};

export default ProjectContent;
