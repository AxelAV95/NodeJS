# Usamos una imagen base de Node.js (versión 18 slim para mantenerlo ligero)
FROM node:18-slim

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Exponemos el puerto 3000 (o el que definiste en .env)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]