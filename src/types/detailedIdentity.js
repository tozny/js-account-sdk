const Group = require('./group').default
const GroupRoleMapping = require('./groupRoleMapping').default

/**
 * Detailed information about a registered Identity for a Tozny realm.
 */
class DetailedIdentity {
  constructor(
    id,
    username,
    email,
    firstName,
    lastName,
    active,
    federated,
    roles,
    groups,
    attributes,
    tozny_id
  ) {
    this.id = id
    this.toznyId = tozny_id
    this.username = username
    this.email = email
    this.firstName = firstName
    this.lastName = lastName
    this.active = active
    this.federated = federated
    this.roles = roles
    this.groups = groups
    this.attributes = attributes
  }

  /**
   * Specify how an already unserialized JSON array should be marshaled into
   * an object representation.
   *
   * <code>
   * identity = DetailedIdentity::decode({
   *   id: '00000000-0000-0000-0000-000000000000',
   *   tozny_id: '00000000-0000-0000-0000-000000000000',
   *   name: 'jsmith',
   *   email: 'jsmith@example.com'
   *   first_name: 'John',
   *   lsat_name: 'Smith',
   *   active: true,
   *   federated: false,
   *   roles: {
   *     realm: [
   *       {
   *         id: '00000000-0000-0000-0000-000000000000',
   *         name: 'exampleRealmRole',
   *         description: 'this role provides access to...',
   *         composite: false,
   *         client_role: false,
   *         container_id: '00000000-0000-0000-0000-000000000000'
   *       }
   *     ],
   *     client: {
   *       account: [
   *         {
   *           id: '00000000-0000-0000-0000-000000000000',
   *           name: 'exampleClientRole',
   *           description: 'this role provides access to...',
   *           composite: false,
   *           client_role: true,
   *           container_id: '00000000-0000-0000-0000-000000000000'
   *         }
   *       ]
   *     }
   *   },
   *   groups: [
   *     {
   *       id: '00000000-0000-0000-0000-000000000000',
   *       name: 'exampleGroup',
   *       path: '/exampleGroup',
   *       subGroups: []
   *     }
   *   ],
   *   attributes: {
   *     name: ['value 1', 'value 2']
   *   }
   * })
   * <code>
   *
   * @param {object} json
   *
   * @return {DetailedIdentity}
   */
  static decode(json) {
    return new DetailedIdentity(
      json.subject_id,
      json.username,
      json.email,
      json.first_name,
      json.last_name,
      json.active,
      json.federated,
      GroupRoleMapping.decode(json.roles),
      Array.isArray(json.groups) ? json.groups.map(Group.decode) : [],
      typeof json.attributes === 'object' ? json.attributes : {},
      json.tozny_id
    )
  }
}

module.exports = DetailedIdentity
