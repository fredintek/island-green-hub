import DisplayContent from "@/components/projects/DisplayContent";
import ProductLink from "@/components/projects/ProductLink";
import ProjectHouses from "@/components/projects/ProjectHouses";
import Stage from "@/components/projects/Stage";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <section className="flex flex-col gap-10">
      {/* product link section */}
      <ProductLink />

      {/* display content */}
      <DisplayContent />

      {/* project houses */}
      <ProjectHouses />

      {/* stage 2 */}
      <Stage />
    </section>
  );
};

export default page;
