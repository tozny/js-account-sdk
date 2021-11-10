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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRealmSettings = exports.getRealmInfo = void 0;
const utils_1 = require("../utils");
/** not publicly exposed. used primarily internally for realmName -> domainName conversion */
function getRealmInfo({ realmName }, { apiUrl }) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${apiUrl}/v1/identity/info/realm/${realmName.toLowerCase()}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        const realmInfo = (yield (0, utils_1.validateRequestAsJSON)(response));
        return realmInfo;
    });
}
exports.getRealmInfo = getRealmInfo;
function updateRealmSettings({ realmName, settings: { secretsEnabled, mfaAvailable, emailLookupsEnabled, tozIDFederationEnabled, mpcEnabled, }, }, { apiUrl, queenClient }) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get the Realm Domain
        const info = yield getRealmInfo({ realmName }, { apiUrl, queenClient });
        const payload = {
            secrets_enabled: secretsEnabled,
            mfa_available: mfaAvailable,
            email_lookups_enabled: emailLookupsEnabled,
            tozid_federation_enabled: tozIDFederationEnabled,
            mpc_enabled: mpcEnabled,
        };
        // Update Realm Settings
        const response = yield queenClient.authenticator.tsv1Fetch(`${apiUrl}/v1/identity/admin/realm/info/${info.domain}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        (0, utils_1.checkStatus)(response);
        return;
    });
}
exports.updateRealmSettings = updateRealmSettings;
