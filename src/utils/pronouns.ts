import { Pronoun } from '@prisma/client'

export type ParsedPronoun = {
  he: string
  him: string
  his: string
}

export const parsePronoun = (pronoun?: Pronoun): ParsedPronoun => {
  if (pronoun === 'he')
    return {
      he: 'he',
      him: 'him',
      his: 'his',
    }

  if (pronoun === 'she') {
    return {
      he: 'she',
      him: 'her',
      his: 'hers',
    }
  }

  return {
    he: 'they',
    him: 'them',
    his: 'their',
  }
}
