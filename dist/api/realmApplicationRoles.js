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
exports.listRealmApplicationRoles = exports.describeRealmApplicationRole = exports.deleteRealmApplicationRole = exports.updateRealmApplicationRole = exports.createRealmApplicationRole = void 0;
const utils_1 = require("../utils");
const realmApplicationRoleUri = (apiUrl, realmName, applicationId) => `${apiUrl}/v1/identity/realm/${realmName}/application/${applicationId}/role`;
function createRealmApplicationRole({ realmName, applicationId, role }, { apiUrl, queenClient }) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield queenClient.authenticator.tsv1Fetch(realmApplicationRoleUri(apiUrl, realmName, applicationId), {
            method: 'POST',
            body: JSON.stringify(role),
        });
        return utils_1.validateRequestAsJSON(response);
    });
}
exports.createRealmApplicationRole = createRealmApplicationRole;
function updateRealmApplicationRole({ realmName, applicationId, originalRoleName, role }, { apiUrl, queenClient }) {
    return __awaiter(this, void 0, void 0, function* () {
        const encodedRoleName = encodeURIComponent(originalRoleName);
        const uri = `${realmApplicationRoleUri(apiUrl, realmName, applicationId)}/${encodedRoleName}`;
        const response = yield queenClient.authenticator.tsv1Fetch(uri, {
            method: 'PUT',
            body: JSON.stringify(role),
        });
        return utils_1.validateRequestAsJSON(response);
    });
}
exports.updateRealmApplicationRole = updateRealmApplicationRole;
function deleteRealmApplicationRole({ realmName, applicationId, roleName }, { apiUrl, queenClient }) {
    return __awaiter(this, void 0, void 0, function* () {
        const encodedRoleName = encodeURIComponent(roleName);
        const uri = `${realmApplicationRoleUri(apiUrl, realmName, applicationId)}/${encodedRoleName}`;
        const response = yield queenClient.authenticator.tsv1Fetch(uri, { method: 'DELETE' });
        utils_1.checkStatus(response);
        return;
    });
}
exports.deleteRealmApplicationRole = deleteRealmApplicationRole;
function describeRealmApplicationRole({ realmName, applicationId, roleName }, { apiUrl, queenClient }) {
    return __awaiter(this, void 0, void 0, function* () {
        const encodedRoleName = encodeURIComponent(roleName);
        const uri = `${realmApplicationRoleUri(apiUrl, realmName, applicationId)}/${encodedRoleName}`;
        const response = yield queenClient.authenticator.tsv1Fetch(uri, { method: 'GET' });
        return utils_1.validateRequestAsJSON(response);
    });
}
exports.describeRealmApplicationRole = describeRealmApplicationRole;
function listRealmApplicationRoles({ realmName, applicationId }, { apiUrl, queenClient }) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield queenClient.authenticator.tsv1Fetch(realmApplicationRoleUri(apiUrl, realmName, applicationId), { method: 'GET' });
        const { application_roles: roles } = (yield utils_1.validateRequestAsJSON(response));
        return roles;
    });
}
exports.listRealmApplicationRoles = listRealmApplicationRoles;
