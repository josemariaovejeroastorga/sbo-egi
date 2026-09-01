function TablaItemizado({datos}) {
return(
    <table>
        <thead>
            <tr>
                <th>Rubro</th>
                <th>Item</th>
                <th>Designación</th>
                <th>Unidad</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>% Incidencia</th>
                <th>Fecha de inicio</th>
                <th>Fecha de fin</th>
            </tr>
        </thead>
        <tbody>
            {datos.map((fila, indice) => (
                <tr key={indice}>
                    <td>{fila.item}</td>
                    <td>{fila.rubro}</td>
                    <td>{fila.designacion}</td>
                    <td>{fila.unidad}</td>
                    <td>{fila.cantidad}</td>
                    <td>{fila.precioUnitario}</td>
                    <td>{fila.incidencia}</td>
                    <td>{fila.fechaInicio}</td>
                    <td>{fila.fechaFin}</td>
                </tr>
            ))}
        </tbody>
    </table>
)
}

export default TablaItemizado
