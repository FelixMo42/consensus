import { error, json, type ServerLoadEvent } from '@sveltejs/kit'
import { getRedisClient, questions, getNewId, getUserId, isAdmin } from '$lib/db'

export async function GET({ locals }: ServerLoadEvent) {
    const client = await getRedisClient()
    const userId = await getUserId(client, locals)
    return json(await questions(client, userId))
}

export async function POST({ request, locals }: ServerLoadEvent) {
    const client = await getRedisClient()

    const userId = await getUserId(client, locals, { admin: true })
    const { question } = await request.json()
    const id = getNewId("Q")

    await client.set(`question:${id}`, question)
    return json(await questions(client, userId))
}
