import { Categories, Difficulty, ChoiceType } from "./types"

export const numberOfQuestions: number[] = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

export const categories: Categories[] = [
    { category: "Any Category", paramValue: "" },
    { category: "General Knowledge", paramValue: "&category=9" },
    { category: "Entertainment: Books", paramValue: "&category=10" },
    { category: "Entertainment: Film", paramValue: "&category=11" },
    { category: "Entertainment: Music", paramValue: "&category=12" },
    { category: "Entertainment: Musical & Theatres", paramValue: "&category=13" },
    { category: "Entertainment: Television", paramValue: "&category=14" },
    { category: "Entertainment: Video Games", paramValue: "&category=15" },
    { category: "Entertainment: Board Games", paramValue: "&category=16" },
    { category: "Science & Nature", paramValue: "&category=17" },
    { category: "Science: Computers", paramValue: "&category=18" },
    { category: "Science: Mathematics", paramValue: "&category=19" },
    { category: "Mythology", paramValue: "&category=20" },
    { category: "Sports", paramValue: "&category=21" },
    { category: "Geography", paramValue: "&category=22" },
    { category: "History", paramValue: "&category=23" },
    { category: "Politics", paramValue: "&category=24" },
    { category: "Celebrities", paramValue: "&category=26" },
    { category: "Animals", paramValue: "&category=27" },
]

export const difficulty: Difficulty[] = [
    { mode: "Any Difficulty", modeValue: "" },
    { mode: "Easy", modeValue: "&difficulty=easy" },
    { mode: "Medium", modeValue: "&difficulty=medium" },
    { mode: "Hard", modeValue: "&difficulty=hard" }
]

export const choiceType: ChoiceType[] = [
   {type: "Any Type", typeValue: ""},
   {type: "Multiple Choice", typeValue: "&type=multiple" },
   {type: "True  False", typeValue: "&type=boolean" }
]