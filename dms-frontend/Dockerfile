# Build Stage
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration=production

# Run Stage
FROM nginx:alpine
COPY --from=build /app/dist/dms-frontend/browser /usr/share/nginx/html
# Copy custom nginx config if needed, otherwise use default
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
