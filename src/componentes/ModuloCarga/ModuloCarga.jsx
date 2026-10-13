import { useState } from 'react'
import * as XLSX from 'xlsx'
import TablaItemizado from '../TablaItemizado/TablaItemizado'
import AsignarPredecesoras from '../Predecesoras/AsignarPredecesoras'
//import ModuloAnalisis from '../ModuloAnalisis/ModuloAnalisis'

// Acepta número de serie de Excel o texto d/m/a, devuelve dd/mm/aaaa
const aFechaTexto = (valor) => {
  if (valor === undefined || valor === null || valor === '') return ''

  if (typeof valor === 'number') {
    // 25569 = días entre 1899-12-30 y 1970-01-01
    const f = new Date((Math.floor(valor) - 25569) * 86400000)
    const dd = String(f.getUTCDate()).padStart(2, '0')
    const mm = String(f.getUTCMonth() + 1).padStart(2, '0')
    return `${dd}/${mm}/${f.getUTCFullYear()}`
  }

  // Celda guardada como texto: se asume d/m/a
  const partes = String(valor).trim().split(/[/\-.]/).map(Number)
  if (partes.length !== 3 || partes.some(Number.isNaN)) return ''
  let [d, m, a] = partes
  if (a < 100) a += 2000
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${a}`
}

function ModuloCarga({onConfirmar}) {
  const [archivo, setArchivo] = useState(null)
  const [itemizado, setItemizado] = useState([])
    const manejarSeleccion = (evento) => {
    const archivoSeleccionado = evento.target.files[0]
    setArchivo(archivoSeleccionado)

    const lector = new FileReader()

    lector.onload = (e) => {
      const datos = new Uint8Array(e.target.result)
      const libro = XLSX.read(datos, { type: 'array' })
      const hoja = libro.Sheets[libro.SheetNames[0]]
      const filas = XLSX.utils.sheet_to_json(hoja, {
        raw: false,
        dateNF: 'dd/mm/yyyy',
        range: 2,
      })
      const filasCrudas = XLSX.utils.sheet_to_json(hoja, { raw: true, range: 2 })
      const aNumero = (valor) => {
      if (!valor) return 0
      const limpio = String(valor)
      .replace(/[$%]/g, '')   // saca el símbolo $ o %
      .replace(/\./g, '')     // saca los puntos de miles
      .replace(',', '.')      // convierte la coma decimal a punto
      .trim()
      const n = Number(limpio)
      return Number.isNaN(n) ? 0 : n
      }

      const itemizadoLeido = filas
      .map((fila, i) => ({
      rubro: fila.RUBRO,
      item: fila['ITEM'],
      designacion: fila['DESIGNACION'],
      unidad: fila.UNIDAD,
      cantidad: aNumero(fila.CANTIDAD),
      precioUnitario: aNumero(fila['PRECIO UNITARIO']),
      incidencia: aNumero(fila['PORCENTAJE DE INCIDENCIA']),
      fechaInicio: aFechaTexto(filasCrudas[i]['FECHA DE INICIO']),
      fechaFin: aFechaTexto(filasCrudas[i]['FECHA DE FIN']),
      }))
      .filter((it) => it.item && it.fechaInicio && it.fechaFin)
      setItemizado(itemizadoLeido)
      console.log(itemizadoLeido.slice(0, 5).map(i => [i.item, i.fechaInicio, i.fechaFin]))
      const posiciones = {}
          itemizadoLeido.forEach((it, i) => {
          ;(posiciones[it.item] ??= []).push(i + 4) // fila del Excel (los datos empiezan en la 4)
      })
      console.table(
      Object.entries(posiciones)
      .filter(([, filas]) => filas.length > 1)
      .map(([item, filas]) => ({ item, filasEnExcel: filas.join(', ') }))
      )
      const descartados = filas.length - itemizadoLeido.length
      if (descartados > 0) console.log(`Filas descartadas por falta de código o fechas: ${descartados}`)
      }
    lector.readAsArrayBuffer(archivoSeleccionado)
  }

  return (
    <div>
      <h2>Cargar itemizado</h2>
      <input type="file" accept=".xlsx, .xls" onChange={manejarSeleccion} />
      {archivo && <p>Archivo seleccionado: {archivo.name}</p>}
      {itemizado.length > 0 && <p>Filas cargadas: {itemizado.length}</p>}
      {itemizado.length > 0 && <TablaItemizado datos={itemizado} />}
      {itemizado.length > 0 && (
      <AsignarPredecesoras
      key={archivo?.name}
      clave={`sbo-egi:predecesores:{archivo?.name}`}
      itemizado={itemizado}
      onConfirmar={(resultado) => onConfirmar(resultado)}
      />
      )
      }
    </div>
  )
}
export default ModuloCarga