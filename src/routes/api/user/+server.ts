import { getRedisClient, getUserId, users } from "$lib/db"
import { json, type ServerLoadEvent } from "@sveltejs/kit"

export async function GET({ locals }: ServerLoadEvent) {
    const client = await getRedisClient()
    const userId = await getUserId(client, locals, { admin: true })
    return json(await users(client))
}
