
import { useState } from 'react'
import Encabezado from './componentes/Encabezado/Encabezado'
import CuerpoPosteo from './componentes/CuerpoPosteo/CuerpoPosteo'
import ModuloCarga from './componentes/ModuloCarga/ModuloCarga'
import PieDePosteo from './componentes/PieDePosteo/PieDePosteo'
import ModuloAnalisis from './componentes/ModuloAnalisis/ModuloAnalisis'
import './App.css'


function App() {

  const [itemizadoConPredecesoras, setItemizadoConPredecesoras] = useState([])
  console.log('APP estado:', itemizadoConPredecesoras, 'esArreglo =', Array.isArray(itemizadoConPredecesoras))
  return (
    <>
    <ModuloCarga onConfirmar={setItemizadoConPredecesoras}/>
    {itemizadoConPredecesoras.length > 0 && (
      <ModuloAnalisis items={itemizadoConPredecesoras} />
    )}  
    </>
  )
}

export default App