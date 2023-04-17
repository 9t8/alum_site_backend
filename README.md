as of 2023-04-17, everything here besides tests is in [gunn-alumni/gunn-alumni](https://github.com/gunn-alumni/gunn-alumni). this repo is no longer needed.

# backend
`npm i` to install deps.

create a `.env` file with the following contents:
```bash
DB_PATH=store.db3
ESSO_SECRET=DEVELOPMENT_AND_TESTING # so we can share the db for now
BACKEND_PORT=9999 # you may change this
```

run `reset_db.mjs` to create nessecary tables.

"Run and Debug" in VS Code to run server.

install [the eslint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint); try not to add new squiggles.

install [thunder client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client) for testing the api. restart code, and you should find some sample queries.

before pushing, make sure you did not add any unintended files, especially secrets.

## warnings
**on live servers, use a KMS or something to properly store `env.ESSO_KEY`.** `require('crypto').randomBytes(258).toString('base64');` in the node repl seems to generate a good key.

do not put sensitive/important/large data in the db.

## useful extensions
[sqlite3 editor](https://marketplace.visualstudio.com/items?itemName=yy0931.vscode-sqlite3-editor) for viewing and manipulating the db (requires python installation).
