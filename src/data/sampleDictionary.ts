export interface Word {
  id: string
  word: string
  definition: string
  category?: string
  example?: string
  etymology?: string
}

export const sampleWords: Word[] = [
  {
    id: '1',
    word: 'ciàcola',
    definition: 'Chiacchiera, conversazione',
    category: 'sostantivo',
    example: 'Far na ciàcola',
    etymology: 'Dal latino tardo'
  }
]
