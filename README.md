# backend
`yarn` to install deps

run `db/reset_*.mjs` to create nessecary tables

"Run and Debug" in VS Code to run server. server will run on `${BACKEND_PORT}` if such environment variable exists

install [thunder client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client) for testing the api (todo postman?)
* enable `thunder-client.saveToWorkspace`
## before pushing
make sure you did not
* add any unintended files, especially secrets
* blow up the db
## warnings
db is for sharing tests only; don't put sensitive/important/large data in it

code is mostly untested
## useful extensions
[sqlite3 editor](https://marketplace.visualstudio.com/items?itemName=yy0931.vscode-sqlite3-editor) for viewing and manipulating the db (depends on python installation)
