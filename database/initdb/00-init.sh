#!/bin/bash
set -e

echo CREATE DATABASE ${DB_NAME};
psql -v ON_ERROR_STOP=1 --username "$DB_USER" --dbname "$DB_PASSWORD" << EOSQL
	CREATE DATABASE ${DB_NAME};
EOSQL
