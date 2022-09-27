import { Pronoun } from '@prisma/client'

export type ParsedPronoun = {
  he: string
  He: string

  him: string
  Him: string

  his: string
  His: string
}

export const parsePronoun = (pronoun?: Pronoun): ParsedPronoun => {
  if (pronoun === 'he')
    return {
      he: 'he',
      He: 'He',

      him: 'him',
      Him: 'Him',

      his: 'his',
      His: 'His',
    }

  if (pronoun === 'she') {
    return {
      he: 'she',
      He: 'She',

      him: 'her',
      Him: 'her',

      his: 'hers',
      His: 'Hers',
    }
  }

  return {
    he: 'they',
    He: 'They',

    him: 'them',
    Him: 'them',

    his: 'their',
    His: 'Their',
  }
}
