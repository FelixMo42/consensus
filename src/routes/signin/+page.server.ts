import { signIn } from "../../lib/auth/auth"
import type { Actions } from "./$types"
export const actions: Actions = { default: signIn }