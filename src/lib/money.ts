import Decimal from 'decimal.js'

/** Valores em ETH trafegam como strings decimais; todo cálculo passa por Decimal. */
export type EthString = string

Decimal.set({ precision: 40, rounding: Decimal.ROUND_HALF_UP })

export const eth = (v: EthString | number) => new Decimal(v)
export const addEth = (...v: EthString[]): EthString => v.reduce((a, b) => a.plus(b), new Decimal(0)).toFixed()
export const mulEth = (v: EthString, qty: number): EthString => {
  if (!Number.isInteger(qty) || qty < 0) throw new RangeError('Quantidade deve ser inteira e não negativa')
  return new Decimal(v).times(qty).toFixed()
}
export const eqEth = (a: EthString, b: EthString) => new Decimal(a).eq(b)

/** Apresentação: pelo menos `min` casas, preservando a precisão até `max`. */
export function formatEth(v: EthString, min = 2, max = 18): string {
  const d = new Decimal(v)
  const places = Math.min(Math.max(d.decimalPlaces(), min), max)
  return `${d.toFixed(places, Decimal.ROUND_HALF_UP).replace('.', ',')} ETH`
}
