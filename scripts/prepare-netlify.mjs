import { readFile, writeFile } from "node:fs/promises";

const publishDir = "dist/client";
const shellPath = `${publishDir}/_shell.html`;
const shell = (await readFile(shellPath, "utf8")).replaceAll("/Birthday-Gift/", "/");

await writeFile(shellPath, shell);
await writeFile(`${publishDir}/index.html`, shell);
await writeFile(`${publishDir}/404.html`, shell);

console.log(`Prepared static SPA for Netlify in ${publishDir}`);
