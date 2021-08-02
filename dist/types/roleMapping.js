"use strict";
const Role = require('./role').default;
/**
 * A full set of roles for a realm and client applications in the realm.
 */
class RoleMapping {
    constructor(realm, clients) {
        this.realm = realm;
        this.clients = clients;
    }
    /**
     * Specify how an already unserialized JSON array should be marshaled into
     * an object representation.
     *
     * <code>
     * role = RoleMapping::decode({
     *   realm: [
     *     {
     *       id: '00000000-0000-0000-0000-000000000000',
     *       name: 'exampleRealmRole',
     *       description: 'this role provides access to...',
     *       composite: false,
     *       client_role: false,
     *       container_id: '00000000-0000-0000-0000-000000000000'
     *     }
     *   ],
     *   client: {
     *     account: [
     *       {
     *         id: '00000000-0000-0000-0000-000000000000',
     *         name: 'exampleClientRole',
     *         description: 'this role provides access to...',
     *         composite: false,
     *         client_role: true,
     *         container_id: '00000000-0000-0000-0000-000000000000'
     *       }
     *     ]
     *   }
     * })
     * <code>
     *
     * @param {object} json
     *
     * @return {<RoleMapping>}
     */
    static decode(json) {
        const realm = RoleMapping._decodeRoles(json.realm);
        const client = {};
        if (typeof json.client === 'object') {
            for (let name in json.client) {
                client[name] = RoleMapping._decodeRoles(json.client[name]);
            }
        }
        return new RoleMapping(realm, client);
    }
    /**
     * decodes a list of role objects into the correct type
     * @param {Array} roles The list of JSON serialized roles
     * @return {Array<Role>} The list of role objects
     *
     */
    static _decodeRoles(roles) {
        return Array.isArray(roles) ? roles.map(Role.decode) : [];
    }
}
module.exports = RoleMapping;
