"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Facebook, Instagram, Mail, Phone, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    const form = event.currentTarget;
    form.reset();
  }

  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="container grid gap-10 py-12 md:grid-cols-3 md:gap-16">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">The Fix</h3>
          <p className="max-w-md text-sm text-muted-foreground">
            Your neighborhood tech repair crew since 2011. Certified technicians, premium parts,
            and same-day turnarounds for phones, tablets, laptops, and more.
          </p>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4" aria-hidden="true" />
              <a href="tel:15551234567" className="hover:text-fix-blue">
                (555) 123-4567
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4" aria-hidden="true" />
              <a href="mailto:hello@thefix.com" className="hover:text-fix-blue">
                hello@thefix.com
              </a>
            </p>
            <p>Hours: Mon-Sat 10-7, Sun 11-5</p>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Link href="#" aria-label="Follow The Fix on Instagram" className="hover:text-fix-blue">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href="#" aria-label="Follow The Fix on Facebook" className="hover:text-fix-blue">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="#" aria-label="Subscribe to The Fix on YouTube" className="hover:text-fix-blue">
              <Youtube className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Navigate</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-fix-blue">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-fix-blue">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/locations" className="hover:text-fix-blue">
                  Locations
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-fix-blue">
                  About
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-fix-blue">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Services</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>Screen repair</li>
              <li>Battery replacement</li>
              <li>Water damage</li>
              <li>Accessory upgrades</li>
              <li>Device protection</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-semibold text-foreground">Stay in the loop</p>
          <p className="text-sm text-muted-foreground">
            Get promos, new accessories, and repair tips monthly. We never spam.
          </p>
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
            <Input
              type="email"
              name="email"
              placeholder="Email address"
              aria-label="Email address"
              required
              className="w-full"
            />
            <Button type="submit" className="rounded-xl">
              Subscribe
            </Button>
          </form>
          {submitted ? (
            <p className="text-sm font-medium text-fix-blue">Thanks! We'll keep you posted.</p>
          ) : (
            <p className="text-xs text-muted-foreground">Mocked opt-in. No emails sent.</p>
          )}
        </div>
      </div>
      <div className="border-t border-border/40 bg-background/40 py-6 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} The Fix. All rights reserved.
      </div>
    </footer>
  );
}


