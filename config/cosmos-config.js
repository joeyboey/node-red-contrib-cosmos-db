module.exports = function (RED) {
    function CosmosConfigNode(n) {
        RED.nodes.createNode(this, n);

        const endpoint = n.endpoint;
        const key = n.key;
        const CosmosClient = require("@azure/cosmos").CosmosClient;
        
        this.name = n.name;
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