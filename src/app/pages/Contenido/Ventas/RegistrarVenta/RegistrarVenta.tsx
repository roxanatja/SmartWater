import { FC, useContext, useEffect, useState } from "react";
import "./RegistrarVenta.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";
import { OptionScrooll } from "../../../components/OptionScrooll/OptionScrooll";
import { VentasContext } from "../VentasContext";
import { GetClientById } from "../../../../../services/ClientsService";
import { Client } from "../../../../../type/Cliente/Client";
import { saveSale } from "../../../../../services/SaleService";
import { GetProducts } from "../../../../../services/ProductsService";
import Product from "../../../../../type/Products/Products";

type ProductosAdd = {
    id: number,
    cantidadSeleccionada: string,
    productoSeleccionado: Product,
    precioSeleccionado: string
}

const RegistrarVenta: FC = () => {

    const { selectedClient } = useContext(VentasContext)
    const [opcionesVisibles, setOpcionesVisibles] = useState<boolean>(true);
    const [checkbox1, setCheckbox1] = useState<boolean>(false);
    const [checkbox2, setCheckbox2] = useState<boolean>(false);
    const [selectedEdit, setSelectedEdit] = useState<boolean>(false);
    const [productosAgregados, setProductosAgregados] = useState<Array<ProductosAdd>>([]);
    const [selectedCantidad, setSelectedCantidad] = useState<string>('');
    const [selectedProducto, setSelectedProducto] = useState<Product>();
    const [selectedPrecio, setSelectedPrecio] = useState<string>('');
    const [comment, setComment] = useState<string>('');
    const [products, setProducts] = useState<Product[]>([]);
    const [editId, setEditId] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingSale, setLoadingSale] = useState<boolean>(false);
    const [client, setClient] = useState<Client>();
    const navigate = useNavigate();

    const Cantidad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    const Precio = ["5000", "10000", "300", "4000", "20000"];

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

    const handleOpcionesClick = () => {
        setOpcionesVisibles(!opcionesVisibles);
    };

    const handleClick = () => {
        navigate('/Ventas');
    };

    const handleCheckbox1Change = () => {
        setCheckbox1(!checkbox1);
        if (checkbox2) {
        setCheckbox2(false);
        }
    };

    const handleCheckbox2Change = () => {
        setCheckbox2(!checkbox2);
        if (checkbox1) {
        setCheckbox1(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setComment(e.target.value);
    };

    const AgregarProducto = () => {
        var TodosProductos = [...productosAgregados]
        var ProductoNew: ProductosAdd = {
            id: productosAgregados.length + 1,
            cantidadSeleccionada: selectedCantidad,
            productoSeleccionado: selectedProducto as Product,
            precioSeleccionado: selectedPrecio
        }
        TodosProductos.push(ProductoNew);
        setProductosAgregados(TodosProductos);
    };

    const DeleteProducto = (id: number) => {
        var TodosProductos = productosAgregados.filter(P => P.id !== id);
        setProductosAgregados(TodosProductos);
    };

    const editProduct = (id: number) => {
        setSelectedEdit(!selectedEdit);
        setEditId(id);
    }

    const saveEditProduct = () => {      // Save the edited product
        const updatedProducts = productosAgregados.map((product) => {
            if (product.id === editId) {
                product.cantidadSeleccionada = selectedCantidad;
                product.productoSeleccionado = selectedProducto as Product;
                product.precioSeleccionado = selectedPrecio;

                setSelectedEdit(false);
            }
            return product;
        });

        setProductosAgregados(updatedProducts);
    };

    const registerSale = async () => {    
        const allProducts = productosAgregados;
        setLoadingSale(true);

        if (allProducts.length === 0) {        // Check if there are products to sale
            window.alert('No hay productos agregados para vender');
            console.log('There is no products to sale ', allProducts);
            setLoadingSale(false);
        } else {
            try{
                const dataToSave = {
                    client: client?._id,
                     user: client?.user,
                     comment: comment,
                     detail: allProducts.map((item) => ({
                         product: item.productoSeleccionado._id,
                         quantity: item.cantidadSeleccionada,
                         price: item.precioSeleccionado
                     })),
                     creditSale: checkbox2,
                }
    
                const resp = await saveSale(dataToSave);
    
                if(resp === 200){
                    console.log('Sale successfully registered', dataToSave);
                    window.alert('Venta registrada correctamente');
                    setLoadingSale(false);
                    navigate('/Ventas');
                };

            } catch(e) {
                console.error('Error registering sale', e);
                setLoadingSale(false);
                navigate('/Ventas');
            }
        }
        setLoadingSale(false);
        navigate('/Ventas');
    };

    return(
        <>
        <form onSubmit={(e) => e.preventDefault()}>
                <PageTitle titulo="Clientes" icon="../clientes-icon.svg" />
                <div className="RegistrarVenta-titulo">
                    <button className="RegistrarVenta-btn" onClick={handleClick}>
                        <span className="material-symbols-outlined">
                            arrow_back
                        </span>
                    </button>
                    <span>Registrar venta</span>
                </div>
                <div className="RegistrarVenta-scrooll">
                    <div className="RegistrarVenta-NombreCliente">
                        <img src="../Cliente2.svg" alt="" />
                        <span>{client?.fullName}</span>
                    </div>
                    <div className="RegistrarVenta-AgregarProducto">
                        <div className="RegistrarVenta-AgregarProductoTitulo">
                            <span>Agregar producto</span>
                            <button onClick={handleOpcionesClick} className={opcionesVisibles ? "RegistrarVenta-btnAgregarProducto AgregarProductoactive-btn" : "RegistrarVenta-btnAgregarProducto"}>
                                <span className="material-symbols-outlined">
                                    expand_more
                                </span>
                            </button>
                        </div>
                        <div className="lineagris"></div>
                        {
                            opcionesVisibles &&
                            <>
                                <div className="RegistrarVenta-opciones">
                                    <span>Seleccione una opción</span>
                                    <div className="RegistrarVenta-grupo-checbox">
                                        <div className="RegistrarVenta-grupo-check">
                                            <input
                                                className="input-check"
                                                type="checkbox"
                                                checked={checkbox1}
                                                onChange={handleCheckbox1Change}
                                            />
                                            <label className="text-check">Factura</label>
                                        </div>
                                        <div className="RegistrarVenta-grupo-check">
                                            <input
                                                className="input-check"
                                                type="checkbox"
                                                checked={checkbox2}
                                                onChange={handleCheckbox2Change}
                                            />
                                            <label className="text-check">Contado</label>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ width: "100%", marginTop: "25px" }}>
                                    <table style={{ width: "100%", borderSpacing: "0px" }}>
                                        <thead>
                                            <tr style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                                                <th>
                                                    <div className="RegistrarVenta-TablaTitulo2">
                                                        <span>Cantidad</span>
                                                    </div>
                                                </th>
                                                <th>
                                                    <div className="RegistrarVenta-TablaTitulo2">
                                                        <span>Producto</span>
                                                    </div>
                                                </th>
                                                <th>
                                                    <div className="RegistrarVenta-TablaTitulo2">
                                                        <span>Precio</span>
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                                                <td>
                                                    <div className="RegistrarVenta-TablaBody" style={{ borderRadius: "0px 0px 0px 20px" }}>
                                                        <OptionScrooll
                                                            options={ Cantidad }
                                                            onOptionChange={(selectedOption) => setSelectedCantidad(selectedOption)} />
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="RegistrarVenta-TablaBody" style={{ borderRadius: "0px 0px 0px 0px" }}>
                                                        <OptionScrooll
                                                            options={ products.map((product) => product.name)}
                                                            onOptionChange={(selectedOption) => setSelectedProducto(products.find((product) => product.name === selectedOption))} />
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="RegistrarVenta-TablaBody" style={{ borderRadius: "0px 0px 20px 0px" }}>
                                                        <OptionScrooll
                                                            options={Precio}
                                                            onOptionChange={(selectedOption) => setSelectedPrecio(selectedOption)} />
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <button className="RegistrarVenta-agregarproducto" onClick={selectedEdit ? saveEditProduct : AgregarProducto}>
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
                                    <span>{selectedEdit ? 'Actualizar producto' : 'Agregar producto'}</span>
                                </button>
                                {
                                    productosAgregados.length > 0 ?
                                        <>
                                            {
                                                productosAgregados.map((item, index) => (
                                                    <div className="RegistrarVenta-productoAgregado" style={{border: item.id === editId && selectedEdit ? "2px solid blue" : "none"}}>
                                                        <div className="RegistrarVenta-productoAgregado1">
                                                            <span>{item.productoSeleccionado.name}</span>
                                                            <div className="RegistrarVenta-productoAgregadobtncontainer">
                                                                <button className="RegistrarVenta-productoAgregadoBTN" onClick={() => DeleteProducto(item.id)}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                                        <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="#C50000" />
                                                                    </svg>
                                                                </button>
                                                                <button className="RegistrarVenta-productoAgregadoBTN" onClick={() => editProduct(item.id)}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                                        <path d="M3 17.46V20.5C3 20.78 3.22 21 3.5 21H6.54C6.67 21 6.8 20.95 6.89 20.85L17.81 9.94L14.06 6.19L3.15 17.1C3.05 17.2 3 17.32 3 17.46ZM20.71 7.04C20.8027 6.94749 20.8762 6.8376 20.9264 6.71663C20.9766 6.59565 21.0024 6.46597 21.0024 6.335C21.0024 6.20403 20.9766 6.07435 20.9264 5.95338C20.8762 5.83241 20.8027 5.72252 20.71 5.63L18.37 3.29C18.2775 3.1973 18.1676 3.12375 18.0466 3.07357C17.9257 3.02339 17.796 2.99756 17.665 2.99756C17.534 2.99756 17.4043 3.02339 17.2834 3.07357C17.1624 3.12375 17.0525 3.1973 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="#1A3D7D" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="RegistrarVenta-productoAgregadoCantidad">
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
                    <div className="RegistrarVenta-AgregarComentario">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="23" viewBox="0 0 24 23" fill="none">
                            <path d="M3 0C1.34531 0 0 1.23423 0 2.75229V15.1376C0 16.6557 1.34531 17.8899 3 17.8899H7.5V21.3303C7.5 21.5926 7.65938 21.8291 7.9125 21.9452C8.16563 22.0614 8.47031 22.0355 8.7 21.8807L14.4984 17.8899H21C22.6547 17.8899 24 16.6557 24 15.1376V2.75229C24 1.23423 22.6547 0 21 0H3Z" fill="#1A3D7D" />
                        </svg>
                        <input type="text"
                            placeholder="Agregar Comentario"
                            value={comment} 
                            onChange={handleInputChange} />
                    </div>
                </div>
                <div style={{ width: "100%", textAlign: "end", marginTop: "10px" }} onClick={registerSale} >
                    <button className="RegistrarVenta-btnVender">
                        <span>{loadingSale ? 'Cargando' : 'Vender'}</span>
                    </button>
                </div>
            </form>
        </>
    )
}

export{RegistrarVenta}