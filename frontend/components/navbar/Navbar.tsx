"use client";
import { Link, useRouter } from "@/i18n/routing";
import { toggleNavbar, toggleTheme } from "@/redux/slices/navbar";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  GlobalOutlined,
  UserOutlined,
  VerticalRightOutlined,
} from "@ant-design/icons";
import { faLightbulb, faMoon } from "@fortawesome/free-regular-svg-icons";
import {
  faBars,
  faMagnifyingGlass,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, ConfigProvider, Dropdown, Input, MenuProps } from "antd";
import { useSearchParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {};

const Navbar = (props: Props) => {
  const dispatch = useAppDispatch();
  const currentReduxUser = useAppSelector((state) => state.auth.user);
  const [isNavbarOpen, setIsNavbarOpen] = useState<boolean>(false);
  const { isNavCollapsed, isDark } = useAppSelector((state) => state.sidebar);
  const [searchValue, setSearchValue] = useState("");
  const nextPath = usePathname();
  const searchParams = useSearchParams();
  const locale = nextPath.split("/")[1] as "en" | "tr" | "ru";
  const router = useRouter();

  const queryParams = searchParams
    ? Object.fromEntries(searchParams.entries())
    : {};

  const changeLocale = (newLocale: "en" | "tr" | "ru") => {
    const targetPathname = nextPath.replace(/^\/(en|tr|ru)/, "");
    router.replace(
      { pathname: targetPathname, query: queryParams },
      { locale: newLocale }
    );
  };

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
          <span>tr</span>
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
          <span>en</span>
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
          <span>ru</span>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width:768px)");

    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsNavbarOpen(false);
      }
    };

    // Add listener for media query changes

    mediaQuery.addEventListener("change", handleMediaChange);

    // Set initial state based on the current screen size
    if (mediaQuery.matches) {
      setIsNavbarOpen(false);
    }

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <nav className="fixed left-0 top-0 h-[80px] w-dvw bg-white dark:bg-[#1e293b] shadow-nav-shadow z-30">
      <div className="mx-auto w-full px-8 h-full flex items-center justify-between">
        {/* left */}
        <div className="flex items-center gap-6">
          {/* logo */}
          <div className="w-[130px] h-[65px] shrink-0">
            <Link href="/" className="">
              <img
                alt="logo"
                src={"/images/island-green-logo.png"}
                className="w-full h-full object-fill"
              />
            </Link>
          </div>

          {/* toggle */}
          <div>
            <VerticalRightOutlined
              onClick={() => dispatch(toggleNavbar(undefined))}
              className={`text-[#828282] cursor-pointer ${
                isNavCollapsed ? "rotate-0" : "rotate-180"
              } transition-transform duration-300 ease-in-out`}
            />
          </div>
          {/* search */}
          <div className="hidden md:block relative w-full rounded-md bg-[#F8F8F8] mb-4 my-auto">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="h-5 absolute top-1/2 -translate-y-1/2 left-2 z-10 text-[#828282] rotate-90"
            />
            <div
              onClick={() => {
                setSearchValue("");
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer z-10 w-5 h-5 shrink-0 flex justify-center items-center rounded-full bg-white dark:bg-[#1e293b]"
            >
              <FontAwesomeIcon
                icon={faX}
                className="text-[#909090] text-[7px]"
              />
            </div>
            <ConfigProvider
              theme={{
                components: {
                  Input: {
                    colorBorder: "transparent",
                    hoverBorderColor: "transparent",
                    activeBorderColor: "black",
                    activeShadow: "none",
                    // colorBgContainer: "#F8F8F8",
                  },
                },
              }}
            >
              <Input
                placeholder="Search..."
                className="nav-search-input text-[#464646] !bg-[#F8F8F8] dark:!bg-gray-200 text-sm leading-5 w-full h-[40px]"
                size="large"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </ConfigProvider>
          </div>
        </div>
        {/* right */}
        <div className="flex gap-3 items-center">
          {/* language switcher */}
          <Dropdown
            // overlayClassName="custom-dropdown"
            menu={{ items: languageItems }}
            trigger={["hover"]}
            autoAdjustOverflow={true}
          >
            <div className="cursor-pointer flex items-center gap-1 text-black dark:text-gray-400">
              <p className="uppercase text-[10px] font-medium">{locale}</p>
              <GlobalOutlined className="text-xl" />
            </div>
          </Dropdown>

          {/* light and dark theme */}
          <div
            onClick={() => dispatch(toggleTheme(undefined))}
            className="hidden md:flex bg-[#9c9c9c] rounded-md cursor-pointer"
          >
            <div
              className={`${
                isDark ? "bg-[#9c9c9c]" : "bg-red-500"
              }  py-1 px-3 rounded-md transition-colors duration-300 ease-in-out`}
            >
              <FontAwesomeIcon icon={faLightbulb} className="text-white" />
            </div>
            <div
              className={`${
                isDark ? "bg-red-500" : "bg-[#9c9c9c]"
              }  py-1 px-3 rounded-md transition-colors duration-300 ease-in-out`}
            >
              <FontAwesomeIcon icon={faMoon} className="text-white" />
            </div>
          </div>

          {/* profile picture */}
          <div className="flex flex-col gap-1 items-center">
            <Avatar
              icon={<UserOutlined className="text-black h-4" />}
              className="hidden md:flex cursor-pointer group w-[40px] h-[40px] bg-[#F8F8F8] border border-red-500"
            />
            <p className="hidden md:block text-sm italic text-gray-400">
              {currentReduxUser?.email}
            </p>
          </div>

          {/* hamburger icon */}
          <div
            onClick={() => setIsNavbarOpen(!isNavbarOpen)}
            className="block md:hidden"
          >
            <FontAwesomeIcon icon={faBars} className="cursor-pointer" />
          </div>
        </div>
      </div>

      {/* hamburger menu */}
      <div
        className={`absolute top-full w-full min-h-[250px] bg-white dark:bg-[#1e293b] shadow-nav-shadow ${
          isNavbarOpen ? "translate-x-0" : "translate-x-full"
        } transition-all duration-300 ease-in-out flex flex-col gap-6 items-center justify-center border-t py-4`}
      >
        <p>Profile</p>
      </div>
    </nav>
  );
};

export default Navbar;
