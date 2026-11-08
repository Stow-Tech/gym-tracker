const LB_PER_KG = 2.20462

export function convertWeight(value, from, to) {
  const v = parseFloat(value)
  if (Number.isNaN(v)) return null
  if (from === to) return v
  return from === 'kg' ? v * LB_PER_KG : v / LB_PER_KG
}

export function toLb(value, unit) {
  return convertWeight(value, unit || 'kg', 'lb')
}

// Texto de series/repeticiones de un registro (nuevo o viejo). Nunca devuelve "null".
export function describeSets(log) {
  if (Array.isArray(log.set_reps) && log.set_reps.length) return log.set_reps.join(' / ')
  if (log.sets_done && log.reps_done) return `${log.sets_done}×${log.reps_done}`
  if (log.sets_done) return `${log.sets_done} series`
  if (log.reps_done) return `${log.reps_done} reps`
  return ''
}

export function describeWeight(log) {
  if (log.kg_used === null || log.kg_used === undefined || log.kg_used === '') return ''
  return `${Number(log.kg_used)}${log.unit || 'kg'}`
}
