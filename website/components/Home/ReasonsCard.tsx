"use client";
import { MultiLanguage } from "@/utilities/interfaces";
import { useLocale } from "next-intl";
import React from "react";

type Props = {
  direction: "left" | "right";
  data: {
    title: MultiLanguage;
    text: MultiLanguage;
    icon: string;
  };
};

const ReasonsCard = ({ direction, data }: Props) => {
  const locale = useLocale() as "en" | "tr" | "ru";
  return (
    <div
      className={`flex items-start gap-3 ${
        direction === "right" ? "lg:flex-row-reverse" : "flex-row"
      } max-w-[600px]`}
    >
      {/* BOX */}
      <div className="group hover:bg-white flex-shrink-0 w-[70px] h-[70px] lg:w-[85px] lg:h-[85px] bg-primaryShade rounded-md relative grid place-items-center transition-colors duration-[400ms]">
        <span
          className={`${data?.icon} text-white text-5xl group-hover:text-primaryShade`}
        ></span>
        <div
          className={`absolute w-3 lg:w-4 h-3 lg:h-4 bg-primaryShade top-1/2 ${
            direction === "right"
              ? "right-1 translate-x-1/2 lg:left-1 lg:-translate-x-1/2"
              : "right-1 translate-x-1/2"
          } -translate-y-1/2 rotate-45 group-hover:bg-white transition-colors duration-[400ms]`}
        ></div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col gap-[2px] lg:gap-2 max-w-[300px] lg:max-w-none">
        {/* title */}
        <p className="text-white text-base lg:text-lg uppercase font-semibold">
          {data?.title[locale]}
        </p>

        {/* text */}
        <p className="text-grayShade text-[14px] lg:text-base font-normal">
          {data?.text[locale]}
        </p>
      </div>
    </div>
  );
};

export default ReasonsCard;
