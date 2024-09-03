import { json, type ServerLoadEvent } from '@sveltejs/kit'
import { questions, getNewId, getUserId, redis } from '$lib/db'

export async function GET({ locals }: ServerLoadEvent) {
    const userId = await getUserId(locals)
    return json(await questions(userId))
}

export async function POST({ request, locals }: ServerLoadEvent) {
    const userId = await getUserId(locals, { admin: true })
    const { question } = await request.json()
    const id = getNewId("Q")

    await redis.set(`question:${id}`, question)
    return json(await questions(userId))
}
