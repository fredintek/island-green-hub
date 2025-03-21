"use client";
import { useRouter } from "@/i18n/routing";
import { useGetPageBySlugQuery } from "@/redux/api/pageApiSlice";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

type Props = {};

const page = (props: Props) => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = usePathname();
  const locale = nextPath?.split("/")[1] as "en" | "tr" | "ru";
  const queryParams = searchParams
    ? Object.fromEntries(searchParams.entries())
    : {};

  const { data: getPageBySlug, isLoading: getPageBySlugLoading } =
    useGetPageBySlugQuery(params?.slug as string, {
      refetchOnFocus: true,
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
    });

  useEffect(() => {
    if (getPageBySlug?.parentPage) {
      router.replace(
        {
          pathname: `/${getPageBySlug?.parentPage?.slug}/${getPageBySlug?.slug}`,
          query: queryParams,
        },
        { locale }
      );
    } else {
      router.replace(
        {
          pathname: `/${getPageBySlug?.slug}`,
          query: queryParams,
        },
        { locale }
      );
    }
  }, [getPageBySlug]);

  if (getPageBySlugLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin border-t-2 border-white border-solid rounded-full w-5 h-5"></div>
      </div>
    );
  } else {
    return null;
  }
};

export default page;
