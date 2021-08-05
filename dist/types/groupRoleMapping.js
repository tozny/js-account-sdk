"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const role_1 = __importDefault(require("./role"));
/**
 * An object representing the realm & client roles to which a particular realm group maps.
 */
class GroupRoleMapping {
    constructor(realmRoles, rolesByClient) {
        this.realm = realmRoles;
        this.client = rolesByClient;
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
     */
    static decode(json) {
        const realmRoles = GroupRoleMapping._decodeRoles(json.realm);
        const rolesByClient = {};
        const clientNames = Object.keys(json.client);
        clientNames.forEach(clientName => {
            rolesByClient[clientName] = this._decodeRoles(json.client[clientName]);
        });
        return new GroupRoleMapping(realmRoles, rolesByClient);
    }
    /**
     * decodes a list of role objects into the correct type
     */
    static _decodeRoles(roles) {
        return roles.map(role_1.default.decode);
    }
}
exports.default = GroupRoleMapping;
