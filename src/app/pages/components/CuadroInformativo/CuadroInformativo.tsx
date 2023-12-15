import "./CuadroInformativo.css";

type item = {
    titulo: string,
    numero: string,
    porcentajeVerde?: string,
    porcentajeRojo?: string,
    letra?: string
}

const CuadroInformativo = ({ titulo, numero, porcentajeVerde, porcentajeRojo, letra }: item) => {
    return (
        <div className="cuadroGeneral">
            <div className="titulo-cuadro">
                <span>{titulo}</span>
            </div>
            {letra !== undefined ?
                <div className="numero-letra">
                    <span>{numero}</span>
                    <span style={{ fontSize: "24px", marginLeft: "4px" }}>{letra}</span>
                </div>
                :
                <div className="numero-cuadro">
                    <span>{numero}</span>
                </div>
            }
            <div className="cuadrogeneral-porcentaje">
                {porcentajeVerde !== undefined ?
                    <div className="porcentaje-verde">
                        <span>{porcentajeVerde}</span>
                    </div>
                    :
                    <div className="porcentaje-rojo">
                        <span>{porcentajeRojo}</span>
                    </div>
                }

                <div className="letras-cuadro">
                    <span>En el último mes</span>
                </div>
            </div>
        </div>
    )
}

export { CuadroInformativo }