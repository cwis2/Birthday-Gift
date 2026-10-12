import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const publishDir = resolve("dist/client");
const sourceDir = resolve(".output/public");
const shellPath = join(sourceDir, "_shell.html");
const shell = (await readFile(shellPath, "utf8")).replaceAll("/Birthday-Gift/", "/");

await mkdir(publishDir, { recursive: true });
for (const entry of await readdir(sourceDir, { withFileTypes: true })) {
  if (entry.name === "server" || entry.name === "client") continue;
  await cp(join(sourceDir, entry.name), join(publishDir, entry.name), { recursive: true });
}
await writeFile(join(publishDir, "_shell.html"), shell);
await writeFile(join(publishDir, "index.html"), shell);
await writeFile(join(publishDir, "404.html"), shell);

console.log(`Prepared static SPA for Netlify in ${publishDir}`);
