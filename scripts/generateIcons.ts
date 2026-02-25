import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const faviconPath = join(projectRoot, "public/favicon.ico");
const iconsDir = join(projectRoot, "public/icons");

// Icon sizes needed for PWA
const iconSizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

const generatePlaceholderIcon = (size: number) => {
  // Simple SVG placeholder icon
  const svg = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#000000"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${Math.floor(size * 0.3)}">O</text>
</svg>`.trim();

  return svg;
};

const generateIcons = () => {
  // Ensure icons directory exists
  if (!existsSync(iconsDir)) {
    mkdirSync(iconsDir, { recursive: true });
  }

  // Check if favicon exists
  if (!existsSync(faviconPath)) {
    console.warn("Favicon not found, generating placeholder icons...");
  }

  for (const size of iconSizes) {
    const iconPath = join(iconsDir, `icon-${size}x${size}.png`);

    if (existsSync(iconPath)) {
      continue;
    }

    // For now, create a placeholder SVG and save it as PNG
    // In a real implementation, you'd want to use a proper image processing library
    // like sharp or jimp to convert and resize the favicon
    const placeholder = generatePlaceholderIcon(size);
    const placeholderPath = join(iconsDir, `icon-${size}x${size}.svg`);

    try {
      writeFileSync(placeholderPath, placeholder);
    } catch (error) {
      console.error(`Failed to generate icon ${size}x${size}:`, error);
    }
  }
};

generateIcons();
