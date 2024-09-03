export async function GET({ event }) {
    const session = await event.locals.auth()

    if (!session?.user?.userId) {
        return new Response(null, { status: 401, statusText: "Unauthorized" })
    }

    return "HI!"
}