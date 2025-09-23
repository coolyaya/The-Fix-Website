#!/usr/bin/env node
import { importServicesFromFile } from "./import-services-lib.mjs";

function printHelp() {
  console.log(`Usage: node scripts/import-services.mjs [options] <input-file>

Options:
  -i, --input <file>   Path to CSV or JSON source file (can also be provided as the last argument)
  -o, --output <file>  Optional destination path (defaults to data/services.json)
  -h, --help           Show this help message
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    if (args.includes("--help") || args.includes("-h")) {
      printHelp();
      return;
    }
  }

  let inputPath;
  let outputPath;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    switch (arg) {
      case "--input":
      case "-i":
        inputPath = args[index + 1];
        index += 1;
        break;
      case "--output":
      case "-o":
        outputPath = args[index + 1];
        index += 1;
        break;
      case "--help":
      case "-h":
        printHelp();
        return;
      default:
        if (!inputPath) {
          inputPath = arg;
        }
    }
  }

  if (!inputPath) {
    console.error("Error: missing input file. Use --input <file> or provide a path as the first argument.\n");
    printHelp();
    process.exitCode = 1;
    return;
  }

  try {
    const result = await importServicesFromFile(inputPath, {
      outputPath,
    });
    console.log(`Imported ${result.length} services into ${outputPath ?? "data/services.json"}.`);
  } catch (error) {
    console.error("Failed to import services:\n", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

main();
