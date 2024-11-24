import { workos } from './workos.js';
import { WORKOS_CLIENT_ID, WORKOS_REDIRECT_URI, WORKOS_AUTHKIT_DOMAIN_OVERRIDE } from './env-variables.js';
import { GetAuthURLOptions } from './interfaces.js';
import { headers } from 'next/headers';

async function getAuthorizationUrl(options: GetAuthURLOptions = {}) {
  const headersList = await headers();
  const { returnPathname, screenHint, organizationId, redirectUri = headersList.get('x-redirect-uri') } = options;

  if (WORKOS_AUTHKIT_DOMAIN_OVERRIDE) {
    return `${WORKOS_AUTHKIT_DOMAIN_OVERRIDE}/${screenHint === "sign-up" ? "sign-up" : ""}?client_id=${WORKOS_CLIENT_ID}&redirect_uri=${redirectUri ?? WORKOS_REDIRECT_URI}&state=${returnPathname ? btoa(JSON.stringify({ returnPathname })) : ''}&response_type=code`;
  }

  return workos.userManagement.getAuthorizationUrl({
    provider: 'authkit',
    clientId: WORKOS_CLIENT_ID,
    redirectUri: redirectUri ?? WORKOS_REDIRECT_URI,
    state: returnPathname ? btoa(JSON.stringify({ returnPathname })) : undefined,
    screenHint,
    organizationId,
  });
}

export { getAuthorizationUrl };
