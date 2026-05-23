#!/usr/bin/env -S node --import tsx
import { resolve } from "node:path";
import { detectProfiles, loadRegistry } from "../src/detection.js";

const projectDir = resolve(process.argv[2] ?? ".");
const repoDir = resolve(import.meta.dirname, "..");
const registry = loadRegistry(repoDir);

if (!registry) {
	console.error(`registry not found under ${repoDir}/profiles`);
	process.exit(1);
}

const profiles = detectProfiles(projectDir, registry);
if (profiles.length === 0) process.exit(1);
console.log(profiles.join(" "));
