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
exports.leaveGroups = exports.joinGroups = exports.updateGroupMembership = exports.groupMembership = void 0;
const utils_1 = require("../utils");
function groupMembership({ realmName, identityId }, { apiUrl, queenClient }) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield queenClient.authenticator.tsv1Fetch(`${apiUrl}/v1/identity/realm/${realmName}/identity/${identityId}/groups`, {
            method: 'GET',
        });
        const { groups } = (yield utils_1.validateRequestAsJSON(response));
        return groups;
    });
}
exports.groupMembership = groupMembership;
function updateGroupMembership({ realmName, identityId, groups }, { apiUrl, queenClient }) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield queenClient.authenticator.tsv1Fetch(`${apiUrl}/v1/identity/realm/${realmName}/identity/${identityId}/groups`, {
            method: 'PUT',
            body: JSON.stringify(groups),
        });
        utils_1.checkStatus(response);
        return;
    });
}
exports.updateGroupMembership = updateGroupMembership;
function joinGroups({ realmName, identityId, groups }, { apiUrl, queenClient }) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield queenClient.authenticator.tsv1Fetch(`${apiUrl}/v1/identity/realm/${realmName}/identity/${identityId}/groups`, {
            method: 'PATCH',
            body: JSON.stringify(groups),
        });
        utils_1.checkStatus(response);
        return;
    });
}
exports.joinGroups = joinGroups;
function leaveGroups({ realmName, identityId, groups }, { apiUrl, queenClient }) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield queenClient.authenticator.tsv1Fetch(`${apiUrl}/v1/identity/realm/${realmName}/identity/${identityId}/groups`, {
            method: 'DELETE',
            body: JSON.stringify(groups),
        });
        utils_1.checkStatus(response);
        return;
    });
}
exports.leaveGroups = leaveGroups;
