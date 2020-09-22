module.exports = function (RED) {
    function CosmosReadResourceTokenNode(n) {
        RED.nodes.createNode(this, n);
        var node = this;
        const configNode = RED.nodes.getNode(n.config);

        node.client = configNode.client.database(n.database);

        function getValue(st, obj) {
            return st.replace(/\[([^\]]+)]/g, '.$1').split('.').reduce(function (o, p) {
                return o[p];
            }, obj);
        }

        node.on('input', function (msg) {
            msg.permission = {
                id: msg.payload.permission.id,
                permissionMode: msg.payload.permission.permissionMode ? msg.payload.permission.permissionMode : "read",
                resource: node.client.container(msg.payload.permission.container ? msg.payload.permission.container : n.container).url
            };

            msg.payload.permission.resourcePartitionKey ? msg.permission.resourcePartitionKey = msg.payload.permission.resourcePartitionKey : null;

            let oid = getValue(n.userKey, msg);

            n.exposeAPI ? msg.cosmos = node.client : null;

            if (oid !== "") {
                node.client.user(oid).permission(msg.permission.id).read().then(p => {
                    msg.payload.permission = p.resource;
                    delete msg.permission;
                    node.send(msg);
                })
                    .catch(e => {
                        node.warn(Object.values(e));
                        if (e.substatus == 1003) {
                            node.warn(`User does not exist!`);
                            msg.permissionError = "noUser";
                            node.send(msg);
                        } else if (e.code == 404 && typeof e.substatus === "undefined") {
                            node.warn(`Permission does not exist!`);
                            msg.permissionError = "noPermission";
                            node.send(msg);
                        } else {
                            node.error(`Something went wrong!\n${e.substatus}\n${e.body.message}`);
                            throw Error;
                        }
                });
            } else {
                node.error(`No user found in msg.${n.userKey} property.`)
                throw SyntaxError
            }
        });
    }
    RED.nodes.registerType("cosmos-get-resource-token", CosmosReadResourceTokenNode);
}