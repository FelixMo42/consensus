import { json, type ServerLoadEvent } from "@sveltejs/kit"

export async function GET({ locals }: ServerLoadEvent) {
    const session = await locals.auth()
    return json(session)
}
