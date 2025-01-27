import InventariosLayout from '../InventariosLayout/InventariosLayout'

const Ingresos = () => {
    return (
        <>
            <InventariosLayout filtro swith switchDetails={[
                {
                    isSelected: true,
                    text: "Otros ingresos de almacén",
                    url: "/Finanzas/Inventarios/Otros/Ingresos"
                },
                {
                    isSelected: false,
                    text: "Otras salidas de almacén",
                    url: "/Finanzas/Inventarios/Otros/Salidas"
                },
            ]} add onAdd={() => { alert("OnAdd") }}>
                Ingresos
            </InventariosLayout>
        </>
    )
}

export default Ingresos