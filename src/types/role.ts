/**
 * A defined role which provides permissions in a realm.
 */
class Role {
  id: string
  name: string
  description: string
  composite?: boolean
  clientRole?: boolean
  containerId?: string

  constructor(
    id: string,
    name: string,
    description: string,
    composite?: boolean,
    clientRole?: boolean,
    containerId?: string
  ) {
    this.id = id
    this.name = name
    this.description = description
    this.composite = composite
    this.clientRole = clientRole
    this.containerId = containerId
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
  static decode(json: ToznyAPIRole): Role {
    return new Role(
      json.id,
      json.name,
      json.description,
      json.composite,
      json.client_role,
      json.container_id
    )
  }
}

export type ToznyAPIRole = {
  id: string
  name: string
  description: string
  composite?: boolean
  client_role?: boolean
  container_id?: string
}
type RoleData = {
  id: string
  name: string
  description: string
  composite?: boolean
  clientRole?: boolean
  containerId?: string
}

export type MinimumRoleData = { name: string; description: string }
export type MinimumRoleWithId = { id: string } & MinimumRoleData

export function roleToAPI({
  id,
  name,
  description,
  composite,
  clientRole,
  containerId,
}: RoleData): ToznyAPIRole {
  return {
    id,
    name,
    description,
    composite,
    client_role: clientRole,
    container_id: containerId,
  }
}
export default Role
