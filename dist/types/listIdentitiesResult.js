"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * The result from running an identity list operation.
 */
class ListIdentitiesResult {
    constructor(client, realmName, max, next) {
        this.client = client;
        this.realmName = realmName;
        this.max = max;
        this.nextToken = next;
        this.done = false;
    }
    /**
     * Get the next page of results from the current query
     *
     * @returns {Promise<array>}
     */
    next() {
        return __awaiter(this, void 0, void 0, function* () {
            // Finished iteration, exit early
            if (this.done) {
                return [];
            }
            let response = yield this.client._listIdentities(this.realmName, this.max, this.nextToken);
            // If we've reached the last page, keep track and exit
            if (response.next === -1) {
                this.done = true;
            }
            this.nextToken = response.next;
            return response.identities;
        });
    }
}
module.exports = ListIdentitiesResult;
