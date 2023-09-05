# fortuna-explorer

## Backend
```
cd backend
venv/bin/flask --debug run
```

## Frontend
``` 
cd frontend
npm run start
```

## Nginx conf
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