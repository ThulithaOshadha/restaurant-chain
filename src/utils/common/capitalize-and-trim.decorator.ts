import { Transform } from 'class-transformer';

export function CapitalizeAndTrim() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      // Trim spaces, capitalize first letter, and lowercase the rest
      return value.trim().charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }
    return value;
  });
}