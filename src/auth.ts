import { ORCID_CLIENT_ID, ORCID_CLIENT_SECRET, REDIS_URL } from '$env/static/private';
import { SvelteKitAuth } from "@auth/sveltekit"
import { RedisAdapter } from './adapter';

export const { handle, signIn, signOut } = SvelteKitAuth({
    providers: [{
        id: "orcid",
        name: "ORCID",
        type: "oidc",
        issuer: "https://orcid.org/",
        wellKnown: "https://orcid.org/.well-known/openid-configuration",
        clientId: ORCID_CLIENT_ID,
        clientSecret: ORCID_CLIENT_SECRET,
        profile(profile) {
            return {
                email: profile.sub,
                givenName: profile.given_name,
                familyName: profile.family_name
            }
        }
    }],
    adapter: RedisAdapter(),
    trustHost: true,
})
