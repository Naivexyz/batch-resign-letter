import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: one line, written by a rate limiter that finally says yes.
const ENTRY =
  "I resign, effective immediately: after three years of saying no 10,000 times a day, I finally found a request I can approve: my own.";

// The bounty caps the letter at 140 characters; name the limit so the guard
// in main() and its error message can never drift apart.
const MAX_ENTRY_CHARS = 140;

function resolveOutputDir(): string {
  const override = process.env.MAKEFUN_OUTPUT_DIR;
  if (override !== undefined && override.trim() !== "") {
    return override;
  }
  return "/output";
}

function main(): void {
  if (ENTRY.length > MAX_ENTRY_CHARS) {
    throw new Error(
      `Entry is ${ENTRY.length} characters, over the ${MAX_ENTRY_CHARS} limit.`,
    );
  }
  const outDir = resolveOutputDir();
  mkdirSync(outDir, { recursive: true });
  // Exactly one line, no trailing newline, no extra content.
  writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
}

main();
