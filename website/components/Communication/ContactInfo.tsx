import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type Props = {
  icon: IconProp;
  items: {
    label: string;
    href?: string;
  }[];
  isSideBorder?: boolean;
};

const ContactInfo = ({ icon, items, isSideBorder = false }: Props) => {
  return (
    <div
      className={`flex flex-col gap-3 items-center flex-1 min-h-[256px] px-1 ${
        isSideBorder ? "md:border-r-2 md:border-l-2" : ""
      }`}
    >
      <div className="w-28 h-28 rounded-full border-[10px] border-secondaryShade grid place-items-center hover:bg-secondaryShade group transition-colors duration-300">
        <FontAwesomeIcon
          icon={icon}
          className="text-black text-2xl group-hover:text-white"
        />
      </div>
      <div
        className="text-grayShade font-medium [&>*]:cursor-pointer flex flex-col gap-3 text-center"
        dangerouslySetInnerHTML={{ __html: items }}
      />
      {/* {items?.map((item, idx) => {
          return item.href ? (
            <p className="text-center hover:text-primaryShade ">
              <Link
                key={`${item.label}-${idx}`}
                href={item.href}
                className="max-w-[250px]"
              >
                {item.label}
              </Link>
            </p>
          ) : (
            <p
              key={`${item.label}-${idx}`}
              className="text-center max-w-[250px]"
            >
              {item.label}
            </p>
          );
        })} */}
    </div>
  );
};

export default ContactInfo;
