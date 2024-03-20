import { FC, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegistrarDevolucion.css";
import { OptionScrooll } from "../../../components/OptionScrooll/OptionScrooll";
import { ClientesContext } from "../ClientesContext";
import { GetLoansByClientId } from "../../../../../services/LoansService";
import { GetItems } from "../../../../../services/ItemsService";
import { registerDevolutions } from "../../../../../services/DevolutionsService";

type ProductosAdd = {
    id: number,
    idLoan: string,
    user: string,
    cantidadSeleccionada: string,
    productoSeleccionado: string,
};

const DevolucionParcial: FC = () => {

    const { selectedClient } = useContext(ClientesContext);
    const [opcionesVisibles, setOpcionesVisibles] = useState<boolean>(true);
    const [loading, setLoading] = useState(true);
    const [loadingSave, setLoadingSave] = useState(false);
    const [productosAgregados, setProductosAgregados] = useState<Array<ProductosAdd>>([]);
    const [selectedLoan, setSelectedLoan] = useState<any>();
    const [selectedCantidad, setSelectedCantidad] = useState<string>('');
    const [selectedProducto, setSelectedProducto] = useState<string>('');
    const [items, setItems] = useState<Array<any>>([]);
    const [itemToShow, setItemToShow] = useState<Array<any>>([]);
    const [quantityToShow, setQuantityToShow] = useState<Array<string>>([]);
    const [loans, setLoans] = useState<Array<any>>([]);
    const [comment, setComment] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const getLoans = async () => {
            await GetLoansByClientId(selectedClient._id)
                    .then((resp) => {
                        setLoans(resp.data);
                        setLoading(false);
                    });
        };

        const getItems = async () => {
            const {data} = await GetItems();
            setItems(data);
        };
        
        if(loading){
            getLoans();
            getItems();
        };

    }, [selectedClient._id, loading]);

    if (loading) {
        return <p>Cargando</p>
    };

    const handleOpcionesClick = () => {
        setOpcionesVisibles(!opcionesVisibles);
    };

    const AgregarProducto = () => {
        var TodosProductos = [...productosAgregados]
        var ProductoNew: ProductosAdd = {
            id: productosAgregados.length + 1,
            idLoan: selectedLoan._id,
            user: selectedLoan.user,
            cantidadSeleccionada: selectedCantidad,
            productoSeleccionado: selectedProducto,
        }
        TodosProductos.push(ProductoNew);
        setProductosAgregados(TodosProductos);

        deleteElementToShow(selectedCantidad, selectedProducto);
    };

    const DeleteProducto = (item: any) => {
        
        var TodosProductos = productosAgregados.filter(P => P.id !== item.id);
        setProductosAgregados(TodosProductos);

        const updatedItemToShow = [...itemToShow];
        const updatedQuantityToShow = [...quantityToShow];

        updatedItemToShow.push(item.productoSeleccionado);
        updatedQuantityToShow.push(item.cantidadSeleccionada);

        setItemToShow(updatedItemToShow);
        setQuantityToShow(updatedQuantityToShow);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setComment(e.target.value);
    };

    const deleteElementToShow = (selectedCantidad: string, selectedProducto: string) => {
        const updatedItemToShow = [...itemToShow];
        const updatedQuantityToShow = [...quantityToShow];

        const indexItem = updatedItemToShow.findIndex((item) => item === selectedProducto);
        const indexQuantity = updatedQuantityToShow.findIndex((quantity) => quantity === selectedCantidad);

        updatedItemToShow.splice(indexItem, 1);
        updatedQuantityToShow.splice(indexQuantity, 1);

        setItemToShow(updatedItemToShow);
        setQuantityToShow(updatedQuantityToShow);
        };

    const updateElementToShow = (loan: any) => {
        let cant: string[] = [];
        let prod: any[] = [];
        loan.detail.forEach((detailItem: any) => {
            const item = items.find((itemItem: any) => itemItem._id === detailItem.item);
            if (item) {
                prod.push(item.name);
                cant.push(detailItem.quantity);
            }
        });
        setItemToShow(prod);
        setQuantityToShow(cant);
    };

    const handleSwitchChange = (id: string) => {
        const loan = loans.find((loan) => loan._id === id);
        setSelectedLoan(loan);

        updateElementToShow(loan);
    };

    const searchItem = (item: string) => {
        let itemId: string | undefined;
        items.forEach((itemItem: any) => {
            if (itemItem.name.toString() === item.toString()) {
                itemId = itemItem._id;
            }
        });
        return itemId;
    };

    const registerDevolution = () => {
        setLoadingSave(true);

        const allDevolutions = productosAgregados;

        if (allDevolutions.length === 0) {
            setLoadingSave(false);
            console.log('There is no devolutions to register.', allDevolutions);
            return window.alert("Debes seleccionar al menos un préstamo paea devolver.");
        } else {
            let isSuccess = true;

            allDevolutions.forEach(async (devolution) => {
                const data = {
                    user: devolution.user,
                    loan: devolution.idLoan,
                    comment: comment,
                    detail: {
                        item: searchItem(devolution.productoSeleccionado),
                        quantity: devolution.cantidadSeleccionada,
                    },
                };

                const resp = await registerDevolutions(data);

                if (resp !== 200) {
                    isSuccess = false;
                };
            });

            if (isSuccess) {
                console.log("Devolución registrada");
                window.alert("Devolución registrada.");
                setLoadingSave(false);
                navigate('/Clientes');
            } else {
                console.log("Error al registrar devolución");
                window.alert("Error al registrar devolución, intente de nuevo.");
            };

        };

    };

    return (
        <>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="RegistrarDevolucion-scrooll">
                    <div className="RegistrarDevolucion-NombreCliente">
                        <div className="RegistrarDevolucion-Nombre">
                            <img src="../Cliente2.svg" alt="" />
                            <span>{selectedClient.fullName}</span>
                        </div>
                    </div>
                    {
                        loans.map((loan) => (
                            <div className="RegistrarDevolucion-ProductosAdevolver" key={loan.id}>
                                <div className="RegistrarDevolucion-Producto">
                                    {loan.detail.map((detailItem: any) => {
                                        const item = items.find((itemItem: any) => itemItem._id === detailItem.item);
                                        return (
                                            <div>
                                                {item && (
                                                    <div className="RegistrarDevolucion-Producto1">
                                                        <div className="RegistrarDevolucion-Producto2">
                                                            <span>{item.name}</span>
                                                        </div>
                                                        <div className="RegistrarDevolucion-Producto2">
                                                            <span>{detailItem.quantity}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div>
                                    <input type="radio" name="prestamo" onChange={(e) => handleSwitchChange(loan._id)} className="RegistrarDevolucion-inputRadio" />
                                </div>
                            </div>
                        ))
                    }
                    <div className="RegistrarDevolucion-AgregarProducto">
                        <div className="RegistrarDevolucion-AgregarProductoTitulo">
                            <span>Agregar producto</span>
                            <button onClick={handleOpcionesClick} className={opcionesVisibles ? "RegistrarDevolucion-btnAgregarProducto AgregarProductoactive-btn" : "RegistrarDevolucion-btnAgregarProducto"}>
                                <span className="material-symbols-outlined">
                                    expand_more
                                </span>
                            </button>
                        </div>
                        <div className="lineagris"></div>
                        {
                            opcionesVisibles &&
                            <>
                                <div style={{ width: "100%", marginTop: "25px" }}>
                                    <table style={{ width: "100%", borderSpacing: "0px" }}>
                                        <thead>
                                            <tr style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                                                <th>
                                                    <div className="RegistrarDevolucion-TablaTitulo2">
                                                        <span>Cantidad</span>
                                                    </div>
                                                </th>
                                                <th>
                                                    <div className="RegistrarDevolucion-TablaTitulo2">
                                                        <span>Producto</span>
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                                                <td>
                                                    <div className="RegistrarDevolucion-TablaBody" style={{ borderRadius: "0px 0px 0px 20px" }}>
                                                        <OptionScrooll
                                                            options={quantityToShow.map((quantity) => quantity.toString())}
                                                            onOptionChange={(selectedOption) => setSelectedCantidad(selectedOption)} />
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="RegistrarDevolucion-TablaBody" style={{ borderRadius: "0px 0px 20px 0px" }}>
                                                        <OptionScrooll
                                                            options={itemToShow.map((item) => item)}
                                                            onOptionChange={(selectedOption) => setSelectedProducto(selectedOption)} />
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <button className="RegistrarDevolucion-agregarproducto" onClick={AgregarProducto}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="49" height="48" viewBox="0 0 49 48" fill="none">
                                        <g filter="url(#filter0_d_9_26327)">
                                            <circle cx="24.5" cy="20" r="20" fill="#1A3D7D" />
                                            <circle cx="24.5" cy="20" r="19.5" stroke="#52A5F5" />
                                        </g>
                                        <path d="M23.3182 28.2758V21.1822H16.2246V18.8177H23.3182V11.7241H25.6827V18.8177H32.7763V21.1822H25.6827V28.2758H23.3182Z" fill="white" />
                                        <defs>
                                            <filter id="filter0_d_9_26327" x="0.5" y="0" width="48" height="48" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                <feOffset dy="4" />
                                                <feGaussianBlur stdDeviation="2" />
                                                <feComposite in2="hardAlpha" operator="out" />
                                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_9_26327" />
                                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_9_26327" result="shape" />
                                            </filter>
                                        </defs>
                                    </svg>
                                    <span>Agregar producto</span>
                                </button>
                                {
                                    productosAgregados.length > 0 ?
                                        <>
                                            {
                                                productosAgregados.map((item, index) => (
                                                    <div className="RegistrarDevolucion-productoAgregado">
                                                        <div className="RegistrarDevolucion-productoAgregado1">
                                                            <span>{item.productoSeleccionado}</span>
                                                            <div className="RegistrarDevolucion-productoAgregadobtncontainer">
                                                                <button className="RegistrarDevolucion-productoAgregadoBTN" onClick={() => DeleteProducto(item)}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                                        <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="#C50000" />
                                                                    </svg>
                                                                </button>
                                                                <button className="RegistrarDevolucion-productoAgregadoBTN">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                                        <path d="M3 17.46V20.5C3 20.78 3.22 21 3.5 21H6.54C6.67 21 6.8 20.95 6.89 20.85L17.81 9.94L14.06 6.19L3.15 17.1C3.05 17.2 3 17.32 3 17.46ZM20.71 7.04C20.8027 6.94749 20.8762 6.8376 20.9264 6.71663C20.9766 6.59565 21.0024 6.46597 21.0024 6.335C21.0024 6.20403 20.9766 6.07435 20.9264 5.95338C20.8762 5.83241 20.8027 5.72252 20.71 5.63L18.37 3.29C18.2775 3.1973 18.1676 3.12375 18.0466 3.07357C17.9257 3.02339 17.796 2.99756 17.665 2.99756C17.534 2.99756 17.4043 3.02339 17.2834 3.07357C17.1624 3.12375 17.0525 3.1973 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="#1A3D7D" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="RegistrarDevolucion-productoAgregadoCantidad">
                                                            <span>Cantidad: <span style={{ color: "#1A3D7D" }}>{item.cantidadSeleccionada}</span></span>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </>
                                        :
                                        null
                                }
                            </>
                        }
                    </div>
                    <div className="RegistrarPedido-AgregarComentario">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="23" viewBox="0 0 24 23" fill="none">
                            <path d="M3 0C1.34531 0 0 1.23423 0 2.75229V15.1376C0 16.6557 1.34531 17.8899 3 17.8899H7.5V21.3303C7.5 21.5926 7.65938 21.8291 7.9125 21.9452C8.16563 22.0614 8.47031 22.0355 8.7 21.8807L14.4984 17.8899H21C22.6547 17.8899 24 16.6557 24 15.1376V2.75229C24 1.23423 22.6547 0 21 0H3Z" fill="#1A3D7D" />
                        </svg>
                        <input type="text"
                            placeholder="Agregar Comentario" 
                            value={comment} 
                            onChange={handleInputChange} />
                    </div>
                </div>
                <div style={{ width: "100%", textAlign: "end", marginTop: "10px" }}>
                    <button className="RegistrarDevolucion-btnVender"  onClick={registerDevolution} >
                    <span>{loadingSave ? 'Cargando' : 'Registrar devolución'}</span>
                    </button>
                </div>
            </form>
        </>
    )
}

export { DevolucionParcial }