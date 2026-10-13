console.log('caminoCritico: versión nueva cargada')
const MS_DIA = 86400000
// Acepta dd/mm/aaaa. Devuelve NaN si la fecha está vacía o mal formada
const aDias = (texto) => {
  if (texto === undefined || texto === null || texto === '') return NaN
  const partes = String(texto).trim().split(/[/\-.]/).map(Number)
  if (partes.length !== 3 || partes.some(Number.isNaN)) return NaN
  let [d, m, a] = partes
  if (a < 100) a += 2000
  if (m < 1 || m > 12 || d < 1 || d > 31) return NaN
  return Math.round(Date.UTC(a, m - 1, d) / MS_DIA)
}

const deDias = (n) => {
  const f = new Date(n * MS_DIA)
  const dd = String(f.getUTCDate()).padStart(2, '0')
  const mm = String(f.getUTCMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}/${f.getUTCFullYear()}`
}
const normalizarPreds = (valor) =>
  (Array.isArray(valor) ? valor : String(valor ?? '').split(/[,;]+/))
    .map((p) => String(p).trim())
    .filter(Boolean)

export function calcularCaminoCritico(items) {
  // 1. Códigos repetidos
  console.log('items dentro de la función:', items)
  const conteo = {}
  items.forEach((it) => { conteo[it.item] = (conteo[it.item] || 0) + 1 })
  const repetidos = Object.keys(conteo).filter((k) => conteo[k] > 1)
  if (repetidos.length) {
    return {
      error: 'Códigos de ítem repetidos',
      detalle: repetidos.map((k) => `Ítem ${k}: aparece ${conteo[k]} veces`),
    }
  }

  // 2. Fechas inválidas
  const fechasMalas = items.filter((it) => {
    const i = aDias(it.fechaInicio)
    const f = aDias(it.fechaFin)
    return Number.isNaN(i) || Number.isNaN(f) || f < i
  })
  if (fechasMalas.length) {
    return {
      error: 'Fechas inválidas, vacías o con fin anterior al inicio',
      detalle: fechasMalas.map(
        (it) => `Ítem ${it.item}: inicio "${it.fechaInicio}", fin "${it.fechaFin}"`
      ),
    }
  }

  // 3. Nodos
  const nodos = new Map(
    items.map((it) => [
      String(it.item),
      {
        ...it,
        id: String(it.item),
        preds: normalizarPreds(it.predecesores ?? it.predecesoras ?? it.predecesora),
        sucs: [],
        dur: aDias(it.fechaFin) - aDias(it.fechaInicio) + 1,
      },
    ])
  )

  // 4. Predecesoras que no existen en el itemizado
  const inexistentes = []
  nodos.forEach((n) =>
    n.preds.forEach((p) => {
      if (!nodos.has(p)) inexistentes.push(`Ítem ${n.id}: predecesora "${p}" no existe`)
    })
  )
  if (inexistentes.length) {
    return { error: 'Predecesoras inexistentes', detalle: inexistentes }
  }

  nodos.forEach((n) => n.preds.forEach((p) => nodos.get(p).sucs.push(n.id)))

  // 5. Orden topológico (Kahn) y detección de ciclos
  const grado = new Map([...nodos].map(([id, n]) => [id, n.preds.length]))
  const cola = [...nodos.keys()].filter((id) => grado.get(id) === 0)
  const orden = []
  while (cola.length) {
    const id = cola.shift()
    orden.push(id)
    nodos.get(id).sucs.forEach((s) => {
      grado.set(s, grado.get(s) - 1)
      if (grado.get(s) === 0) cola.push(s)
    })
  }
  if (orden.length !== nodos.size) {
    return {
      error: 'Dependencia circular',
      detalle: [...nodos.keys()]
        .filter((id) => !orden.includes(id))
        .map((id) => `Ítem ${id}`),
    }
  }

  // 6. Pasada hacia adelante (fin-a-inicio, sin demoras)
  orden.forEach((id) => {
    const n = nodos.get(id)
    n.es = n.preds.length ? Math.max(...n.preds.map((p) => nodos.get(p).ef)) : 0
    n.ef = n.es + n.dur
  })
  const total = Math.max(...[...nodos.values()].map((n) => n.ef))

  // 7. Pasada hacia atrás
  ;[...orden].reverse().forEach((id) => {
    const n = nodos.get(id)
    n.lf = n.sucs.length ? Math.min(...n.sucs.map((s) => nodos.get(s).ls)) : total
    n.ls = n.lf - n.dur
    n.holgura = n.ls - n.es
    n.critica = n.holgura === 0
  })

  // 8. Resultado con fechas calendario
  const inicioProyecto = Math.min(...items.map((i) => aDias(i.fechaInicio)))
  const resultado = orden.map((id) => {
    const n = nodos.get(id)
    return {
      item: n.id,
      designacion: n.designacion,
      duracion: n.dur,
      inicioTemprano: deDias(inicioProyecto + n.es),
      finTemprano: deDias(inicioProyecto + n.ef - 1),
      inicioTardio: deDias(inicioProyecto + n.ls),
      finTardio: deDias(inicioProyecto + n.lf - 1),
      fechaInicioCargada: n.fechaInicio,
      fechaFinCargada: n.fechaFin,
      holgura: n.holgura,
      critica: n.critica,
    }
  })

  return { resultado, duracionTotal: total }
}