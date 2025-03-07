import React from "react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full flex-1 flex flex-col items-center justify-center">
      {children}
    </main>
  );
}
