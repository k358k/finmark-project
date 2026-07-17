#!/bin/bash
set -e

# Fix keyfile permissions (Swarm may change them)
chmod 400 /etc/mongo/keyfile 2>/dev/null || true

# Run the original entrypoint with our args
exec docker-entrypoint.sh mongod --replSet rs0 --keyFile /etc/mongo/keyfile
