export interface Question {
    id: string
    question: string
    myVote: string
    votes: {
        [key: string]: number
    }
}