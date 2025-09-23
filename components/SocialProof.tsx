import { Star } from "lucide-react";

const BADGES = [
  "Trusted by thousands of local customers",
  "Parts & labor warranty",
  "Most repairs in under an hour",
] as const;

export function SocialProof() {
  return (
    <section>
      <div className="container grid gap-12 py-16 md:grid-cols-[minmax(0,1fr)_minmax(0,420px)] md:items-center md:py-24">
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold md:text-4xl">Repairs people rave about</h2>
          <p className="text-lg text-fix-slate">
            With transparent pricing, certified pros, and a promise that the job is done right, The Fix is the repair shop locals recommend to friends and family.
          </p>
          <div className="flex flex-wrap gap-3">
            {BADGES.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-2 rounded-full bg-fix-blue/10 px-4 py-2 text-sm font-medium text-fix-blue"
              >
                <span className="h-2 w-2 rounded-full bg-fix-pink" aria-hidden />
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-2xl bg-white p-8 shadow-soft">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-fix-blue">
            <Star className="h-4 w-4 fill-current" aria-hidden />
            Real 5-Star Reviews
          </div>
          <blockquote className="space-y-4 text-fix-slate">
            <p className="text-lg text-fix-navy">
              “They swapped my shattered screen, checked the battery, and had me out the door in 45 minutes. Friendly team and zero upsell nonsense.”
            </p>
            <footer className="text-sm font-medium text-fix-blue">— Hannah M., Brooklyn</footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
