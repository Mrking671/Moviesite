FROM node:18 as builder

WORKDIR /app
COPY server/package*.json ./
RUN npm install

COPY client/package*.json ./client/
RUN cd client && npm install

COPY . .
RUN cd client && npm run build

FROM node:18
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/client/dist ./public
COPY server .

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "index.js"]
