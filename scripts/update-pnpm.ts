#!/usr/bin/env -S node --experimental-strip-types
import * as Semver from "@std/semver"
import ChildProcess from "child_process"
import { writeFileSync } from "fs"
import { promisify } from "util"
import state from "../state.json" with { type: "json" }

const execFile = promisify(ChildProcess.execFile)
const [ ,, pnpmVersion ] = process.argv
const pnpmSemverVersion = Semver.parse(pnpmVersion)

await Promise.all(state.map(async state => {
	if (pnpmSemverVersion.major != Semver.parse(state.pnpmVersion).major)
		return

	let { stdout, stderr } = await execFile(`./build.sh`, [ pnpmVersion, state.nodeVersion ])
	process.stdout.write(stdout)
	process.stderr.write(stderr);
	({ stdout, stderr } = await execFile(`docker`, [ `push`, `petscanner/pnpm:${pnpmVersion}-node${state.nodeVersion}` ]))
	process.stdout.write(stdout)
	process.stderr.write(stderr)
	state.pnpmVersion = pnpmVersion
}))

writeFileSync(`state.json`, `${JSON.stringify(state, undefined, `\t`)}\n`)
