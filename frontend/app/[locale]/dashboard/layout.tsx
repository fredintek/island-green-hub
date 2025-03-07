import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="flex-1 flex h-[calc(100dvh-80px)] mt-[80px]">
        {/* sidebar */}
        <Sidebar />
        {/* content */}
        <main className="flex-1 m-4 h-[calc(100dvh-80px-32px)] bg-gray-200 dark:bg-[#475569] p-4 overflow-y-auto">
          {children}
        </main>
      </div>
    </>
  );
}
