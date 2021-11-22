/**
 * Billing status for a Tozny account
 */
class AccountBillingStatus {
  constructor(
    accountActive,
    isTrial,
    trialPeriodEnds,
    isLegacy,
    isGoodStanding = null,
    isFree = null
  ) {
    this.accountActive = accountActive
    this.isTrial = isTrial
    this.trialPeriodEnds = trialPeriodEnds
    this.isLegacy = isLegacy
    this.isGoodStanding = isGoodStanding
    this.isFree = isFree
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
   *  is_good_standing: true,
   *  is_free: false,
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
      json.is_good_standing,
      json.is_free
    )
  }
}

module.exports = AccountBillingStatus
