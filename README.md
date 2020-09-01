# node-red-contrib-cosmos-db

[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]
[![Node.js Version][node-image]][node-url]

Custom Nodes for [Node RED](https://nodered.org) to allow basic operations
against an Azure Cosmos DB.

The add-on is still in early development and the functionality will be enhanced
over time.

## Installation

Right now there are to available options to install Node RED add-ons.

### Via the Web-Interface

1. Open the menu in the upper right corner
2. Choose **Manage Palette**
3. Under **Install**, search for: *node-red-contrib-cosmos-db*

### Via the command line

1. Navigate to your Node RED user directory, usally `$HOME/.node-red`
2. Run the following command:

```shell
npm install node-red-contrib-cosmos-db
```

## Usage

Right now the is just a single Node implemented, but this will change with
upcoming versions.

### Config Node

Before using any nodes you have to configure your Database. For that you have
the option to create config nodes from within the normal nodes.

You only need 2 parameters from your Cosmos Database:

1. Your endpoint, usally something like this: `https://[instance-name].documents.azure.com:443/`
2. The primary key, which is found under the **Keys** Tab in the Azure console.

### SQL Node

The SQL Node is used to perform read operations against a specified container.
The query can be set by:

1. The `msg.topic` parameter
2. The included text editor within the node.

The second option will always override any topic that was specified beforehand.

`msg.topic` example:

```sql
SELECT *
FROM c
```

The reference for the SQL-Syntax can be found in the [Microsoft SQL Docs][microsoft-cosmos-sql-docs].

## License

[ISC](LICENSE)

[npm-version-image]: https://img.shields.io/npm/v/node-red-contrib-cosmos-db.svg
[npm-downloads-image]: https://img.shields.io/npm/dm/node-red-contrib-cosmos-db.svg
[npm-url]: https://npmjs.org/package/node-red-contrib-cosmos-db
[node-image]: https://img.shields.io/node/v/node-red-contrib-cosmos-db.svg
[node-url]: https://nodejs.org/en/download
[microsoft-cosmos-sql-docs]: https://docs.microsoft.com/azure/cosmos-db/sql-query-getting-started