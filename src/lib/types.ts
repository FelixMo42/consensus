export interface Question {
    id: string
    question: string
    myVote: string
    votes: {
        [key: string]: number
    }
}

export interface User {
    id: string
    firstName: string
    lastName: string
    role: string
}