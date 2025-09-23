import Link from "next/link";

export function CTA() {
  return (
    <section className="bg-fix-blue text-white">
      <div className="container flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between md:py-24">
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold md:text-4xl">Ready to Get Your Fix?</h2>
          <p className="text-lg text-white/80">Walk in or book online in under a minute.</p>
        </div>
        <Link
          href="/support"
          className="inline-flex items-center rounded-xl bg-fix-pink px-6 py-3 text-base font-semibold text-white shadow-soft transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-fix-blue/30"
        >
          Book a Repair
        </Link>
      </div>
    </section>
  );
}
