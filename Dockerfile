# ── Stage 1: build the React client ──────────────────────────────────────────
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# ── Stage 2: install server production deps ──────────────────────────────────
FROM node:20-alpine AS server-deps
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev

# ── Stage 3: runtime ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime
ENV NODE_ENV=production
ENV SERVE_CLIENT=true
ENV PORT=8787
WORKDIR /app

# Run as the built-in non-root "node" user.
COPY --chown=node:node server/ ./server/
COPY --from=server-deps --chown=node:node /app/server/node_modules ./server/node_modules
COPY --from=client-build --chown=node:node /app/client/dist ./client/dist

USER node
EXPOSE 8787

# Lightweight container healthcheck against the API.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:'+(process.env.PORT||8787)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server/src/index.js"]
