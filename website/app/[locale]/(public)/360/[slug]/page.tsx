"use client";
import {
  useGetPageBySlugQuery,
  useGetSectionByTypeQuery,
} from "@/redux/api/pageApiSlice";
import { useParams } from "next/navigation";
import React from "react";

type Props = {};

const page = (props: Props) => {
  const params = useParams();

  const { data: getPageBySlug } = useGetPageBySlugQuery(params?.slug as string);

  const { data: getSectionByType } = useGetSectionByTypeQuery(
    {
      sectionType: "degree-view",
      parentPageId: getPageBySlug?.id,
    },
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
    }
  );

  return (
    <section className="border h-[100dvh]">
      <iframe
        src={getSectionByType?.content}
        className="w-full h-full"
        style={{ border: "none" }}
      ></iframe>
    </section>
  );
};

export default page;
