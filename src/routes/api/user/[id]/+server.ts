import { json, type ServerLoadEvent } from '@sveltejs/kit'
import { getRedisClient, getUserId, users } from '$lib/db'

export async function POST({ request, locals, params }: ServerLoadEvent) {
    const client = await getRedisClient()
    await getUserId(client, locals, { admin: true })
    
    const { id } = params
    const { role } = await request.json()

    await client.set(`user:role:${id}`, role)

    return json(await users(client))
}

export async function DELETE({ params, locals }: ServerLoadEvent) {
    const client = await getRedisClient()
    await getUserId(client, locals, { admin: true })
    const { id } = params

    const uuid = await client.get(`user:orcid:${id}`)
    const session = await client.get(`user:session:by-user-id:${uuid}`)

    client.del([
        ...await client.keys(`*${id}*`),
        ...await client.keys(`*${uuid}*`),
        session
    ])

    return json(await users(client))
}
