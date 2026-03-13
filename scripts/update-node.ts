#!/usr/bin/env -S node --experimental-strip-types
import * as Semver from "@std/semver"
import { writeFileSync } from "fs"
import { cmd, cmdSync } from "../common.ts"
import state from "../state.json" with { type: "json" }

const [ ,, nodeVersion ] = process.argv

if (!nodeVersion) {
	process.stderr.write(`Expected 1 argument`)
	process.exit(1)
}

const nodeSemverVersion = Semver.parse(nodeVersion)

await Promise.all(state.map(async state => {
	if (nodeSemverVersion.major != Semver.parse(state.nodeVersion).major)
		return

	await cmd(`./build.sh`, state.pnpmVersion, nodeVersion)
	await cmd(`docker`, `push`, `petscanner/pnpm:${state.pnpmVersion}-node${nodeVersion}`)
	state.nodeVersion = nodeVersion
}))

console.log(`Updating state.json`)
writeFileSync(`state.json`, `${JSON.stringify(state, undefined, `\t`)}\n`)
cmdSync(`git`, `add`, `state.json`)
cmdSync(`git`, `commit`, `-m`, `update to Node.js v${nodeVersion}`)
cmdSync(`git`, `push`)
