type ParseMoneyOptions = {
  currency: 'USD' | 'EUR' | 'BRL'
}

const CurrencyLocaleMapper = {
  USD: 'en-US',
  EUR: 'en-UK',
  BRL: 'pt-BR',
}

export const parseMoney = (value: number, options?: ParseMoneyOptions) => {
  const { currency } = options || { currency: 'EUR' }
  const locale = CurrencyLocaleMapper[currency]

  const formatter = Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  })

  return formatter.format(Math.abs(value))
}
