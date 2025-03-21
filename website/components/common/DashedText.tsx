import React from "react";

type Props = {
  text: string;
  stylesClassName?: string;
};

const DashedText = ({ text, stylesClassName }: Props) => {
  return (
    <div className={`${stylesClassName} w-fit flex items-center gap-1`}>
      <hr className="border-2 border-primaryShade w-6" />
      <span>{text}</span>
    </div>
  );
};

export default DashedText;
