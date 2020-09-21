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
            !msg.permissionType ? msg.permissionType = n.permissionType : null;

            msg.permissionType === "container" ? msg.permissionId = n.container : msg.permissionId = n.scope;

            let oid = getValue(n.userKey, msg);

            if (oid !== "") {
                node.client.user(oid).permission(msg.permissionId).read().then(p => {
                    node.warn(p);
                    msg.resourceToken = p.resource._token;
                    n.exposeAPI ? msg.cosmos = node.client : null;
                    node.send(msg);
                })
                    .catch(e => {
                        node.warn(Object.values(e));
                        if (e.substatus == 1003) {
                            node.warn(`User does not exist!`);
                            msg.cosmosError = "noUser";
                            n.exposeAPI ? msg.cosmos = node.client : null;
                            node.send(msg);
                        } else if (e.code == 404 && typeof e.substatus === "undefined") {
                            node.warn(`Permission does not exist!`);
                            msg.cosmosError = "noPermission";
                            n.exposeAPI ? msg.cosmos = node.client : null;
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