import Link from "next/link";
import Image from "next/image";
import { brand } from "@/lib/brand";

type BrandLogoProps = {
  href?: string;
  compact?: boolean;
  showText?: boolean;
  className?: string;
};

export default function BrandLogo({
  href = "/",
  compact = false,
  showText = true,
  className = "",
}: BrandLogoProps) {
  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`relative overflow-hidden rounded-[1.35rem] bg-white/90 ring-1 ring-[rgba(45,131,173,0.15)] ${
          compact ? "h-12 w-12" : "h-16 w-16"
        }`}
      >
        <Image
          src="/images/logo.png"
          alt={brand.nameAr}
          fill
          className="object-contain p-1.5"
          priority
        />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-[var(--font-brand-heading)] text-xl font-extrabold text-[var(--brand-ink)]">
            {brand.nameAr}
          </span>
          <span className="mt-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--brand-primary)]">
            {brand.nameEn}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <Link href={href} className="inline-flex items-center">
      {content}
    </Link>
  );
}
