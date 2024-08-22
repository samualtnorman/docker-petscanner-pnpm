# PetScanner's pnpm Docker Image
[View the Docker Hub page.](https://hub.docker.com/r/petscanner/pnpm)

## How To Use
1. Install [Docker](https://www.docker.com/)
2. Open a terminal
3. Run `docker run -it --rm petscanner/pnpm`

You should then see something like this:
```
$ docker run -it --rm petscanner/pnpm
Unable to find image 'petscanner/pnpm:latest' locally
latest: Pulling from petscanner/pnpm
efc2b5ad9eec: Already exists 
87e4c1ec204c: Already exists 
Digest: sha256:82a038bf87d252ec1850501960441c4c49da5588226091ccc71ad80d1014074e
Status: Downloaded newer image for petscanner/pnpm:latest
root@55532b803dbd:/# pnpm --version
9.7.1
root@55532b803dbd:/# node --version
v22.6.0
root@55532b803dbd:/# 
```

When
[writing a Dockerfile](https://docs.docker.com/get-started/docker-concepts/building-images/writing-a-dockerfile/)
, you can use this image as a base for your own by placing `FROM petscanner/pnpm` at the top or if you need a specific
version of pnpm and Node.js you can specify like so `FROM petscanner/pnpm:9.7.1-node22.6.0`. [The full list of available
versions is on Docker Hub.](https://hub.docker.com/r/petscanner/pnpm/tags?ordering=name)

For further help, feel free to [open an issue](https://github.com/samualtnorman/docker-petscanner-pnpm/issues/new) or
[start a discussion](https://github.com/samualtnorman/docker-petscanner-pnpm/discussions/new/choose).

## About
This image is based on the slim variant of the [debian Docker Official Image](https://hub.docker.com/_/debian). The
`:latest` tag is normally the one in use in production for [PetScanner's Web App](
https://petscanner.com/app).

## How To Build (Linux Only)
1. Clone this repository `git clone https://github.com/samualtnorman/docker-petscanner-pnpm.git`
2. Open a terminal in the cloned folder `cd docker-petscanner-pnpm`
3. Run `./build.sh <pnpm version> <Node.js version>` e.g. `./build.sh 9.7.1 22.6.0`

This will create an image named `petscanner/pnpm` with a tag using the naming convention `:<pnpm version>-node<Node.js
version>` which can for example look like `:9.7.1-node22.6.0`.

To create an image with a custom name and tag, instead run `docker build . --build-arg pnpmVersion="<pnpm version>" --build-arg nodeVersion="<node version>" --tag <name>:<tag>`.
