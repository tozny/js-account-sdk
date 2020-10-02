const ClientInfo = require('./clientInfo')

/**
 * A list of Tozny Client Info objects belonging to an account.
 */
class ClientInfoList {
  constructor(clients, nextToken) {
    this.clients = clients
    this.nextToken = nextToken
  }

  /**
   * Specify how an already unserialized JSON array should be marshaled into
   * an object representation.
   *
   * <code>
   * clients = ClientInfoList.decode({
   *   clients: [
   *     {
   *         client_id: '46fa26e-db4c-4c5f-741f-84fb65aab5ce',
   *         name: 'clientName',
   *         account_id: 'ff3bafd9-42cb-4318-a00d-b735f0320e74',
   *         queen_id: 'e78cc484-2a94-4542-a7b8-560891388424',
   *         client_type: 'general',
   *         realm_name: '387e7ba1',
   *         public_key: { curve25519: 'OmQ2DANNDlXRQwFZUAcOnSicSfZKnONnBWxFRFZt3W4' },
   *         signing_key: { ed25519: '7oOXyq7bVW5SWqv57RUkeb92YIGbdkM9jp30874vDzg' },
   *         api_key_id: '4601691abc53c542252bca4f31b939ed5cea32d3c301cca01b920305197330af',
   *         api_secret_key: '6d4b836124d9f4cf054b8be3f6f46831e220b35f2ba9731d26fa9dfcd1cebe56',
   *     }
   *   ],
   *   next
   * })
   * <code>
   *
   * @param {object} json the Raw JS object filled with client list data.
   *
   * @return {<ClientInfoList>}
   */
  static decode(json) {
    let clients = json.clients
      ? [...json.clients].map(c => ClientInfo.decode(c))
      : []
    return new ClientInfoList(clients, json.next_token)
  }
}

module.exports = ClientInfoList
