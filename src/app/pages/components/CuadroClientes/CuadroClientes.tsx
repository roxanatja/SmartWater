import "./CuadroClientes.css";

type cliente = {
    id: number,
    nombre: string,
    img: string
}

export const Clientes: Array<cliente> = [
    {
        id: 1,
        nombre: "Daniela Anaya",
        img: "./Cliente1.svg"
    },
    {
        id: 2,
        nombre: "Rubén González",
        img: "./Cliente2.svg"
    },
    {
        id: 3,
        nombre: "Mariana Reyes",
        img: "./Cliente3.svg"
    },
    {
        id: 4,
        nombre: "Julio Espinoza",
        img: "./Cliente4.svg"
    }
];

const CuadroClientes = () => {
    return (
        <>
            <div className="cuadroClientes">
                <div className="titulo-cliente">
                    <div>
                        <span className="Cliente-title">Clientes <span className="Cliente-title2">vista rapida</span> </span>
                    </div>
                    <div className="opciones-svg">
                        <img src="./Opciones-icon.svg" alt=""/>
                    </div>
                </div>
                <div className="todos-clientes">
                    {Clientes.map((item) => {
                        return (
                            <div className="cliente" key={item.id}>
                                <div className="perfil-cliente">
                                    <img src={item.img} className="img-cliente" alt=""/>
                                    <div>
                                        <span>{item.nombre}</span>
                                    </div>
                                </div>
                                <div className="fecha-pago">
                                    <div className="fecha-cliente">
                                        <span>20/01/2023</span>
                                    </div>
                                    <div className="moneda-cliente">
                                        <img src="./Moneda-icon.svg" alt=""/>
                                        <div>
                                            <span>100 Bs.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export { CuadroClientes }