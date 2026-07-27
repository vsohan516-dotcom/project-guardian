#!/usr/bin/env node
/**
 * Prepare Capacitor web build output.
 * Copies .output/capacitor to www/ and ensures index.html is present.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const sourceDir = path.join(projectRoot, ".output", "capacitor");
const targetDir = path.join(projectRoot, "www");

async function prepareCapacitorWeb() {
  try {
    // Remove old www folder
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
    }

    // Create www directory
    fs.mkdirSync(targetDir, { recursive: true });

    // Copy build output
    if (!fs.existsSync(sourceDir)) {
      console.error(`❌ Build output not found at ${sourceDir}`);
      console.error("Run: npm run build:capacitor");
      process.exit(1);
    }

    const files = fs.readdirSync(sourceDir);
    files.forEach((file) => {
      const src = path.join(sourceDir, file);
      const dest = path.join(targetDir, file);

      if (fs.statSync(src).isDirectory()) {
        fs.cpSync(src, dest, { recursive: true });
      } else {
        fs.cpSync(src, dest);
      }
    });

    console.log(`✅ Copied ${sourceDir} → ${targetDir}`);

    // Verify index.html exists
    const indexPath = path.join(targetDir, "index.html");
    if (!fs.existsSync(indexPath)) {
      console.error(`❌ index.html not found in ${targetDir}`);
      process.exit(1);
    }

    console.log("✅ index.html verified");
    console.log("✅ Capacitor web assets ready at www/");
  } catch (error) {
    console.error("❌ Error preparing Capacitor web:", error);
    process.exit(1);
  }
}

prepareCapacitorWeb();
