import { getRedisClient, getUserId, questions } from "$lib/db";
import { fail, json, type ServerLoadEvent } from "@sveltejs/kit";

export async function POST({ params, request, locals }: ServerLoadEvent) {
    const questionId = params.id
    const { vote } = await request.json()
    const userId = await getUserId(locals)

    if (!userId) return fail(401)

    const client = await getRedisClient()
    await client.set(`vote:${questionId}:${userId}`, vote)
    return json(await questions(client))
}
