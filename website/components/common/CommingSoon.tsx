import { useTranslations } from "next-intl";
import React from "react";

type Props = {};

const CommingSoon = (props: Props) => {
  const t = useTranslations();
  return (
    <div className="flex items-center flex-1 justify-center bg-gradient-to-br from-gray-500 to-white text-secondaryShadeDark py-10">
      <div className="container text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 md:mb-4">
          {t("COMING_SOON")}
        </h1>
        <p className="text-base md:text-lg mb-3 md:mb-6">
          {t("COMING_SOON_DESCRIPTION_1")}
        </p>
        <p className="text-sm md:text-base">{t("COMING_SOON_DESCRIPTION_2")}</p>
      </div>
    </div>
  );
};

export default CommingSoon;
