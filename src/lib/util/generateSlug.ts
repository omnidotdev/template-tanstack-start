/**
 * Generate a URL-safe slug from a string.
 */
const generateSlug = (input: string): string =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default generateSlug;
