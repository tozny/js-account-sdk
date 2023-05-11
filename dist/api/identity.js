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
exports.addRolesToIdentity = exports.deleteIdentity = exports.registerIdentity = void 0;
const utils_1 = require("../utils");
const realmSettings_1 = require("./realmSettings");
function registerIdentity({ realmName, realmRegistrationToken, identity }, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const info = yield (0, realmSettings_1.getRealmInfo)({ realmName }, ctx);
        const username = identity.name.toLowerCase();
        const payload = {
            realm_registration_token: realmRegistrationToken,
            realm_name: info.domain,
            identity: {
                realm_name: info.domain,
                name: username,
                public_key: identity.public_key,
                signing_key: identity.signing_key,
                first_name: identity.first_name,
                last_name: identity.last_name,
                email: identity.email,
                attributes: identity.attributes,
            },
        };
        const request = yield fetch(ctx.apiUrl + '/v1/identity/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        const identityResponse = (yield (0, utils_1.validateRequestAsJSON)(request));
        return identityResponse;
    });
}
exports.registerIdentity = registerIdentity;
function deleteIdentity({ realmName, identityId }, { apiUrl, queenClient }) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield queenClient.authenticator.tsv1Fetch(`${apiUrl}/v1/identity/realm/${realmName}/identity/${identityId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        (0, utils_1.checkStatus)(response);
        return true;
    });
}
exports.deleteIdentity = deleteIdentity;
function addRolesToIdentity({ realmName, identityId, roles }, { apiUrl, queenClient }) {
    return __awaiter(this, void 0, void 0, function* () {
        const payload = {
            roles,
        };
        const response = yield queenClient.authenticator.tsv1Fetch(`${apiUrl}/v1/identity/admin/realm/${realmName}/identity/${identityId}/role`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        (0, utils_1.checkStatus)(response);
        return true;
    });
}
exports.addRolesToIdentity = addRolesToIdentity;
