module.exports = function (RED) {
    function CosmosConfigNode(n) {
        RED.nodes.createNode(this, n);

        const SqlString = require('sqlstring');

        const endpoint = n.endpoint;
        const key = n.key;
        const CosmosClient = require("@azure/cosmos").CosmosClient;

        this.SqlString = SqlString;

        this.name = n.name;
        this.client = new CosmosClient({ endpoint, key });

        this.client.getReadEndpoint().then(endpoint => {
            this.warn(`Connected to Azure Cosmos DB instance at: ${endpoint}`);
        })

        this.formatSQLString = (query, params) => {
            try {
                const re = /\?[\S]+/g;
                const _params = query.match(re).map(e => e.replace("?", ""));

                let preparedParameters = [];

                if (_params.length <= Object.keys(params).length) {
                    _params.forEach(e => {
                        e in params ? preparedParameters.push(params[e]) : node.error(`Key: "${e}" not found in query!`)
                    });
                    return { query: query.replace(re, "?"), params: preparedParameters }
                } else {
                    node.error("Parameters in query and msg.params do not have the same length!")
                }
            } catch (TypeError) {
                this.error(`No variables declared in query:\n${query}`);
                throw TypeError;
            }
        }


        this.on('close', function (removed, done) {
            if (removed) {
                // This node has been disabled/deleted
            } else {
                // This node is being restarted
            }
            done();
        });
    }
    RED.nodes.registerType("cosmos-config", CosmosConfigNode);
}