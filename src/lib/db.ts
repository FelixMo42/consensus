import { REDIS_URL } from '$env/static/private';
import { createClient, type RedisClientType } from 'redis';

const client: {
    client?: RedisClientType
} = {}

export async function getRedisClient(): Promise<RedisClientType> {
    if (!client.client) {
        client.client = await createClient({
            url: REDIS_URL
        }).connect();
    }

    return client.client!
}

export async function list<T>(client: RedisClientType, query: string, cb: (id: string, val: string) => T): Promise<T[]> {
    const keys = await client.keys(query) as unknown as string[];

    return Promise.all(keys.map(async (key) => cb(
        key.split(":").at(-1)!,
        await client.get(key)
    )))
}

async function calcVotes(client: RedisClientType, qId: string) {
    const votes: { [key: string]: number } = {}

    await list(client, `vote:${qId}:*`, async (userId, vote) => {
        votes[vote] = 1 + (votes[vote] ?? 0)
    })

    return votes
}

export function questions(client: RedisClientType) {
    return list(client, 'question:*', async (id, question) => ({
        id,
        question,
        votes: await calcVotes(client, id)
    }))
}


