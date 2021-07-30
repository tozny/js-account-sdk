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
class SRPRefresher {
    constructor(api, crypto, keys, username) {
        ;
        (this.api = api), (this.crypto = crypto), (this.keys = keys);
        this.username = username;
    }
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield this.profile();
            return profile.token;
        });
    }
    profile() {
        return __awaiter(this, void 0, void 0, function* () {
            const challenge = yield this.api.getChallenge(this.username);
            const signature = yield this.crypto.sign(challenge.challenge, this.keys.privateKey);
            const profile = yield this.api.completeChallenge(this.username, challenge.challenge, signature, 'password');
            return profile;
        });
    }
    serialize() {
        return {
            username: this.username,
            keys: this.keys,
        };
    }
}
module.exports = SRPRefresher;
