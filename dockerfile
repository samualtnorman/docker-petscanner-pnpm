FROM debian:12.10-slim AS install
RUN apt-get update\
 && apt-get install wget=1.21.3-1+deb12u1 ca-certificates=20230311 --yes --no-install-recommends\
 && apt-get clean\
 && rm /var/lib/apt/lists/* --recursive --force
WORKDIR /root
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PATH:$PNPM_HOME
ADD https://get.pnpm.io/install.sh .
RUN ENV=$HOME/.shrc SHELL=$(which sh) sh install.sh
ARG nodeVersion
RUN pnpm env use $nodeVersion --global
ARG pnpmVersion
RUN pnpm add pnpm@$pnpmVersion --global && pnpm --version

FROM debian:12.10-slim
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PATH:$PNPM_HOME
COPY --from=install $PNPM_HOME $PNPM_HOME
