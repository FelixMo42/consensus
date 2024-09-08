import { REDIS_URL } from '$env/static/private'
import Redis from 'ioredis'
import { dev } from '$app/environment'
import type { Question } from './types'
import { error } from '@sveltejs/kit'

/** Shared **/

export const redis = new Redis(REDIS_URL)

export async function list<T>(
    query: string,
    cb: (id: string, val: string) => Promise<T>
): Promise<T[]> {
    const keys = await redis.keys(query) as unknown as string[]

    return Promise.all(keys.map(async (key) => cb(
        key.split(":").at(-1)!,
        await redis.get(key) as string
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

export function users() {
    return list("user:data:*", async (_id, name) => {
        const raw = JSON.parse(name)

        return {
            id: raw.email,
            firstName: raw.givenName,
            lastName: raw.familyName,
            role: await getUserRole(raw.email)
        }
    })
}

export async function getUserId(
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
        if (await getUserRole(id) !== "admin") {
            throw error(403)
        }
    }

    // Return
    return id
}

export async function getUserRole(id: string) {
    return (await redis.get(`user:role:${id}`)) ?? 'pending'
}

/** Questions **/

export function questions(userId?: string) {
    return list<Question>('question:*', async (id, question) => ({
        id,
        question,
        votes: await calcVotes(id),
        myVote: await redis.get(`vote:${id}:${userId}`) as string
    }))
}

async function calcVotes(qId: string) {
    const votes: { [key: string]: number } = {}

    await list(`vote:${qId}:*`, async (userId, vote) => {
        if (["admin", "expert"].includes(await getUserRole(userId))) {
            votes[vote] = 1 + (votes[vote] ?? 0)
        }
    })

    return votes
}
