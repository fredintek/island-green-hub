import { redirect } from "next/navigation";

export default async function LocaleRedirect({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  redirect(`/${locale}/dashboard`);
}
