import * as ChildProcess from "child_process"
import { spawnSync } from "child_process"
import { t } from "try"
import { promisify, styleText } from "util"
import * as v from "valibot"

const execFile = promisify(ChildProcess.execFile)

const ExecFileErrorSchema = v.object({
	code: v.number(),
	killed: v.boolean(),
	signal: v.nullable(v.string()),
	cmd: v.string(),
	stdout: v.string(),
	stderr: v.string()
})

const shellEscape = (string: string) =>
	/["\$&'\(\)\*;<>\?\[\\\]`{\|}~ \t\r\n]/.test(string) ? `'${string.replaceAll(`'`, `\\'`)}'` : string

const highlightCommand = (command: string, args: string[]) =>
	 `${styleText(`blueBright`, shellEscape(command))} ${args.map(arg => (arg = shellEscape(arg), styleText(arg[0] == `'` ? `green` : `cyanBright`, arg))).join(` `)}`

export const cmd = async (command: string, ...args: string[]) => {
	const highlightedCommand = highlightCommand(command, args)

	console.log(styleText(`gray`, `Running command:`), highlightedCommand)

	const [ ok, error, value ] = await t(() => execFile(command, args))

	if (!ok) {
		if (!(error instanceof Error && v.is(ExecFileErrorSchema, error)))
			throw error

		const { code, killed, stderr, stdout, signal } = error

		console.error(styleText(`red`, `Command failed:`), highlightedCommand)

		if (signal)
			console.error(styleText(`red`, `Child process got signal:`), styleText(`green`, signal))

		if (killed)
			console.error(styleText(`red`, `Child process was killed`))

		process.stdout.write(stdout)
		process.stderr.write(stderr)
		process.exit(code)
	}

	console.log(styleText(`gray`, `Command finished:`), highlightedCommand)
	process.stdout.write(value.stdout)
	process.stderr.write(value.stderr)
}

export const cmdSync = (command: string, ...args: string[]) => {
	console.log(styleText(`gray`, `Running command:`), highlightCommand(command, args))

	const { signal, status, error } = spawnSync(command, args, { stdio: `inherit` })

	if (signal)
		console.error(styleText(`red`, `Child process got signal:`), styleText(`green`, signal))

	if (error)
		console.error(styleText(`red`, `Got error:`), error)

	if (status)
		process.exit(status)
}
