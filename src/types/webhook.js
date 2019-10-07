/**
 * A tozny type, used to represent a Tozny account webhook.
 */

'use strict'

/**
 * A Tozny webhook with an id, url, and triggers with an event and enabled status.
 */
class Webhook {
  /**
   * Set up the values for a Webhook.
   *
   * @param {number} webhook_id The webhook id
   * @param {string} webhook_url The payload url
   * @param {object} triggers A list of event trigger objects with an api_event and enabled status.
   */
  constructor(webhook_id, webhook_url, triggers) {
    this.webhook_id = webhook_id
    this.webhook_url = webhook_url
    this.triggers = triggers
  }

  /**
   * Specify how an already unserialized JSON array should be marshaled into
   * an object representation.
   *
   * @param {object} json
   *
   * @return {<Webhook>}
   */
  static decode(json) {
    return new Webhook(json.webhook_id, json.webhook_url, json.triggers)
  }
}

module.exports = Webhook
