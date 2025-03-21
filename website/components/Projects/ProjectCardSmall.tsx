import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

type Props = {
  image: string;
  href: string;
};

const ProjectCardSmall = ({ image, href }: Props) => {
  return (
    <div
      className={`group w-full aspect-[2/1] sm:aspect-[3/1] min-h-[120px] rounded-md relative overflow-hidden`}
    >
      <img src={image} className="w-full h-full object-cover" alt="" />

      {/* top overlay */}
      <div className="z-10 absolute bg-primaryShadeLight top-0 left-0 w-full h-full -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out rounded-md" />

      {/* cta */}
      <Link
        href={href}
        target="_blank"
        className="z-20 absolute w-[65px] h-[65px] grid place-items-center top-full group-hover:top-1/2 group-hover:-translate-y-1/2 bg-black left-1/2 -translate-x-1/2 hover:bg-white hover:text-primaryShade text-white transition-all duration-500 ease-out rounded-full cursor-pointer"
      >
        <FontAwesomeIcon icon={faPlus} size="2x" />
      </Link>
    </div>
  );
};

export default ProjectCardSmall;
