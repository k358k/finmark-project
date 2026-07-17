#!/bin/bash
# Wait for MongoDB to be ready
until mongosh -u finmark -p finmark123 --authenticationDatabase admin --eval "db.adminCommand('ping')" --quiet 2>/dev/null; do
  sleep 2
done

# Initialize replica set (ignore error if already initialized)
mongosh -u finmark -p finmark123 --authenticationDatabase admin --eval '
  try {
    rs.status()
  } catch (e) {
    rs.initiate({
      _id: "rs0",
      members: [{ _id: 0, host: "finmark-mongo:27017" }]
    })
  }
' --quiet
