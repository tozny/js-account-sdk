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
exports.listRealmGroups = exports.describeRealmGroup = exports.deleteRealmGroup = exports.updateRealmGroup = exports.createRealmGroup = void 0;
const utils_1 = require("../utils");
// transformAttributesForApi converts attributes to expected api format
// { key1: 'value1' } becomes { key1: ['value1']}
function transformAttributesForApi(payload) {
    const attributes = {};
    for (const [key, value] of Object.entries(payload.attributes || {})) {
        attributes[key] = [value];
    }
    payload.attributes = attributes;
    return payload;
}
function createRealmGroup({ realmName, group }, { apiUrl, queenClient }) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield queenClient.authenticator.tsv1Fetch(`${apiUrl}/v1/identity/realm/${realmName}/group`, {
            method: 'POST',
            body: JSON.stringify(transformAttributesForApi(group)),
        });
        return (0, utils_1.validateRequestAsJSON)(response);
    });
}
exports.createRealmGroup = createRealmGroup;
function updateRealmGroup({ realmName, groupId, group }, { apiUrl, queenClient }) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield queenClient.authenticator.tsv1Fetch(`${apiUrl}/v1/identity/realm/${realmName}/group/${groupId}`, {
            method: 'PUT',
            body: JSON.stringify(transformAttributesForApi(group)),
        });
        return (0, utils_1.validateRequestAsJSON)(response);
    });
}
exports.updateRealmGroup = updateRealmGroup;
function deleteRealmGroup({ realmName, groupId }, { apiUrl, queenClient }) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield queenClient.authenticator.tsv1Fetch(`${apiUrl}/v1/identity/realm/${realmName}/group/${groupId}`, { method: 'DELETE' });
        (0, utils_1.checkStatus)(response);
        return true;
    });
}
exports.deleteRealmGroup = deleteRealmGroup;
function describeRealmGroup({ realmName, groupId }, { apiUrl, queenClient }) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield queenClient.authenticator.tsv1Fetch(`${apiUrl}/v1/identity/realm/${realmName}/group/${groupId}`, { method: 'GET' });
        return (0, utils_1.validateRequestAsJSON)(response);
    });
}
exports.describeRealmGroup = describeRealmGroup;
function listRealmGroups({ realmName }, { apiUrl, queenClient }) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield queenClient.authenticator.tsv1Fetch(`${apiUrl}/v1/identity/realm/${realmName}/group`, { method: 'GET' });
        const { groups } = (yield (0, utils_1.validateRequestAsJSON)(response));
        return groups;
    });
}
exports.listRealmGroups = listRealmGroups;
