# ============================================
# BASE
# ============================================
FROM node:22-bookworm-slim AS base

WORKDIR /app


# ============================================
# BUILD
# ============================================
FROM base AS build

WORKDIR /app

# Dependencias de producción
COPY package.json package-lock.json ./

RUN npm ci --omit=dev


# ============================================
# RUNTIME
# ============================================
FROM base AS runtime

WORKDIR /app

ENV NODE_ENV=production

# package.json
COPY --from=build --chown=node:node \
    /app/package.json \
    /app/package-lock.json \
    ./

# Dependencias ya preparadas para producción
COPY --from=build --chown=node:node \
    /app/node_modules \
    ./node_modules

# Código fuente
COPY --chown=node:node src ./src

USER node

EXPOSE 3000

CMD ["node", "src/main.js"]
