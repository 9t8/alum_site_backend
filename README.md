# backend
`npm install` to install deps.

create a `.env` file with the following contents:
```bash
DB_PATH=db.db3
BACKEND_PORT=9999 # you may change this
```

run `db/reset_*.mjs` to create nessecary tables.

"Run and Debug" in VS Code to run server.

install [thunder client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client) for testing the api. you should be able to find some sample queries.
* enable `thunder-client.saveToWorkspace`.

before pushing, make sure you did not add any unintended files, especially secrets.

## warnings
db is for sharing tests only; don't put sensitive/important/large data in it.

code is mostly untested.

## useful extensions
[sqlite3 editor](https://marketplace.visualstudio.com/items?itemName=yy0931.vscode-sqlite3-editor) for viewing and manipulating the db (depends on python installation).
