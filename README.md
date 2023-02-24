# backend
`yarn` to install deps

`node init_db.mjs` to init db

`node .` to run server
## before pushing
* make sure you did not add any unintended files
* make sure you did not blow up the db
## how to "test"
Register a user:
```bash
curl -i "http://127.0.0.1:3000/register" -H "content-type: application/json" --data "{\"email\": \"user@example.com\",\"password\":\"mypass\"}"
```
Get auth tok:
```bash
curl "http://127.0.0.1:3000/auth" -H "content-type: application/json" --data "{\"email\": \"user@example.com\",\"password\":\"mypass\"}"
```
