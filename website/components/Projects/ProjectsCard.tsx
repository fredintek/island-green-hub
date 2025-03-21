import { Link } from "@/i18n/routing";
import { MultiLanguage } from "@/utilities/interfaces";
import { LinkOutlined } from "@ant-design/icons";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  data: {
    title: MultiLanguage;
    projectHouseId: number;
    displayImg: string;
    parentPage: string;
  };
};

const ProjectsCard = ({ data }: Props) => {
  const nextPath = usePathname();
  const locale = nextPath?.split("/")[1] as "en" | "tr" | "ru";
  return (
    <div className="group relative overflow-hidden project-box w-full aspect-video rounded-md cursor-pointer">
      <img
        src={data?.displayImg}
        className="w-full h-full rounded-md object-cover group-hover:scale-105 transition-transform duration-1000 ease"
      />

      <div className="project-card-container">
        <div className="project-card">
          {/* CARD FRONT */}
          <div className="relative group project-card-front bg-primaryShadeLight text-white flex items-center justify-center rounded-md">
            {/* link */}
            <Link
              href={`/projects/${data?.parentPage}/project-house/${data?.projectHouseId}`}
              className="absolute top-4 right-4 bg-black grid place-items-center p-3 cursor-pointer rounded-full scale-0 group-hover:scale-100 transition-transform duration-1000 delay-300"
            >
              <LinkOutlined className="text-white text-2xl" />
            </Link>

            {/* title */}
            <p className="font-bold uppercase text-white text-2xl leading-7 max-w-40 absolute left-10 bottom-10 opacity-0 transform translate-y-[-30px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-1000 delay-300">
              {data?.title[locale]}
            </p>

            {/* vertical line */}
            <div className="absolute bottom-0 left-5 w-1 bg-gradient-to-t from-white to-transparent h-0 group-hover:h-full transition-all duration-1000 delay-300" />

            {/* horizontal line */}
            <div className="absolute left-0 bottom-5 h-1 bg-gradient-to-r from-white to-transparent w-0 group-hover:w-full transition-all duration-1000 delay-300" />
          </div>

          {/* CARD BACK */}
          <div className="project-card-back flex items-center justify-center rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsCard;
