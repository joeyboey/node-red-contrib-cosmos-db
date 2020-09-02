module.exports = function (RED) {
    function CosmosSQLReadNode(n) {
        RED.nodes.createNode(this, n);
        var node = this;
        const configNode = RED.nodes.getNode(n.config);

        node.client = configNode.client;
        node.SqlString = configNode.SqlString;

        if (node.client) {
            node.container = node.client.database(n.database).container(n.container);
        }

        node.on('input', function (msg) {
            if (msg.params) {
                const { query, params } = configNode.formatSQLString(n.query, msg.params);
                msg.topic = node.SqlString.format(query, params);
            } else {
                msg.topic = n.query === "" ? msg.topic : n.query;
            }
            if (msg.topic !== "") {
                node.container.items
                    .query({ query: msg.topic })
                    .fetchAll()
                    .then(items => {
                        n.relayPayload ? msg.initialPayload = msg.payload : null;

                        msg.payload = items;

                        n.exposeAPI ? msg.cosmos = node.container : null;

                        node.send(msg);
                    })
                    .catch(e => {
                        node.error(`Something went wrong while processing the query.\nNote that only values can be replaced with prepared statements, not table or variable names!\n\n${msg.topic}`)
                        throw Error
                    });
            } else {
                node.error("No query specified in msg.topic or node configuration!")
                throw SyntaxError
            }
        });
    }
    RED.nodes.registerType("cosmos-sql-read", CosmosSQLReadNode);
}