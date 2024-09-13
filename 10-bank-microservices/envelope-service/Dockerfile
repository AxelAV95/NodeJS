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

# Copiar el script wait-for-it.sh al contenedor
COPY wait-for-it.sh /usr/src/app/wait-for-it.sh

# Hacer que el script wait-for-it.sh sea ejecutable
RUN chmod +x /usr/src/app/wait-for-it.sh

# Exponer el puerto en el que la aplicación escucha
EXPOSE 3002

# Comando para ejecutar la aplicación usando wait-for-it.sh
CMD ["sh", "-c", "/usr/src/app/wait-for-it.sh db 3306 node index.js"]