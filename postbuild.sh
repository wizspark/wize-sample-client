#!/bin/bash
cat > dist/@local-srv/config.json  << EOF
{
  "host":"${HOST_APIURL}",
  "auth0Options":{
    "clientId":"${AUTH0_CLIENTID}",
    "domain":"${AUTH0_DOMAIN}"
  }
}
EOF
