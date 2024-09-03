import { getRedisClient, questions } from "$lib/db";
import { json, type ServerLoadEvent } from "@sveltejs/kit";

export async function POST({ params, request }: ServerLoadEvent) {
    const client = await getRedisClient()

    const questionId = params.id
    const { userId, vote } = await request.json()

    await client.set(`vote:${questionId}:${userId}`, vote)

    return json(await questions(client))
}
