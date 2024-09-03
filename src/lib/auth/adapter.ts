import { redis } from "$lib/db"
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
const orcidKeyPrefix = "user:orcid:"
const userKeyPrefix = "user:data:"
const verificationTokenKeyPrefix = "user:token:"

export function hydrate(json: string) {
    return Object.entries(JSON.parse(json)).reduce((acc, [key, val]) => {
        acc[key] = isDate(val) ? new Date(val as string) : val
        return acc
    }, {} as any)
}

export function RedisAdapter(): Adapter {
    const setObjectAsJson = async (key: string, obj: any) => {
        return redis.set(key, JSON.stringify(obj))
    }

    const get = async (key: string) => {
        const raw = await redis.get(key) as string

        if (typeof raw === "string" && raw.startsWith("{")) {
            return hydrate(raw)
        } else {
            return raw
        }
    }

    const setAccount = async (id: string, account: AdapterAccount) => {
        const accountKey = accountKeyPrefix + id
        await setObjectAsJson(accountKey, account)
        await redis.set(accountByUserIdPrefix + account.userId, accountKey)
        return account
    }

    const getAccount = async (id: string) => {
        return await get(accountKeyPrefix + id)
    }

    const setSession = async (
        id: string,
        session: AdapterSession
    ): Promise<AdapterSession> => {
        const sessionKey = sessionKeyPrefix + id
        await setObjectAsJson(sessionKey, session)
        await redis.set(sessionByUserIdKeyPrefix + session.userId, sessionKey)
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
        await redis.set(`${orcidKeyPrefix}${user.email}`, id)
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
        async getUserByEmail(email) {
            const userId = await redis.get(orcidKeyPrefix + email)
            if (!userId) return null
            return await getUser(userId)
        },
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
            await redis.del(sessionKeyPrefix + sessionToken)
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
            const tokenKey =
                verificationTokenKeyPrefix +
                verificationToken.identifier +
                ":" +
                verificationToken.token

            const token = await get(tokenKey)
            await redis.del(tokenKey)

            return token
        },
        async unlinkAccount(account) {
            const id = `${account.provider}:${account.providerAccountId}`
            const dbAccount = await getAccount(id)
            if (!dbAccount) return
            const accountKey = `${accountKeyPrefix}${id}`
            await redis.del([
                accountKey,
                `${accountByUserIdPrefix} + ${dbAccount.userId as string}`
            ])
        },
        async deleteUser(userId) {
            const user = await getUser(userId)
            if (!user) return
            const accountByUserKey = accountByUserIdPrefix + userId
            const accountKey = await redis.get(accountByUserKey)
            const sessionByUserIdKey = sessionByUserIdKeyPrefix + userId
            const sessionKey = await redis.get(sessionByUserIdKey)
            await redis.del([
                userKeyPrefix + userId,
                accountKey as string,
                `${orcidKeyPrefix}${user.email as string}`,
                accountByUserKey,
                sessionKey as string,
                sessionByUserIdKey
            ])
        },
    }
}
