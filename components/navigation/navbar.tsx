"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { FaArrowLeft, FaCalendarAlt } from "react-icons/fa";
import { buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn, NAV_LINKS } from "@/utils";
import MobileNavbar from "./mobile-navbar";
import BrandLogo from "@/components/BrandLogo";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 inset-x-0 z-[99999] h-18 w-full border-b transition-all duration-300",
        scrolled
          ? "border-[rgba(45,131,173,0.12)] bg-[rgba(255,255,255,0.88)] shadow-sm backdrop-blur-xl"
          : "border-transparent bg-[rgba(255,255,255,0.74)]"
      )}
    >
      <div className="container mx-auto flex h-full items-center justify-between px-4 py-3 lg:px-8">
        <div className="flex flex-1 items-center gap-6">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className={`transition-opacity duration-200 ${mobileMenuOpen ? "opacity-0 lg:opacity-100" : "opacity-100"}`}
          >
            <BrandLogo />
          </motion.div>

          <nav className="hidden flex-1 justify-center lg:flex">
            <NavigationMenu>
              <NavigationMenuList className="gap-1 rounded-full bg-white/75 px-2 py-1 shadow-sm ring-1 ring-[rgba(45,131,173,0.08)]">
                {NAV_LINKS.map((link) => (
                  <NavigationMenuItem key={link.title}>
                    <Link href={link.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "rounded-full bg-transparent text-[var(--brand-ink)] hover:bg-[var(--brand-primary-soft)] hover:text-[var(--brand-primary)]"
                        )}
                      >
                        {link.title}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          <Link
            href="/#courses"
            className={cn(
              buttonVariants({ size: "sm" }),
              "hidden rounded-full border-0 bg-[var(--brand-accent)] px-5 text-white shadow-lg shadow-[rgba(255,67,67,0.22)] hover:bg-[var(--brand-accent)]/90 lg:inline-flex"
            )}
          >
            <FaCalendarAlt className="mr-2 text-sm" />
            ابدأ التعلم
          </Link>

          {status === "authenticated" ? (
            <>
              {session.user?.role === "Admin" && (
                <Link
                  href="/admin/courses"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "hidden rounded-full border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary-soft)] md:inline-flex"
                  )}
                >
                  لوحة التحكم
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "hidden rounded-full text-[var(--brand-ink)] hover:bg-[var(--brand-primary-soft)] md:inline-flex"
                )}
              >
                تسجيل الخروج
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "hidden rounded-full text-[var(--brand-ink)] hover:bg-[var(--brand-primary-soft)] md:inline-flex"
                )}
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/auth/register"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "hidden rounded-full border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary-soft)] md:inline-flex"
                )}
              >
                إنشاء حساب
                <FaArrowLeft className="ml-2 text-xs" />
              </Link>
            </>
          )}

          <div className="lg:hidden">
            <MobileNavbar onMenuStateChange={setMobileMenuOpen} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
