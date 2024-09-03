import { getRedisClient } from "$lib/db"
import {
    type Adapter,
    type AdapterUser,
    type AdapterAccount,
    type AdapterSession,
    isDate,
} from "@auth/core/adapters"

const accountKeyPrefix = "user:account:"
const accountByUserIdPrefix = "user:account:by-user-id:"
const sessionKeyPrefix = "user:session:"
const sessionByUserIdKeyPrefix = "user:session:by-user-id:"
const userKeyPrefix = "user:"
const verificationTokenKeyPrefix = "user:token:"

export function hydrate(json: string) {
    return Object.entries(JSON.parse(json)).reduce((acc, [key, val]) => {
        acc[key] = isDate(val) ? new Date(val as string) : val
        return acc
    }, {} as any)
}

export function RedisAdapter(): Adapter {
    const setObjectAsJson = async (key: string, obj: any) => {
        const client = await getRedisClient()
        return client.set(key, JSON.stringify(obj))
    }

    const get = async (key: string) => {
        const client = await getRedisClient()
        const raw = await client.get(key) as string

        if (raw.startsWith("{")) {
            return hydrate(raw)
        } else {
            return raw
        }
    }

    const setAccount = async (id: string, account: AdapterAccount) => {
        const client = await getRedisClient()
        const accountKey = accountKeyPrefix + id
        await setObjectAsJson(accountKey, account)
        await client.set(accountByUserIdPrefix + account.userId, accountKey)
        return account
    }

    const getAccount = async (id: string) => {
        return await get(accountKeyPrefix + id)
    }

    const setSession = async (
        id: string,
        session: AdapterSession
    ): Promise<AdapterSession> => {
        const client = await getRedisClient()
        const sessionKey = sessionKeyPrefix + id
        await setObjectAsJson(sessionKey, session)
        await client.set(sessionByUserIdKeyPrefix + session.userId, sessionKey)
        return session
    }

    const getSession = async (id: string) => {
        return get(sessionKeyPrefix + id)
    }

    const setUser = async (
        id: string,
        user: AdapterUser
    ): Promise<AdapterUser> => {
        await setObjectAsJson(userKeyPrefix + id, user)
        return user
    }

    const getUser = async (id: string) => {
        return get(userKeyPrefix + id)
    }

    return {
        async createUser(user) {
            const id = crypto.randomUUID()
            // TypeScript thinks the emailVerified field is missing
            // but all fields are copied directly from user, so it's there
            return await setUser(id, { ...user, id })
        },
        getUser,
        async getUserByAccount(account) {
            const dbAccount = await getAccount(
                `${account.provider}:${account.providerAccountId}`
            )
            if (!dbAccount) return null
            return await getUser(dbAccount.userId)
        },
        async updateUser(updates) {
            const userId = updates.id as string
            const user = await getUser(userId)
            return await setUser(userId, { ...(user as AdapterUser), ...updates })
        },
        async linkAccount(account) {
            const id = `${account.provider}:${account.providerAccountId}`
            return await setAccount(id, { ...account, id })
        },
        createSession: (session) => setSession(session.sessionToken, session),
        async getSessionAndUser(sessionToken) {
            const session = await getSession(sessionToken)
            if (!session) return null
            const user = await getUser(session.userId)
            if (!user) return null
            return { session, user }
        },
        async updateSession(updates) {
            const session = await getSession(updates.sessionToken)
            if (!session) return null
            return await setSession(updates.sessionToken, { ...session, ...updates })
        },
        async deleteSession(sessionToken) {
            const client = await getRedisClient()
            await client.del(sessionKeyPrefix + sessionToken)
        },
        async createVerificationToken(verificationToken) {
            await setObjectAsJson(
                verificationTokenKeyPrefix +
                verificationToken.identifier +
                ":" +
                verificationToken.token,
                verificationToken
            )
            return verificationToken
        },
        async useVerificationToken(verificationToken) {
            const client = await getRedisClient()

            const tokenKey =
                verificationTokenKeyPrefix +
                verificationToken.identifier +
                ":" +
                verificationToken.token

            const token = await get(tokenKey)
            await client.del(tokenKey)

            return token
        },
        async unlinkAccount(account) {
            const client = await getRedisClient()

            const id = `${account.provider}:${account.providerAccountId}`
            const dbAccount = await getAccount(id)
            if (!dbAccount) return
            const accountKey = `${accountKeyPrefix}${id}`
            await client.del([
                accountKey,
                `${accountByUserIdPrefix} + ${dbAccount.userId as string}`
            ])
        },
        async deleteUser(userId) {
            const client = await getRedisClient()
            const user = await getUser(userId)
            if (!user) return
            const accountByUserKey = accountByUserIdPrefix + userId
            const accountKey = await client.get(accountByUserKey)
            const sessionByUserIdKey = sessionByUserIdKeyPrefix + userId
            const sessionKey = await client.get(sessionByUserIdKey)
            await client.del([
                userKeyPrefix + userId,
                accountKey as string,
                accountByUserKey,
                sessionKey as string,
                sessionByUserIdKey
            ])
        },
    }
}
