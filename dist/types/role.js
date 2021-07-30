"use strict";
/**
 * A defined role which provides permissions in a realm.
 */
class Role {
    constructor(id, name, description, composite, clientRole, containerId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.composite = composite;
        this.clientRole = clientRole;
        this.containerId = containerId;
    }
    /**
     * Specify how an already unserialized JSON array should be marshaled into
     * an object representation.
     *
     * <code>
     * role = Role::decode({
     *   id: '00000000-0000-0000-0000-000000000000',
     *   name: 'jsmith',
     *   description: 'This role provides access to...'
     *   composite: false',
     *   client_role: trie,
     *   container_id: '00000000-0000-0000-0000-000000000000',
     * })
     * <code>
     *
     * @param {object} json
     *
     * @return {<Role>}
     */
    static decode(json) {
        return new Role(json.id, json.name, json.description, json.composite, json.client_role, json.container_id);
    }
}
module.exports = Role;
