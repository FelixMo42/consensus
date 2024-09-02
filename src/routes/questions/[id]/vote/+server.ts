import { getRedisClient, questions } from "$lib/db";
import { json } from "@sveltejs/kit";

export async function POST({ params, request }) {
    const client = await getRedisClient()

    const questionId = params.id
    const { userId, vote } = await request.json()

    await client.set(`vote:${questionId}:${userId}`, vote)

    return json(await questions(client))
}
