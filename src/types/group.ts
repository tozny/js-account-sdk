/**
 * Information about a group in an identity realm.
 */
class Group {
  id: string
  name: string
  path: string
  subGroups: string[]
  constructor(id: string, name: string, path: string, subGroups: string[]) {
    this.id = id
    this.name = name
    this.path = path
    this.subGroups = subGroups
  }

  /**
   * Specify how an already unserialized JSON array should be marshaled into
   * an object representation.
   *
   * <code>
   * identity = Group::decode({
   *   id: '00000000-0000-0000-0000-000000000000',
   *   name: 'exampleGroup',
   *   path: '/exampleGroup',
   *   sub_groups: []
   * })
   * <code>
   *
   * @param {object} json
   *
   * @return {<Group>}
   */
  static decode(json: ToznyAPIGroup): Group {
    return new Group(json.id, json.name, json.path, json.subGroups || [])
  }
}

export type ToznyAPIGroup = {
  id: string
  name: string
  path: string
  attributes: Record<string, string>
  // NOTE: go client indeed returns camelCase here. keeping separate type definitions regardless.
  subGroups?: string[]
}

export default Group
