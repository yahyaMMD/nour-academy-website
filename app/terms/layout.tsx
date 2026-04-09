import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `الشروط والأحكام | ${brand.nameAr}`,
  description: `الشروط والأحكام الخاصة بمنصة ${brand.nameAr} وحسابات المستخدمين والدورات.`,
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
