#!/usr/bin/env node
// The root package.json is private and not a workspace, so `changeset version`
// never bumps it. Keep it in lockstep with the published packages.
import { readFileSync, writeFileSync } from "node:fs";

const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
const { version } = read("../packages/core/package.json");
const rootUrl = new URL("../package.json", import.meta.url);
const root = read("../package.json");

if (root.version !== version) {
	root.version = version;
	writeFileSync(rootUrl, `${JSON.stringify(root, null, "\t")}\n`);
	console.log(`Root package.json version set to ${version}`);
}
