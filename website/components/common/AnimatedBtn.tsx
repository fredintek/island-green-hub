import { Link } from "@/i18n/routing";
import React from "react";

type Props = {
  children: React.ReactNode;
  link?: string;
  target?: string;
  staticLink?: boolean;
};

const AnimatedBtn = ({
  children,
  link,
  target = undefined,
  staticLink = false,
}: Props) => {
  return (
    <>
      {link && staticLink ? (
        <a
          href={link}
          target={target}
          className="w-fit relative group flex items-center justify-center gap-1 py-2 px-8 rounded-md bg-primaryShade text-white overflow-hidden"
        >
          {children}

          {/* Hover effect */}
          <div className="z-0 md:animate-shrinkFill md:group-hover:animate-growFill absolute bg-black left-0 top-[100%] w-full h-full"></div>
        </a>
      ) : link && !staticLink ? (
        <Link
          href={link}
          target={target}
          className="w-fit relative group flex items-center justify-center gap-1 py-2 px-8 rounded-md bg-primaryShade text-white overflow-hidden"
        >
          {children}

          {/* Hover effect */}
          <div className="z-0 md:animate-shrinkFill md:group-hover:animate-growFill absolute bg-black left-0 top-[100%] w-full h-full"></div>
        </Link>
      ) : (
        <button
          type="button"
          className="relative group py-2 px-8 rounded-md bg-primaryShade text-white overflow-hidden"
        >
          {children}

          {/* Hover effect */}
          <div className="z-0 md:animate-shrinkFill md:group-hover:animate-growFill absolute bg-black left-0 top-[100%] w-full h-full"></div>
        </button>
      )}
    </>
  );
};

export default AnimatedBtn;
