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
        "inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground backdrop-blur",
        className
      )}
    >
      {icon}
      {children}
    </Badge>
  );
}


