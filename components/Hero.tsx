import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="bg-gradient-to-b from-fix-sky to-fix-white">
      <div className="container grid gap-12 py-16 md:grid-cols-[minmax(0,1fr)_minmax(0,520px)] md:items-center md:py-24">
        <div className="space-y-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wide text-fix-blue shadow-soft">
            Device emergencies solved daily
          </span>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Fast, Expert Phone & Device Repair
          </h1>
          <p className="text-lg text-fix-slate md:text-xl">
            Cracked screen? Battery dying? Get same-day repairs backed by warranty{"\u2014"}done by certified technicians.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/support">Book a Repair</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/support#estimate">Get an Instant Estimate</Link>
            </Button>
          </div>
          <ul className="grid gap-3 text-sm text-fix-slate md:grid-cols-2">
            {[
              "Same-day turnarounds on the repairs you need most",
              "Certified techs using premium, device-safe tools",
              "Backed by parts and labor warranty",
              "Walk in anytime or schedule online in under a minute",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-fix-pink" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-fix-blue/10 bg-white shadow-soft">
          <Image
            src="/promos/iphone17-case.jpg"
            alt="Certified technician installing a new iPhone display"
            fill
            sizes="(max-width: 768px) 100vw, 520px"
            className="object-cover"
            priority
          />
          <div className="pointer-events-none absolute inset-x-6 bottom-6 rounded-2xl bg-white/90 p-4 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-wide text-fix-blue">
              Most repairs in under an hour
            </p>
            <p className="text-sm text-fix-slate">
              Book online and we'll have parts ready before you arrive.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

