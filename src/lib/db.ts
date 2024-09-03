import { REDIS_URL } from '$env/static/private'
import { createClient, type RedisClientType } from 'redis'
import { dev } from '$app/environment'
import type { Question } from './types'
import { error } from '@sveltejs/kit'

const client: {
    client?: RedisClientType
} = {}

interface UserIdOptions {
    admin?: boolean
}

export async function getUserId(
    client: RedisClientType,
    locals: App.Locals,
    options: UserIdOptions = {},
): Promise<string | undefined> {
    if (dev) return "0009-0005-9178-8538"

    const session = await locals.auth()
    const id = session?.user?.email ?? undefined

    if (!id) throw error(401)

    if (options.admin) {
        if (!await isAdmin(client, id)) {
            throw error(403)
        }
    }

    return id
}

export async function getRedisClient(): Promise<RedisClientType> {
    if (!client.client) {
        client.client = await createClient({
            url: REDIS_URL
        }).connect() as RedisClientType
    }

    return client.client!
}

export async function list<T>(
    client: RedisClientType,
    query: string,
    cb: (id: string, val: string) => Promise<T>
): Promise<T[]> {
    const keys = await client.keys(query) as unknown as string[]

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

export function questions(client: RedisClientType, userId?: string) {
    return list<Question>(client, 'question:*', async (id, question) => ({
        id,
        question,
        votes: await calcVotes(client, id),
        myVote: await client.get(`vote:${id}:${userId}`)
    }))
}


export function getNewId(pre = "") {
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

export async function isAdmin(client: RedisClientType, userId: string) {
    return await client.get(`user:role:${userId}`) === "admin"
}
