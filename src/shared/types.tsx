export type Categories = {
    category: string,
    paramValue: string
}
export type Difficulty = {
    mode: string,
    modeValue: "" | "&difficulty=easy" | "&difficulty=medium" | "&difficulty=hard"
}

export type ChoiceType = {
    type: string,
    typeValue: "" | "&type=multiple" | "&type=boolean"
}

export type Endpoint = {
    limitOfQuestion: number,
    category: string,
    difficulty: string,
    type: string
}

export type Questionaire = {
    category: string,
    correct_answer: string,
    difficulty: string,
    incorrect_answers: string[],
    question: string,
    type: string,
}