module.exports = function (RED) {
    function CosmosSQLReadNode(n) {
        RED.nodes.createNode(this, n);
        var node = this;
        const configNode = RED.nodes.getNode(n.config);

        node.client = configNode.client;

        if (node.client) {
            node.container = node.client.database(n.database).container(n.container);
        }

        node.on('input', function (msg) {
            msg.topic = n.query === "" ? msg.topic : n.query;
            if (msg.topic !== "") {
                node.container.items
                    .query({ query: msg.topic })
                    .fetchAll()
                    .then(items => {
                        msg.payload = items;
                        node.send(msg);
                    });
            } else {
                node.error("No query specified in msg.topic or node configuration!")
            }
        });
    }
    RED.nodes.registerType("cosmos-sql-read", CosmosSQLReadNode);
}