import { FC, useState, useContext, useEffect } from "react";
import "./RegistrarPrestamo.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";
import { OptionScrooll } from "../../../components/OptionScrooll/OptionScrooll";
import DatePicker from 'react-datepicker';
import moment from 'moment'
import { ImagenInsertar } from "../../../components/ImagenInsertar/ImagenInsertar";
import { VentasContext } from "../VentasContext";
import { GetClientById } from "../../../../../services/ClientsService";
import { saveLoans } from "../../../../../services/LoansService";
import { GetProducts } from "../../../../../services/ProductsService";
import Product from "../../../../../type/Products/Products";
import { Client } from "../../../../../type/Cliente/Client";

type ProductosAdd = {
    id: number,
    cantidadSeleccionada: string,
    productoSeleccionado: Product,
}

const RegistrarPrestamo: FC = () => {

    const { selectedClient } = useContext(VentasContext);
    const [client, setClient] = useState<Client>();
    const [opcionesVisibles, setOpcionesVisibles] = useState<boolean>(true);
    const [productosAgregados, setProductosAgregados] = useState<Array<ProductosAdd>>([]);
    const [selectedCantidad, setSelectedCantidad] = useState<string>('');
    const [selectedProducto, setSelectedProducto] = useState<Product>();
    const [imageContrato, setImageContrato] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [date, setDate] = useState<Date | null>(null);
    const [showCalendar, setShowCalendar] = useState(false);

    const [selectedEdit, setSelectedEdit] = useState<boolean>(false);
    const [editId, setEditId] = useState<number>(0);
    const [comment, setComment] = useState<string>('');
    const [loadingSale, setLoadingSale] = useState<boolean>(false);
    const navigate = useNavigate();

    const Cantidad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    const [products, setProducts] = useState<Product[]>([]);
    const handleOpcionesClick = () => {
        setOpcionesVisibles(!opcionesVisibles);
    };

    useEffect(() => {
        getClient();
        getProducts();
        setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps    
    }, []);

    const getClient = async () => {      //Obtiene el cliente de la venta y convierte la fecha a un formato mas legible
        try{
            await GetClientById(selectedClient)
                .then((resp) => {
                    setClient(resp);
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
        return <p>Cargando...</p>
    };

    const handleClick = () => {
        navigate('/Ventas');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setComment(e.target.value);
    };

    const AgregarProducto = () => {
        var TodosProductos = [...productosAgregados]
        var ProductoNew: ProductosAdd = {
            id: productosAgregados.length + 1,
            cantidadSeleccionada: selectedCantidad,
            productoSeleccionado:  selectedProducto as Product,
        }
        TodosProductos.push(ProductoNew);
        setProductosAgregados(TodosProductos);
    }

    const editProduct = (id: number) => {
        setSelectedEdit(!selectedEdit);
        setEditId(id);
    }

    const saveEditProduct = () => {       //Saves the edited product by updating the list of added products.
        var TodosProductos = productosAgregados.filter(P => P.id !== editId);
        var ProductoNew: ProductosAdd = {
            id: editId,
            cantidadSeleccionada: selectedCantidad,
            productoSeleccionado: selectedProducto as Product,
        }
        TodosProductos.push(ProductoNew);
        setProductosAgregados(TodosProductos);
        setSelectedEdit(false);
    }

    const DeleteProducto = (id: number) => {
        var TodosProductos = productosAgregados.filter(P => P.id !== id);
        setProductosAgregados(TodosProductos);
    }

    const toggleCalendario = () => {
        setDate(null);
        setShowCalendar(!showCalendar);
    };

    const handleDateChange = (date: Date | null) => {
        setDate(date);
        setShowCalendar(false);
    };

    const saveLoansData = async () => {    //Saves the loan data in the database
        const allProducts = productosAgregados;
        setLoadingSale(true);

        if(allProducts.length === 0){        // Check if there are products to sale
            window.alert('No hay productos agregados para vender');
            console.log('There is no products to sale ', allProducts);
            setLoadingSale(false);
        } else {
            try{    
                const loansData = {     //Data to save in the database
                    user: client?.user,
                    client: client?._id,
                    contract: {
                        link: imageContrato,
                        validUntil: date,
                    },
                    comment: comment,
                    detail: productosAgregados.map((product) => ({
                        item: product.productoSeleccionado._id,
                        quantity: product.cantidadSeleccionada
                    })),
                }

                const resp = await saveLoans(loansData);     

                if(resp === 200){
                    console.log('Loan successfully registered', loansData);
                    window.alert('Prestamo registrado correctamente');
                    setLoadingSale(false);
                    navigate('/Ventas');
                }
            }catch(error){
                console.log('Error al guardar el prestamo', error);
                setLoadingSale(false);
                navigate('/Ventas');
            }
        }
    }

    return(
        <form onSubmit={(e) => e.preventDefault()}>
            <PageTitle titulo="Clientes" icon="../clientes-icon.svg" />
            <div className="RegistrarPrestamo-titulo">
                <button className="RegistrarPrestamo-btn" onClick={handleClick}>
                    <span className="material-symbols-outlined">
                        arrow_back
                    </span>
                </button>
                <span>Registrar préstamo</span>
            </div>
            <div className="RegistrarPrestamo-scrooll">
                <div className="RegistrarPrestamo-NombreCliente">
                    <div className="RegistrarPrestamo-Nombre">
                        <img src="../Cliente2.svg" alt="" />
                        <span>{client?.fullName}</span>
                    </div>
                    <div className="RegistrarPrestamo-Nombre" style={{gap: "10px", fontWeight: "400"}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <g clipPath="url(#clip0_9_28494)">
                                <path d="M0.427148 9.88041C0.42668 11.5608 0.86918 13.2016 1.71059 14.6478L0.34668 19.589L5.44293 18.2631C6.85248 19.0245 8.43179 19.4235 10.0367 19.4236H10.0409C15.3389 19.4236 19.6517 15.1458 19.6539 9.88793C19.655 7.3401 18.6559 4.94428 16.8407 3.1418C15.0259 1.33948 12.6122 0.346378 10.0405 0.345215C4.74184 0.345215 0.429414 4.62273 0.427227 9.88041" fill="url(#paint0_linear_9_28494)"/>
                                <path d="M0.0835938 9.87721C0.0830469 11.6181 0.541406 13.3175 1.41281 14.8155L0 19.9339L5.27898 18.5605C6.73352 19.3474 8.37117 19.7622 10.0376 19.7629H10.0419C15.53 19.7629 19.9977 15.3312 20 9.88512C20.0009 7.24574 18.9659 4.7638 17.0859 2.89674C15.2057 1.02992 12.7057 0.00108527 10.0419 0C4.55281 0 0.0857813 4.43101 0.0835938 9.87721ZM3.22734 14.5575L3.03023 14.2471C2.20164 12.9398 1.7643 11.4291 1.76492 9.87783C1.76672 5.35109 5.47953 1.66822 10.045 1.66822C12.2559 1.66915 14.3337 2.52434 15.8966 4.07597C17.4593 5.62775 18.3192 7.69054 18.3187 9.8845C18.3166 14.4112 14.6037 18.0946 10.0419 18.0946H10.0386C8.5532 18.0938 7.09641 17.698 5.82594 16.95L5.52359 16.7721L2.39094 17.5871L3.22734 14.5574V14.5575Z" fill="url(#paint1_linear_9_28494)"/>
                                <path d="M7.55254 5.74801C7.36613 5.33692 7.16996 5.32863 6.9927 5.32142C6.84754 5.31522 6.6816 5.31568 6.51582 5.31568C6.34988 5.31568 6.08027 5.37762 5.85238 5.62452C5.62426 5.87165 4.98145 6.46886 4.98145 7.68351C4.98145 8.89824 5.87309 10.0721 5.99738 10.237C6.12184 10.4016 7.71871 12.974 10.2478 13.9636C12.3496 14.786 12.7774 14.6224 13.2336 14.5812C13.6898 14.5401 14.7057 13.9841 14.913 13.4076C15.1204 12.8312 15.1204 12.3371 15.0582 12.2338C14.9961 12.131 14.8301 12.0692 14.5813 11.9458C14.3324 11.8223 13.1091 11.225 12.8811 11.1426C12.6529 11.0603 12.4871 11.0192 12.3211 11.2664C12.1552 11.5132 11.6787 12.0692 11.5335 12.2338C11.3884 12.3989 11.2432 12.4194 10.9944 12.2959C10.7454 12.172 9.9441 11.9116 8.9934 11.0706C8.25371 10.4162 7.75434 9.60808 7.60918 9.36088C7.46402 9.11405 7.59363 8.98026 7.7184 8.85723C7.8302 8.74661 7.9673 8.56894 8.09184 8.42483C8.2159 8.28064 8.2573 8.17777 8.34027 8.01312C8.42332 7.84832 8.38176 7.70413 8.31965 7.58064C8.2573 7.45715 7.77379 6.23615 7.55254 5.74801Z" fill="white"/>
                            </g>
                            <defs>
                                <linearGradient id="paint0_linear_9_28494" x1="965.71" y1="1924.73" x2="965.71" y2="0.345215" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#1FAF38"/>
                                <stop offset="1" stopColor="#60D669"/>
                                </linearGradient>
                                <linearGradient id="paint1_linear_9_28494" x1="1000" y1="1993.39" x2="1000" y2="0" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#F9F9F9"/>
                                <stop offset="1" stopColor="white"/>
                                </linearGradient>
                                <clipPath id="clip0_9_28494">
                                <rect width="20" height="20" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                        <span>{client?.phoneNumber}</span>
                    </div>
                </div>
                <div className="RegistrarPrestamo-AgregarProducto">
                    <div className="RegistrarPrestamo-AgregarProductoTitulo">
                        <span>Agregar producto</span>
                        <button onClick={handleOpcionesClick} className={opcionesVisibles ? "RegistrarPrestamo-btnAgregarProducto AgregarProductoactive-btn" : "RegistrarPrestamo-btnAgregarProducto"}>
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
                                        <tr style={{display: "flex", justifyContent: "center", width: "100%"}}>
                                            <th>
                                                <div className="RegistrarPrestamo-TablaTitulo2">
                                                    <span>Cantidad</span>
                                                </div>
                                            </th>
                                            <th>
                                                <div className="RegistrarPrestamo-TablaTitulo2">
                                                    <span>Producto</span>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style={{display: "flex", justifyContent: "center", width: "100%"}}>
                                            <td>
                                                <div className="RegistrarPrestamo-TablaBody" style={{borderRadius: "0px 0px 0px 20px"}}>
                                                    <OptionScrooll 
                                                        options={Cantidad}
                                                        onOptionChange={(selectedOption) => setSelectedCantidad(selectedOption)}/>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="RegistrarPrestamo-TablaBody" style={{borderRadius: "0px 0px 20px 0px"}}>
                                                    <OptionScrooll 
                                                        options={ products.map((product) => product.name)}
                                                        onOptionChange={(selectedOption) => setSelectedProducto(products.find((product) => product.name === selectedOption))}/>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <button className="RegistrarPrestamo-agregarproducto" onClick={selectedEdit ? saveEditProduct : AgregarProducto}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="49" height="48" viewBox="0 0 49 48" fill="none">
                                    <g filter="url(#filter0_d_9_26327)">
                                        <circle cx="24.5" cy="20" r="20" fill="#1A3D7D"/>
                                        <circle cx="24.5" cy="20" r="19.5" stroke="#52A5F5"/>
                                    </g>
                                    <path d="M23.3182 28.2758V21.1822H16.2246V18.8177H23.3182V11.7241H25.6827V18.8177H32.7763V21.1822H25.6827V28.2758H23.3182Z" fill="white"/>
                                    <defs>
                                        <filter id="filter0_d_9_26327" x="0.5" y="0" width="48" height="48" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                        <feOffset dy="4"/>
                                        <feGaussianBlur stdDeviation="2"/>
                                        <feComposite in2="hardAlpha" operator="out"/>
                                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_9_26327"/>
                                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_9_26327" result="shape"/>
                                        </filter>
                                    </defs>
                                </svg>
                                <span>{selectedEdit ? 'Actualizar producto' : 'Agregar producto'}</span>
                            </button>
                            {
                                productosAgregados.length > 0 ?
                                <>
                                {
                                    productosAgregados.map((item, index) => (
                                        <div className="RegistrarPrestamo-productoAgregado" style={{border: item.id === editId && selectedEdit ? "2px solid blue" : "none"}}>
                                            <div className="RegistrarPrestamo-productoAgregado1">
                                                <span>{item.productoSeleccionado.name}</span>
                                                <div className="RegistrarPrestamo-productoAgregadobtncontainer">
                                                    <button className="RegistrarPrestamo-productoAgregadoBTN" onClick={() => DeleteProducto(item.id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                            <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="#C50000"/>
                                                        </svg>
                                                    </button>
                                                    <button className="RegistrarPrestamo-productoAgregadoBTN" onClick={() => editProduct(item.id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                            <path d="M3 17.46V20.5C3 20.78 3.22 21 3.5 21H6.54C6.67 21 6.8 20.95 6.89 20.85L17.81 9.94L14.06 6.19L3.15 17.1C3.05 17.2 3 17.32 3 17.46ZM20.71 7.04C20.8027 6.94749 20.8762 6.8376 20.9264 6.71663C20.9766 6.59565 21.0024 6.46597 21.0024 6.335C21.0024 6.20403 20.9766 6.07435 20.9264 5.95338C20.8762 5.83241 20.8027 5.72252 20.71 5.63L18.37 3.29C18.2775 3.1973 18.1676 3.12375 18.0466 3.07357C17.9257 3.02339 17.796 2.99756 17.665 2.99756C17.534 2.99756 17.4043 3.02339 17.2834 3.07357C17.1624 3.12375 17.0525 3.1973 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="#1A3D7D"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="RegistrarPrestamo-productoAgregadoCantidad">
                                                <span>Cantidad: <span style={{color: "#1A3D7D"}}>{item.cantidadSeleccionada}</span></span>
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
                <div className="RegistrarPrestamo-FechaComentario">
                    <div className="RegistrarPrestamo-AgregarComentario">
                        <label htmlFor="FechaPedido" onClick={toggleCalendario} style={{ cursor: "pointer" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="27" viewBox="0 0 25 27" fill="none">
                                <g clipPath="url(#clip0_9_28590)">
                                    <path d="M7.47098 0C8.3928 0 9.13755 0.754102 9.13755 1.6875V3.375H15.8038V1.6875C15.8038 0.754102 16.5486 0 17.4704 0C18.3922 0 19.137 0.754102 19.137 1.6875V3.375H21.6368C23.017 3.375 24.1367 4.50879 24.1367 5.90625V8.4375H0.804688V5.90625C0.804688 4.50879 1.92442 3.375 3.30455 3.375H5.8044V1.6875C5.8044 0.754102 6.54915 0 7.47098 0ZM0.804688 10.125H24.1367V24.4688C24.1367 25.8662 23.017 27 21.6368 27H3.30455C1.92442 27 0.804688 25.8662 0.804688 24.4688V10.125ZM4.97112 13.5C4.51281 13.5 4.13783 13.8797 4.13783 14.3438V19.4062C4.13783 19.8703 4.51281 20.25 4.97112 20.25H9.97083C10.4291 20.25 10.8041 19.8703 10.8041 19.4062V14.3438C10.8041 13.8797 10.4291 13.5 9.97083 13.5H4.97112Z" fill="#1A3D7D"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0_9_28590">
                                    <rect width="23.332" height="27" fill="white" transform="translate(0.804688)"/>
                                    </clipPath>
                                </defs>
                            </svg>
                        </label>
                        <div style={{ display: showCalendar !== true ? "none" : "" }}>
                                <DatePicker
                                minDate={new Date()}
                                    id="FechaPedido"
                                    selected={date}
                                    onChange={handleDateChange}
                                    dateFormat={"dd-mm-yyyy"}
                                    dropdownMode="select"
                                    onClickOutside={() => setShowCalendar(false)}
                                />
                            </div>
                            <span>{date === null ? "Valido hasta" : moment(date).format('DD/MM/YYYY')}</span>
                    </div>
                    <div className="RegistrarPedido-AgregarComentario">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="23" viewBox="0 0 24 23" fill="none">
                                <path d="M3 0C1.34531 0 0 1.23423 0 2.75229V15.1376C0 16.6557 1.34531 17.8899 3 17.8899H7.5V21.3303C7.5 21.5926 7.65938 21.8291 7.9125 21.9452C8.16563 22.0614 8.47031 22.0355 8.7 21.8807L14.4984 17.8899H21C22.6547 17.8899 24 16.6557 24 15.1376V2.75229C24 1.23423 22.6547 0 21 0H3Z" fill="#1A3D7D" />
                            </svg>
                            <input type="text"
                                placeholder="Agregar Comentario"
                                onChange={handleInputChange} />
                        </div>
                    <div style={{width: "100%"}}>
                        <ImagenInsertar texto="Porfavor, adjunta la imagen del contrato" imagenSelect={imageContrato} onImagenSeleccionada={setImageContrato} id="contrato"/>
                    </div>
                </div>
            </div>
            <div style={{width: "100%", textAlign: "end", marginTop: "10px"}}>
                <button className="RegistrarPrestamo-btnVender" onClick={saveLoansData}>
                    <span>{loadingSale ? 'Cargando' : 'Registrar Prestamo'}</span>
                </button>
            </div>
        </form>
    )
}

export{RegistrarPrestamo}