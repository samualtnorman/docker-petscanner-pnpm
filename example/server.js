import { Server } from "http"

new Server((request, response) => {
	console.log(request.method, request.url)
	response.writeHead(200, { "Content-Type": "text/plain" })
	response.end("Hello, world!")
}).listen(80)

process.on("SIGTERM", () => process.exit())
