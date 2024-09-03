import { json } from '@sveltejs/kit';
import { getNewId } from '$lib/lib';
import { getRedisClient, questions } from '$lib/db';

export async function GET() {
    const client = await getRedisClient();
    return json(await questions(client));
}

export async function POST({ request }) {
    const client = await getRedisClient()

    const { question } = await request.json()
    const id = getNewId("Q")
    await client.set(`question:${id}`, question)

    return json({ id });
}
