import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ServicesDirectory } from "@/components/ServicesDirectory";
import type { Service } from "@/lib/services";

const sampleServices: Service[] = [
  {
    category: "Screens",
    name: "iPhone 14 Screen Replacement",
    variants: [
      { option: "OEM", price: 249 },
      { option: "Aftermarket", price: 179 },
    ],
    duration_min: 90,
    warranty_days: 180,
    description: "Genuine OLED replacement",
    featured: true,
    slug: "iphone-14-screen-replacement",
  },
  {
    category: "Batteries",
    name: "iPad 9th Gen Battery Service",
    models: [
      { model: "Wi-Fi", price: 119 },
      { model: "Cellular", price: 139 },
    ],
    duration_min: 60,
    warranty_days: 365,
    description: "High cycle count battery swap",
    featured: false,
    slug: "ipad-9-battery-service",
  },
];

describe("ServicesDirectory", () => {
  it("renders cards and updates price when a variant is selected", async () => {
    const user = userEvent.setup();
    const { container } = render(<ServicesDirectory services={sampleServices} />);

    expect(screen.getAllByRole("article")).toHaveLength(sampleServices.length);
    expect(container).toMatchSnapshot("initial-services-directory");

    const iPhoneCard = screen.getByRole("article", { name: "iPhone 14 Screen Replacement" });
    expect(within(iPhoneCard).getByText("$249")).toBeInTheDocument();

    const trigger = within(iPhoneCard).getByRole("combobox", { name: "Choose option" });
    await user.click(trigger);

    const aftermarketOption = await screen.findByRole("option", { name: "Aftermarket - $179" });
    await user.click(aftermarketOption);

    expect(within(iPhoneCard).getByText("$179")).toBeInTheDocument();
  });
});

