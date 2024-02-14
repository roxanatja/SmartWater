import { useContext, useEffect, useState } from "react";
import "./CuadroVentaCliente.css";
import { Option } from "../../../components/Option/Option";
import { VentasContext } from "../VentasContext";
import { Sale } from "../../../../../type/Sale/Sale";
import { Client } from "../../../../../type/Cliente/Client";
import { GetClientById } from "../../../../../services/ClientsService";
import { GetProducts } from "../../../../../services/ProductsService";
import Product from "../../../../../type/Products/Products";
import { format } from "path";
import { formatDateTime } from "../../../../../utils/helpers";

const CuadroVentaCliente = (sale: Sale) => {

    const { setShowModal } = useContext(VentasContext);

    const [showOptions, setShowOptions] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [products, setProducts] = useState<Array<Product>>([]);
    const [client, setClient] = useState<Client>();
    const [date, setDate] = useState<string>();

    useEffect(() => {
        getClient();
        getProducts();
        setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps    
    }, []);

    const getClient = async () => {      //Obtiene el cliente de la venta y convierte la fecha a un formato mas legible
        try{
            await GetClientById(sale.client)
                .then((resp) => {
                    setClient(resp);
                    var date = formatDateTime(sale.updated, 'numeric', 'long', 'numeric');
                    setDate(date);
                });
        }catch(e){
            console.error(e);
        }
    };

    const getProducts = async () => {
        try{
            await GetProducts()
                .then((resp) => {
                    setProducts(resp.data);
                });
        }catch(e){
            console.error(e);
        }
    };

    if (loading) {
        return <p>Cargando Cliente</p>
    };

    const handleOpen = () => {
        setShowModal(true);
    }

    const Opciones = () => {
        setShowOptions(!showOptions);
    }
    
    const Edit = () => {
        setShowOptions(false);
    }

    const Delete = () => {
        setShowOptions(false);
    }
    
    return(
        <div className="CuadroVentaCliente-container">
            <div style={{padding: "15px 20px 12px 10px"}}>
                <div style={{display: "flex", flexDirection: "column", gap: "5px", marginBottom: "10px"}}>
                    <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                        <div className="CuadroVentaCliente-header">
                            <img src="./Cliente2.svg" alt="" />
                            <span>{ client?.fullName }</span>
                        </div>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <button type="button" className="btn" onClick={handleOpen}>
                                <img src="./Opciones-icon.svg" alt=""/>
                            </button>
                        </div>
                        <div className="infoClientes-ultimaventa">
                            <span>{date}</span>
                        </div>
                    </div>
                    <div className="CuadroVentaCliente-text">
                        <span>No. Cliente: <span style={{color: "#1A3D7D"}}>{client?.code}</span></span>
                    </div>
                </div>
                <div className="CuadroVentaCliente-productos">
                    <div style={{width: "100%"}}>
                        <table style={{width: "100%"}}>
                            <thead style={{textAlign: "left", marginBottom: "5px"}}>
                                <tr>
                                    <th>
                                        <span>Productos</span>
                                    </th>
                                    <th>
                                        <span>Cantidad</span>
                                    </th>
                                    <th>
                                        <span>Precio</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    sale.detail.map((detail) => {
                                        let product = products.find((product) => product._id === detail.product);
                                        return(
                                            <tr key={detail._id}>
                                                <td>
                                                    <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                                                        <img src="./Botella-icon.svg" alt="" />
                                                        <span className="CuadroVentaCliente-text">{ product?.name }</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="CuadroVentaCliente-TextContainer">
                                                        <span className="CuadroVentaCliente-text" style={{fontWeight: "600"}}>{ detail.quantity }</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span className="CuadroVentaCliente-text" style={{fontWeight: "600"}}>{ detail.price } Bs</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <button type="button" className="btn" onClick={() => Opciones()}>
                            <img src="./opcion-icon.svg" alt="" />
                        </button>
                        <Option editAction={Edit} visible={showOptions} editar={true} eliminar={true} deleteAction={Delete}/>
                    </div>
                </div>
            </div>
            <div style={{width: "98%", height: "1px", background: "#52A5F5", marginLeft: "3px"}}>
            </div>
            <div style={{width: "100%", textAlign: "right", padding: "9px 43px 20px 0px"}}>
                <span className="CuadroVentaCliente-text" style={{fontWeight: "600", fontSize: "14px", marginRight: "17px"}}>Total:</span>
                <span className="CuadroVentaCliente-text" style={{fontWeight: "600", fontSize: "18px", color: "#1A3D7D"}}>{sale.total}</span>
            </div>
        </div>
    )
}

export { CuadroVentaCliente }