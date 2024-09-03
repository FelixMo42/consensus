import type { Question } from "./types";

export async function getUserInfo() {
    return fetch("/api/user", {
        credentials: 'include',
    }).then(res => res.json())
}

export async function getQuestions(): Promise<Question[]> {
    return fetch("/api/questions").then((res) => res.json())
}

export function addQuestion() {
    const question = prompt("Question?");
    return fetch("/api/questions", {
        method: "POST",
        body: JSON.stringify({
            question,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    }).then(res => res.json());
}

export function submitVote(params: {
    qId: string,
    vote: string
}): Promise<Question[]> {
    return fetch(`/api/questions/${params.qId}/vote`, {
        method: "POST",
        body: JSON.stringify({
            vote: params.vote
        })
    }).then((res) => res.json())
}
