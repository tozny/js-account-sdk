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
const { TOKEN_LIFETIME_MILLISECONDS } = require('../utils/constants');
class Token {
    constructor(token, created = Date.now()) {
        this._token = token;
        this._created = created;
    }
    get token() {
        return this._token;
    }
    get bearer() {
        return { Authorization: `Bearer ${this._token}` };
    }
    get expired() {
        return Date.now() - this._created > TOKEN_LIFETIME_MILLISECONDS;
    }
    get refresher() {
        return this._refresher;
    }
    set refresher(refresher) {
        if (typeof refresher !== 'object') {
            throw new Error('The refresher must be an object with refresh and serialize methods');
        }
        if (typeof refresher.refresh !== 'function') {
            throw new Error('The refresher.refresh method must be an async function that fetches a new token');
        }
        if (typeof refresher.refresh !== 'function') {
            throw new Error('The refresher.serialize method must be function');
        }
        this._refresher = refresher;
    }
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._refresher) {
                throw new Error('A refresher object must be set before the refresh method can be called.');
            }
            const newToken = yield this.refresher.refresh();
            this._token = newToken;
            this._created = Date.now();
        });
    }
    serialize() {
        const serialized = {
            token: this._token,
            created: this._created,
        };
        if (this._refresher) {
            const refresher = this._refresher.serialize();
            if (refresher) {
                serialized.refresher = refresher;
            }
        }
        return serialized;
    }
}
module.exports = Token;
