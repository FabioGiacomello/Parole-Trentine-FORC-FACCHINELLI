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
    example: 'Far na ciàcola'
  },
  {
    id: '2',
    word: 'bón',
    definition: 'Buono, di qualità',
    category: 'aggettivo',
    example: 'Sto vin l\'è bón'
  },
  {
    id: '3',
    word: 'marangón',
    definition: 'Falegname',
    category: 'sostantivo',
    example: 'El marangón laora'
  }
]
