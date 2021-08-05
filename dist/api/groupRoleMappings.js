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
exports.removeGroupRoleMappings = exports.addGroupRoleMappings = exports.listGroupRoleMappings = void 0;
const utils_1 = require("../utils");
const roleMappingForGroupUri = (apiUrl, realmName, groupId) => `${apiUrl}/v1/identity/realm/${realmName}/group/${groupId}/role_mapping`;
function listGroupRoleMappings({ groupId, realmName }, { apiUrl, queenClient }) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield queenClient.authenticator.tsv1Fetch(roleMappingForGroupUri(apiUrl, realmName, groupId), { method: 'GET' });
        return utils_1.validateRequestAsJSON(response);
    });
}
exports.listGroupRoleMappings = listGroupRoleMappings;
function addGroupRoleMappings({ realmName, groupId, groupRoleMapping }, { apiUrl, queenClient }) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield queenClient.authenticator.tsv1Fetch(roleMappingForGroupUri(apiUrl, realmName, groupId), {
            method: 'POST',
            body: JSON.stringify(groupRoleMapping),
        });
        utils_1.checkStatus(response);
        return;
    });
}
exports.addGroupRoleMappings = addGroupRoleMappings;
function removeGroupRoleMappings({ realmName, groupId, groupRoleMapping }, { apiUrl, queenClient }) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield queenClient.authenticator.tsv1Fetch(roleMappingForGroupUri(apiUrl, realmName, groupId), {
            method: 'DELETE',
            body: JSON.stringify(groupRoleMapping),
        });
        utils_1.checkStatus(response);
        return;
    });
}
exports.removeGroupRoleMappings = removeGroupRoleMappings;
