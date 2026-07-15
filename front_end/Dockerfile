# Stage 1: Build the React application
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend source code
COPY . .

# Build the app (this creates the production-ready files in the /build directory)
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy the compiled static files from the build stage into Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Cloud Run dynamically assigns a port via the $PORT environment variable.
# This command forces Nginx to listen on that specific port instead of the default port 80.
CMD sed -i -e 's/listen       80;/listen       '"$PORT"';/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'