#!/usr/bin/env -S node --experimental-strip-types
import * as Semver from "@std/semver"
import ChildProcess from "child_process"
import { writeFileSync } from "fs"
import { promisify } from "util"
import state from "../state.json" with { type: "json" }

const execFile = promisify(ChildProcess.execFile)
const [ ,, nodeVersion ] = process.argv
const nodeSemverVersion = Semver.parse(nodeVersion)

await Promise.all(state.map(async state => {
	if (nodeSemverVersion.major != Semver.parse(state.nodeVersion).major)
		return

	let { stdout, stderr } = await execFile(`./build.sh`, [ state.pnpmVersion, nodeVersion ])
	process.stdout.write(stdout)
	process.stderr.write(stderr);
	({ stdout, stderr } = await execFile(`docker`, [ `push`, `petscanner/pnpm:${state.pnpmVersion}-node${nodeVersion}` ]))
	process.stdout.write(stdout)
	process.stderr.write(stderr)
	state.nodeVersion = nodeVersion
}))

writeFileSync(`state.json`, `${JSON.stringify(state, undefined, `\t`)}\n`)
