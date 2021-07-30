"use strict";
/**
 * The ruling Identity for a Tozny ID Realm.
 */
class Sovereign {
    constructor(id, name, password = null) {
        this.id = id;
        this.name = name;
        this.password = password;
    }
    /**
     * Specify how an already unserialized JSON array should be marshaled into
     * an object representation.
     *
     * <code>
     * sovereign = Sovereign::decode({
     *   id: 15,
     *   name: 'YassQueen',
     *   password: 'ff1d5cb9-017b-4447-8386-7c2d14d42a49'
     * })
     * <code>
     *
     * @param {object} json
     *
     * @return {<Sovereign>}
     */
    static decode(json) {
        return new Sovereign(json.id, json.name, json.password);
    }
}
module.exports = Sovereign;
