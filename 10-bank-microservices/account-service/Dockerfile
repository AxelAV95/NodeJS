# Usar una imagen base de Node.js versión 20.12.1
FROM node:20.12.1

# Establecer el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar los archivos package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de los archivos de la aplicación
COPY . .

# Exponer el puerto en el que la aplicación escucha
EXPOSE 3001

# Comando para ejecutar la aplicación
CMD ["node", "index.js"]