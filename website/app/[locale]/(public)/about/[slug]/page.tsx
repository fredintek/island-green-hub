"use client";
import React from "react";
import DashedText from "@/components/common/DashedText";
import { useTranslations } from "next-intl";
import { useParams, usePathname } from "next/navigation";
import { useGetPageBySlugQuery } from "@/redux/api/pageApiSlice";
import { baseUrl } from "@/constants";
import { cleanAndSplitHTML } from "@/utilities";

type Props = {};

const page = (props: Props) => {
  const params = useParams();
  const nextPath = usePathname();
  const locale = nextPath?.split("/")[1] as "en" | "tr" | "ru";

  const { data: getPageBySlug } = useGetPageBySlugQuery(
    params?.slug as string,
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const textDescription = cleanAndSplitHTML(
    getPageBySlug?.sections[0]?.content?.text[locale]
  );
  const t = useTranslations();
  return (
    <section className="py-10 flex flex-col">
      <div className="container flex flex-col md:flex-row gap-4">
        {/* left */}
        <div className="flex-1 flex items-center">
          <img
            src={`${baseUrl}${getPageBySlug?.sections[0]?.content?.image[0]}`}
            alt="who-are-we-img"
            className="max-h-[500px] min-h-[500px] w-full object-cover rounded-xl"
          />
        </div>
        {/* right */}
        <div className="flex-1 flex flex-col justify-center gap-2 md:gap-4">
          <div>
            <DashedText
              text={t("ABOUT.ABOUT_US")}
              stylesClassName="text-primaryShade text-base md:text-[18px]"
            />
          </div>

          {/* header */}
          <p className="capitalize text-primaryShade font-semibold text-3xl md:text-4xl">
            {getPageBySlug?.title[locale]}
          </p>

          <div className="flex flex-col gap-2">
            {textDescription?.map((text: string) => (
              <p className="text-grayShade text-base md:text-[18px]">{text}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
