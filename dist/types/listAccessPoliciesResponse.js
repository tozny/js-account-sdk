"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const accessPolicy_1 = __importDefault(require("./accessPolicy"));
class ListAccessPoliciesResponse {
    constructor(settings, groupAccessPolicies) {
        this.settings = settings;
        this.groupAccessPolicies = groupAccessPolicies;
    }
    static decode(api) {
        const groups = api.groups.map(({ id, access_policies }) => ({
            id,
            accessPolicies: access_policies.map(accessPolicy_1.default.decode),
        }));
        const settings = {
            defaultAccessDurationSeconds: api.settings.default_access_duration_seconds,
            defaultRequiredApprovals: api.settings.default_required_approvals,
            mpcEnabledForRealm: api.settings.mpc_enabled_for_realm,
        };
        return new ListAccessPoliciesResponse(settings, groups);
    }
}
exports.default = ListAccessPoliciesResponse;
