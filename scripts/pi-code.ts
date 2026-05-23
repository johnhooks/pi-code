#!/usr/bin/env -S node --import tsx
import { resolve } from "node:path";
import { runCli } from "../src/cli.js";

const repoDir = resolve(import.meta.dirname, "..");
const exitCode = runCli({ repoDir, argv: process.argv.slice(2) });
process.exit(exitCode);
