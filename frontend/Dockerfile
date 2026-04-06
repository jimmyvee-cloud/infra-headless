FROM node:20-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
