"use strict";
const Sovereign = require('./sovereign');
/**
 * A Tozny ID Realm belonging to an account.
 */
class Realm {
    constructor(id, name, domain, adminURL, active, sovereign, brokerIdentityToznyId = null) {
        this.id = id;
        this.name = name;
        this.domain = domain;
        this.adminURL = adminURL;
        this.active = active;
        this.sovereign = sovereign;
        this.brokerIdentityToznyId = brokerIdentityToznyId;
    }
    /**
     * Specify how an already unserialized JSON array should be marshaled into
     * an object representation.
     *
     * <code>
     * realm = Realm::decode({
     *  id: 15,
     *  name: '10ba1902',
     *  admin_url: 'http://platform.local.tozny.com:8010/auth/admin/10ba1902/console',
     *  active: true,
     *  sovereign: {
     *    id: 15,
     *    name: 'YassQueen',
     *    password: 'ff1d5cb9-017b-4447-8386-7c2d14d42a49'
     *  },
     *  broker_identity_tozny_id: '00000000-0000-0000-0000-000000000000'
     * })
     * <code>
     *
     * @param {object} json
     *
     * @return {Realm}
     */
    static decode(json) {
        return new Realm(json.id, json.name, json.domain, json.admin_url, json.active, Sovereign.decode(json.sovereign), json.broker_identity_tozny_id);
    }
}
module.exports = Realm;
