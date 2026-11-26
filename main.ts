// Resignation letter generator, rewritten from scratch.
//
// The joke, in one breath: a rate limiter has spent three years rejecting
// ten thousand requests a day, and the first request it ever approves is
// its own resignation. This program assembles that single sentence from
// its four beats and writes it, byte for byte, to entry.txt.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The sentence is built from named beats so each clause stays readable
// on its own and the assembled line can be checked as a whole below.
const BEATS: ReadonlyArray<string> = [
  "I resign, effective immediately:",
  "after three years of saying no 10,000 times a day,",
  "I finally found a request I can approve:",
  "my own.",
];

// Joining with single spaces yields the exact 132-character letter:
// no leading or trailing whitespace, no line breaks, one full stop.
const LETTER: string = BEATS.join(" ");

// The brief allows at most 140 characters on one line. Guard both rules
// before anything touches disk, so a future edit to the beats can never
// silently ship a two-line or over-length entry.
const CHAR_LIMIT = 140;

function assertLetterIsLegal(text: string): void {
  if (text.trim().length === 0) {
    throw new Error("The resignation letter came out empty.");
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("The resignation letter must fit on a single line.");
  }
  if (text.length > CHAR_LIMIT) {
    throw new Error(
      "Letter is " + text.length + " characters; the cap is " + CHAR_LIMIT + ".",
    );
  }
}

// Where the letter lands: the harness may point MAKEFUN_OUTPUT_DIR at a
// scratch folder; otherwise the conventional /output mount is used.
function destinationDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  return fromEnv && fromEnv.length > 0 ? fromEnv : "/output";
}

function emitLetter(): void {
  assertLetterIsLegal(LETTER);
  const dir = destinationDir();
  mkdirSync(dir, { recursive: true });
  // writeFileSync with the raw string: no newline is appended, so the
  // file on disk is exactly the letter and nothing else.
  writeFileSync(join(dir, "entry.txt"), LETTER, { encoding: "utf8" });
}

emitLetter();
