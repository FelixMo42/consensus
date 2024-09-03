import { ORCID_CLIENT_ID, ORCID_CLIENT_SECRET } from '$env/static/private';
import { SvelteKitAuth } from "@auth/sveltekit"

console.log("HIIIII!")

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
            console.log("PROFILE", profile)
            return {
                test: "hi",
                ...profile
            }
        }
    }],
    trustHost: true,
})
