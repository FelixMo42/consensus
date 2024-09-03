import { getRedisClient, getUserId, questions } from "$lib/db"
import { error, json, type ServerLoadEvent } from "@sveltejs/kit"

export async function POST({ params, request, locals }: ServerLoadEvent) {
    const client = await getRedisClient()

    const questionId = params.id
    const { vote } = await request.json()
    const userId = await getUserId(client, locals, { admin: true })

    await client.set(`vote:${questionId}:${userId}`, vote)
    return json(await questions(client, userId))
}
