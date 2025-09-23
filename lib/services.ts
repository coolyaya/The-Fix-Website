import servicesData from "@/data/services.json";

import { servicesSchema } from "@/lib/services-schema";

export const services = servicesSchema.parse(servicesData);
export type { Service } from "@/lib/services-schema";
