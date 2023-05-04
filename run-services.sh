#!/bin/sh

# Start the Go server
cd /app/backend && ./main &

# Start the Next.js server
cd /app/frontend && npm run start
