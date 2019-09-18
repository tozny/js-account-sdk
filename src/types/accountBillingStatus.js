/*!
 * Tozny e3db
 *
 * LICENSE
 *
 * Tozny dual licenses this product. For commercial use, please contact
 * info@tozny.com. For non-commercial use, the contents of this file are
 * subject to the TOZNY NON-COMMERCIAL LICENSE (the "License") which
 * permits use of the software only by government agencies, schools,
 * universities, non-profit organizations or individuals on projects that
 * do not receive external funding other than government research grants
 * and contracts.  Any other use requires a commercial license. You may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at https://tozny.com/legal/non-commercial-license.
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
 * License for the specific language governing rights and limitations under
 * the License. Portions of the software are Copyright (c) TOZNY LLC, 2019.
 * All rights reserved.
 *
 * @copyright Copyright (c) 2019 Tozny, LLC (https://tozny.com)
 */

'use strict'

/**
 * Billing status for a Tozny account
 */
class AccountBillingStatus {
  constructor(
    accountActive,
    isTrial,
    trialPeriodEnds,
    isLegacy,
    isGoodStanding = null
  ) {
    this.accountActive = accountActive
    this.isTrial = isTrial
    this.trialPeriodEnds = trialPeriodEnds
    this.isLegacy = isLegacy
    this.isGoodStanding = isGoodStanding
  }

  /**
   * Specify how an already unserialized JSON array should be marshaled into
   * an object representation.
   *
   * <code>
   * isp = AccountBillingStatus::decode({
   *  account_active: true,
   *  is_trial: true,
   *  trial_period_ends: "2019-09-22T05:19:52Z",
   *  is_legacy: false,
   *  is_good_standing: true
   * })
   * <code>
   *
   * @param {object} json
   *
   * @return {<AccountBillingStatus>}
   */
  static decode(json) {
    return new AccountBillingStatus(
      json.account_active,
      json.is_trial,
      json.trial_period_ends,
      json.is_legacy,
      json.is_good_standing
    )
  }
}

module.exports = AccountBillingStatus
