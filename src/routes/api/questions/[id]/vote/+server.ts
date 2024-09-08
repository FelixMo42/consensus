import { getUserId, questions, redis } from "$lib/db"
import { error, json, type ServerLoadEvent } from "@sveltejs/kit"

export async function POST({ params, request, locals }: ServerLoadEvent) {
    const questionId = params.id
    const { vote } = await request.json()
    const userId = await getUserId(locals)

    await redis.set(`vote:${questionId}:${userId}`, vote)
    return json(await questions(userId))
}
