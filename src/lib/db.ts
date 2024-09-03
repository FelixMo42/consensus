import { REDIS_URL } from '$env/static/private'
import { createClient, type RedisClientType } from 'redis'
import { dev } from '$app/environment'
import type { Question } from './types'
import { error } from '@sveltejs/kit'

/** Shared **/

const client: {
    client?: RedisClientType
} = {}

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

export function getNewId(pre = "") {
    const alphabet = [
        "0123456789",
        "abcdefghijklmnopqrstuvwxyz",
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    ].join("")

    let num = Date.now()
    let id = ""

    while (num > 0) {
        const q = num % alphabet.length
        num = (num - q) / alphabet.length
        id += alphabet[q]
    }

    return pre + id
}

/** User **/

export function users(client: RedisClientType) {
    return list(client, "user:user:*", async (_id, name) => {
        const raw = JSON.parse(name)

        return {
            id: raw.email,
            firstName: raw.givenName,
            lastName: raw.familyName,
            role: await getUserRole(client, raw.email)
        }
    })
}

export async function getUserId(
    client: RedisClientType,
    locals: App.Locals,
    options: {
        admin?: boolean
    } = {},
): Promise<string | undefined> {
    // Dev mode!!!! (that's me!)
    if (dev) return "0009-0005-9178-8538"

    // Get the id from auth state 
    const session = await locals.auth()
    const id = session?.user?.email ?? undefined

    // If no id, then we have a problem
    if (!id) throw error(401)

    // Is this admin only?
    if (options.admin) {
        if (await getUserRole(client, id) !== "admin") {
            throw error(403)
        }
    }

    // Return
    return id
}

export function getUserRole(client: RedisClientType, id: string) {
    return client.get(`user:role:${id}`) ?? 'pending' 
}

/** Questions **/

export function questions(client: RedisClientType, userId?: string) {
    return list<Question>(client, 'question:*', async (id, question) => ({
        id,
        question,
        votes: await calcVotes(client, id),
        myVote: await client.get(`vote:${id}:${userId}`)
    }))
}

async function calcVotes(client: RedisClientType, qId: string) {
    const votes: { [key: string]: number } = {}

    await list(client, `vote:${qId}:*`, async (userId, vote) => {
        if (["admin", "expert"].includes(await getUserRole(client, userId))) {
            votes[vote] = 1 + (votes[vote] ?? 0)
        }
    })

    return votes
}
