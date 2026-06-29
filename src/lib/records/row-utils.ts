export function getSingleRow<T>(row: T | T[] | null | undefined) {
  return Array.isArray(row) ? row[0] : row;
}
