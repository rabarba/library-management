#!/bin/sh

export PGPASSWORD="$DB_PASSWORD"

echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER"; do
  echo "PostgreSQL is unavailable - waiting..."
  sleep 2
done

echo "Checking if database exists..."


db_check=$(psql -h "$DB_HOST" -U "$DB_USER" -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'")

if [ "$db_check" != "1" ]; then
  echo "Database does not exist, creating..."
  createdb -h "$DB_HOST" -U "$DB_USER" "$DB_NAME"
else
  echo "Database already exists."
fi

echo "Generating database migrations..."
npm run migration:generate src/migrations/libraryManagement

echo "Running database migrations..."
npm run migration:run

echo "Starting server..."
npm run start
