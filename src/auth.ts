import { ORCID_CLIENT_ID, ORCID_CLIENT_SECRET } from '$env/static/private';
import { SvelteKitAuth } from "@auth/sveltekit"
import github from '@auth/sveltekit/providers/github';

github

export const { handle, signIn, signOut } = SvelteKitAuth({
    providers: [{
        id: "orcid",
        name: "ORCID",
        type: "oidc",
        issuer: "https://orcid.org/",
        clientId: ORCID_CLIENT_ID,
        clientSecret: ORCID_CLIENT_SECRET,
        token: "https://orcid.org/oauth/token",
        userinfo: {
            userinfo: "https://orcid.org/oauth/userinfo",
            async request({ tokens, provider }) {
                return await fetch(provider.userinfo?.url as URL, {
                    headers: {
                        Authorization: `Bearer ${tokens.access_token}`,
                        "User-Agent": "authjs",
                    },
                }).then(async (res) => await res.json())
            }
        },
        profile(response) {
            return response
        }
    }],
    trustHost: true,
})
