#!/usr/bin/env -S node --experimental-strip-types
import * as Semver from "@std/semver"
import { writeFileSync } from "fs"
import { cmd, cmdSync } from "../common.ts"
import state from "../state.json" with { type: "json" }

const [ ,, pnpmVersion ] = process.argv

if (!pnpmVersion) {
	process.stderr.write(`Expected 1 argument`)
	process.exit(1)
}

const pnpmSemverVersion = Semver.parse(pnpmVersion)

await Promise.all(state.map(async state => {
	if (pnpmSemverVersion.major != Semver.parse(state.pnpmVersion).major)
		return

	await cmd(`./build.sh`, pnpmVersion, state.nodeVersion)
	await cmd(`docker`, `push`, `petscanner/pnpm:${pnpmVersion}-node${state.nodeVersion}`)
	state.pnpmVersion = pnpmVersion
}))

console.log(`Updating state.json`)
writeFileSync(`state.json`, `${JSON.stringify(state, undefined, `\t`)}\n`)
cmdSync(`git`, `add`, `state.json`)
cmdSync(`git`, `commit`, `-m`, `update to pnpm v${pnpmVersion}`)
cmdSync(`git`, `push`)
