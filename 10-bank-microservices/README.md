PASOS
--------------------------------------------------
- Subir a repositorios el codigo 
--------------------------------------------------
- Crear máquina virtual en google cloud 
bank-microservices-instance
- Configurar firewall para que me abra los puertos 8000, 8001, 8002, 3306, 8080, 3000, 3001, 3002,5000,5001,5002 
bank-firewall


--------------------------------------------------
- Abrir SSH

--------------------------------------------------
- Instalar git (listo)

sudo apt-get update
sudo apt-get install git -y

--------------------------------------------------

- Instalar docker (listo)

# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo docker run hello-world
--------------------------------------------------

- Clonar repositorio (listo)

git clone https://github.com/AxelAV95/NodeJS.git

--------------------------------------------------
- Entrar al directorio (listo)
cd NodeJS
cd 10-bank-microservices
--------------------------------------------------
- Revisar los comandos que voy a necesitar para docker compose

sudo apt-get update
sudo apt-get install docker-compose
--------------------------------------------------

- Correr el docker-compose.yml 
docker-compose up -d
docker-compose ps
docker-compose down

sudo docker-compose logs user-service
sudo docker-compose logs account-service
sudo docker-compose logs envelope-service
sudo docker-compose logs db

--------------------------------------------------
- Importar el backup en phpmyadmin
--------------------------------------------------
- Hacer pruebas API con Postman u otras herramientas
--------------------------------------------------