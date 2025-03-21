"use client";
import { useGetAllFaqQuery } from "@/redux/api/pageApiSlice";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {};

const page = (props: Props) => {
  const nextPath = usePathname();
  const locale = nextPath?.split("/")[1] as "en" | "tr" | "ru";
  const { data: getAllFaqData } = useGetAllFaqQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });

  return (
    <section className="py-10 flex flex-col flex-1">
      <div className="container flex flex-col gap-6">
        {getAllFaqData?.map((faq: any) => (
          <div key={faq?.id} className="flex flex-col gap-2">
            <p className="text-primaryShade font-semibold capitalize text-base md:text-[18px]">
              {faq?.question[locale]}
            </p>
            <div
              className="text-sm md:text-base"
              dangerouslySetInnerHTML={{ __html: faq?.answer[locale] }}
            />
          </div>
        )) || []}
      </div>
    </section>
  );
};

export default page;
