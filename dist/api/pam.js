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
exports.UpsertAccessPolicies = exports.listAccessPolicies = void 0;
const utils_1 = require("../utils");
const role_1 = require("../types/role");
function listAccessPolicies({ realmName, groupIds }, { apiUrl, queenClient }) {
    return __awaiter(this, void 0, void 0, function* () {
        var query = new URLSearchParams();
        query.set('realm_name', encodeURIComponent(realmName));
        groupIds.forEach(groupId => query.append('group_ids', encodeURIComponent(groupId)));
        const request = yield queenClient.authenticator.tsv1Fetch(apiUrl + '/v1/identity/pam/polcies?${query.toString()}', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const accessPolicyResponse = (yield utils_1.validateRequestAsJSON(request));
        return accessPolicyResponse;
    });
}
exports.listAccessPolicies = listAccessPolicies;
function UpsertAccessPolicies({ realmName, groupId, accessPolicies }, { apiUrl, queenClient }) {
    return __awaiter(this, void 0, void 0, function* () {
        const payload = {
            realm_name: realmName,
            group: {
                id: groupId,
                accessPolicies: accessPolicies.map(ap => ({
                    id: ap.id,
                    required_approvals: ap.requiredApprovals,
                    max_access_duration_seconds: ap.maxAccessDurationSeconds,
                    approval_roles: ap.approvalRoles.map(role_1.roleToAPI),
                })),
            },
        };
        const response = yield queenClient.authenticator.tsv1Fetch(`${apiUrl}/v1/identity/pam/policies`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        utils_1.checkStatus(response);
        return;
    });
}
exports.UpsertAccessPolicies = UpsertAccessPolicies;
