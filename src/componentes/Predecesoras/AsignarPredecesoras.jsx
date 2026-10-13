
import { useState } from 'react'

function AsignarPredecesores({ itemizado, onConfirmar }) {
  const [predecesores, setPredecesores] = useState({})

  const manejarCambio = (itemActual, itemPredecesor) => {
    setPredecesores((anterior) => ({
      ...anterior,
      [itemActual]: itemPredecesor,
    }))
  }

  const confirmar = () => {
    const itemizadoConPredecesoras = itemizado.map((fila) => ({
      ...fila,
      predecesores: predecesores[fila.item] ? [predecesores[fila.item]] : [],
    }))
    console.log('Itemizado con predecesoras:', itemizadoConPredecesoras)
    console.log('typeof onConfirmar =', typeof onConfirmar)
     try {
     onConfirmar(itemizadoConPredecesoras)
      } catch (error) {
      console.error('Falló onConfirmar:', error)
      }
  }
  return (
    <div>
      <h2>Asignar predecesoras</h2>
      {itemizado.map((fila) => (
        <div key={fila.item}>
          <p>{fila.item} - {fila.designacion}</p>
          <select
            value={predecesores[fila.item] || ''}
            onChange={(e) => manejarCambio(fila.item, e.target.value)}
          >
            <option value="">Sin predecesora</option>
            {itemizado
              .filter((otro) => otro.item !== fila.item)
              .map((otro) => (
                <option key={otro.item} value={otro.item}>
                  {otro.item} - {otro.designacion}
                </option>
              ))}
          </select>
        </div>
      ))}
      <button onClick={confirmar}>Confirmar predecesoras</button>
    </div>
  )
}
export default AsignarPredecesores
