import { json, type ServerLoadEvent } from "@sveltejs/kit"

export async function GET({ locals }: ServerLoadEvent) {
    const session = await locals.auth()

    // if (!session?.user?.userId) {
    //     return new Response(null, { status: 401, statusText: "Unauthorized" })
    // }

    return json(session)
}
