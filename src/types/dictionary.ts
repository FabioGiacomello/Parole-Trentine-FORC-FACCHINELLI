export interface Word {
  id: string
  word: string
  definition: string
  category: string | null
  example: string | null
  etymology: string | null
  created_at: string
  updated_at: string
}
