import { ToznyAPIRealmApplication } from '../types/realmApplications'
import { validateRequestAsJSON } from '../utils'
import { APIContext } from './context'

type DescribeRealmApplication = { realmName: string }
type ListRealmApplicationsResponse = {
  applications: ToznyAPIRealmApplication[]
}

export async function listRealmApplications(
  { realmName }: DescribeRealmApplication,
  { apiUrl, queenClient }: APIContext
): Promise<ToznyAPIRealmApplication[]> {
  const response = await queenClient.authenticator.tsv1Fetch(
    `${apiUrl}/v1/identity/realm/${realmName}/application`,
    { method: 'GET' }
  )
  const { applications } = (await validateRequestAsJSON(
    response
  )) as ListRealmApplicationsResponse
  return applications
}
