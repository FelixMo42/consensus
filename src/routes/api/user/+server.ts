export async function GET({ locals }) {
    const session = await locals.auth()

    if (!session?.user?.userId) {
        return new Response(null, { status: 401, statusText: "Unauthorized" })
    }

    return json(session)
}
