import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PromoBadgeProps {
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function PromoBadge({ icon, children, className }: PromoBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-fix-blue/20 bg-fix-blue/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-fix-blue backdrop-blur transition hover:border-fix-blue/30",
        className,
      )}
    >
      {icon}
      {children}
    </Badge>
  );
}
