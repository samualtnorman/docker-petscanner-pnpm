FROM debian:12.8-slim as install
RUN apt-get update\
 && apt-get install --yes wget=1.21.3-1+b2 ca-certificates=20230311 --no-install-recommends\
 && apt-get clean\
 && rm -rf /var/lib/apt/lists/*
WORKDIR /root
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PATH:$PNPM_HOME
ADD https://get.pnpm.io/install.sh .
RUN ENV=$HOME/.shrc SHELL=$(which sh) sh install.sh
ARG nodeVersion
RUN pnpm env use --global $nodeVersion
ARG pnpmVersion
RUN pnpm add --global pnpm@$pnpmVersion && pnpm --version

FROM debian:12.8-slim
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PATH:$PNPM_HOME
COPY --from=install $PNPM_HOME $PNPM_HOME
