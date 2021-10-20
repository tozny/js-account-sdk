/**
 * Basic information about a registered Identity for a Tozny realm.
 */
class BasicIdentity {
  id: string
  username: string
  firstName: string
  lastName: string
  active: string
  federated: string
  email: string
  constructor(
    id: string,
    username: string,
    firstName: string,
    lastName: string,
    active: string,
    federated: string,
    email: string
  ) {
    this.id = id
    this.username = username
    this.firstName = firstName
    this.lastName = lastName
    this.active = active
    this.federated = federated
    this.email = email
  }

  /**
   * Specify how an already unserialized JSON array should be marshaled into
   * an object representation.
   *
   * <code>
   * identity = BasicIdentity::decode({
   *   id: '00000000-0000-0000-0000-000000000000',
   *   name: 'jsmith',
   *   first_name: 'John',
   *   lsat_name: 'Smith',
   *   active: true,
   *   federated: false,
   *   email: 'john@sample.com'
   * })
   * <code>
   *
   * @param {object} json
   *
   * @return {<BasicIdentity>}
   */
  static decode(json: ToznyAPIBasicIdentity): BasicIdentity {
    return new BasicIdentity(
      json.subject_id,
      json.username,
      json.first_name,
      json.last_name,
      json.active,
      json.federated,
      json.email
    )
  }
}

export type ToznyAPIBasicIdentity = {
  subject_id: string
  username: string
  first_name: string
  last_name: string
  active: string
  federated: string
  email: string
}
export default BasicIdentity
