"use client";

import React, { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Service } from "@/lib/services";

const collator = new Intl.Collator("en", { sensitivity: "base" });
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

interface ServicesDirectoryProps {
  services: Service[];
}

export function ServicesDirectory({ services }: ServicesDirectoryProps) {
  const [searchValue, setSearchValue] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = useMemo(() => {
    const unique = new Set(services.map((service) => service.category));
    return [...unique].sort((a, b) => collator.compare(a, b));
  }, [services]);

  const normalizedSearch = searchValue.trim().toLowerCase();

  const groupedServices = useMemo(() => {
    const matches = services.filter((service) => {
      if (categoryFilter !== "all" && service.category !== categoryFilter) {
        return false;
      }

      if (!normalizedSearch) return true;

      const options = service.variants ?? service.models ?? [];
      const haystack = [
        service.name,
        service.category,
        service.description,
        service.slug,
        ...options.map(getOptionLabel),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });

    const grouped = new Map<string, Service[]>();
    matches.forEach((service) => {
      if (!grouped.has(service.category)) {
        grouped.set(service.category, []);
      }
      grouped.get(service.category)?.push(service);
    });

    const sortedEntries = [...grouped.entries()].map(([category, items]) => {
      const sortedItems = [...items].sort((a, b) => {
        if (a.featured !== b.featured) {
          return a.featured ? -1 : 1;
        }
        return collator.compare(a.name, b.name);
      });
      return [category, sortedItems] as const;
    });

    sortedEntries.sort((a, b) => collator.compare(a[0], b[0]));
    return sortedEntries;
  }, [services, categoryFilter, normalizedSearch]);

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-1 flex-col gap-2">
          <label className="sr-only" htmlFor="services-search">
            Search services
          </label>
          <Input
            id="services-search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search by repair, device, or keyword"
            aria-label="Search services"
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-2 lg:w-60">
          <label className="sr-only" htmlFor="services-category">
            Filter by category
          </label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger id="services-category" aria-label="Filter by category">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {groupedServices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/70 bg-muted/30 p-10 text-center text-sm text-muted-foreground">
          No services match your filters. Try adjusting the search or category.
        </div>
      ) : (
        <div className="space-y-12">
          {groupedServices.map(([category, items]) => (
            <CategorySection key={category} category={category} services={items} />
          ))}
        </div>
      )}
    </section>
  );
}

interface CategorySectionProps {
  category: string;
  services: Service[];
}

function CategorySection({ category, services }: CategorySectionProps) {
  const sectionId = `category-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;

  return (
    <section aria-labelledby={`${sectionId}-title`} className="space-y-6" id={sectionId}>
      <div className="sticky top-24 z-10 flex flex-col gap-1 border-b border-border/60 bg-background/95 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <h2 id={`${sectionId}-title`} className="text-2xl font-semibold text-foreground">
          {category}
        </h2>
        <p className="text-sm text-muted-foreground">
          {services.length} {services.length === 1 ? "service" : "services"}
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </div>
    </section>
  );
}

interface ServiceCardProps {
  service: Service;
}

function ServiceCard({ service }: ServiceCardProps) {
  const options = service.variants ?? service.models ?? [];
  const hasMultipleOptions = options.length > 1;
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedOption = options[selectedIndex] ?? options[0];
  const selectLabel = service.variants ? "Choose option" : "Choose model";

  return (
    <Card
      id={service.slug}
      role="article"
      aria-labelledby={`${service.slug}-title`}
      className={cn(
        "group relative flex h-full flex-col justify-between border-border/60",
        service.featured && "border-fix-blue/80 shadow-[0_0_0_1.5px_rgba(0,106,255,0.3)]"
      )}
    >
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <CardTitle id={`${service.slug}-title`} className="text-lg font-semibold text-foreground">
              {service.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{service.description}</p>
          </div>
          {service.featured ? (
            <Badge variant="secondary" className="rounded-full bg-fix-blue/10 text-fix-blue">
              Featured
            </Badge>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="outline" className="rounded-full border-border/50 text-muted-foreground">
            ~{service.duration_min} min
          </Badge>
          <Badge variant="outline" className="rounded-full border-border/50 text-muted-foreground">
            {service.warranty_days}-day warranty
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="mt-auto space-y-4">
        <div className="rounded-2xl border border-border/50 bg-muted/40 p-4">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Current price</div>
          <div className="mt-1 text-2xl font-semibold text-foreground" aria-live="polite">
            {formatPrice(selectedOption.price)}
          </div>
          {hasMultipleOptions ? (
            <div className="mt-4">
              <Select value={String(selectedIndex)} onValueChange={(value) => setSelectedIndex(Number(value))}>
                <SelectTrigger aria-label={selectLabel} className="w-full">
                  <SelectValue placeholder={selectLabel} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option, index) => (
                    <SelectItem key={`${service.slug}-${index}`} value={String(index)}>
                      {getOptionLabel(option)} - {formatPrice(option.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">{getOptionLabel(selectedOption)}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function getOptionLabel(
  option: Service["variants"][number] | Service["models"][number]
): string {
  return "option" in option ? option.option : option.model;
}

function formatPrice(price: number) {
  return currencyFormatter.format(price);
}
