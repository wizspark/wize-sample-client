#!/bin/bash
cat > dist/@local-srv/config.dev.json  << EOF
{
  "host":"${HOST_APIURL}",
  "auth0Options":{
    "clientId":"${AUTH0_CLIENTID}",
    "domain":"${AUTH0_DOMAIN}"
  }
}
EOF
cp dist/@local-srv/config.dev.json dist/@local-srv/config.prod.json
cp dist/@local-srv/config.dev.json dist/@local-srv/config.qa.json
