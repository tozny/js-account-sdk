/**
 * A tozny type, used to represent a Tozny webhook trigger.
 */

'use strict'

/**
 * A Tozny webhook trigger with an api_event and enabled status.
 */
class WebhookTrigger {
  /**
   * Set up the values for a WebhookTrigger.
   *
   * @param {string} api_event The name of api_event associated with the trigger
   * @param {boolean} enabled The status of the trigger
   */
  constructor(api_event, enabled) {
    this.api_event = api_event
    this.enabled = enabled
  }

  /**
   * Specify how an already unserialized JSON array should be marshaled into
   * an object representation.
   *
   * @param {object} json
   *
   * @return {<WebhookTrigger>}
   */
  static decode(json) {
    return new WebhookTrigger(json.api_event, json.enabled)
  }
}

module.exports = WebhookTrigger
