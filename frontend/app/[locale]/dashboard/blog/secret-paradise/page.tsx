import BlogContent from "@/components/blog/BlogContent";
import BlogImages from "@/components/blog/BlogImages";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <section className="flex flex-col gap-10">
      <BlogContent />
      <BlogImages />
    </section>
  );
};

export default page;
