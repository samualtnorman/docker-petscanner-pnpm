FROM debian:13.1-slim AS install
RUN apt-get update\
 && apt-get install wget=1.25.0-2 ca-certificates=20250419 libatomic1=14.2.0-19 --yes --no-install-recommends\
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

FROM debian:13.1-slim
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PATH:$PNPM_HOME
COPY --from=install /usr/lib/x86_64-linux-gnu/libatomic.so.1 /usr/lib/x86_64-linux-gnu/libatomic.so.1
COPY --from=install $PNPM_HOME $PNPM_HOME
