"use client";
import React, { useEffect } from "react";
import HeroSection from "@/components/Home/HeroSection";
import DashedText from "@/components/common/DashedText";
import ServiceCard from "@/components/Home/ServiceCard";
import ReasonsCard from "@/components/Home/ReasonsCard";
import { ReadOutlined, SendOutlined } from "@ant-design/icons";
import { ConfigProvider, Form, Input } from "antd";
import FormItem from "antd/es/form/FormItem";
import { useTranslations } from "next-intl";
import { prepareTranslationText } from "@/utilities/prepareTranslationText";
import { useGetPageBySlugQuery } from "@/redux/api/pageApiSlice";
import { useGetAllPagesQuery } from "@/redux/api/navbarApiSlice";
import { useSendNewLetterMutation } from "@/redux/api/infoApiSlice";
import { toast } from "react-toastify";
import { baseUrl } from "@/constants";

type Props = {};

const page = (props: Props) => {
  const t = useTranslations();
  const [form] = Form.useForm();

  const { data: getPageBySlug, isLoading: getPageBySlugLoading } =
    useGetPageBySlugQuery("home", {
      refetchOnFocus: true,
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
    });

  const { data: getHomeProjectPages, isLoading: getHomeProjectPagesLoading } =
    useGetAllPagesQuery(
      { isProjectHomePage: true },
      {
        refetchOnFocus: true,
        refetchOnReconnect: true,
        refetchOnMountOrArgChange: true,
      }
    );

  const [
    sendNewsLetterFn,
    {
      isLoading: sendNewsLetterLoading,
      error: sendNewsLetterError,
      data: sendNewsLetterData,
      isSuccess: sendNewsLetterIsSuccess,
      isError: sendNewsLetterIsError,
    },
  ] = useSendNewLetterMutation();

  // console.log("getHomeProjectPages", getHomeProjectPages);

  const handleSubmit = async (values: any) => {
    try {
      await sendNewsLetterFn(values).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (sendNewsLetterIsSuccess) {
      toast.success(sendNewsLetterData?.message);
      form.resetFields();
    }
    if (sendNewsLetterIsError) {
      const customError = sendNewsLetterError as {
        data: any;
        status: number;
      };
      toast.error(customError.data.message);
    }
  }, [
    sendNewsLetterIsSuccess,
    sendNewsLetterIsError,
    sendNewsLetterError,
    sendNewsLetterData,
  ]);

  return (
    <>
      {/* HERO */}
      {getPageBySlugLoading ? (
        <div className="animate-spin border-t-2 border-white border-solid rounded-full w-5 h-5"></div>
      ) : (
        <HeroSection
          data={getPageBySlug?.sections?.find(
            (obj: any) => obj?.type === "home-hero"
          )}
        />
      )}

      {/* SERVICES */}
      {getHomeProjectPagesLoading ? (
        <div className="animate-spin border-t-2 border-white border-solid rounded-full w-5 h-5"></div>
      ) : (
        <section className="mb-10">
          <div className="container">
            {/* header text */}
            <div className="mb-2">
              <DashedText
                text={t("HOMEPAGE.PROJECTS")}
                stylesClassName="text-primaryShade uppercase"
              />
            </div>

            {/* services cards */}
            <div className="flex flex-col gap-10 md:gap-20">
              {getHomeProjectPages?.map((page: any, idx: number) => {
                return (
                  <ServiceCard
                    key={idx}
                    index={idx + 1}
                    data={{
                      href: page?.slug,
                      images: page?.projectHomeImages,
                      text: page?.projectHomeText,
                      title: page?.title,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* WHY ISLAND GREEN */}
      {getPageBySlugLoading ? (
        <div className="animate-spin border-t-2 border-white border-solid rounded-full w-5 h-5"></div>
      ) : (
        <section className="px-10 pt-10 pb-20  bg-blackShade">
          <div className="container">
            {/* header text */}
            <div className="mb-6 lg:mb-10 flex justify-center">
              <DashedText
                text={t(
                  `HOMEPAGE.${prepareTranslationText(
                    "Why Island Green Construction"
                  )}`
                )}
                stylesClassName="text-primaryShade uppercase font-bold text-sm md:text-base"
              />
            </div>

            {/* Topic */}
            <p className="text-white font-extrabold text-2xl lg:text-4xl text-center mb-4">
              {t(
                `HOMEPAGE.${prepareTranslationText(
                  "Some reasons to choose us"
                )}`
              )}
            </p>

            {/* Reasons */}
            <div className="flex flex-col items-center lg:flex-row lg:justify-center gap-6">
              <div className="flex-1 flex flex-col gap-5">
                <ReasonsCard
                  direction="left"
                  data={
                    getPageBySlug?.sections?.find(
                      (obj: any) => obj?.type === "home-reason"
                    )?.content[0]
                  }
                />
                <ReasonsCard
                  direction="left"
                  data={
                    getPageBySlug?.sections?.find(
                      (obj: any) => obj?.type === "home-reason"
                    )?.content[1]
                  }
                />
              </div>
              <div className="w-[90vw] h-[90vw] min-[400px]:w-[370px] min-[400px]:h-[370px] border-2 border-primaryShade rounded-full">
                <img
                  src={"./../../images/goldlogo1-svg.svg"}
                  alt=""
                  className="w-full h-full object-contain scale-[0.85]"
                />
              </div>
              <div className="flex-1 flex flex-col gap-5">
                <ReasonsCard
                  direction="right"
                  data={
                    getPageBySlug?.sections?.find(
                      (obj: any) => obj?.type === "home-reason"
                    )?.content[2]
                  }
                />
                <ReasonsCard
                  direction="right"
                  data={
                    getPageBySlug?.sections?.find(
                      (obj: any) => obj?.type === "home-reason"
                    )?.content[3]
                  }
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CONTACT US */}
      {getPageBySlugLoading ? (
        <div className="animate-spin border-t-2 border-white border-solid rounded-full w-5 h-5"></div>
      ) : (
        <section className="py-[60px] md:py-[120px] mb-10 relative overflow-hidden">
          <div className="container">
            {/* contact us */}
            <div className="max-w-[600px] flex flex-col gap-4 relative z-10">
              {/* informed text */}
              <div className="flex items-center gap-3 text-base">
                <ReadOutlined className="text-secondaryShade" />
                <p className="text-primaryShade font-semibold">
                  {t(`HOMEPAGE.BE_INFORMED_ABOUT_INNOVATIONS`)}
                </p>
              </div>

              {/* title */}
              <p className="text-grayShade text-2xl md:text-4xl font-semibold">
                {t(`HOMEPAGE.BE_INFORMED_ABOUT_INNOVATIONS_DESCRIPTION`)}
              </p>

              {/* form */}
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className=""
              >
                <div className="flex">
                  <ConfigProvider
                    theme={{
                      components: {
                        Input: {
                          colorBorder: "var(--black-shade)",
                          borderRadius: 0,
                          hoverBorderColor: "var(--secondary-shade)",
                          activeBorderColor: "var(--secondary-shade)",
                          activeShadow: "none",
                          fontSize: 16,
                          colorTextPlaceholder: "var(--gray-shade)",
                          colorText: "var(--gray-shade)",
                        },
                      },
                    }}
                  >
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
                        className="h-[50px] md:h-[70px] rounded-tl-md rounded-bl-md"
                        placeholder="Email Address"
                      />
                    </FormItem>
                  </ConfigProvider>

                  {/* submit button */}
                  <button
                    type="button"
                    onClick={() => form.submit()}
                    disabled={sendNewsLetterLoading}
                    className="bg-secondaryShade text-white text-lg md:text-2xl h-[50px] md:h-[70px] w-[50px] md:w-[70px] grid place-items-center rounded-tr-md rounded-br-md border border-l-0 border-secondaryShade md:hover:bg-transparent md:hover:text-secondaryShade transition-colors duration-300"
                  >
                    {sendNewsLetterLoading ? (
                      <div className="animate-spin border-t-2 border-white border-solid rounded-full w-5 h-5"></div>
                    ) : (
                      <SendOutlined className="-rotate-45" />
                    )}
                  </button>
                </div>
              </Form>
            </div>
          </div>

          {/* video gif */}
          <div className="bg-red-500 w-[280px] sm:w-[500px] aspect-[16/12] absolute top-0 right-0 -z-1">
            <video
              className="w-full block h-full object-cover"
              autoPlay
              loop
              muted={true}
              preload="none"
              playsInline
            >
              <source
                src={
                  `${baseUrl}${
                    getPageBySlug?.sections?.find(
                      (obj: any) => obj?.type === "home-contact"
                    )?.content[0]
                  }` || ""
                }
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* <div className="hidden min-[1945px]:block absolute bg-secondaryShade left-0 top-[-180px] h-[920px] w-[100px] rotate-45 z-[-1]" />
        <div className="absolute left-[1048px] top-[-124px] h-[591px] w-[103px] -rotate-45 z-[-1] opacity-[0.502] bg-news-letter-shape-2" />
        <div className="absolute left-[1225px] top-[-110px] h-[563px] w-[78px] -rotate-45 z-[-1] opacity-[0.502] bg-news-letter-shape-3" />
        <div className="hidden min-[1170px]:block absolute right-[615px] top-[-53px] h-[360px] w-[3px] -rotate-45 z-[-1] bg-primaryShade" />
        <div className="hidden min-[1170px]:block absolute right-[493px] top-[-97px] h-[626px] w-[3px] -rotate-45 z-[-1] bg-secondaryShade" />
        <div className="hidden min-[1170px]:block absolute top-0 right-0 h-full z-[-1]">
          <img
            src="./../../images/newsletter-shape-6.png"
            className="h-full object-cover"
            alt=""
          />
        </div> */}
        </section>
      )}
    </>
  );
};

export default page;
