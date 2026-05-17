export function getTileFontSize(value: number): number {
  if (value >= 1024) {
    return 28;
  }

  if (value >= 128) {
    return 32;
  }

  return 38;
}
