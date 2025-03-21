"use client";
import {
  useSendCareerApplicationMutation,
  useUploadFileMutation,
} from "@/redux/api/infoApiSlice";
import { UploadOutlined } from "@ant-design/icons";
import { ConfigProvider, Form, Input, Upload } from "antd";
import FormItem from "antd/es/form/FormItem";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

type Props = {};

const page = (props: Props) => {
  const t = useTranslations();
  const [form] = Form.useForm();

  const [uploadFileFn, { isLoading: uploadFileIsLoading }] =
    useUploadFileMutation();

  const [
    careerApplicationFn,
    {
      isLoading: careerApplicationLoading,
      error: careerApplicationError,
      data: careerApplicationData,
      isSuccess: careerApplicationIsSuccess,
      isError: careerApplicationIsError,
    },
  ] = useSendCareerApplicationMutation();

  const handleSubmit = async (values: any) => {
    let formData = new FormData();
    formData.append("files", values?.file[0]?.originFileObj);
    try {
      const uploadedFile = await uploadFileFn(formData).unwrap();
      const finalData = {
        name: values?.name,
        email: values?.email,
        telephone: values?.telephone,
        resume: uploadedFile[0],
      };
      console.log("finalData", finalData);
      await careerApplicationFn(finalData).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (careerApplicationIsSuccess) {
      toast.success(careerApplicationData?.message);
      form.resetFields();
    }
    if (careerApplicationIsError) {
      const customError = careerApplicationError as {
        data: {
          message: string | string[];
          error: string;
          statusCode: number;
        };
        status: 400;
      };
      toast.error(
        Array.isArray(customError.data.message)
          ? customError.data.message?.join(", ")
          : customError.data.message
      );
    }
  }, [
    careerApplicationIsSuccess,
    careerApplicationIsError,
    careerApplicationError,
    careerApplicationData,
  ]);
  return (
    <section className="py-10 flex flex-col">
      <div className="container flex flex-col">
        <p className="capitalize text-center text-4xl md:text-5xl text-primaryShade font-extrabold leading-[48px] md:leading-[58px]">
          {t("ABOUT.OPEN_POSITIONS")}
        </p>
        <p className="text-center text-primaryShade uppercase text-xs md:text-base tracking-widest leading-6 font-bold mb-4">
          {t("ABOUT.OPEN_POSITIONS_DESCRIPTION_1")}
        </p>

        {/* form */}
        <ConfigProvider
          theme={{
            components: {
              Input: {
                colorBorder: "var(--input-gray-shade)",
                hoverBorderColor: "var(--input-gray-shade)",
                activeBorderColor: "var(--input-gray-shade)",
                activeBg: "var(--input-gray-shade)",
                hoverBg: "var(--input-gray-shade)",
                activeShadow: "none",
                fontSize: 16,
                colorTextPlaceholder: "var(--gray-shade)",
                colorText: "var(--gray-shade)",
              },
              InputNumber: {
                colorBorder: "var(--input-gray-shade)",
                hoverBorderColor: "var(--input-gray-shade)",
                activeBorderColor: "var(--input-gray-shade)",
                activeBg: "var(--input-gray-shade)",
                hoverBg: "var(--input-gray-shade)",
                activeShadow: "none",
                fontSize: 16,
                colorTextPlaceholder: "var(--gray-shade)",
                colorText: "var(--gray-shade)",
              },
            },
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className=""
            requiredMark={undefined}
          >
            <div className="flex flex-col gap-1">
              <FormItem
                className="!flex-1"
                name="name"
                required
                rules={[
                  {
                    message: "Please input your name",
                  },
                ]}
              >
                <Input
                  className="h-[50px] md:h-[60px] rounded-md bg-inputGrayShade"
                  placeholder={t("NAME_SURNAME")}
                />
              </FormItem>

              <FormItem
                className="!flex-1"
                required
                rules={[
                  {
                    message: "Please input your number",
                  },
                ]}
                name="telephone"
              >
                <Input
                  className="about-positions-number-input h-[50px] md:h-[60px] rounded-md bg-inputGrayShade w-full"
                  placeholder={t("TELEPHONE")}
                />
              </FormItem>

              <FormItem
                className="!flex-1"
                name="email"
                validateTrigger="onBlur"
                rules={[
                  {
                    type: "email",
                    message: "Please input a valid email address",
                  },
                ]}
              >
                <Input
                  className="h-[50px] md:h-[60px] rounded-md bg-inputGrayShade"
                  placeholder={t("EMAIL_ADDRESS")}
                />
              </FormItem>

              <FormItem
                name="file"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  return e?.fileList;
                }}
                className="py-[9px] md:py-[10px] rounded-md flex items-center bg-inputGrayShade px-[11px]"
              >
                <Upload
                  listType="text"
                  beforeUpload={() => false}
                  maxCount={1}
                  className="!bg-inputGrayShade rounded-md"
                >
                  <button
                    type="button"
                    className="flex gap-2 items-center cursor-pointer border rounded-lg py-[2px] md:py-2 px-2 bg-white text-gray-600"
                  >
                    <UploadOutlined className="text-gray-600" />
                    <span className="text-gray-600">{t("UPLOAD")}</span>
                  </button>
                </Upload>
              </FormItem>
            </div>

            {/* button */}
            <div className="flex justify-center gap-2">
              {/* send button */}
              <button
                disabled={careerApplicationLoading || uploadFileIsLoading}
                type="button"
                onClick={() => form.submit()}
                className="bg-primaryShade font-semibold text-white py-2 px-8 grid place-items-center rounded-md cursor-pointer"
              >
                {careerApplicationLoading || uploadFileIsLoading ? (
                  <div className="animate-spin border-t-2 border-white border-solid rounded-full w-5 h-5"></div>
                ) : (
                  <p>{t("SEND")}</p>
                )}
              </button>
              {/* clear button */}
              <button
                disabled={careerApplicationLoading || uploadFileIsLoading}
                type="button"
                onClick={() => form.resetFields()}
                className="bg-grayShade font-semibold text-white py-2 px-8 grid place-items-center rounded-md cursor-pointer"
              >
                {careerApplicationLoading || uploadFileIsLoading ? (
                  <div className="animate-spin border-t-2 border-white border-solid rounded-full w-5 h-5"></div>
                ) : (
                  <p>{t("CLEAR")}</p>
                )}
              </button>
            </div>
          </Form>
        </ConfigProvider>
      </div>
    </section>
  );
};

export default page;
