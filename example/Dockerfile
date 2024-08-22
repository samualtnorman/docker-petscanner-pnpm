ARG PNPM_VERSION
ARG NODE_VERSION
FROM petscanner/pnpm:${PNPM_VERSION}-node${NODE_VERSION}
WORKDIR /opt/example

RUN --mount=type=bind,source=package.json,target=package.json \
	--mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
	--mount=type=cache,target=/root/.local/share/pnpm/store \
	pnpm install

USER www-data

COPY . .

ENTRYPOINT [ "node", "server.js" ]
