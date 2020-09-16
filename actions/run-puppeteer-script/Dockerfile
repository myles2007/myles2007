FROM buildkite/puppeteer@sha256:37934dbb9755d0a4d80aab4b3adbf8323dc1aa080044b427deea0904aef6f857

COPY . .
RUN mkdir artifacts
VOLUME "artifacts"

ENTRYPOINT [ "node", "--unhandled-rejections=strict"]