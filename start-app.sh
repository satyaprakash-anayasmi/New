#!/bin/sh

# Log the initial URL (masking password)
MASKED_URL=$(echo $SPRING_DATASOURCE_URL | sed 's/:[^:@]*@/:****@/')
echo "Starting application with Source URL: $MASKED_URL"

# Robust conversion from postgres(ql):// to jdbc:postgresql://
# Format: postgresql://user:password@host/dbname
# To: jdbc:postgresql://host/dbname?user=user&password=password

# Extract parts using specialized regex
DB_USER=$(echo $SPRING_DATASOURCE_URL | sed -n 's|.*//\([^:]*\):.*|\1|p')
DB_PASS=$(echo $SPRING_DATASOURCE_URL | sed -n 's|.*//[^:]*:\([^@]*\)@.*|\1|p')
DB_HOST_DB=$(echo $SPRING_DATASOURCE_URL | sed -n 's|.*@\([^?]*\).*|\1|p')

# Build the perfect JDBC URL
FIXED_URL="jdbc:postgresql://${DB_HOST_DB}?user=${DB_USER}&password=${DB_PASS}&sslmode=require"

# Masked log for safety
MASKED_FIXED="jdbc:postgresql://${DB_HOST_DB}?user=${DB_USER}&password=****&sslmode=require"
echo "Reformatted JDBC URL: $MASKED_FIXED"

# Run the app
exec java -jar app.jar --spring.profiles.active=prod --spring.datasource.url="$FIXED_URL"
