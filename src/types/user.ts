export interface User {
  user: string
  email: string
  docId: string
  certificateNo: string
  dateJoined: string
  isAdmin: boolean
}

export interface UserDetail {
  firstName: string
  lastName: string
  type: string
  email: string
  createdAt:
    | {
        seconds: number
        nanoseconds: number
      }
    | string
  is_archived?: boolean
}
