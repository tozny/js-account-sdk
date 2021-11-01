"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const role_1 = __importDefault(require("./role"));
class AccessPolicy {
    constructor(id, approvalRoles, requiredApprovals, maxAccessDurationSeconds) {
        this.id = id;
        this.approvalRoles = approvalRoles;
        this.maxAccessDurationSeconds = maxAccessDurationSeconds;
        this.requiredApprovals = requiredApprovals;
    }
    /**
     * Specify how an already unserialized JSON array should be marshaled into
     * an object representation.
     *
     * @param {ToznyAPIAccessPolicy} json
     * @return {<AccessPolicy>}
     */
    static decode(json) {
        const realmRoles = json.approval_roles.map(role_1.default.decode);
        return new AccessPolicy(json.id, realmRoles, json.required_approvals, json.max_access_duration_seconds);
    }
}
exports.default = AccessPolicy;
