import { json, type ServerLoadEvent } from '@sveltejs/kit'
import { getUserId, redis, users } from '$lib/db'

export async function POST({ request, locals, params }: ServerLoadEvent) {
    await getUserId(locals, { admin: true })
    
    const { id } = params
    const { role } = await request.json()

    await redis.set(`user:role:${id}`, role)

    return json(await users())
}

export async function DELETE({ params, locals }: ServerLoadEvent) {
    await getUserId(locals, { admin: true })
    const { id } = params

    const uuid = await redis.get(`user:orcid:${id}`)
    const session = await redis.get(`user:session:by-user-id:${uuid}`)

    redis.del([
        ...await redis.keys(`*${id}*`),
        ...await redis.keys(`*${uuid}*`),
        session
    ])

    return json(await users())
}
