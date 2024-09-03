import { fail, json, type ServerLoadEvent } from '@sveltejs/kit';
import { getRedisClient, questions, getNewId, getUserId } from '$lib/db';

export async function GET({ locals }: ServerLoadEvent) {
    const client = await getRedisClient();
    const userId = await getUserId(locals);
    return json(await questions(client, userId));
}

export async function POST({ request, locals }: ServerLoadEvent) {
    const userId = await getUserId(locals)
    const { question } = await request.json()
    const id = getNewId("Q")

    if (!userId) return fail(401) 

    const client = await getRedisClient()
    await client.set(`question:${id}`, question)
    return json(await questions(client, userId));
}
