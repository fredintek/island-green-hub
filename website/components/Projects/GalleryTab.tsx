import React from "react";
import ProjectCardSmall from "./ProjectCardSmall";
import { useTranslations } from "next-intl";
import { baseUrl } from "@/constants";

type Props = {
  data: string[];
};

const GalleryTab = ({ data }: Props) => {
  const t = useTranslations();
  return (
    <div className="flex flex-col gap-4">
      {/* tab header */}
      <div className="flex items-center justify-center gap-2">
        <p className="cursor-pointer transition-colors duration-300 bg-secondaryShade hover:bg-secondaryShadeDark text-white capitalize rounded-md py-1 text-center w-[80px] md:w-[110px]">
          {t("ALL")}
        </p>
        {/* <p className="cursor-pointer transition-colors duration-300 bg-secondaryShade hover:bg-secondaryShadeDark text-white capitalize rounded-md py-1 text-center w-[80px] md:w-[110px]">
          {t("DRINK")}
        </p>
        <p className="cursor-pointer transition-colors duration-300 bg-secondaryShade hover:bg-secondaryShadeDark text-white capitalize rounded-md py-1 text-center w-[80px] md:w-[110px]">
          {t("EXTERNAL")}
        </p> */}
      </div>

      {/* tab content */}
      <div className="grid grid-cols-project-grid-mobile gap-6">
        {data?.map((img: string, idx: number) => {
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
  );
};

export default GalleryTab;
