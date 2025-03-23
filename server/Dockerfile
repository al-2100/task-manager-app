FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
# Instalar dependencias de compilación para módulos nativos (como bcrypt)
RUN apk add --no-cache python3 make g++
RUN npm install --production
# Forzar recompilación de bcrypt para garantizar la compatibilidad con Alpine
RUN npm rebuild bcrypt --build-from-source
COPY . .
# Generar los clientes de Prisma necesarios para conectarse a la base de datos
RUN npx prisma generate
EXPOSE 5000
# Command moved to docker-compose.yml to ensure migrations run before the app starts
CMD ["npm", "start"]
