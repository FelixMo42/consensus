import type { Question } from "./types";

export async function getUserInfo() {
    return fetch("https://orcid.org/oauth/userinfo").then(res => res.json())
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
    userId: string,
    qId: string,
    vote: string
}): Promise<Question[]> {
    return fetch(`/api/questions/${params.qId}/vote`, {
        method: "POST",
        body: JSON.stringify({
            userId: params.userId,
            vote: params.vote
        })
    }).then((res) => res.json())
}

export function getNewId(pre = "") {
    const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

    let num = Date.now()
    let id = ""

    while (num > 0) {
        const q = num % alphabet.length
        num = (num - q) / alphabet.length
        id += alphabet[q]
    }

    return pre + id
}