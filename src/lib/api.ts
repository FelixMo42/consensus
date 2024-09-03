import type { Question } from "./types"

export function getUserInfo() {
    return f("/api/user")
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
