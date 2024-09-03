import { json, type ServerLoadEvent } from '@sveltejs/kit';
import { getRedisClient, questions, getNewId } from '$lib/db';

export async function GET() {
    const client = await getRedisClient();
    return json(await questions(client));
}

export async function POST({ request }: ServerLoadEvent) {
    const client = await getRedisClient()

    const { question } = await request.json()
    const id = getNewId("Q")
    await client.set(`question:${id}`, question)

    return json({ id });
}
