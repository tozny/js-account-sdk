export type RealmGroupAttributes = { [prop: string]: any }

/**
 * Information about a group in an identity realm.
 */
class Group {
  id: string
  name: string
  path: string
  attributes?: RealmGroupAttributes
  subGroups: string[]
  constructor(id: string, name: string, path: string, attributes: RealmGroupAttributes, subGroups: string[]) {
    this.id = id
    this.name = name
    this.path = path
    this.attributes = attributes
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
   *   attributes: { key1: 'value1' },
   *   sub_groups: []
   * })
   * <code>
   *
   * @param {object} json
   *
   * @return {<Group>}
   */
  static decode(json: ToznyAPIGroup): Group {
    const attributes = transformAttributes(json.attributes || {})

    return new Group(json.id, json.name, json.path, attributes, json.subGroups || [])
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

// transformAttributes converts from single element array to string
// { key1: ['value1']} becomes { key1: 'value1' }
function transformAttributes(apiAttributes: any): RealmGroupAttributes {
  const attributes: RealmGroupAttributes = {}
  for (const [key, value] of Object.entries(apiAttributes || {})) {
    attributes[key] = apiAttributes[key][0]
  }
  return attributes
}

export default Group
