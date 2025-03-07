"use client";
import { Input } from "antd";
import React from "react";

type Props = {};

const ProductLink = (props: Props) => {
  return (
    <div className="p-6 bg-white dark:bg-[#1e293b] shadow-md rounded-md">
      <p className="text-[22px] text-secondaryShade dark:text-primaryShade font-bold uppercase mb-4">
        Product Link
      </p>

      {/* content */}
      <Input placeholder="Product Link" className="!w-full" size="large" />

      <button
        onClick={() => console.log("Product Link")}
        type="button"
        className="mt-4 ml-auto px-6 py-2 rounded-md text-white cursor-pointer flex items-center justify-center bg-secondaryShade dark:bg-primaryShade border border-secondaryShade dark:border-primaryShade hover:bg-transparent hover:text-secondaryShade dark:hover:bg-transparent dark:hover:text-primaryShade transition-colors duration-300"
      >
        <p className="uppercase font-medium">Submit</p>
      </button>
    </div>
  );
};

export default ProductLink;
