import { useMemo } from 'react'
import {calcularCaminoCritico} from '../CaminoCritico/caminoCritico'
import DiagramaGantt from '../DiagramaGannt/DiagramaGannt'

function ModuloAnalisis({ items=[] }) {
  
  console.log('ANÁLISIS renderizado con', items.length, 'ítems')
  const analisis = useMemo(() => (items.length ? calcularCaminoCritico(items):null), [items])
  console.log('analisis =', analisis)
  if (!analisis) return <p>Todavía no hay predecesoras confirmadas</p>

  if (analisis.error) {
    return (
      <div style={{ color: 'crimson' }}>
        <h2>Análisis del camino crítico</h2>
        <p>{analisis.error}:</p>
        <ul>
          {analisis.detalle.map((d, i) => (
            <li key={i}>
              {typeof d === 'string' ? `Ítem ${d}` : `Ítem ${d.item}: predecesora ${d.predecesora}`}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const critica = analisis.resultado.filter((r) => r.critica)

  return (
    <div>
      <h2>Análisis del camino crítico</h2>
      <p>
        Duración total: <b>{analisis.duracionTotal} días</b> · Ítems críticos:{' '}
        <b>{critica.length}</b> de {analisis.resultado.length}
      </p>
      <table>
        <thead>
          <tr>
            <th>Ítem</th>
            <th>Designación</th>
            <th>Dur.</th>
            <th>Inicio cargado</th>
            <th>Inicio temprano</th>
            <th>Fin temprano</th>
            <th>Inicio tardío</th>
            <th>Fin tardío</th>
            <th>Holgura</th>
          </tr>
        </thead>
        <tbody>
          {analisis.resultado.map((r) => (
            <tr
              key={r.item}
              style={r.critica ? { background: '#fde2e2', fontWeight: 600 } : {}}
            >
              <td>{r.item}</td>
              <td>{r.designacion}</td>
              <td>{r.duracion}</td>
              <td>{r.fechaInicioCargada}</td>
              <td>{r.inicioTemprano}</td>
              <td>{r.finTemprano}</td>
              <td>{r.inicioTardio}</td>
              <td>{r.finTardio}</td>
              <td>{r.holgura}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <DiagramaGantt 
      resultado={analisis.resultado}
      duracionTotal={analisis.duracionTotal}
      inicioProyecto={analisis.inicioProyecto}/>
    </div>
  )
}

export default ModuloAnalisis