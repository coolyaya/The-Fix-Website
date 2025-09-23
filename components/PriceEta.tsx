import { cn } from "@/lib/utils";

type PriceValue = number | string;

interface PriceEtaProps {
  price: PriceValue;
  eta: string;
  className?: string;
  separatorClassName?: string;
}

export function PriceEta({
  price,
  eta,
  className,
  separatorClassName,
}: PriceEtaProps) {
  const formattedPrice =
    typeof price === "number" ? price.toLocaleString("en-US") : price;

  return (
    <span className={cn("inline-flex items-center text-sm text-muted-foreground", className)}>
      <span>FROM ${formattedPrice}</span>
      <span
        aria-hidden="true"
        className={cn(
          "mx-1 inline-flex h-1 w-1 items-center justify-center before:block before:h-full before:w-full before:rounded-full before:bg-current before:content-['']",
          separatorClassName
        )}
      />
      <span className="uppercase">{eta}</span>
    </span>
  );
}