import { json } from '@sveltejs/kit';
import { createClient } from 'redis';
import { REDIS_URL } from '$env/static/private';

const client = await createClient({
    url: REDIS_URL
}).connect();

function getNewId(pre="") {
    const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

    let num = Date.now()
    let id = ""

    while (num > 0) {
        const q = num % alphabet.length
        num = (num - q) / alphabet.length
        id += alphabet[q]
    }

    return pre + id
}

export async function GET() {
	const keys = await client.keys('question:*');

    const res = await Promise.all(keys.map(async (key) => ({
        id: key.split(":").at(-1),
        question: await client.get(key)
    })))

	return json(res);
}

export async function POST({ request }) {
	const { question } = await request.json()
	const id = getNewId("Q")
	await client.set(`question:${id}`, question)

	return json({ id });
}
