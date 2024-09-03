import { getUserId, users } from "$lib/db"
import { json, type ServerLoadEvent } from "@sveltejs/kit"

export async function GET({ locals }: ServerLoadEvent) {
    const userId = await getUserId(locals, { admin: true })
    return json(await users())
}
