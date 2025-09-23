import { readFile, writeFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { parse } from "csv-parse/sync";

import { serviceSchema, servicesSchema } from "./services-schema.mjs";

const collator = new Intl.Collator("en", { sensitivity: "base" });

function coerceBoolean(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["true", "yes", "1", "y"].includes(normalized);
  }
  return false;
}

function coerceNumber(value) {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return NaN;
}

function stripEmpty(value) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

function normalizeOption(option, type) {
  const labelKey = type === "models" ? "model" : "option";
  const label = stripEmpty(option[labelKey]);
  const price = coerceNumber(option.price);
  return { [labelKey]: label, price };
}

function finalizeServiceDraft(draft) {
  const durationMin = coerceNumber(draft.duration_min ?? draft.durationMin);
  const warrantyDays = coerceNumber(draft.warranty_days ?? draft.warrantyDays);
  const base = {
    category: stripEmpty(draft.category),
    name: stripEmpty(draft.name),
    description: stripEmpty(draft.description),
    duration_min: durationMin,
    warranty_days: warrantyDays,
    featured: coerceBoolean(draft.featured ?? false),
    slug: stripEmpty(draft.slug),
  };

  if (!draft.variants?.length && !draft.models?.length) {
    throw new Error(`Service "${base.name ?? "<unknown>"}" is missing variants or models.`);
  }

  if (draft.variants?.length && draft.models?.length) {
    throw new Error(`Service "${base.name ?? draft.slug}" cannot have both variants and models.`);
  }

  const optionType = draft.variants?.length ? "variants" : "models";
  const normalizedOptions = (draft[optionType] ?? []).map((option) => normalizeOption(option, optionType));

  const service = {
    ...base,
    [optionType]: normalizedOptions,
  };

  const parsed = serviceSchema.parse(service);
  return parsed;
}

function groupCsvRows(rows) {
  const bySlug = new Map();

  rows.forEach((row) => {
    const slug = stripEmpty(row.slug);
    if (!slug) {
      throw new Error("CSV input requires a slug column.");
    }

    const optionTypeRaw = (row.option_type ?? row.optionType ?? "variant").toString().trim().toLowerCase();
    const optionType = optionTypeRaw === "model" || optionTypeRaw === "models" ? "models" : "variants";

    const entry = bySlug.get(slug) ?? {
      category: row.category,
      name: row.name,
      description: row.description,
      duration_min: row.duration_min ?? row.durationMin,
      warranty_days: row.warranty_days ?? row.warrantyDays,
      featured: row.featured,
      slug,
      variants: [],
      models: [],
    };

    const labelKey = optionType === "models" ? "model" : "option";
    entry[optionType].push({
      [labelKey]: row[labelKey] ?? row.option ?? row.model,
      price: row.price,
    });

    bySlug.set(slug, entry);
  });

  return Array.from(bySlug.values()).map((draft) => {
    const { variants, models, ...rest } = draft;
    const hasVariants = variants.length > 0;
    const hasModels = models.length > 0;

    return finalizeServiceDraft({
      ...rest,
      variants: hasVariants ? variants : undefined,
      models: hasModels ? models : undefined,
    });
  });
}

function normalizeJsonInput(jsonLike) {
  if (Array.isArray(jsonLike)) {
    return jsonLike.map((item) => finalizeServiceDraft(item));
  }

  if (jsonLike && Array.isArray(jsonLike.services)) {
    return jsonLike.services.map((item) => finalizeServiceDraft(item));
  }

  throw new Error("JSON input must be an array of services or an object with a services array.");
}

export function parseCsvToServices(csvString) {
  const rows = parse(csvString, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  return groupCsvRows(rows);
}

export function prepareServices(data) {
  const validated = servicesSchema.parse(data);
  return sortServices(validated);
}

export function sortServices(services) {
  return [...services].sort((a, b) => {
    if (a.category !== b.category) {
      return collator.compare(a.category, b.category);
    }
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }
    return collator.compare(a.name, b.name);
  });
}

export async function importServicesFromFile(inputPath, options = {}) {
  if (!inputPath) {
    throw new Error("Provide a path to a CSV or JSON file.");
  }

  const absolutePath = resolve(process.cwd(), inputPath);
  const ext = extname(absolutePath).toLowerCase();
  const raw = await readFile(absolutePath, "utf8");
  const normalizedRaw = raw.replace(/^\uFEFF/, "");

  let services;
  if (ext === ".csv") {
    services = parseCsvToServices(normalizedRaw);
  } else if (ext === ".json") {
    const parsedJson = JSON.parse(normalizedRaw);
    services = normalizeJsonInput(parsedJson);
  } else {
    throw new Error(`Unsupported file extension: ${ext}`);
  }

  const sorted = prepareServices(services);

  const destination = options.outputPath ?? resolve(process.cwd(), "data/services.json");
  await writeFile(destination, JSON.stringify(sorted, null, 2) + "\n", "utf8");

  return sorted;
}
