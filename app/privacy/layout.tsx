import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `سياسة الخصوصية | ${brand.nameAr}`,
  description: `سياسة الخصوصية الخاصة بمنصة ${brand.nameAr} وكيفية التعامل مع بيانات المستخدمين.`,
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
