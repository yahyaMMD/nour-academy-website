"use client";

import Link from "next/link";
import React, { useState } from "react";
import { LayoutDashboard, LogIn, LogOut, Menu, UserPlus } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NAV_LINKS } from "@/utils";
import BrandLogo from "@/components/BrandLogo";

type MobileNavbarProps = {
  onMenuStateChange?: (open: boolean) => void;
};

const MobileNavbar = ({ onMenuStateChange }: MobileNavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onMenuStateChange?.(open);
  };

  return (
    <div className="flex items-center justify-end lg:hidden">
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className={`rounded-full transition-opacity ${isOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}
          >
            <Menu className="h-6 w-6 text-[var(--brand-ink)]" />
          </Button>
        </SheetTrigger>

        <SheetContent className="w-screen border-l-0 bg-[var(--brand-surface)]">
          <div className="my-20">

            <Accordion type="single" collapsible className="w-full">
              {NAV_LINKS.map((link) => (
                <AccordionItem key={link.title} value={link.title} className="border-b border-[rgba(45,131,173,0.1)]">
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center py-4 text-lg font-medium text-[var(--brand-ink)]"
                  >
                    {link.title}
                  </Link>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-8 space-y-2">
              {status === "authenticated" ? (
                <>
                  {session.user?.role === "Admin" && (
                    <Link
                      href="/admin/courses"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center rounded-2xl bg-white px-4 py-4 font-medium text-[var(--brand-primary)] shadow-sm"
                    >
                      <LayoutDashboard className="mr-3 h-5 w-5" />
                      لوحة التحكم
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center rounded-2xl bg-white px-4 py-4 font-medium text-[var(--brand-ink)] shadow-sm"
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center rounded-2xl bg-white px-4 py-4 font-medium text-[var(--brand-ink)] shadow-sm"
                  >
                    <LogIn className="mr-3 h-5 w-5" />
                    تسجيل الدخول
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center rounded-2xl bg-[var(--brand-primary)] px-4 py-4 font-medium text-white shadow-sm"
                  >
                    <UserPlus className="mr-3 h-5 w-5" />
                    إنشاء حساب
                  </Link>
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavbar;
