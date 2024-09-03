import { getUserId, questions, redis } from "$lib/db"
import { json, type ServerLoadEvent } from "@sveltejs/kit"

export async function DELETE({ params, locals }: ServerLoadEvent) {
    const questionId = params.id
    const userId = await getUserId(locals, { admin: true })

    await redis.del([
        `question:${questionId}`,
        `vote:${questionId}:*`
    ])

    return json(await questions(userId))
}
