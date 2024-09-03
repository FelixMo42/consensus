import type { Question, User } from "./types"

export function getUsers() {
    return f<User[]>("/api/user")
}

export function removeUsers(userId: string) {
    return f<User[]>(`/api/user/${userId}`, "DELETE")
}

export function setUserRole(userId: string, role: string) {
    return f<User[]>(`/api/user/${userId}`, { role })
}

export function getQuestions(): Promise<Question[]> {
    return f<Question[]>("/api/questions")
}

export function addQuestion(question: string) {
    if (question === "") {
        return alert("Question can not be empty!")
    }

    return f<Question[]>("/api/questions", { question })
}

export function removeQuestion(id: string) {
    return f<Question[]>(`/api/questions/${id}`, "DELETE")
}

export function submitVote(id: string, vote: string) {
    return f<Question[]>(`/api/questions/${id}/vote`, { vote })
}

async function f<T>(url: string, body?: any): Promise<T> {
    const response = await fetch(url,
        typeof body === "string" ? {
            method: body
        }
        : body ? {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
        }
        : {
            method: "GET"
        }
    )

    return response.json()
}
