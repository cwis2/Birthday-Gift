import { cp, mkdir, readdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const netlifyBuildDir = resolve("dist");
const publishDir = resolve("dist/client");
const sourceDir = netlifyBuildDir;
const assetsDir = join(sourceDir, "assets");
const assetNames = await readdir(assetsDir);
const script = assetNames.find((name) => /^index-.*\.js$/.test(name));
const stylesheet = assetNames.find((name) => /^styles-.*\.css$/.test(name));
if (!script) throw new Error(`No client entry bundle found in ${assetsDir}`);

await mkdir(publishDir, { recursive: true });
for (const entry of await readdir(sourceDir, { withFileTypes: true })) {
  if (entry.name === "server" || entry.name === "client") continue;
  await cp(join(sourceDir, entry.name), join(publishDir, entry.name), { recursive: true });
}
const shell = `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>3DS Home Menu</title>${stylesheet ? `<link rel="stylesheet" href="/assets/${stylesheet}">` : ""}</head><body><div id="root"></div><script type="module" src="/assets/${script}"></script></body></html>`;
await writeFile(join(publishDir, "_shell.html"), shell);
await writeFile(join(publishDir, "index.html"), shell);
await writeFile(join(publishDir, "404.html"), shell);

console.log(`Prepared static SPA for Netlify in ${publishDir}`);
