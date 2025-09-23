import { describe, expect, it } from "vitest";

import { parseCsvToServices, prepareServices } from "../scripts/import-services-lib.mjs";

describe("import-services parser", () => {
  it("normalizes CSV input into the service schema", () => {
    const csv = [
      "category,name,slug,description,duration_min,warranty_days,featured,option_type,option,model,price",
      "Screens,iPhone 14 Screen Replacement,iphone-14-screen-replacement,Genuine OLED replacement,90,180,true,variant,OEM,,249",
      "Screens,iPhone 14 Screen Replacement,iphone-14-screen-replacement,Genuine OLED replacement,90,180,true,variant,Aftermarket,,179",
      "Tablets,iPad 9th Gen Display Repair,ipad-9th-gen-display-repair,Digitizer and LCD assembly install,150,180,false,model,,Wi-Fi,239",
      "Tablets,iPad 9th Gen Display Repair,ipad-9th-gen-display-repair,Digitizer and LCD assembly install,150,180,false,model,,Cellular,269",
    ].join("\n");

    const services = parseCsvToServices(csv);
    const normalized = prepareServices(services);

    expect(normalized).toHaveLength(2);

    const [screenRepair, tabletRepair] = normalized;

    expect(screenRepair.slug).toBe("iphone-14-screen-replacement");
    expect(screenRepair.featured).toBe(true);
    expect(screenRepair.variants).toEqual([
      { option: "OEM", price: 249 },
      { option: "Aftermarket", price: 179 },
    ]);

    expect(tabletRepair.slug).toBe("ipad-9th-gen-display-repair");
    expect(tabletRepair.models).toEqual([
      { model: "Wi-Fi", price: 239 },
      { model: "Cellular", price: 269 },
    ]);
  });
});
