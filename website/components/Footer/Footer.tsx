"use client";
import React from "react";
import DashedText from "../common/DashedText";
import { footerBlog, footerProjects } from "./FooterData";
import { Link } from "@/i18n/routing";
import {
  FacebookFilled,
  ForwardFilled,
  InstagramFilled,
  LinkedinFilled,
  PhoneFilled,
} from "@ant-design/icons";
import { prepareTranslationText } from "@/utilities/prepareTranslationText";
import { useTranslations } from "next-intl";
import { useGetPageBySlugQuery } from "@/redux/api/pageApiSlice";
import { usePathname } from "next/navigation";

type Props = {};

const Footer = (props: Props) => {
  const t = useTranslations();
  const nextPath = usePathname();
  const locale = nextPath?.split("/")[1] as "en" | "tr" | "ru";
  const { data: blogData } = useGetPageBySlugQuery("blog", {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });
  const { data: projectData } = useGetPageBySlugQuery("projects", {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });
  return (
    <footer className="mt-auto py-4">
      <div className="container flex flex-col md:flex-row justify-between gap-6">
        {/* LOGO */}
        <div className="w-[220px] h-[110px] self-center">
          <Link href={"/"} className="">
            <img
              alt="logo"
              src={"/images/island-green-logo.png"}
              className="w-full h-full object-contain"
            />
          </Link>
        </div>

        {/* MIDDLE */}
        <div className="flex flex-col md:flex-row flex-1 items-center md:items-start justify-center gap-10 md:border-2 md:border-primaryShade md:border-t-0 md:border-b-0 px-1">
          {/* projects */}
          <div className="">
            <div className="flex justify-center">
              <DashedText
                text={projectData?.title[locale]}
                stylesClassName="capitalize text-secondaryShade text-lg font-semibold"
              />
            </div>

            <div className="flex mt-1 w-fit flex-col gap-6 items-center">
              {projectData?.subPages?.length > 0 &&
                projectData?.subPages?.slice(0, 3)?.map((subPage: any) => {
                  return (
                    <div
                      key={`${subPage.id}`}
                      className="text-base text-secondaryShade"
                    >
                      <Link href={subPage.slug}>{subPage?.title[locale]}</Link>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* blog */}
          <div className="">
            <div className="flex justify-center">
              <DashedText
                text={blogData?.title[locale]}
                stylesClassName="capitalize text-secondaryShade text-lg font-semibold"
              />
            </div>
            <div className="flex mt-1 w-fit flex-col gap-6 items-center">
              {blogData?.subPages?.length > 0 &&
                blogData?.subPages?.slice(0, 3)?.map((subPage: any) => {
                  return (
                    <div
                      key={`${subPage.id}`}
                      className="text-base text-secondaryShade"
                    >
                      <Link href={subPage.slug}>{subPage?.title[locale]}</Link>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* END */}
        <div className="px-1">
          {/* help */}
          <div className="">
            <div className="flex justify-center">
              <DashedText
                text={t(`FOOTER.${prepareTranslationText("Help")}`)}
                stylesClassName="capitalize text-secondaryShade text-lg font-semibold"
              />
            </div>
            <div className="flex mt-1 w-fit mx-auto flex-col gap-6 items-center">
              <p className="text-base text-center text-secondaryShade font-light">
                {t(
                  `FOOTER.${prepareTranslationText(
                    "Have questions or want more information? Call now"
                  )}`
                )}
              </p>

              {/* numbers */}
              <div className="text-sm text-secondaryShade font-light">
                <div className="flex gap-1 items-center">
                  <PhoneFilled className="rotate-90 text-primaryShade text-sm" />
                  <a
                    target="_blank"
                    href="tel://+905391068484"
                    className="cursor-pointer"
                  >
                    +90 539 106 84 84
                  </a>
                  <div className="flex gap-1">
                    <img
                      className="inline-block w-7 h-7 object-cover cursor-pointer"
                      src="/images/tr-flag.png"
                      alt=""
                    />
                    <img
                      className="inline-block w-7 h-7 object-cover cursor-pointer"
                      src="/images/gb-flag.png"
                      alt=""
                    />
                  </div>
                </div>
                <div className="flex gap-1 items-center">
                  <PhoneFilled className="rotate-90 text-primaryShade text-sm" />
                  <a
                    target="_blank"
                    href="tel://+905391158484"
                    className="cursor-pointer"
                  >
                    +90 539 115 84 84
                  </a>
                  <div className="flex gap-1">
                    <img
                      className="inline-block w-7 h-7 object-cover cursor-pointer"
                      src="/images/gb-flag.png"
                      alt=""
                    />
                    <img
                      className="inline-block w-7 h-7 object-cover cursor-pointer"
                      src="/images/ru-flag.png"
                      alt=""
                    />
                  </div>
                </div>
                <div className="flex gap-1 items-center">
                  <PhoneFilled className="rotate-90 text-primaryShade text-sm" />
                  <a
                    target="_blank"
                    href="tel://+903924448484"
                    className="cursor-pointer"
                  >
                    +90 392 444 84 84
                  </a>
                </div>
              </div>

              {/* socials */}
              <div className="flex gap-2">
                <a
                  target="_blank"
                  href="https://www.facebook.com/islandgreencons"
                  className="w-8 h-8 cursor-pointer rounded-full bg-primaryShade grid place-items-center"
                >
                  <FacebookFilled className="text-white text-base" />
                </a>
                <a
                  href="https://www.instagram.com/islandgreencons"
                  target="_blank"
                  className="w-8 h-8 cursor-pointer rounded-full bg-primaryShade grid place-items-center"
                >
                  <InstagramFilled className="text-white text-base" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 cursor-pointer rounded-full bg-primaryShade grid place-items-center"
                >
                  <LinkedinFilled className="text-white text-base" />
                </a>
                <Link
                  href="/communication"
                  className="py-1 px-2 cursor-pointer rounded-md bg-primaryShade flex justify-center items-center gap-2"
                >
                  <p className="text-base text-white">
                    {t(`FOOTER.${prepareTranslationText("Contact Us")}`)}
                  </p>
                  <ForwardFilled className="text-white text-base" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
