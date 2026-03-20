#!/bin/sh
set -euxo pipefail
./build.sh "$1" "$2"
docker run --interactive --tty --rm petscanner/pnpm:"$1"-node"$2" $3
