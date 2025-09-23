import { ShieldCheck, Sparkles, Timer, Wrench } from "lucide-react";

const BENEFITS = [
  {
    title: "Same-day repairs by certified techs",
    description: "We stock parts for the most popular devices so your fix never waits on shipping.",
    icon: Timer,
  },
  {
    title: "Transparent pricing\u2014no surprises",
    description: "Know the repair scope, price, and turnaround before we pick up a screwdriver.",
    icon: Sparkles,
  },
  {
    title: "Premium parts & device-safe tools",
    description: "OEM-grade components and anti-static workstations keep your device safe.",
    icon: Wrench,
  },
  {
    title: "Backed by parts and labor warranty",
    description: "If something doesn't feel right after your visit, come back and we'll make it right.",
    icon: ShieldCheck,
  },
] as const;

export function WhyUs() {
  return (
    <section>
      <div className="container space-y-10 py-16 md:space-y-12 md:py-24">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-3xl font-semibold md:text-4xl">Why choose The Fix?</h2>
          <p className="text-lg text-fix-slate">
            A modern repair experience built around speed, communication, and craftsmanship. Every visit should feel effortless from check-in to checkout.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {BENEFITS.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="flex items-start gap-4 rounded-2xl bg-white p-6 shadow-soft"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-fix-blue text-white shadow-soft">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-fix-navy">{title}</h3>
                <p className="text-sm text-fix-slate">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
