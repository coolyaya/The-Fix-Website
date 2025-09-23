import {
  BatteryCharging,
  Camera,
  Gamepad2,
  Laptop,
  Smartphone,
  Tablet,
} from "lucide-react";

const SERVICES = [
  {
    title: "iPhone Repair",
    description: "Genuine-quality parts, done today.",
    icon: Smartphone,
  },
  {
    title: "iPad/Tablet",
    description: "Fixes that last, for work or school.",
    icon: Tablet,
  },
  {
    title: "Laptop/Computer",
    description: "Speed up, clean up, or tune up\u2014like new.",
    icon: Laptop,
  },
  {
    title: "Battery/Charging",
    description: "All-day power restored in a flash.",
    icon: BatteryCharging,
  },
  {
    title: "Camera/Audio",
    description: "Clear photos. Clear calls. Clear fix.",
    icon: Camera,
  },
  {
    title: "Game Console",
    description: "Back in the game\u2014fast turnaround.",
    icon: Gamepad2,
  },
] as const;

export function Services() {
  return (
    <section>
      <div className="container space-y-8 py-16 md:py-24">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-3xl font-semibold md:text-4xl">Repairs for every device you depend on</h2>
          <p className="text-lg text-fix-slate">
            From shattered screens to sluggish laptops, our certified technicians diagnose and repair quickly so you can get back to what matters.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="rounded-2xl bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-fix-blue/10 text-fix-blue">
                <Icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="text-xl font-semibold text-fix-navy">{title}</h3>
              <p className="mt-2 text-sm text-fix-slate">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
