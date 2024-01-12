import "./CuadroRealizarPedido.css";

const CuadroRealizarPedido = () => {


    const handletSubmit = async () => {
        console.log("hola Mundo")
    }


    return (
        <>
            <form action="" onSubmit={handletSubmit}>
                <div className="RealizarPedidoCuadro">
                    <div className="titulo-RealizarPedido">
                        <div>
                            <span className="RealizarPedido-title">Realizar Pedido</span>
                        </div>
                        <div className="opciones-svg">
                            <img src="./Opciones-icon.svg" alt=""/>
                        </div>
                    </div>
                    <div>
                        <select name="cliente" id="cliente" className="selec-pedido">
                            <option value="opciones1" >Cliente</option>
                        </select>
                        <select name="cliente" id="cliente" className="selec-pedido">
                            <option value="opciones1" >Botellon de 20 Lts</option>
                        </select>
                        <div style={{ marginTop: "11px", gap: "15px", display: "flex" }}>
                            <div className="cantidad-pedido">
                                <span style={{ marginLeft: "10px" }}>Cantidad</span>
                                <div className="numero-pedido">
                                    <button type="button" className="boton"><img src="./BotonMenos-icon.svg" alt=""/></button>
                                    <div>
                                        <input type="text" defaultValue="1" className="numero-solicitado"/>
                                    </div>
                                    <button type="button" className="boton"><img src="./BotonMas-icon.svg" alt=""/></button>
                                </div>
                            </div>
                            <div style={{ display: "flex" }}>
                                <input type="text" defaultValue="15" className="numero-input"/>
                                <div className="letras-Bs" 
                                    style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                                    <div>
                                        <span>Bs</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ minWidth: "96%", width: "96%", marginTop: "11px", display: "flex", justifyContent: "end"}}>
                            <button className="boton-realizar-pedido" type="submit">Realizar Pedido</button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export { CuadroRealizarPedido }