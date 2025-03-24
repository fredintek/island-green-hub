"use client";
import React, { useEffect, useRef, useState, useTransition } from "react";
import { Collapse, Dropdown } from "antd";
import type { MenuProps } from "antd";
import {
  CaretDownOutlined,
  GlobalOutlined,
  LinkOutlined,
  LoginOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { useLocale, useTranslations } from "next-intl";
import { prepareTranslationText } from "@/utilities/prepareTranslationText";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useGetAllPagesQuery } from "@/redux/api/navbarApiSlice";
import { getExtraPages } from "@/utilities/extraPages";

type Props = {};

const Navbar = (props: Props) => {
  const t = useTranslations();
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const queryParams = searchParams
    ? Object.fromEntries(searchParams.entries())
    : {};

  const changeLocale = (newLocale: string) => {
    startTransition(() => {
      router.replace(
        {
          pathname,
          query: queryParams,
        },
        {
          locale: newLocale,
        }
      );
    });
  };

  const whatsappItems: MenuProps["items"] = [
    {
      key: "078653",
      label: (
        <div className="flex items-center gap-1">
          <img
            className="inline-block w-7 h-7 object-cover"
            src="/images/tr-flag.png"
            alt=""
          />
          <span>{t(prepareTranslationText("NAVBAR.Turkish"))}</span>
        </div>
      ),
    },
    {
      key: "178654",
      label: (
        <div className="flex items-center gap-1">
          <img
            className="inline-block w-7 h-7 object-cover"
            src="/images/gb-flag.png"
            alt=""
          />
          <span>{t(prepareTranslationText("NAVBAR.English"))}</span>
        </div>
      ),
    },
    {
      key: "36571",
      label: (
        <div className="flex items-center gap-1">
          <img
            className="inline-block w-7 h-7 object-cover"
            src="/images/ru-flag.png"
            alt=""
          />
          <span>{t(prepareTranslationText("NAVBAR.Russian"))}</span>
        </div>
      ),
    },
  ];

  const languageItems: MenuProps["items"] = [
    {
      key: "278362",
      label: (
        <div
          onClick={() => changeLocale("tr")}
          className="flex items-center gap-1"
        >
          <img
            className="inline-block w-7 h-7 object-cover"
            src="/images/tr-flag.png"
            alt=""
          />
          <span>{t(prepareTranslationText("NAVBAR.Turkish"))}</span>
        </div>
      ),
    },
    {
      key: "232348",
      label: (
        <div
          onClick={() => changeLocale("en")}
          className="flex items-center gap-1"
        >
          <img
            className="inline-block w-7 h-7 object-cover"
            src="/images/gb-flag.png"
            alt=""
          />
          <span>{t(prepareTranslationText("NAVBAR.English"))}</span>
        </div>
      ),
    },
    {
      key: "22435",
      label: (
        <div
          onClick={() => changeLocale("ru")}
          className="flex items-center gap-1"
        >
          <img
            className="inline-block w-7 h-7 object-cover"
            src="/images/ru-flag.png"
            alt=""
          />
          <span>{t(prepareTranslationText("NAVBAR.Russian"))}</span>
        </div>
      ),
    },
  ];

  const transactionItems = [
    {
      key: "963771",
      label: (
        <div className="flex items-center gap-1">
          <LinkOutlined />
          <span>
            {t(prepareTranslationText("NAVBAR.Employee/Customer Panel"))}
          </span>
        </div>
      ),
    },
    {
      key: "86352",
      label: (
        <div className="flex items-center gap-1">
          <LinkOutlined />
          <span>{t(prepareTranslationText("NAVBAR.Buy Now"))}</span>
        </div>
      ),
    },
  ];

  const extraItems: MenuProps["items"] = [
    {
      key: "867421",
      label: (
        <div className="flex text-white items-center justify-center bg-secondaryShade p-2 rounded-md text-[14px]">
          <WhatsAppOutlined className="" />
        </div>
      ),
      children: whatsappItems,
    },
    {
      key: "874622",
      label: (
        <div className="flex text-white items-center justify-center bg-blackShade p-2 rounded-md">
          <GlobalOutlined className="" />
        </div>
      ),
      children: languageItems,
    },
    {
      key: "393659",
      label: (
        <div className="flex gap-1 text-white items-center justify-center bg-primaryShade p-2 rounded-md text-[12px]">
          <LoginOutlined className="" />
          <span className="uppercase">
            {t(prepareTranslationText("NAVBAR.Online Transactions"))}
          </span>
        </div>
      ),
      children: transactionItems,
      popupOffset: [-180, 45],
    },
  ];

  const { data: getAllPagesData } = useGetAllPagesQuery(
    { onlyParent: true },
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
    }
  );

  // Close mobile nav when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsNavOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Close mobile nav when screen width exceeds 768px
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsNavOpen(false);
      }
    };

    // Add listener for media query changes
    mediaQuery.addEventListener("change", handleMediaChange);

    // Set initial state based on the current screen size
    if (mediaQuery.matches) {
      setIsNavOpen(false);
    }

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  // Translation logic
  useEffect(() => {
    const cookieLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("ISLAND_GREEN_LOCALE="))
      ?.split("=")[1];
    if (!cookieLocale) {
      const browserLocale = navigator.language.slice(0, 2);
      document.cookie = `ISLAND_GREEN_LOCALE=${browserLocale}`;
      router.refresh();
    }
  }, [router]);

  return (
    <nav
      ref={navRef}
      className={`z-50 text-[13px] fixed w-screen top-0 left-0 bg-white ${
        isNavOpen ? "" : "shadow-shadow-1"
      }`}
    >
      <div className="container flex items-center justify-between gap-4 py-4">
        {/* LOGO */}
        <div className="w-[140px] h-[70px]">
          <Link href={"/"} className="">
            <img
              alt="logo"
              src={"/images/island-green-logo.png"}
              className="w-full h-full object-fill"
            />
          </Link>
        </div>

        {/* LINKS */}
        <ul className="flex flex-1 justify-center items-end gap-6 max-[769px]:hidden text-primaryShade [&>*]:transition-colors [&>*]:duration-300 font-semibold">
          {getAllPagesData?.map((page: any) => {
            const extraSubPages = getExtraPages(page?.slug);
            const subPages = [...(page?.subPages || []), ...extraSubPages];
            return subPages?.length > 0 ? (
              // Render dropdown for items with children
              <Dropdown
                key={page?.id}
                overlayClassName="custom-dropdown"
                menu={{
                  items: subPages?.map((subPage: any) => {
                    return {
                      key: subPage?.slug,
                      label: (
                        <Link
                          key={subPage?.id}
                          href={
                            subPage?.link
                              ? `/${subPage?.link}`
                              : `/${page?.slug}/${subPage?.slug}` || "#"
                          }
                        >
                          <span className="">{subPage?.title[locale]}</span>
                        </Link>
                      ),
                    };
                  }),
                }}
                trigger={["hover"]}
              >
                <p className="flex items-center gap-[2px] cursor-pointer hover:text-secondaryShade">
                  <span className="uppercase">{page?.title[locale]}</span>
                  <CaretDownOutlined />
                </p>
              </Dropdown>
            ) : (
              // Render simple links
              <li
                key={page?.id}
                className="hover:text-secondaryShade uppercase"
              >
                <Link
                  href={page?.slug === "home" ? "/" : `/${page?.slug}` || "#"}
                >
                  {page?.title[locale]}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* SETTINGS DESKTOP */}
        <div className="flex items-center gap-2 max-[1024px]:hidden">
          {/* LANGUAGES */}
          <Dropdown
            overlayClassName="custom-dropdown"
            menu={{ items: languageItems }}
            trigger={["hover"]}
            autoAdjustOverflow={true}
          >
            <div className="cursor-pointer flex items-center gap-1">
              <p className="uppercase text-[10px] font-medium text-black">
                {locale}
              </p>
              <GlobalOutlined className="text-xl" />
            </div>
          </Dropdown>

          {/* WHATSAPP */}
          <Dropdown
            overlayClassName="custom-dropdown"
            menu={{ items: whatsappItems }}
            trigger={["hover"]}
            autoAdjustOverflow={true}
          >
            <div className="bg-secondaryShade text-white p-2 rounded-full grid place-items-center cursor-pointer">
              <WhatsAppOutlined className="text-base" />
            </div>
          </Dropdown>

          {/* CTA BUTTON */}
          <Dropdown
            overlayClassName="custom-dropdown"
            menu={{ items: transactionItems }}
            trigger={["hover"]}
            autoAdjustOverflow={true}
          >
            <div className="flex gap-1 text-white items-center bg-primaryShade p-2 rounded-md hover:rounded-2xl transition-all duration-300 cursor-pointer">
              <LoginOutlined className="text-base" />
              <span className="">
                {t(prepareTranslationText("NAVBAR.ONLINE TRANSACTIONS"))}
              </span>
            </div>
          </Dropdown>
        </div>

        {/* MOBILE CONTROLS */}
        <div className="flex items-center gap-4">
          {/* HAMBURGER */}
          <div className="text-base min-[769px]:hidden">
            <MenuUnfoldOutlined
              className={`${
                isNavOpen ? "rotate-180" : "rotate-0"
              } transition-all duration-300`}
              onClick={() => setIsNavOpen(!isNavOpen)}
            />
          </div>

          {/* DROPDOWN FOR EXTRA CTA's */}
          {/* <div className="min-[965px]:hidden flex items-center"> */}
          <div className="visible-settings-control items-center">
            <Dropdown
              overlayClassName="custom-dropdown"
              menu={{ items: extraItems }}
              trigger={["click"]}
              autoAdjustOverflow={true}
              placement="bottomCenter"
            >
              <SettingOutlined className="text-base" />
            </Dropdown>
          </div>
        </div>
      </div>

      {/* MOBILE NAV */}
      <div
        className={`z-50 bg-white shadow-nav-shadow min-[769px]:hidden absolute top-full w-full transition duration-300 ${
          isNavOpen ? "translate-x-0" : "translate-x-[100%]"
        }`}
      >
        <ul className="flex flex-col items-center text-primaryShade gap-6 w-full h-full p-4">
          {getAllPagesData?.map((page: any) => {
            const extraSubPages = getExtraPages(page?.slug);
            const subPages = [...(page?.subPages || []), ...extraSubPages];
            return subPages?.length > 0 ? (
              // Render accordion for items with children
              <Collapse
                key={page?.id}
                accordion
                className="mobile-nav-collapse"
                expandIcon={(panelProps) => {
                  return null;
                }}
                ghost
                items={[
                  {
                    key: page?.id,
                    label: (
                      <p className="flex items-center gap-[2px] text-primaryShade cursor-pointer md:hover:text-secondaryShade">
                        <span className="uppercase">{page?.title[locale]}</span>
                        <CaretDownOutlined />
                      </p>
                    ),
                    children: (
                      <div className="flex flex-col gap-3 items-center mt-2">
                        {subPages?.map((subPage: any) => {
                          return (
                            <Link
                              key={subPage?.id}
                              href={
                                subPage?.link
                                  ? `/${subPage?.link}`
                                  : `/${page?.slug}/${subPage?.slug}` || "#"
                              }
                            >
                              <p
                                onClick={() => setIsNavOpen(false)}
                                className="text-center text-secondaryShade"
                              >
                                {subPage?.title[locale]}
                              </p>
                            </Link>
                          );
                        })}
                      </div>
                    ),
                  },
                ]}
              />
            ) : (
              // Render simple links
              <li
                key={page?.id}
                className="hover:text-secondaryShade uppercase"
              >
                <Link
                  href={page?.slug === "home" ? "/" : `/${page?.slug}` || "#"}
                >
                  <p onClick={() => setIsNavOpen(false)}>
                    {page?.title[locale]}
                  </p>
                </Link>
              </li>
            );
          })}

          {/* extra CTA */}

          {/* languages */}
          <div className="w-[270px] mx-auto flex flex-col gap-2">
            <div className="border-b flex gap-1 items-center justify-center">
              <p className="">
                {t(prepareTranslationText("NAVBAR.LANGUAGE"))} -{" "}
                <span className="uppercase text-[10px] font-medium text-primaryShade">
                  ({locale})
                </span>
              </p>
            </div>
            <div className="flex justify-center items-center gap-2">
              <div
                onClick={() => changeLocale("tr")}
                className="flex items-center"
              >
                <img
                  className="inline-block w-7 h-7 object-cover"
                  src="/images/tr-flag.png"
                  alt=""
                />
              </div>
              <div
                onClick={() => changeLocale("en")}
                className="flex items-center"
              >
                <img
                  className="inline-block w-7 h-7 object-cover"
                  src="/images/gb-flag.png"
                  alt=""
                />
              </div>
              <div
                onClick={() => changeLocale("ru")}
                className="flex items-center"
              >
                <img
                  className="inline-block w-7 h-7 object-cover"
                  src="/images/ru-flag.png"
                  alt=""
                />
              </div>
            </div>
          </div>

          {/* whatsapp */}
          <div className="w-[270px] mx-auto flex flex-col gap-2">
            <div className="border-b flex gap-1 items-center justify-center">
              <span className="">
                {t(prepareTranslationText("NAVBAR.WHATSAPP"))}
              </span>
            </div>
            <div className="flex justify-center items-center gap-2">
              <div className="flex items-center gap-1">
                <img
                  className="inline-block w-7 h-7 object-cover"
                  src="/images/tr-flag.png"
                  alt=""
                />
              </div>
              <div className="flex items-center gap-1">
                <img
                  className="inline-block w-7 h-7 object-cover"
                  src="/images/gb-flag.png"
                  alt=""
                />
              </div>
              <div className="flex items-center gap-1">
                <img
                  className="inline-block w-7 h-7 object-cover"
                  src="/images/ru-flag.png"
                  alt=""
                />
              </div>
            </div>
          </div>

          {/* transactions */}
          <div className="w-[270px] mx-auto flex flex-col gap-2">
            <div className="border-b flex gap-1 items-center justify-center">
              <LoginOutlined className="text-base" />
              <span className="">
                {t(prepareTranslationText("NAVBAR.ONLINE TRANSACTIONS"))}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1">
                <LinkOutlined />
                <span>
                  {t(prepareTranslationText("NAVBAR.Employee/Customer Panel"))}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <LinkOutlined />
                <span>{t(prepareTranslationText("NAVBAR.Buy Now"))}</span>
              </div>
            </div>
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
