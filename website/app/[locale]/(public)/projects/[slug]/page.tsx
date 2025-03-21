"use client";
import AnimatedBtn from "@/components/common/AnimatedBtn";
import DashedText from "@/components/common/DashedText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import ProjectsCard from "@/components/Projects/ProjectsCard";
import { useParams, usePathname } from "next/navigation";
import { useGetPageBySlugQuery } from "@/redux/api/pageApiSlice";
import ProjectCardSmall from "@/components/Projects/ProjectCardSmall";
import { useTranslations } from "next-intl";
import { baseUrl } from "@/constants";
import { cleanAndSplitHTML } from "@/utilities";

type Props = {};

const page = (props: Props) => {
  const t = useTranslations();
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

  const productLink = getPageBySlug?.sections?.find((section: any) =>
    section?.type.includes("productLink")
  )?.content;

  const projectContent = getPageBySlug?.sections?.find((section: any) =>
    section?.type.includes("productContent")
  )?.content;

  const projectLocation = getPageBySlug?.sections
    ?.find((section: any) => section?.type.includes("productLocation"))
    ?.content?.split(",");

  const projectVideos = getPageBySlug?.sections?.find((section: any) =>
    section?.type.includes("productYoutube")
  )?.content;

  const projectStage = getPageBySlug?.sections?.find((section: any) =>
    section?.type.includes("productStage2Images")
  )?.content;

  const textDescription = cleanAndSplitHTML(
    projectContent?.description[locale]
  );

  return (
    <section className="flex flex-col flex-1">
      {/* SHOWCASE AND CONTENT*/}
      <div className="bg-inputGrayShade py-10 flex flex-col gap-10">
        {/* SHOWCASE */}
        <div className="container">
          <p className="text-center text-primaryShade font-extrabold text-3xl md:text-4xl mb-4">
            {getPageBySlug?.title[locale]} 360°
          </p>
          <div className="h-[600px]">
            <iframe
              src={productLink}
              className="w-full h-full"
              style={{ border: "none" }}
            ></iframe>
          </div>
        </div>

        {/* CONTENT */}
        <div className="container bg-white py-10 px-4 flex flex-col xmd:flex-row gap-10">
          {/* left */}
          <div className="max-h-[400px] min-[470px]:min-h-[400px] flex-1 grid place-items-center xmd:self-center">
            <div className="relative w-full min-[470px]:h-full min-[470px]:w-fit aspect-square border-[50px] min-[470px]:border-[80px] border-secondaryShade rounded-full">
              <img
                src={`${baseUrl}${projectContent?.image}`}
                className="w-full h-full object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                alt=""
              />
            </div>
          </div>
          {/* right */}
          <div className="h-fit flex-1 flex flex-col gap-4 xmd:self-center">
            <div>
              <DashedText
                text={getPageBySlug?.title[locale]}
                stylesClassName="uppercase text-primaryShade"
              />
            </div>

            {/* contents */}
            <div className="flex flex-col gap-3 text-grayShade text-base md:text-[18px] leading-7">
              {textDescription?.map((text: string) => (
                <p>{text}</p>
              ))}
            </div>

            {/* CTA */}
            <AnimatedBtn
              children={
                <>
                  <div className="z-10 grid place-items-center w-4 h-4 rounded-full bg-white">
                    <FontAwesomeIcon
                      icon={faBook}
                      className="w-2 h-2 text-primaryShade"
                      color="#b5884c"
                    />
                  </div>
                  <p className="z-10">{t("E_CATALOG")}</p>
                </>
              }
              link={`${baseUrl}${projectContent?.pdf}`}
              target="_blank"
              staticLink={true}
            />
          </div>
        </div>
      </div>

      {/* PROJECT HOUSES AND VIDEOS AND STAGE2*/}
      <div className="py-10 flex flex-col gap-10">
        {/* PROJECT HOUSES */}
        <div className="container">
          <p className="text-center text-primaryShade font-extrabold text-3xl md:text-4xl mb-4">
            {t("PROJECT_HOUSES")}
          </p>

          <div className="grid grid-cols-1 xsm:grid-cols-2 lg:grid-cols-3 gap-6">
            {getPageBySlug?.projectHouse?.map((project: any, idx: number) => {
              return (
                <ProjectsCard
                  key={idx}
                  data={{
                    displayImg: `${baseUrl}${project?.displayImage}`,
                    title: project?.title,
                    projectHouseId: project?.id,
                    parentPage: getPageBySlug?.slug,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* STAGE 2 */}
        {projectStage && projectStage?.length > 0 && (
          <div className="container">
            <p className="text-center text-primaryShade font-extrabold text-3xl md:text-4xl mb-4">
              {t("STAGE_2")}
            </p>

            <div className="grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-3 gap-6">
              {projectStage?.map((img: string, idx: number) => {
                return (
                  <ProjectCardSmall
                    key={idx}
                    image={`${baseUrl}${img}`}
                    href={`${baseUrl}${img}`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* VIDEOS */}
        {projectVideos && (
          <div className="container">
            <p className="text-center text-primaryShade font-extrabold text-3xl md:text-4xl mb-4">
              {t("VIDEOS")}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {projectVideos?.map((link: string, idx: number) => {
                const embedLink = link.replace("watch?v=", "embed/");
                return (
                  <div key={idx} className="w-full aspect-video rounded-md">
                    <iframe
                      style={{ borderRadius: "6px" }}
                      width="100%"
                      height="100%"
                      src={embedLink}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    ></iframe>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* PROJECT LOCATION*/}
      {projectLocation && (
        <div className="bg-inputGrayShade py-10 flex flex-col">
          {/* LOCATION */}
          <p className="text-center text-primaryShade font-extrabold text-3xl md:text-4xl mb-4">
            Project Location
          </p>
          <div className="container w-full aspect-square xsm:aspect-[16/6] rounded-md border border-black">
            <iframe
              // src={projectLocation}
              src={`https://www.google.com/maps?q=${projectLocation[0]},${projectLocation[1]}&hl=en&z=14&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
};

export default page;
