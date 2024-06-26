#!/bin/bash
client=$(docker run --rm \
    --network ory-hydra-net \
    oryd/hydra:v2.2.0 \
    create client --skip-tls-verify \
    --name testclient \
    --secret some-secret \
    --grant-type authorization_code \
    --response-type token,code,id_token \
    --scope openid \
    --redirect-uri http://localhost:4200/api/auth/callback/siwt \
    -e http://hydra:4445 \
    --format json )

echo $client

client_id=$(echo $client | jq -r '.client_id')

docker run --rm \
    --network ory-hydra-net \
    -p 9010:9010 \
    oryd/hydra:v2.2.0 \
    perform authorization-code --skip-tls-verify \
    --port 9010 \
    --client-id $client_id \
    --client-secret some-secret \
    --redirect http://localhost:4200/api/auth/callback/siwt \
    --scope openid \
    --auth-url http://localhost:5004/oauth2/auth \
    --token-url http://hydra:4444/oauth2/token \
    -e http://hydra:4444
