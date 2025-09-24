"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/locations", label: "Locations" },
  { href: "/about", label: "About" },
  { href: "/support", label: "Support" },
] as const;

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-fix-blue/10 bg-fix-white/90 backdrop-blur supports-[backdrop-filter]:bg-fix-white/75">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6">
        <Link href="/" className="inline-flex items-center" aria-label="The Fix home">
          <Image
            src="/logo-thefix.png"
            alt="The Fix"
            width={160}
            height={40}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "rounded-full px-4 py-2 transition-all",
                pathname === href
                  ? "bg-fix-blue/10 text-fix-blue shadow-soft"
                  : "text-fix-slate hover:bg-fix-blue/5 hover:text-fix-blue",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href="tel:15551234567"
            className="inline-flex items-center gap-2 text-sm font-medium text-fix-slate transition-colors hover:text-fix-blue"
          >
            <Phone className="h-4 w-4" aria-hidden />
            (555) 123-4567
          </a>
          <Button asChild size="sm">
            <Link href="/support">Book a Repair</Link>
          </Button>
        </div>

        <div className="flex md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" aria-hidden />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader className="items-start">
                <Link href="/" aria-label="The Fix home" className="inline-flex items-center">
                  <Image src="/logo-thefix.png" alt="The Fix" width={140} height={36} className="h-8 w-auto" />
                </Link>
              </SheetHeader>
              <nav className="mt-6 grid gap-2">
                {links.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "rounded-lg px-3 py-2 text-base font-medium",
                      pathname === href
                        ? "bg-fix-blue/10 text-fix-blue"
                        : "text-fix-slate hover:bg-fix-blue/5 hover:text-fix-blue",
                    )}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
              <div className="mt-6 flex flex-col gap-3">
                <Button asChild>
                  <Link href="/support">Book a Repair</Link>
                </Button>
                <a
                  href="tel:15551234567"
                  className="flex items-center gap-2 text-sm font-medium text-fix-slate hover:text-fix-blue"
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  (555) 123-4567
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
