import { useState } from 'react'
import * as XLSX from 'xlsx'
import TablaItemizado from './TablaItemizado'

function ModuloCarga() {
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
      console.log('Primera fila cruda:', filas[0])

      const aNumero = (valor) => {
  if (!valor) return 0
  const limpio = String(valor)
    .replace(/[$%]/g, '')   // saca el símbolo $ o %
    .replace(/\./g, '')     // saca los puntos de miles
    .replace(',', '.')      // convierte la coma decimal a punto
    .trim()
  return Number(limpio)
}

      const itemizadoLeido = filas.map((fila) => ({
        rubro: fila.RUBRO,
        item: fila['ITEM'],
        designacion: fila['DESIGNACION'],
        unidad: fila.UNIDAD,
        cantidad: aNumero(fila.CANTIDAD),
        precioUnitario: aNumero(fila['PRECIO UNITARIO']),
        incidencia: aNumero(fila['PORCENTAJE DE INCIDENCIA']),
        fechaInicio: fila['FECHA DE INICIO'],
        fechaFin: fila['FECHA DE FIN'],
      }))

      setItemizado(itemizadoLeido)
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
    </div>
  )
}

export default ModuloCarga