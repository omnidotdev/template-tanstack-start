import { existsSync, readFileSync, mkdirSync, PathOrFileDescriptor } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { build } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const distDir = join(projectRoot, ".output/public");
const swSrc = join(projectRoot, "src/sw/index.ts");

// TODO track https://github.com/serwist/serwist/issues/300 to simplify this process

const buildServiceWorker = async () => {
  console.log("Building service worker...");

  try {
    // Ensure output directory exists
    if (!existsSync(distDir)) {
      mkdirSync(distDir, { recursive: true });
    }

    // Generate manifest of files to precache
    const manifest = generatePrecacheManifest();

    // Build service worker with Vite
    await build({
      configFile: false,
      build: {
        lib: {
          entry: swSrc,
          name: "sw",
          fileName: "sw",
          formats: ["iife"],
        },
        outDir: distDir,
        rollupOptions: {
          output: {
            entryFileNames: "sw.js",
          },
        },
        minify: "terser",
        sourcemap: false,
      },
      define: {
        "self.__SW_MANIFEST": JSON.stringify(manifest),
      },
      plugins: [],
    });

    console.log("Service worker built successfully!");
  } catch (error) {
    console.error("Failed to build service worker:", error);
    process.exit(1);
  }
};

function generatePrecacheManifest() {
  // TODO type properly
  const manifest: any = [];

  const publicDir = join(projectRoot, ".output/public");

  if (!existsSync(publicDir)) {
    console.warn("Public directory does not exist, creating empty manifest");

    return manifest;
  }

  // Simple file discovery for precaching
  // In a real implementation, you might want to use glob patterns
  const commonFiles = ["favicon.ico", "manifest.json"];

  for (const file of commonFiles) {
    const filePath = join(publicDir, file);
    if (existsSync(filePath)) {
      manifest.push({
        url: `/${file}`,
        revision: getFileRevision(filePath),
      });
    }
  }

  return manifest;
}

const getFileRevision = async (filePath: PathOrFileDescriptor) => {
  try {
    const content = readFileSync(filePath);

    const crypto = await import("crypto");

    return crypto.createHash("md5").update(content).digest("hex");
  } catch {
    return Date.now().toString();
  }
};

buildServiceWorker();
