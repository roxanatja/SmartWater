import InventariosLayout from '../InventariosLayout/InventariosLayout'

const Salidas = () => {
    return (
        <>
            <InventariosLayout filtro swith switchDetails={[
                {
                    isSelected: false,
                    text: "Otros ingresos de almacén",
                    url: "/Finanzas/Inventarios/Otros/Ingresos"
                },
                {
                    isSelected: true,
                    text: "Otras salidas de almacén",
                    url: "/Finanzas/Inventarios/Otros/Salidas"
                },
            ]} add onAdd={() => { alert("OnAdd") }}>
                Salidas
            </InventariosLayout>
        </>
    )
}

export default Salidas