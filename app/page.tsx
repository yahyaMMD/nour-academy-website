'use client'

import { Hero } from "@/components/Hero";
import { FAQSection } from "@/components/Faqs";
import Contact from "@/components/Contact";
import { CTA } from "@/components/cta";
import Testimonials from "@/components/testimonials";
import About from "@/components/Services";
import CoursesSection from "@/components/projects";
import { SponsorsMarquee } from "@/components/Sponsor";
import FeedbackSection from "@/components/FeedbackSection";
import AppDownloadPromo from "@/components/AppDownloadPromo";

export default function Home() {
  return (
    <>
      <div className="m-2 overflow-x-hidden sm:m-10 lg:m-12">
        <Hero />
        <AppDownloadPromo className="mt-10" />
        <About />
        <CTA />
        <CoursesSection />
        <Testimonials />
        <FAQSection />
        <SponsorsMarquee />
        <FeedbackSection />
        <Contact />
      </div>
    </>
  );
}
