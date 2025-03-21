"use client";
import DashedText from "@/components/common/DashedText";
import SmoothImageDisplay from "@/components/common/SmoothImageDisplay";
import { useGetPageBySlugQuery } from "@/redux/api/pageApiSlice";
import { splitByBr } from "@/utilities";
import { useParams, usePathname } from "next/navigation";
import React from "react";

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

  const blogContent = getPageBySlug?.sections[0];
  const textDescription = splitByBr(blogContent?.content?.blogContent[locale]);

  return (
    <section className="py-10 flex flex-col flex-1 justify-center">
      <div className="container flex flex-col md:flex-row gap-4">
        {/* left */}
        <div className="flex-1 flex flex-col justify-center gap-2 md:gap-4">
          <div>
            <DashedText
              text={getPageBySlug?.title[locale]}
              stylesClassName="text-primaryShade text-base md:text-[18px]"
            />
          </div>

          {/* header */}
          <p className="capitalize text-primaryShade font-semibold text-3xl md:text-4xl">
            {blogContent?.content?.blogTitle[locale]}
          </p>

          {/* content */}
          <div className="flex flex-col gap-4 font-semibold">
            {textDescription?.length > 0 && (
              <p
                dangerouslySetInnerHTML={{ __html: textDescription[0] }}
                className="leading-8 text-secondaryShade text-base md:text-[18px]"
              />
            )}
            {textDescription?.length > 1 && (
              <div
                dangerouslySetInnerHTML={{
                  __html: textDescription?.slice(1)?.join(" "),
                }}
                className="flex flex-col gap-1 leading-8 text-grayShade text-base md:text-[18px]"
              />
            )}
            {/* {textDescription?.length > 1 &&
              textDescription
                ?.slice(1)
                ?.map((text) => (
                  <p className="leading-8 text-grayShade text-base md:text-[18px]">
                    {text}
                  </p>
                ))} */}
          </div>
        </div>

        {/* right */}
        <div className="flex-1 flex items-start">
          <SmoothImageDisplay image={blogContent?.content?.blogImages} />
        </div>
      </div>
    </section>
  );
};

export default page;
