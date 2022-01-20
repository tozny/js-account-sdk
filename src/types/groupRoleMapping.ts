import Role, { ToznyAPIRole } from './role'

type RolesByClient = Record<string, Role[]>

/**
 * An object representing the realm & client roles to which a particular realm group maps.
 */
class GroupRoleMapping {
  /** Realm roles to which the group maps. */
  realm: Role[]
  /** A map of client names to roles to which this group maps. */
  client: RolesByClient
  constructor(realmRoles: Role[], rolesByClient: RolesByClient) {
    this.realm = realmRoles
    this.client = rolesByClient
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
  static decode(json: ToznyAPIGroupRoleMapping): GroupRoleMapping {
    const realmRoles = GroupRoleMapping._decodeRoles(json.realm)

    const rolesByClient: RolesByClient = {}
    const clientNames = Object.keys(json.client)
    clientNames.forEach((clientName) => {
      rolesByClient[clientName] = this._decodeRoles(json.client[clientName])
    })

    return new GroupRoleMapping(realmRoles, rolesByClient)
  }

  /**
   * decodes a list of role objects into the correct type
   */
  static _decodeRoles(roles: ToznyAPIRole[]): Role[] {
    return roles.map(Role.decode)
  }
}

export type ToznyAPIGroupRoleMapping = {
  realm: ToznyAPIRole[]
  client: Record<string, ToznyAPIRole[]>
}

export default GroupRoleMapping
