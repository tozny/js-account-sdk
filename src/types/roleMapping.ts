import Role, { ToznyAPIRole } from './role'

type ClientRoles = Record<string, Role[]>

/**
 * A full set of roles for a realm and client applications in the realm.
 */
class RoleMapping {
  realm: Role[]
  clients: ClientRoles
  constructor(realm: Role[], clients: ClientRoles) {
    this.realm = realm
    // NOTE: this is different from Tozny's API property.
    // keeping for backwards-compatibility
    this.clients = clients
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
  static decode(json: ToznyAPIRoleMapping): RoleMapping {
    const realm = RoleMapping._decodeRoles(json.realm)
    const clients: ClientRoles = {}
    if (typeof json.client === 'object') {
      for (let name in json.client) {
        clients[name] = RoleMapping._decodeRoles(json.client[name])
      }
    }
    return new RoleMapping(realm, clients)
  }

  /**
   * decodes a list of role objects into the correct type
   */
  static _decodeRoles(roles: ToznyAPIRole[]): Role[] {
    return roles.map(Role.decode)
  }
}

export type ToznyAPIRoleMapping = {
  realm: ToznyAPIRole[]
  client: Record<string, ToznyAPIRole[]>
}

export default RoleMapping
