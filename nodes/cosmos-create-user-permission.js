module.exports = function (RED) {
    function CosmosCreateUserPermissionNode(n) {
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

            let permission = getValue(n.permissionObject, msg)
            let oid = getValue(n.userKey, msg);

            n.onlyReadOverwrite ? permission.permissionMode = "read" : null;

            n.exposeAPI ? msg.cosmos = node.client : null;

            if (msg.permissionError === "noUser") {
                node.client.users.create({ id: oid }).then(u => {
                    node.warn(`User created!\n${JSON.stringify(u.resource)}`);
                    node.client.user(oid).permissions.create(permission).then(p => {
                        node.warn(`Permission created!\n${JSON.stringify(p.resource)}`);
                        msg.payload = { permission: p.resource };
                        node.send(msg);
                    })
                        .catch(e => node.error(e))
                })
                    .catch(e => node.error(e));
            } else if (msg.permissionError === "noPermission") {
                node.client.user(oid).permissions.create(permission).then(p => {
                    msg.payload = { permission: p.resource };
                    node.send(msg);
                })
                    .catch(e => node.error(e))
            } else {
                node.client.user(oid).permission(permission.id).replace(permission).then(p => {
                    msg.payload = { permission: p.resource };
                    node.send(msg);
                })
                    .catch(e => node.error(e))
            }
        });
    }
    RED.nodes.registerType("cosmos-create-user-permission", CosmosCreateUserPermissionNode);
}