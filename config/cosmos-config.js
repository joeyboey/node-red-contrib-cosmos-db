module.exports = function (RED) {
    function CosmosConfigNode(n) {
        RED.nodes.createNode(this, n);
        this.name = n.name;
        this.endpoint = n.endpoint;
        this.key = n.key;

        const endpoint = this.endpoint;
        const key = this.key;
        const CosmosClient = require("@azure/cosmos").CosmosClient;
        this.client = new CosmosClient({ endpoint, key });

        this.client.getReadEndpoint().then(endpoint => {
            this.warn(`Connected to Azure Cosmos DB instance at: ${endpoint}`);
        })


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