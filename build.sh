#!/bin/sh
docker build . --build-arg pnpmVersion="$1" --build-arg nodeVersion="$2" --tag petscanner/pnpm:"$1"-node"$2"
