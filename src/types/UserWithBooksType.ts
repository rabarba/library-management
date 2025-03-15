export type UserWithBooks = {
  id: number,
  name: string,
  books: {
    past: PastBooksType[],
    present: PresentBooksType[]
  }
}

export type PastBooksType = {
  name: string,
  userScore: number
}

export type PresentBooksType = {
  name: string
}