# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

ARG PNPM_VERSION
ARG NODE_VERSION
FROM petscanner/pnpm:${PNPM_VERSION}-node${NODE_VERSION}
WORKDIR /opt/example

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and pnpm-lock.yaml to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
	--mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
	--mount=type=cache,target=/root/.local/share/pnpm/store \
	pnpm install

# Run the application as a non-root user.
USER www-data

# Copy the rest of the source files into the image.
COPY . .

# Run the application.
ENTRYPOINT [ "node", "server.js" ]
