export interface Snippet {
  id: string
  title: string
  description: string
  language: string
  code: string
  tags: string[]
  favorite: boolean
  createdAt: string
  updatedAt: string
}

export interface SnippetInput {
  title: string
  description: string
  language: string
  code: string
  tags: string[]
}

