export interface Exam {
  testLanguage: string
  status: string
  price: string
  date: string
  docId: string
  isActive: boolean
  isArchived: boolean
}

export interface ExamPayload {
  language: string | null
  number_of_questions: string
  timer: string
  price: string
  exam_detail_1: string
  exam_detail_2: string
  exam_detail_3: string
  title: string
  second_title: string
  thing_rem_1: string
  thing_rem_2: string
  thing_rem_3: string
  exam_image: string
  is_archived: boolean
  is_active: boolean
  created: string
}
