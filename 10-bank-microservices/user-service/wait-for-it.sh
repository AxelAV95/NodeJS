#!/bin/bash

# wait-for-it.sh

set -e

host="$1"
port="$2"
shift 2
cmd="$@"

until nc -z -v -w30 "$host" "$port"; do
  echo "Esperando que $host:$port esté disponible..."
  sleep 5
done

echo "$host:$port está disponible, ejecutando comando: $cmd"
exec $cmd