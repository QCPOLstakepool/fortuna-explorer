# fortuna-explorer

[Fortuna Explorer](https://fortuna-explorer.stakepool.quebec/) is an explorer website for the PoW smart contract based token $TUNA on Cardano.

## Configuration
### Oura (1.8.3)
```
[source]
type = "N2C"
address = ["Unix", "/home/relay/cardano-my-node/db/socket"]
magic = "mainnet"
min_depth = 6

[source.intersect]
type = "Point"
value = [101511155, "b019548e41b55ae702fee37d8b9ae716c978712c02bc4862ba13db6602e5af72"]

[source.mapper]
include_transaction_details = true

[cursor]
type = "File"
path = "/home/relay/oura/cursor"

[[filters]]
type = "Selection"

[filters.check]
predicate = "policy_equals"
argument = "279f842c33eed9054b9e3c70cd6a3b32298259c24b78b895cb41d91a"

[sink]
type = "Webhook"
url = "http://127.0.0.1:5001/api/blocks"
timeout = 30000
error_policy = "Exit"

[sink.retry_policy]
max_retries = 5
backoff_unit =  5000
backoff_factor = 2
max_backoff = 100000
```

### Oura Sinks Database
```
cd oura-sinks
python3.9 ../backend/init_database.py
```

## Nginx (1.24.0)
```
server {
    listen       8080;
    server_name  localhost;

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }

    location /api {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Run
### Oura Sinks
```
cd oura-sinks
venv/bin/flask run --port 5001 --debug
```

### Backend
```
cd backend
venv/bin/flask run --port 5000 --debug
```

### Frontend
``` 
cd frontend
npm run start
```
