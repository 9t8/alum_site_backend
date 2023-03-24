# backend
`npm i` to install deps.

create a `.env` file with the following contents:
```bash
DB_PATH=db.db3
ESSO_SECRET=DEVELOPMENT_AND_TESTING # so we can share the db for now
BACKEND_PORT=9999 # you may change this
```

run `database/reset.mjs` to create nessecary tables.

"Run and Debug" in VS Code to run server.

install [thunder client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client) for testing the api. you should be able to find some sample queries.
* enable `thunder-client.saveToWorkspace`.

before pushing, make sure you did not add any unintended files, especially secrets.

## warnings
**on live servers, use a KMS or something to properly store `env.ESSO_KEY`.** `require('crypto').randomBytes(258).toString('base64');` in the node repl seems to generate a good key.

code is mostly untested.

don't put sensitive/important/large data in the db.

## useful extensions
[sqlite3 editor](https://marketplace.visualstudio.com/items?itemName=yy0931.vscode-sqlite3-editor) for viewing and manipulating the db (requires python installation).
