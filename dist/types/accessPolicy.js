"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const role_1 = __importDefault(require("./role"));
class AccessPolicy {
    constructor(id, approval_roles, required_approvals, max_access_duration_seconds) {
        this.id = id;
        this.approvalRoles = approval_roles;
        this.maxAccessDurationSeconds = max_access_duration_seconds;
        this.requiredApprovals = required_approvals;
    }
    /**
     * Specify how an already unserialized JSON array should be marshaled into
     * an object representation.
     *
     * <code>
     * access_policy = AccessPolicy::decode({
     *   id: '00000000-0000-0000-0000-000000000000',
     *   approval_roles: Role::decode({
     *   id: '00000000-0000-0000-0000-000000000000',
     *   name: 'jsmith',
     *   description: 'This role provides access to...'
     *   composite: false',
     *   client_role: trie,
     *   container_id: '00000000-0000-0000-0000-000000000000',
     * })
     *   max_access_duration_seconds: '00',
     *   required_approvals: '00',
     * })
     * <code>
     *
     * @param {object} json
     *
     * @return {<AccessPolicy>}
     */
    static decode(json) {
        const realmRoles = json.approval_roles.map(role_1.default.decode);
        return new AccessPolicy(json.id, realmRoles, json.required_approvals, json.max_access_duration_seconds);
    }
}
exports.default = AccessPolicy;
