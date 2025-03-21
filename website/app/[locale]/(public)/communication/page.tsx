"use client";
import AnimatedBtn from "@/components/common/AnimatedBtn";
import DashedText from "@/components/common/DashedText";
import ContactInfo from "@/components/Communication/ContactInfo";
import { useConsultExpertMutation } from "@/redux/api/infoApiSlice";
import { useGetAllCommunicationQuery } from "@/redux/api/pageApiSlice";
import { ArrowRightOutlined } from "@ant-design/icons";
import {
  faEnvelope,
  faLocationDot,
  faPhoneVolume,
} from "@fortawesome/free-solid-svg-icons";
import { ConfigProvider, Form, Input } from "antd";
import FormItem from "antd/es/form/FormItem";
import TextArea from "antd/es/input/TextArea";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

type Props = {};

const page = (props: Props) => {
  const t = useTranslations();
  const [form] = Form.useForm();
  const { data: getAllCommunicationData } = useGetAllCommunicationQuery(
    undefined,
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const [
    consultExpertFn,
    {
      isLoading: consultExpertLoading,
      error: consultExpertError,
      data: consultExpertData,
      isSuccess: consultExpertIsSuccess,
      isError: consultExpertIsError,
    },
  ] = useConsultExpertMutation();

  const handleSubmit = async (values: any) => {
    try {
      await consultExpertFn({
        name: values?.name,
        email: values?.email,
        message: values?.message,
      }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const data =
    Array.isArray(getAllCommunicationData) &&
    getAllCommunicationData?.length > 0 &&
    getAllCommunicationData[0];

  useEffect(() => {
    if (consultExpertIsSuccess) {
      toast.success(consultExpertData?.message);
      form.resetFields();
    }
    if (consultExpertIsError) {
      const customError = consultExpertError as {
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
    consultExpertIsSuccess,
    consultExpertIsError,
    consultExpertError,
    consultExpertData,
  ]);

  return (
    <section className="py-24 flex flex-col flex-1">
      <div className="container flex flex-col gap-12 md:gap-20">
        <div className="flex flex-col gap-8 md:items-start md:justify-between md:flex-row md:gap-4">
          {/* TELEPHONE */}
          <ContactInfo
            key={0}
            icon={faPhoneVolume}
            items={data?.phoneNumber}
            isSideBorder={false}
          />

          {/* EMAIL */}
          <ContactInfo
            key={0}
            icon={faEnvelope}
            items={data?.email}
            isSideBorder={true}
          />

          {/* LOCATION */}
          <ContactInfo
            key={0}
            icon={faLocationDot}
            items={data?.address}
            isSideBorder={false}
          />
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex justify-center items-center">
            <DashedText
              text={t("GET_IN_TOUCH")}
              stylesClassName="uppercase text-primaryShade font-medium"
            />
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-center capitalize text-4xl md:text-5xl text-primaryShade font-extrabold leading-[48px] md:leading-[58px]">
              {t("CONTACT_EXPERTS")}
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
                    className="!flex-1"
                    name="message"
                    required
                    rules={[
                      {
                        message: "Please input your message",
                      },
                    ]}
                  >
                    <TextArea
                      autoSize={{ minRows: 10 }}
                      className="rounded-md bg-inputGrayShade"
                      placeholder={`${t("MESSAGE")}...`}
                    />
                  </FormItem>
                </div>

                <div className="flex justify-center">
                  {/* CTA */}
                  <AnimatedBtn
                    children={
                      <div
                        className="flex items-center gap-1"
                        onClick={() => {
                          if (consultExpertLoading) {
                            return;
                          } else {
                            return form.submit();
                          }
                        }}
                      >
                        {consultExpertLoading ? (
                          <div className="animate-spin border-t-2 border-white border-solid rounded-full w-5 h-5"></div>
                        ) : (
                          <>
                            <div className="z-10 bg-white w-4 h-4 grid place-items-center rounded-full mt-[2px]">
                              <ArrowRightOutlined className="text-primaryShade text-[10px] font-bold" />
                            </div>
                            <p className="z-10 capitalize">{t("SEND")}</p>
                          </>
                        )}
                      </div>
                    }
                  />
                </div>
              </Form>
            </ConfigProvider>
          </div>
        </div>
      </div>

      <div className="w-full aspect-[16/11] md:aspect-[16/6] mt-12 md:mt-20">
        {/* 35.142691,33.90226 */}
        <iframe
          src={`https://www.google.com/maps?q=35.142691,33.90226&hl=en&z=14&output=embed`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
        ></iframe>
      </div>
    </section>
  );
};

export default page;
