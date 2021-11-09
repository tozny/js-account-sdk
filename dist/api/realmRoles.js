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
exports.listRealmRoles = exports.describeRealmRole = exports.deleteRealmRole = exports.updateRealmRole = exports.createRealmRole = void 0;
const utils_1 = require("../utils");
function createRealmRole({ realmName, role }, { apiUrl, queenClient }) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield queenClient.authenticator.tsv1Fetch(`${apiUrl}/v1/identity/realm/${realmName}/role`, {
            method: 'POST',
            body: JSON.stringify(role),
        });
        return (0, utils_1.validateRequestAsJSON)(response);
    });
}
exports.createRealmRole = createRealmRole;
function updateRealmRole({ realmName, role }, { apiUrl, queenClient }) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield queenClient.authenticator.tsv1Fetch(`${apiUrl}/v1/identity/realm/${realmName}/role/${role.id}`, {
            method: 'PUT',
            body: JSON.stringify(role),
        });
        return (0, utils_1.validateRequestAsJSON)(response);
    });
}
exports.updateRealmRole = updateRealmRole;
function deleteRealmRole({ realmName, roleId }, { apiUrl, queenClient }) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield queenClient.authenticator.tsv1Fetch(`${apiUrl}/v1/identity/realm/${realmName}/role/${roleId}`, { method: 'DELETE' });
        (0, utils_1.checkStatus)(response);
        return;
    });
}
exports.deleteRealmRole = deleteRealmRole;
function describeRealmRole({ realmName, roleId }, { apiUrl, queenClient }) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield queenClient.authenticator.tsv1Fetch(`${apiUrl}/v1/identity/realm/${realmName}/role/${roleId}`, { method: 'GET' });
        return (0, utils_1.validateRequestAsJSON)(response);
    });
}
exports.describeRealmRole = describeRealmRole;
function listRealmRoles({ realmName }, { apiUrl, queenClient }) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield queenClient.authenticator.tsv1Fetch(`${apiUrl}/v1/identity/realm/${realmName}/role`, { method: 'GET' });
        const { roles } = (yield (0, utils_1.validateRequestAsJSON)(response));
        return roles;
    });
}
exports.listRealmRoles = listRealmRoles;
