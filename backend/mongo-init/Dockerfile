FROM mongo:7

COPY mongo-init/keyfile /etc/mongo/keyfile
COPY mongo-init/entrypoint.sh /usr/local/bin/custom-entrypoint.sh
COPY mongo-init/init-replicaset.sh /docker-entrypoint-initdb.d/init-replicaset.sh

RUN chown mongodb:mongodb /etc/mongo/keyfile && \
    chmod 400 /etc/mongo/keyfile && \
    chmod +x /usr/local/bin/custom-entrypoint.sh && \
    chmod +x /docker-entrypoint-initdb.d/init-replicaset.sh

ENTRYPOINT ["custom-entrypoint.sh"]
