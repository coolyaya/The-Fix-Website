"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

import { PriceEta } from "@/components/PriceEta";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface RepairIssue {
  name: string;
  startsAt: number;
  eta: string;
}

export interface RepairCategory {
  category: string;
  brand: string;
  models: string[];
  issues: RepairIssue[];
}

export interface AccessoryItem {
  name: string;
  tags: string[];
  priceRange: string;
  image: string;
  compatible?: string[];
}

interface RepairsAccessoriesTabsProps {
  repairs: RepairCategory[];
  accessories: AccessoryItem[];
  defaultTab?: "repairs" | "accessories";
}

export function RepairsAccessoriesTabs({
  repairs,
  accessories,
  defaultTab = "repairs",
}: RepairsAccessoriesTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [searchValue, setSearchValue] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [debouncedSearch] = useDebounce(searchValue.toLowerCase(), 200);

  const brands = useMemo(() => {
    const unique = new Set<string>();
    repairs.forEach((entry) => unique.add(entry.brand));
    return ["all", ...Array.from(unique).sort()];
  }, [repairs]);

  const filteredRepairs = useMemo(() => {
    return repairs.filter((entry) => {
      const matchesBrand = selectedBrand === "all" || entry.brand === selectedBrand;
      if (!matchesBrand) return false;
      if (!debouncedSearch) return true;
      const haystack = [
        entry.brand,
        entry.category,
        ...entry.models,
        ...entry.issues.map((issue) => issue.name),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(debouncedSearch);
    });
  }, [repairs, selectedBrand, debouncedSearch]);

  const filteredAccessories = useMemo(() => {
    return accessories.filter((item) => {
      if (!debouncedSearch) return true;
      const haystack = [
        item.name,
        item.tags.join(" "),
        item.compatible?.join(" ") ?? "",
      ].join(" ").toLowerCase();
      return haystack.includes(debouncedSearch);
    });
  }, [accessories, debouncedSearch]);

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        const tab = value as "repairs" | "accessories";
        setActiveTab(tab);
      }}
      className="w-full"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <TabsList className="grid w-full grid-cols-2 sm:w-auto">
          <TabsTrigger value="repairs">Repairs</TabsTrigger>
          <TabsTrigger value="accessories">Accessories</TabsTrigger>
        </TabsList>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search by device, brand, or issue"
            className="w-full sm:w-72"
            aria-label="Search"
          />
          {activeTab === "repairs" && (
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand === "all" ? "All brands" : brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <TabsContent value="repairs" className="mt-6 space-y-6">
        {filteredRepairs.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border/70 bg-muted/30 p-8 text-center text-sm text-muted-foreground">
            No repair matches found. Try another device or brand.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredRepairs.map((entry) => (
              <Card key={`${entry.brand}-${entry.category}`} className="border-border/60">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-xl font-semibold text-foreground">
                        {entry.brand} {entry.category}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Models: {entry.models.join(", ")}
                      </p>
                    </div>
                    <Badge variant="secondary" className="rounded-full">
                      ETA {entry.issues[0]?.eta ?? "-"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {entry.issues.map((issue) => (
                      <li
                        key={issue.name}
                        className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/40 px-4 py-3"
                      >
                        <span className="font-medium text-foreground">{issue.name}</span>
                        <PriceEta
                          price={issue.startsAt}
                          eta={issue.eta}
                          className="text-xs uppercase tracking-wide text-brand"
                        />
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="accessories" className="mt-6">
        {filteredAccessories.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border/70 bg-muted/30 p-8 text-center text-sm text-muted-foreground">
            No accessories found. Adjust your search terms.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAccessories.map((item) => (
              <Card key={item.name} className="border-border/60">
                <div className="relative h-40 w-full overflow-hidden rounded-t-2xl bg-muted/50">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {item.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{item.priceRange}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="rounded-full border-border/50 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {item.compatible?.length ? (
                    <p className="text-xs text-muted-foreground">
                      Compatible with {item.compatible.join(", ")}
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}



