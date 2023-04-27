# Build the Go backend
FROM golang:1.20 AS go-builder
WORKDIR /app/backend
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend ./
RUN go build -o main .

# Build the Next.js frontend
FROM node:16 AS next-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend ./
RUN npm run build

# Final image to run both services
FROM debian:buster-slim
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy Go backend binary
COPY --from=go-builder /app/backend/main /app/backend/main
COPY --from=go-builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt

# Copy Next.js frontend build
COPY --from=next-builder /app/frontend /app/frontend

# Install node and serve
RUN apt-get update && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs && \
    apt-get remove -y curl && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# Expose the ports for both services
EXPOSE 3000 8000

# Run both services concurrently using a shell script
COPY run-services.sh /app/run-services.sh
RUN chmod +x /app/run-services.sh
CMD ["/app/run-services.sh"]