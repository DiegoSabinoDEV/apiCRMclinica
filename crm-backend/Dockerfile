FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
COPY . .
    RUN npx prisma generate
    RUN npm install --save-dev @types/bcryptjs
    RUN npm run build
    RUN mkdir -p uploads
RUN npm run build
RUN mkdir -p uploads

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
