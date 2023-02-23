# backend
`yarn` to install deps

`node init_db.mjs` to init db

`node .` to run server
## before pushing
watch the files you add and make sure you did not blow up the db
## how to "test"
Register a user and insert into db:
```bash
curl -i "http://127.0.0.1:3000/register" -H "content-type: application/json" --data "{\"email\": \"user@example.com\",\"password\":\"mypass\"}"
```
Check it's all working:
```bash
curl "http://127.0.0.1:3000/" -H "content-type: application/json" --data "{\"email\": \"user@example.com\",\"password\":\"mypass\"}"
```
