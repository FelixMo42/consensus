import { getRedisClient, getUserId, questions } from "$lib/db";
import { fail, json, type ServerLoadEvent } from "@sveltejs/kit";

export async function DELETE({ params, locals }: ServerLoadEvent) {
    console.log("HI")
    const questionId = params.id
    const userId = await getUserId(locals)

    if (!userId) return fail(401)

    const client = await getRedisClient()

    await client.del([
        `question:${questionId}`,
        `vote:${questionId}:*`
    ])

    return json(await questions(client, userId))
}
