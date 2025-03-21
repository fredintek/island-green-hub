"use client";
import AnimatedBtn from "@/components/common/AnimatedBtn";
import SmoothImageDisplay from "@/components/common/SmoothImageDisplay";
import { cleanAndSplitHTML } from "@/utilities";
import { MultiLanguage } from "@/utilities/interfaces";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useLocale, useTranslations } from "next-intl";
import React from "react";

type Props = {
  index?: number;
  data: {
    title: MultiLanguage;
    text: MultiLanguage;
    images: string[];
    href: string;
  };
};

const ServiceCard = ({ index, data }: Props) => {
  const t = useTranslations();
  const locale = useLocale() as "en" | "ru" | "tr";
  const textDescription = cleanAndSplitHTML(data?.text[locale]);

  return (
    <div
      className={`flex flex-col ${
        index && index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
      } gap-4`}
    >
      {/* left */}
      <div className="flex-1 md:flex-[0.4]">
        {/* header */}
        <p className="text-primaryShade text-3xl md:text-[40px] font-extrabold mb-2 md:mb-5">
          {data?.title[locale]}
        </p>

        <p className="text-[18px] md:text-[22px] text-secondaryShade font-semibold mb-3">
          {textDescription[0]}
        </p>

        {textDescription.length > 1 &&
          textDescription
            ?.slice(1)
            ?.map((text: string) => (
              <p className="text-[15px] md:text-[18px] text-grayShade mb-3">
                {text}
              </p>
            ))}

        {/* CTA */}
        <AnimatedBtn
          link={data?.href}
          children={
            <>
              <div className="z-10 bg-white w-4 h-4 grid place-items-center rounded-full">
                <ArrowRightOutlined className="text-primaryShade text-[10px] font-bold" />
              </div>
              <p className="z-10">{t("HOMEPAGE.SEE_DETAILS")}</p>
            </>
          }
        />
      </div>

      {/* right */}
      <div className="flex-1 md:flex-[0.6] flex">
        <SmoothImageDisplay image={data?.images} />
      </div>
    </div>
  );
};

export default ServiceCard;
