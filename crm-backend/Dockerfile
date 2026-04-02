FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm install --save-dev @types/bcryptjs
RUN npx prisma generate
RUN npm run build
RUN mkdir -p uploads

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
