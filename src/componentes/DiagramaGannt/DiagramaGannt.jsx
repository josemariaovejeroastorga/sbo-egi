import { deDias } from '../CaminoCritico/caminoCritico'

const PX_DIA = 14
const ALTO_FILA = 26
const ANCHO_ETIQUETA = 260

function DiagramaGantt({ resultado, duracionTotal, inicioProyecto }) {
  const filas = [...resultado].sort((a, b) => a.posicion - b.posicion)
  const marcas = []
  for (let d = 0; d <= duracionTotal; d += 7) marcas.push(d)

  return (
    <div>
      <h3>Diagrama de Gantt</h3>
      <p style={{ fontSize: 13 }}>
        <span style={{ color: '#d62828' }}>■</span> Crítico{' '}
        <span style={{ color: '#2a6fdb' }}>■</span> No crítico{' '}
        <span style={{ color: '#bcd3f7' }}>■</span> Holgura
      </p>
      <div style={{ display: 'flex', overflowX: 'auto', border: '1px solid #ccc' }}>
        <div
          style={{
            width: ANCHO_ETIQUETA,
            flexShrink: 0,
            position: 'sticky',
            left: 0,
            background: '#fff',
            zIndex: 1,
          }}
        >
          <div style={{ height: ALTO_FILA }} />
          {filas.map((f) => (
            <div
              key={f.item}
              style={{
                height: ALTO_FILA,
                lineHeight: `${ALTO_FILA}px`,
                fontSize: 12,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontWeight: f.critica ? 600 : 400,
              }}
              title={`${f.item} - ${f.designacion}`}
            >
              {f.item} - {f.designacion}
            </div>
          ))}
        </div>

        <div
          style={{
            position: 'relative',
            width: duracionTotal * PX_DIA,
            height: ALTO_FILA * (filas.length + 1),
          }}
        >
          {marcas.map((d) => (
            <div
              key={d}
              style={{
                position: 'absolute',
                left: d * PX_DIA,
                top: 0,
                bottom: 0,
                borderLeft: '1px solid #e5e5e5',
                fontSize: 10,
                paddingLeft: 2,
              }}
            >
              {deDias(inicioProyecto + d).slice(0, 5)}
            </div>
          ))}

          {filas.map((f, i) => {
            const top = (i + 1) * ALTO_FILA + 5
            return (
              <div key={f.item}>
                {f.holgura > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top,
                      height: ALTO_FILA - 10,
                      left: (f.es + f.duracion) * PX_DIA,
                      width: f.holgura * PX_DIA,
                      background: '#bcd3f7',
                    }}
                  />
                )}
                <div
                  title={`${f.item}: ${f.inicioTemprano} → ${f.finTemprano} (${f.duracion} d, holgura ${f.holgura})`}
                  style={{
                    position: 'absolute',
                    top,
                    height: ALTO_FILA - 10,
                    left: f.es * PX_DIA,
                    width: f.duracion * PX_DIA,
                    background: f.critica ? '#d62828' : '#2a6fdb',
                    borderRadius: 2,
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default DiagramaGantt