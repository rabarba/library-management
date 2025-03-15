export type UserWithBooks = {
  id: number,
  name: string,
  books: {
    past: BooksType[],
    present: BooksType[]
  }
}

export type BooksType = {
  name: string,
  userScore?: number
}