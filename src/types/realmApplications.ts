class RealmApplication {
  id: string
  clientId: string
  name: string
  active: boolean
  allowedOrigins: string[]
  protocol: string
  applicationOIDCSettings?: ApplicationOIDCSettings
  applicationSAMLSettings?: ApplicationSAMLSettings
  constructor(
    id: string,
    clientId: string,
    name: string,
    active: boolean,
    allowedOrigins: string[],
    protocol: string,
    applicationOIDCSettings: ApplicationOIDCSettings,
    applicationSAMLSettings: ApplicationSAMLSettings
  ) {
    this.id = id
    this.clientId = clientId
    this.name = name
    this.active = active
    this.allowedOrigins = allowedOrigins
    this.protocol = protocol
    this.applicationOIDCSettings = applicationOIDCSettings
    this.applicationSAMLSettings = applicationSAMLSettings
  }

  /**
   * Specify how an already unserialized JSON array should be marshaled into
   * an object representation
   *
   * @param {object} json
   *
   * @return {<RealmApplication>}
   */
  static decode(json: ToznyAPIRealmApplication): RealmApplication {
    const applicationOIDCSettings = ApplicationOIDCSettings.decode(
      json.application_oidc_settings
    )
    const applicationSAMLSettings = ApplicationSAMLSettings.decode(
      json.application_saml_settings
    )
    return new RealmApplication(
      json.id,
      json.client_id,
      json.name,
      json.active,
      json.allowed_origins,
      json.protocol,
      applicationOIDCSettings,
      applicationSAMLSettings
    )
  }
}

class ApplicationOIDCSettings {
  accessType: string
  rootUrl: string
  standardFlowEnabled: boolean
  implicitFlowEnabled: boolean
  directAccessGrantsEnabled: boolean
  baseUrl: string
  constructor(
    accessType: string,
    rootUrl: string,
    standardFlowEnabled: boolean,
    implicitFlowEnabled: boolean,
    directAccessGrantsEnabled: boolean,
    baseUrl: string
  ) {
    this.accessType = accessType
    this.rootUrl = rootUrl
    this.standardFlowEnabled = standardFlowEnabled
    this.implicitFlowEnabled = implicitFlowEnabled
    this.directAccessGrantsEnabled = directAccessGrantsEnabled
    this.baseUrl = baseUrl
  }

  static decode(
    json: ToznyAPIApplicationOIDCSettings
  ): ApplicationOIDCSettings {
    return new ApplicationOIDCSettings(
      json.access_type,
      json.root_url,
      json.standard_flow_enabled,
      json.implicit_flow_enabled,
      json.direct_access_grants_enabled,
      json.base_url
    )
  }
}

class ApplicationSAMLSettings {
  defaultEndpoint: string
  includeAuthNStatement: boolean
  includeOnetimeUseCondition: boolean
  signDocuments: boolean
  signAssertions: boolean
  clientSignatureRequired: boolean
  forcePostBinding: boolean
  forceNameIdFormat: boolean
  nameIdFormat: string
  idpInitiatedSSOUrlName: string
  assertionConsumerServicePostBindingUrl: string
  constructor(
    defaultEndpoint: string,
    includeAuthNStatement: boolean,
    includeOnetimeUseCondition: boolean,
    signDocuments: boolean,
    signAssertions: boolean,
    clientSignatureRequired: boolean,
    forcePostBinding: boolean,
    forceNameIdFormat: boolean,
    nameIdFormat: string,
    idpInitiatedSSOUrlName: string,
    assertionConsumerServicePostBindingUrl: string
  ) {
    this.defaultEndpoint = defaultEndpoint
    this.includeAuthNStatement = includeAuthNStatement
    this.includeOnetimeUseCondition = includeOnetimeUseCondition
    this.signDocuments = signDocuments
    this.signAssertions = signAssertions
    this.clientSignatureRequired = clientSignatureRequired
    this.forcePostBinding = forcePostBinding
    this.forceNameIdFormat = forceNameIdFormat
    this.nameIdFormat = nameIdFormat
    this.idpInitiatedSSOUrlName = idpInitiatedSSOUrlName
    this.assertionConsumerServicePostBindingUrl = assertionConsumerServicePostBindingUrl
  }

  static decode(
    json: ToznyAPIApplicationSAMLSettings
  ): ApplicationSAMLSettings {
    return new ApplicationSAMLSettings(
      json.default_endpoint,
      json.include_authn_statement,
      json.include_one_time_use_condition,
      json.sign_documents,
      json.sign_assertions,
      json.client_signature_required,
      json.force_post_binding,
      json.force_name_id_format,
      json.name_id_format,
      json.idp_initiated_sso_url_name,
      json.assertion_consumer_service_post_binding_url
    )
  }
}

export type ToznyAPIRealmApplication = {
  id: string
  client_id: string
  name: string
  active: boolean
  allowed_origins: string[]
  protocol: string
  application_oidc_settings: ToznyAPIApplicationOIDCSettings
  application_saml_settings: ToznyAPIApplicationSAMLSettings
}

export type ToznyAPIApplicationOIDCSettings = {
  access_type: string
  root_url: string
  standard_flow_enabled: boolean
  implicit_flow_enabled: boolean
  direct_access_grants_enabled: boolean
  base_url: string
}

export type ToznyAPIApplicationSAMLSettings = {
  default_endpoint: string
  include_authn_statement: boolean
  include_one_time_use_condition: boolean
  sign_documents: boolean
  sign_assertions: boolean
  client_signature_required: boolean
  force_post_binding: boolean
  force_name_id_format: boolean
  name_id_format: string
  idp_initiated_sso_url_name: string
  assertion_consumer_service_post_binding_url: string
}

export default RealmApplication
