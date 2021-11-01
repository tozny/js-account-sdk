"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeRealmSettings = void 0;
/**
 * decodeRealmSettings converts the API response type to the structure used by this package.
 */
function decodeRealmSettings(api) {
    return {
        emailLookupsEnabled: api.secrets_enabled,
        mfaAvailable: api.mfa_available,
        mpcEnabled: api.email_lookups_enabled,
        secretsEnabled: api.tozid_federation_enabled,
        tozIDFederationEnabled: api.mpc_enabled,
    };
}
exports.decodeRealmSettings = decodeRealmSettings;
