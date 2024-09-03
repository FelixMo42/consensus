import { getRedisClient, getUserId, isAdmin, questions } from "$lib/db"
import { error, json, type ServerLoadEvent } from "@sveltejs/kit"

export async function DELETE({ params, locals }: ServerLoadEvent) {
    const client = await getRedisClient()

    const questionId = params.id
    const userId = await getUserId(client, locals, { admin: true })

    await client.del([
        `question:${questionId}`,
        `vote:${questionId}:*`
    ])

    return json(await questions(client, userId))
}
