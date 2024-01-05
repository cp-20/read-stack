FROM oven/bun:1.0-slim AS base

RUN apt-get update \
  && apt-get install -y npm bash curl \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*
RUN npm i -g n
RUN n lts
RUN apt-get remove -y --allow-remove-essential npm bash curl

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder

# Set working directory
WORKDIR /app

# Install Turborepo
RUN pnpm i -g turbo

# Set up the project
COPY . .
RUN turbo prune read-stack-server --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer

# Set working directory
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --prod --frozen-lockfile

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

CMD ["pnpm", "start", "--filter=read-stack-server"]
