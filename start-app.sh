#!/bin/sh

# Log the initial URL (masking password)
# FORCE use of internal pieces and IGNORE any external URL
echo "Bypassing external Render URL and forcing internal connection..."
FIXED_URL="jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}?user=${DB_USER}&password=${DB_PASS}&sslmode=require"

# Masked log for safety
echo "Forcing JDBC URL to Internal Host: ${DB_HOST}"

# Run the app
exec java -jar app.jar --spring.profiles.active=prod --spring.datasource.url="$FIXED_URL"
