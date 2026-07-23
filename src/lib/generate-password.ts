import { randomInt } from "crypto";

const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const LOWER = "abcdefghijkmnpqrstuvwxyz";
const DIGITS = "23456789";
const SYMBOLS = "!@#$%&*";
const ALL = UPPER + LOWER + DIGITS + SYMBOLS;

function pick(chars: string) {
  return chars[randomInt(chars.length)];
}

/** Gera uma senha temporária forte (12 caracteres), evitando caracteres ambíguos. */
export function generateTemporaryPassword(): string {
  const required = [pick(UPPER), pick(LOWER), pick(DIGITS), pick(SYMBOLS)];
  const rest = Array.from({ length: 8 }, () => pick(ALL));
  const chars = [...required, ...rest];

  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join("");
}
