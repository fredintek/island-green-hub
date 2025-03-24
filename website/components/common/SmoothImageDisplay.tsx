"use client";
import { baseUrl } from "@/constants";
import Link from "next/link";
import React from "react";

type Props = {
  image: string[];
  isImageLink?: boolean;
};

const SmoothImageDisplay = ({ image, isImageLink = false }: Props) => {
  return (
    <div className="w-full aspect-[16/13] md:aspect-[16/11] relative">
      <div className="hidden md:block md:w-[90%] lg:w-[65%] h-3/5 absolute top-0 right-0 rounded-2xl overflow-hidden hover:z-20 hover:scale-110 transition-all duration-700 cursor-pointer">
        {isImageLink ? (
          <Link
            href={`/images${image && image[0]?.split("/images").pop()}`}
            target={isImageLink ? "_blank" : undefined}
          >
            <img
              src={image && image[0]}
              alt="service-card-image"
              className="w-full h-full object-cover"
            />
          </Link>
        ) : (
          <div className="w-full h-full overflow-hidden">
            <img
              src={`${baseUrl}${image && image[0]}`}
              alt="service-card-image"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
      <div className="w-full h-full md:w-[90%] lg:w-[65%] md:h-3/5 absolute md:bottom-0 left-0 rounded-2xl overflow-hidden md:hover:z-10 md:hover:scale-110 transition-all duration-700 cursor-pointer">
        {isImageLink ? (
          <Link
            href={`/images${image && image[1]?.split("/images").pop()}`}
            target={isImageLink ? "_blank" : undefined}
          >
            <img
              src={image && image[1]}
              alt="service-card-image"
              className="w-full h-full object-cover"
            />
          </Link>
        ) : (
          <div className="w-full h-full overflow-hidden">
            <img
              src={`${baseUrl}${image && image[1]}`}
              alt="service-card-image"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SmoothImageDisplay;
