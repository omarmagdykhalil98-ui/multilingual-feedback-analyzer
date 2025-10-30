# --- Build Stage ---
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# --- Serve Stage ---
FROM node:22-alpine AS production

WORKDIR /app

RUN npm install -g serve
COPY --from=build /app/dist .

EXPOSE 3000
CMD ["serve", "-s", ".", "-l", "3000"]