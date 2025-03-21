"use client";
import GalleryTab from "@/components/Projects/GalleryTab";
import { baseUrl } from "@/constants";
import { useGetProjectHouseByIdQuery } from "@/redux/api/projectHouseApiSlice";
import { useTranslations } from "next-intl";
import { useParams, usePathname } from "next/navigation";
import React from "react";

type Props = {};

const page = (props: Props) => {
  const params = useParams();
  const t = useTranslations();
  const nextPath = usePathname();
  const locale = nextPath?.split("/")[1] as "en" | "tr" | "ru";

  const { data: projectHouse } = useGetProjectHouseByIdQuery(
    String(params?.id)
  );
  return (
    <section className="flex flex-col flex-1 py-10">
      <div className="container flex flex-col gap-10">
        {/* top */}
        <div>
          <p className="text-primaryShade font-extrabold text-3xl md:text-4xl mb-4">
            {projectHouse?.title[locale]}
          </p>

          <div className="rounded-xl w-full aspect-[16/11] xsm:aspect-[16/7]">
            <img
              src={`${baseUrl}${projectHouse?.coverImage}`}
              className="w-full h-full object-cover rounded-md"
              alt=""
            />
          </div>
        </div>

        {/* bottom */}
        <div className="flex gap-10 flex-col xmd:flex-row">
          {/* left */}
          <div className="flex-[0.65]">
            <p className="text-primaryShade font-extrabold text-3xl md:text-4xl mb-4">
              {t("GENERAL_INFORMATION")}
            </p>

            <div
              dangerouslySetInnerHTML={{
                __html: projectHouse?.generalInfo[locale],
              }}
            />

            {/* <p className="text-grayShade text-sm md:text-base font-semibold mb-4">
              We invite you to a peaceful summer life 365 days a year in a
              complex with 180-degree sea views. Golden sandy beaches and the
              warm Mediterranean are just five minutes away. A prestigious
              community, a high-status neighborhood and a family-friendly
              atmosphere. Enjoy a harbor with luxury fish restaurants and
              fishing boats.
            </p>

            <p className="text-grayShade text-sm md:text-base font-semibold mb-8">
              Welcome to the most preferred location in the Bogaz region.
            </p> */}

            {/* gallery */}
            <div className="mt-4">
              <p className="text-center text-primaryShade font-extrabold text-3xl md:text-4xl mb-4">
                {t("GALLERY")}
              </p>

              {/* gallery tab */}
              <GalleryTab data={projectHouse?.gallery} />
            </div>
          </div>

          {/* right */}
          <div className="bg-secondaryShade rounded-md flex-[0.35] p-4 flex flex-col min-[500px]:flex-row gap-6 xmd:flex-col h-fit">
            <div className="">
              <p className="text-primaryShade text-base capitalize font-semibold">
                {t("FEATURES")}
              </p>
              <div
                className="pl-2 text-white text-[13px] capitalize flex flex-col gap-2"
                dangerouslySetInnerHTML={{
                  __html: projectHouse?.features[locale],
                }}
              />
              {/* <ul className="list-disc list-inside pl-2 text-white text-[13px] capitalize leading-5">
                <li>Terrace in master bedroom</li>
                <li>Wall cabinets in all bedroom</li>
                <li>Air conditioning infrastructure</li>
                <li>Fireplace furnished with crushed yellow stones</li>
                <li>BBQ on the roof</li>
                <li>
                  Yellow crushed stone cladding on the exterior areas of the
                  houses
                </li>
                <li>Double glazed aluminum windows</li>
                <li>Open parking lot</li>
                <li>Terrace floor BBQ and mini kitchen</li>
                <li>Metal grill installation chimney with wood appearance</li>
                <li>Open Semi-open terrace with pergolas on the ground</li>
                <li>Hydrophore system</li>
                <li>Electric water heater</li>
              </ul> */}
            </div>

            <div className="">
              <p className="text-primaryShade text-base capitalize font-semibold">
                {t("OPTIONAL")}
              </p>
              <div
                className="pl-2 text-white text-[13px] capitalize flex flex-col gap-2"
                dangerouslySetInnerHTML={{
                  __html: projectHouse?.optionalFeatures[locale],
                }}
              />
              {/* <ul className="list-disc list-inside pl-2 text-white text-[13px] capitalize leading-5">
                <li>
                  Many options for choice in WC and bathroom tiles and sanitary
                  ware
                </li>
                <li>
                  Ceramic and parquet flooring options throughout the house
                </li>
                <li>Choice of the kitchen cabinets and countertops</li>
              </ul> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
