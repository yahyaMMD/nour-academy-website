import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `سياسة الكوكيز | ${brand.nameAr}`,
  description: `معلومات حول استخدام ملفات الكوكيز داخل منصة ${brand.nameAr}.`,
};

export default function CookiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
