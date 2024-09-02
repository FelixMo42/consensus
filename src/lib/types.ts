export interface Question {
    id: string;
    question: string;
    votes: {
        [key: string]: number
    }
}