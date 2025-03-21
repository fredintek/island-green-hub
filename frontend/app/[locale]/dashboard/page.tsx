import { redirect } from "next/navigation";

type Params = Promise<{ locale: string }>;

export default async function LocaleRedirect(props: { params: Params }) {
  const locale = (await props.params).locale; // If params is a promise, it will be resolved here
  redirect(`/${locale}/dashboard/users`);
}
