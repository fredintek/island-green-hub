"use client";
import ProductLink from "@/components/projects/edit-project/ProductLink";
import ProjectContent from "@/components/projects/edit-project/ProjectContent";
import ProjectHome from "@/components/projects/edit-project/ProjectHome";
import ProjectHouse from "@/components/projects/edit-project/ProjectHouse";
import ProjectLocation from "@/components/projects/edit-project/ProjectLocation";
import ProjectTitle from "@/components/projects/edit-project/ProjectTitle";
import StageGallery from "@/components/projects/edit-project/StageGallery";
import YoutubeVideos from "@/components/projects/edit-project/YoutubeVideos";
import { useGetPageBySlugQuery } from "@/redux/api/pageApiSlice";
import { useParams } from "next/navigation";
import React from "react";

type Props = {};

const page = (props: Props) => {
  const params = useParams() as { locale: string; slug: string };

  const { data: getAllPageBySlugData } = useGetPageBySlugQuery(params?.slug);

  return (
    <section className="flex flex-col">
      <p className="text-[22px] text-secondaryShade dark:text-primaryShade font-bold uppercase mb-6">
        Edit {params?.slug}
      </p>

      <div className="flex flex-col gap-6">
        {/* project title */}
        <div className="flex flex-col p-6 bg-white dark:bg-[#1e293b] shadow-md rounded-md">
          <p className="text-[18px] text-secondaryShade dark:text-primaryShade font-bold uppercase mb-4">
            Project Title
          </p>

          <ProjectTitle pageData={getAllPageBySlugData} />
        </div>

        {/* product link */}
        <div className="flex flex-col p-6 bg-white dark:bg-[#1e293b] shadow-md rounded-md">
          <p className="text-[18px] text-secondaryShade dark:text-primaryShade font-bold uppercase mb-4">
            Product Link
          </p>

          <ProductLink pageData={getAllPageBySlugData} />
        </div>

        {/* project home */}
        <div className="flex flex-col p-6 bg-white dark:bg-[#1e293b] shadow-md rounded-md">
          <p className="text-[18px] text-secondaryShade dark:text-primaryShade font-bold uppercase mb-4">
            Project Home
          </p>

          <ProjectHome pageData={getAllPageBySlugData} />
        </div>

        {/* project content */}
        <div className="flex flex-col p-6 bg-white dark:bg-[#1e293b] shadow-md rounded-md">
          <p className="text-[18px] text-secondaryShade dark:text-primaryShade font-bold uppercase mb-4">
            Project Content
          </p>

          <ProjectContent pageData={getAllPageBySlugData} />
        </div>

        {/* project house */}
        <div className="flex flex-col p-6 bg-white dark:bg-[#1e293b] shadow-md rounded-md">
          <p className="text-[18px] text-secondaryShade dark:text-primaryShade font-bold uppercase mb-4">
            Product House
          </p>

          <ProjectHouse pageData={getAllPageBySlugData} />
        </div>

        {/* stage 2 */}
        <div className="flex flex-col p-6 bg-white dark:bg-[#1e293b] shadow-md rounded-md">
          <p className="text-[18px] text-secondaryShade dark:text-primaryShade font-bold uppercase mb-4">
            Stage Gallery
          </p>

          <StageGallery pageData={getAllPageBySlugData} />
        </div>

        {/* location */}
        <div className="flex flex-col p-6 bg-white dark:bg-[#1e293b] shadow-md rounded-md">
          <p className="text-[18px] text-secondaryShade dark:text-primaryShade font-bold uppercase mb-4">
            Project Location
          </p>

          <ProjectLocation pageData={getAllPageBySlugData} />
        </div>

        {/* youtube videos */}
        <div className="flex flex-col p-6 bg-white dark:bg-[#1e293b] shadow-md rounded-md">
          <p className="text-[18px] text-secondaryShade dark:text-primaryShade font-bold uppercase mb-4">
            Youtube Videos
          </p>

          <YoutubeVideos pageData={getAllPageBySlugData} />
        </div>
      </div>
    </section>
  );
};

export default page;
