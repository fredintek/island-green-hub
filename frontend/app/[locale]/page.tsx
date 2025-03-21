import { redirect } from "next/navigation";

type Params = Promise<{ locale: string }>;

export default async function LocaleRedirect(props: { params: Params }) {
  const locale = (await props.params).locale;
  redirect(`/${locale}/dashboard`);
}
