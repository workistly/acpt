export interface Question {
  answer4: string
  answer1: string
  question: string
  answer3: string
  answer2: string
  correctAnswer: string
  is_archived: boolean
  language: string
  docId: string
}

export interface QuestionPayload {
  question: string
  answer1: string
  answer2: string
  answer3: string
  answer4: string
  correctAnswer: string
  language: string
  is_archived: boolean
}
