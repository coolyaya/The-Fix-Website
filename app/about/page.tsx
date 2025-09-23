import Image from "next/image";
import type { Metadata } from "next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about The Fix: our certified technicians, sustainability commitments, warranties, and the people who keep your devices running.",
};

const highlights = [
  {
    title: "Certified experts",
    description:
      "Every technician completes The Fix Academy plus OEM-certified training across Apple, Samsung, Google, Microsoft, and more.",
  },
  {
    title: "Lifetime workmanship warranty",
    description:
      "If something feels off after a repair, we will make it right. We stand behind every job with verified parts and meticulous QC.",
  },
  {
    title: "Responsible recycling",
    description:
      "We partner with regional e-waste recyclers to keep batteries and components out of landfills, reclaiming 2 tons last year alone.",
  },
];

const team = [
  { name: "Maya Chen", role: "Lead Technician", image: "/promos/team-maya.svg" },
  { name: "Jordan Blake", role: "Accessories Buyer", image: "/promos/team-jordan.svg" },
  { name: "Priya Desai", role: "Support Manager", image: "/promos/team-priya.svg" },
];

export default function AboutPage() {
  return (
    <main className="container space-y-12 py-10">
      <section className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <div className="space-y-5">
          <span className="text-xs font-semibold uppercase tracking-wide text-fix-blue">Since 2011</span>
          <h1 className="text-3xl font-semibold tracking-tight">We fix the tech you love</h1>
          <p className="text-sm text-muted-foreground">
            The Fix started in a tiny Midtown kiosk with a simple promise: fix phones faster than anyone else without compromising on quality. A decade later our crew spans six labs, tackling everything from shattered phones and water-logged tablets to laptop board repairs and game console overhauls.
          </p>
          <p className="text-sm text-muted-foreground">
            We obsess over trustworthy parts, transparent pricing, and warm customer experiences. Whether you book online, walk in, or chat with support, you get real humans who care about keeping you connected.
          </p>
        </div>
        <div className="relative h-80 w-full overflow-hidden rounded-3xl border border-border/60 bg-muted/40">
          <Image src="/promos/team-placeholder.svg" alt="The Fix technicians at work" fill className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" />
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {highlights.map((item) => (
          <Card key={item.title} className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Meet the crew</h2>
          <p className="text-sm text-muted-foreground">
          A few of the faces behind the counter, labs, and chat support ready to diagnose, repair, and keep you rolling.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {team.map((member) => (
            <Card key={member.name} className="border-border/60">
              <div className="relative h-48 w-full overflow-hidden rounded-t-2xl bg-muted/40">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-base font-semibold">{member.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}



