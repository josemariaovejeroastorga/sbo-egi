
import { useState } from 'react'
const leerGuardado = (clave,itemizado) => {
  try{
    const crudo = localStorage.getItem(clave)
    if (!crudo) return {}
    const guardado = JSON.parse(crudo)
    const codigos = new Set(itemizaedo.map((f) => f.item))
    return Object.fromEntries(
      Object.entries(guardado).filter(
        ([item,pred])=> codigos.has(item) && codigos.has(pred)
      )
    )
  } catch {
    return {}
  }
}

function AsignarPredecesores({ itemizado, onConfirmar,clave='sbo-egi:predecesores' }) {
  const [predecesores, setPredecesores] = useState(() => leerGuardado(clave,itemizado))

  const manejarCambio = (itemActual, itemPredecesor) => {
    setPredecesores((anterior) => ({
      ...anterior,
      [itemActual]: itemPredecesor,
    }))
  }

  const confirmar = () => {
    try{
      localStorage.setItem(clave,JSON.stringify(predecesores))
    }catch (error) {
      console.error('No se pudo guardar en localStorage:', error)
    }
    const itemizadoConPredecesoras = itemizado.map((fila) => ({
      ...fila,
      predecesores: predecesores[fila.item] ? [predecesores[fila.item]] : [],
    }))
      onConfirmar(itemizadoConPredecesoras)
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
