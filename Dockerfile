FROM node:18

WORKDIR /app
COPY server/package*.json ./
RUN npm install

COPY client/package*..json ./client/
RUN cd client && npm install

COPY . .
RUN cd client && npm run build

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server/index.js"]
