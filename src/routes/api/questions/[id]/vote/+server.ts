import { getRedisClient, questions } from "$lib/db";
import { fail, json, type ServerLoadEvent } from "@sveltejs/kit";

export async function POST({ params, request, locals }: ServerLoadEvent) {
    const client = await getRedisClient()
    const session = await locals.auth()

    if (!session?.user?.email) return fail(401)

    const questionId = params.id
    const { vote } = await request.json()
    const userId = session?.user?.email

    await client.set(`vote:${questionId}:${userId}`, vote)

    return json(await questions(client))
}
