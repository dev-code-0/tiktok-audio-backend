# Usa una imagen base de Node.js
FROM node:18

# Instala Python, ffmpeg y otras herramientas necesarias
RUN apt-get update && \
    apt-get install -y ffmpeg python3 python3-pip && \
    ln -s /usr/bin/python3 /usr/bin/python

# Crear directorio de la aplicación
WORKDIR /app

# Copiar archivos del proyecto
COPY package*.json ./
RUN npm install
COPY . .

# Exponer el puerto que utiliza la aplicación
EXPOSE 5000

# Comando para correr la aplicación
CMD ["node", "server.js"]