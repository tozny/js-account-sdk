"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RealmApplication {
    constructor(id, clientId, name, active, allowedOrigins, protocol, applicationOIDCSettings, applicationSAMLSettings) {
        this.id = id;
        this.clientId = clientId;
        this.name = name;
        this.active = active;
        this.allowedOrigins = allowedOrigins;
        this.protocol = protocol;
        this.applicationOIDCSettings = applicationOIDCSettings;
        this.applicationSAMLSettings = applicationSAMLSettings;
    }
    /**
     * Specify how an already unserialized JSON array should be marshaled into
     * an object representation
     *
     * @param {object} json
     *
     * @return {<RealmApplication>}
     */
    static decode(json) {
        const applicationOIDCSettings = ApplicationOIDCSettings.decode(json.application_oidc_settings);
        const applicationSAMLSettings = ApplicationSAMLSettings.decode(json.application_saml_settings);
        return new RealmApplication(json.id, json.client_id, json.name, json.active, json.allowed_origins, json.protocol, applicationOIDCSettings, applicationSAMLSettings);
    }
}
class ApplicationOIDCSettings {
    constructor(accessType, rootUrl, standardFlowEnabled, implicitFlowEnabled, directAccessGrantsEnabled, baseUrl) {
        this.accessType = accessType;
        this.rootUrl = rootUrl;
        this.standardFlowEnabled = standardFlowEnabled;
        this.implicitFlowEnabled = implicitFlowEnabled;
        this.directAccessGrantsEnabled = directAccessGrantsEnabled;
        this.baseUrl = baseUrl;
    }
    static decode(json) {
        return new ApplicationOIDCSettings(json.access_type, json.root_url, json.standard_flow_enabled, json.implicit_flow_enabled, json.direct_access_grants_enabled, json.base_url);
    }
}
class ApplicationSAMLSettings {
    constructor(defaultEndpoint, includeAuthNStatement, includeOnetimeUseCondition, signDocuments, signAssertions, clientSignatureRequired, forcePostBinding, forceNameIdFormat, nameIdFormat, idpInitiatedSSOUrlName, assertionConsumerServicePostBindingUrl) {
        this.defaultEndpoint = defaultEndpoint;
        this.includeAuthNStatement = includeAuthNStatement;
        this.includeOnetimeUseCondition = includeOnetimeUseCondition;
        this.signDocuments = signDocuments;
        this.signAssertions = signAssertions;
        this.clientSignatureRequired = clientSignatureRequired;
        this.forcePostBinding = forcePostBinding;
        this.forceNameIdFormat = forceNameIdFormat;
        this.nameIdFormat = nameIdFormat;
        this.idpInitiatedSSOUrlName = idpInitiatedSSOUrlName;
        this.assertionConsumerServicePostBindingUrl =
            assertionConsumerServicePostBindingUrl;
    }
    static decode(json) {
        return new ApplicationSAMLSettings(json.default_endpoint, json.include_authn_statement, json.include_one_time_use_condition, json.sign_documents, json.sign_assertions, json.client_signature_required, json.force_post_binding, json.force_name_id_format, json.name_id_format, json.idp_initiated_sso_url_name, json.assertion_consumer_service_post_binding_url);
    }
}
exports.default = RealmApplication;
