import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      {/* BODY */}
      <main className="mt-[102px] pb-4 flex-1 flex flex-col">{children}</main>
      {/* FOOTER */}
      <Footer />
    </>
  );
}
