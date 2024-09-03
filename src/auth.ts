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
        wellKnown: "https://orcid.org/oauth",
        profile(response) {
            return response
        }
    }],
    trustHost: true,
})
