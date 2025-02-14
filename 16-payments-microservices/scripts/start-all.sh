#!/bin/bash

# Iniciar todos los servicios
docker-compose up -d

# Mostrar logs de los servicios
docker-compose logs -f