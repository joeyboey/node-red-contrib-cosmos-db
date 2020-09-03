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

---

## Usage

Right now the is just a single Node implemented, but this will change with
upcoming versions.

## Config Node

Before using any nodes you have to configure your Database. For that you have
the option to create config nodes from within the normal nodes.

You only need 2 parameters from your Cosmos Database:

1. Your endpoint, usally something like this:
   `https://[instance-name].documents.azure.com:443/`
2. The primary key, which is found under the **Keys** Tab in the Azure console.

## SQL Node

The SQL Node is used to perform read operations against a specified container.
The query can be set by:

1. The `msg.topic` parameter
2. The included text editor within the node.

The second option will always override any topic that was specified beforehand.

`msg.topic` example:

```sql
SELECT *
FROM   c
```

The reference for the SQL-Syntax can be found in the [Microsoft SQL
Docs][microsoft-cosmos-sql-docs].

### Prepared Statements

You also have the option to use prepared statements. For that the query has to
be defined in the included editor within the node. This is to prevent
SQL-Injection. Internally [sqlstring][sqlstring-npmjs] is used to properly escape values.

The node uses `?variable` in the statement, so the query should look something like this:

```sql
SELECT *
FROM   c
WHERE  c.id = ?id
  AND  c.city = ?city
```

To fill the variables you use the `msg.params` object:

```json
{
    "id": 1234,
    "city": "Berlin"
}
```

Note that this method can only be used to replace values, not table names and value names. Such a replacement cannot be safely achieved without the risk of SQL-Injection. If you need such a feature, you can always generate the required query in a function node and write it to the `msg.topic` object.

### Using the exposed API

Within the node you have the option to expose the container object, which is loosley described in the [Node.js documentation][microsoft-cosmos-node-js-docs]. This allows you to use operations like replace or delete. If the option is checked, the API will be exposed on the `msg.cosmos` property, and can be used like this:

```js
//Get the desired resource
let data = msg.payload.resources[0];
//Change whatever you like
data.city = "Berlin";
//Write the updated data to Cosmos
msg.cosmos
    .item(data.id)
    .replace(data).then(o => {
        //Then part is used to wait for the object to complete, you do not have to do this.
        msg.replacedItem = o;
        node.send(msg);
    });
```

### Relay original Payload

When updating or creating new items it is useful to keep the original payload. I
used to achieve this with a function node in front of the query node. The second
checkbox within the node allows the user to skip this step. When enabled the
original payload gets written to `msg.initialPayload`.

---

## License

[ISC](LICENSE)

[npm-version-image]: https://img.shields.io/npm/v/node-red-contrib-cosmos-db.svg
[npm-downloads-image]: https://img.shields.io/npm/dm/node-red-contrib-cosmos-db.svg
[npm-url]: https://npmjs.org/package/node-red-contrib-cosmos-db
[node-image]: https://img.shields.io/node/v/node-red-contrib-cosmos-db.svg
[node-url]: https://nodejs.org/en/download
[microsoft-cosmos-sql-docs]: https://docs.microsoft.com/azure/cosmos-db/sql-query-getting-started
[microsoft-cosmos-node-js-docs]: https://docs.microsoft.com/de-de/azure/cosmos-db/sql-api-sdk-node
[sqlstring-npmjs]: https://www.npmjs.com/package/sqlstring
