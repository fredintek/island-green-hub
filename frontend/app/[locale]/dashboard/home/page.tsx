"use client";
import ContactSection from "@/components/home/ContactSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import ReasonSection from "@/components/home/ReasonSection";
import UploadSection from "@/components/home/UploadSection";

export default function Home() {
  return (
    <section className="flex flex-col gap-10">
      {/* hero section */}
      <UploadSection />

      {/* projects section */}
      <ProjectsSection />

      {/* reasons section */}
      <ReasonSection />

      {/* contact section */}
      <ContactSection />
    </section>
  );
}
