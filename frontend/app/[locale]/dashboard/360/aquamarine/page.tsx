import ProductLink from "@/components/projects/ProductLink";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <section className="flex flex-col gap-10">
      {/* product link section */}
      <ProductLink />
    </section>
  );
};

export default page;
