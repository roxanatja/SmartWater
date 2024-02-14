import { Switch } from "../Switch/Switch";
import "./FiltroPaginado.css";
import { FC, ReactNode } from "react";
import * as XLSX from 'xlsx';
import { Sale } from "../../../../type/Sale/Sale";
import { GetSales } from "../../../../services/SaleService";
import { GetClientById } from "../../../../services/ClientsService";
import { Client } from "../../../../type/Cliente/Client";
import { GetUser } from "../../../../services/UserService";
import { formatDateTime } from "../../../../utils/helpers";
import { GetZone } from "../../../../services/ZonesService";
import { GetProducts } from "../../../../services/ProductsService";

type Componentes = {
    exportar?: boolean;                               //Para que se active la opcion de exportar
    typeDataToExport?: string;                        //Tipo de datos a exportar
    add?: boolean;
    paginacion?: boolean;
    infoPedidos?: boolean;
    resultados?: boolean;                             //Para que se active la opcion de ver los resultados
    resultadosPrestamo?: boolean;
    children?: ReactNode;
    swith?: boolean;
    opcionesSwitch1?: string;
    opcionesSwitch2?: string;
    onAdd?: () => void;
    onFilter?: () => void;
    finanzas?: boolean;
    iconUbicacion?: boolean;
    filtro?: boolean;
    total?: number;                                   //Total de resultados
    orderArray?: (order: string) => void;             //Funcion para ordenar por antiguedad o reciente
};

const FiltroPaginado: FC<Componentes> = ({  exportar, typeDataToExport, add, paginacion, children, onAdd, infoPedidos, 
                                            resultados, swith, opcionesSwitch1, opcionesSwitch2, resultadosPrestamo,
                                            finanzas, iconUbicacion, filtro, total, orderArray, onFilter}) => {

const searchUser = async (id: string) => {        //Busca el nombre del usuario 
    const userList = await GetUser();
    const user = userList.find((user: any) => user._id === id);
    return user.fullName;
};

const searchZone = async (id: string) => {        //Busca la zona del cliente
    const zones = await GetZone().then((resp) => { return resp.data });
    const zone = zones.find((zone: any) => zone._id === id);
    return zone.name;
};

const setDetail = async (sale: Sale) => {        //Guarda los detalles de la venta
    const products = await GetProducts().then((resp) => { return resp.data });
    var detailsProduct: string = '';
    await Promise.all(
        sale.detail.map(async (detail: any) => {
            const product = products.find((product: any) => product._id === detail.product);
            detailsProduct += `Producto: ${product.name} Cantidad: ${detail.quantity} Precio: ${detail.price}\n`;
            return {
                detailsProduct
            };
        })
    );
    return detailsProduct;
}

const getDataWithClientNames = async () => {            //Guarda el nombre del cliente, del usuario y las fechas formateadas en la venta
    const { data } = await GetSales();
    const dataWithClientNames = await Promise.all(
        data.map(async (sale: Sale) => {
            const client: Client = await GetClientById(sale.client);

            const typeDataToExport = {
                "cliente" : client.fullName,
                "usuario" : await searchUser(sale.user),
                "comentario" : sale.comment ? sale.comment : "Sin comentario",
                "detalle" : await setDetail(sale),
                "Total" : sale.total,
                "zona" : await searchZone(sale.zone),
                "Pago" : sale.credtSale ? "Credito" : "Al contado",
                "creado" : formatDateTime(sale.created, 'numeric', 'long', '2-digit'),
                "actualizado" : formatDateTime(sale.updated, 'numeric', 'long', '2-digit'),
            }

            return typeDataToExport;
        })
    );

    return dataWithClientNames;
};


const exportData = (fileName: string, data: any) => {    //Exporta los datos a un archivo excel
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, fileName);
};

const exportToExcel = async() => {
    if(typeDataToExport === "sales"){
        const fileName = "ReporteVenta.xlsx";
        const data = await getDataWithClientNames();
        exportData(fileName, data);
    }
};
                                                
    return(
        <>
        <div className="filtro-contenido" style={{marginTop: "2em", maxHeight: "100vh"}}>
            <div style={{ width:"100%", display: "flex"}}>
                <div style={{ width:"70%", minWidth: "70%", marginRight: "2em", display: "flex", flexDirection: "column"}}>
                    <form className="search__container" onSubmit={(e) => e.preventDefault()}>
                        <input className="search__input" type="text" placeholder="Buscar" required />
                        <button type="submit" className="boton-buscar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M19.5 9.75C19.5 11.9016 18.8016 13.8891 17.625 15.5016L23.5594 21.4406C24.1453 22.0266 24.1453 22.9781 23.5594 23.5641C22.9734 24.15 22.0219 24.15 21.4359 23.5641L15.5016 17.625C13.8891 18.8062 11.9016 19.5 9.75 19.5C4.36406 19.5 0 15.1359 0 9.75C0 4.36406 4.36406 0 9.75 0C15.1359 0 19.5 4.36406 19.5 9.75ZM9.75 16.5C10.6364 16.5 11.5142 16.3254 12.3331 15.9862C13.1521 15.647 13.8962 15.1498 14.523 14.523C15.1498 13.8962 15.647 13.1521 15.9862 12.3331C16.3254 11.5142 16.5 10.6364 16.5 9.75C16.5 8.86358 16.3254 7.98583 15.9862 7.16689C15.647 6.34794 15.1498 5.60382 14.523 4.97703C13.8962 4.35023 13.1521 3.85303 12.3331 3.51381C11.5142 3.17459 10.6364 3 9.75 3C8.86358 3 7.98583 3.17459 7.16689 3.51381C6.34794 3.85303 5.60382 4.35023 4.97703 4.97703C4.35023 5.60382 3.85303 6.34794 3.51381 7.16689C3.17459 7.98583 3 8.86358 3 9.75C3 10.6364 3.17459 11.5142 3.51381 12.3331C3.85303 13.1521 4.35023 13.8962 4.97703 14.523C5.60382 15.1498 6.34794 15.647 7.16689 15.9862C7.98583 16.3254 8.86358 16.5 9.75 16.5Z" fill="black"/>
                            </svg>
                        </button>
                    </form>
                    {
                        resultados &&
                        <div style={{ width:"100%", display: "flex", justifyContent: "end", gap: "50px"}}>
                            <div className="resultado-busqueda">
                                <span>Resultados:</span>
                                <span style={{color: "#1A3D7D"}}> {total}</span>
                            </div>
                            <div className="resultado-busqueda">
                                <span>Ordenar por: </span>
                                <select className="select-filtro" name="filter" onChange={(event) => orderArray && orderArray(event.target.value)}>
                                    <option value="new">Más reciente</option>
                                    <option value="older">Más antiguos</option>
                                </select>
                            </div>
                        </div>
                    }
                    {
                        resultadosPrestamo &&
                        <div style={{ width:"100%", display: "flex", justifyContent: "end", gap: "50px"}}>
                            <div className="resultado-busqueda">
                                <span>Resultados:</span>
                                <span style={{color: "#1A3D7D"}}> 42</span>
                            </div>
                            <div className="resultado-busqueda">
                                <span>Dispensadores:</span>
                                <span style={{color: "#1A3D7D"}}> 52</span>
                            </div>
                            <div className="resultado-busqueda">
                                <span>Botellones:</span>
                                <span style={{color: "#1A3D7D"}}> 20</span>
                            </div>
                        </div>
                    }
                </div>
                <div style={{marginTop: "6px", display: "flex", justifyContent:"space-between", flexWrap: "wrap", height: "30px", width: "30%"}}>
                    {
                        filtro &&
                        <div>
                            <button type="button" className="boton-filtro" onClick={onFilter}>
                                <span style={{marginRight: "5px"}}>Filtrar</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <g clipPath="url(#clip0_35_4995)">
                                    <path d="M0 19.5C0 18.6703 0.670312 18 1.5 18H4.06406C4.64062 16.6734 5.9625 15.75 7.5 15.75C9.0375 15.75 10.3594 16.6734 10.9359 18H22.5C23.3297 18 24 18.6703 24 19.5C24 20.3297 23.3297 21 22.5 21H10.9359C10.3594 22.3266 9.0375 23.25 7.5 23.25C5.9625 23.25 4.64062 22.3266 4.06406 21H1.5C0.670312 21 0 20.3297 0 19.5ZM9 19.5C9 18.6703 8.32969 18 7.5 18C6.67031 18 6 18.6703 6 19.5C6 20.3297 6.67031 21 7.5 21C8.32969 21 9 20.3297 9 19.5ZM18 12C18 11.1703 17.3297 10.5 16.5 10.5C15.6703 10.5 15 11.1703 15 12C15 12.8297 15.6703 13.5 16.5 13.5C17.3297 13.5 18 12.8297 18 12ZM16.5 8.25C18.0375 8.25 19.3594 9.17344 19.9359 10.5H22.5C23.3297 10.5 24 11.1703 24 12C24 12.8297 23.3297 13.5 22.5 13.5H19.9359C19.3594 14.8266 18.0375 15.75 16.5 15.75C14.9625 15.75 13.6406 14.8266 13.0641 13.5H1.5C0.670312 13.5 0 12.8297 0 12C0 11.1703 0.670312 10.5 1.5 10.5H13.0641C13.6406 9.17344 14.9625 8.25 16.5 8.25ZM9 3C8.17031 3 7.5 3.67031 7.5 4.5C7.5 5.32969 8.17031 6 9 6C9.82969 6 10.5 5.32969 10.5 4.5C10.5 3.67031 9.82969 3 9 3ZM12.4359 3H22.5C23.3297 3 24 3.67031 24 4.5C24 5.32969 23.3297 6 22.5 6H12.4359C11.8594 7.32656 10.5375 8.25 9 8.25C7.4625 8.25 6.14062 7.32656 5.56406 6H1.5C0.670312 6 0 5.32969 0 4.5C0 3.67031 0.670312 3 1.5 3H5.56406C6.14062 1.67344 7.4625 0.75 9 0.75C10.5375 0.75 11.8594 1.67344 12.4359 3Z" fill="#1B1B1B"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_35_4995">
                                    <rect width="24" height="24" fill="white"/>
                                    </clipPath>
                                    </defs>
                                </svg>
                            </button>
                        </div>
                    }
                    {paginacion && 
                        <div style={{display: "flex", gap: "15px", width: "145px", minWidth: "145px"}}>
                            <div>
                                <button type="button" className="boton-paginado">
                                    <img style={{transform: "rotate(90deg)"}} src="./Desplegable-icon.svg" alt="" />
                                </button>
                            </div>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <span className="text-paginado">3 De 20</span>
                            </div>
                            <div>
                                <button type="button" className="boton-paginado">
                                    <img style={{transform: "rotate(-0.25turn)"}} src="./Desplegable-icon.svg" alt="" />
                                </button>
                            </div>
                        </div>
                    }
                </div>
                {
                    infoPedidos && 
                    <div className="infoPedidos-filtro">
                        <div style={{display: "flex", gap: "17px", justifyContent: "space-between"}}>
                            <div className="infoPedidosLetras-filtro">
                                <span>10 botellones 20 lt</span>
                            </div>
                            <div className="infoPedidosLetras-filtro" style={{color: "#1A3D7D", fontWeight: "600"}}>
                                <span>35 Bs</span>
                            </div>
                        </div>
                        <div style={{display: "flex", gap: "17px", justifyContent: "space-between"}}>
                            <div className="infoPedidosLetras-filtro">
                                <span>5 botellones 10 lt</span>
                            </div>
                            <div className="infoPedidosLetras-filtro" style={{color: "#1A3D7D", fontWeight: "600"}}>
                                <span>35 Bs</span>
                            </div>
                        </div>
                        <div style={{display: "flex", gap: "17px", justifyContent: "space-between"}}>
                            <div className="infoPedidosLetras-filtro">
                                <span>1 Dispensador</span>
                            </div>
                            <div className="infoPedidosLetras-filtro" style={{color: "#1A3D7D", fontWeight: "600"}}>
                                <span>35 Bs</span>
                            </div>
                        </div>
                    </div>
                }
            </div>
            {
                iconUbicacion &&
                <div style={{display: "flex", gap: "35px", marginBottom: "25px", marginTop: "10px"}}>
                    <div className="Mapaclientes-ubicacion">
                        <svg xmlns="http://www.w3.org/2000/svg" width="31" height="47" viewBox="0 0 31 47" fill="#DD0000">
                            <path d="M31 15.3918C31 23.8925 23.1159 33.807 15.5 47C6.78557 33.807 0 23.8925 0 15.3918C0 6.89115 6.93959 0 15.5 0C24.0604 0 31 6.89115 31 15.3918Z"/>
                        </svg>
                        <span>
                            Clientes registrados
                        </span>
                    </div>
                    <div className="Mapaclientes-ubicacion">
                        <svg xmlns="http://www.w3.org/2000/svg" width="31" height="47" viewBox="0 0 31 47" fill="#FF5C00">
                            <path d="M31 15.3918C31 23.8925 23.1159 33.807 15.5 47C6.78557 33.807 0 23.8925 0 15.3918C0 6.89115 6.93959 0 15.5 0C24.0604 0 31 6.89115 31 15.3918Z"/>
                        </svg>
                        <span>
                            Clientes registrados
                        </span>
                    </div>
                    <div className="Mapaclientes-ubicacion">
                        <svg xmlns="http://www.w3.org/2000/svg" width="31" height="47" viewBox="0 0 31 47" fill="#960090">
                            <path d="M31 15.3918C31 23.8925 23.1159 33.807 15.5 47C6.78557 33.807 0 23.8925 0 15.3918C0 6.89115 6.93959 0 15.5 0C24.0604 0 31 6.89115 31 15.3918Z"/>
                        </svg>
                        <span>
                            Clientes registrados
                        </span>
                    </div>
                    <div className="Mapaclientes-ubicacion">
                        <svg xmlns="http://www.w3.org/2000/svg" width="31" height="47" viewBox="0 0 31 47" fill="#1FAF38">
                            <path d="M31 15.3918C31 23.8925 23.1159 33.807 15.5 47C6.78557 33.807 0 23.8925 0 15.3918C0 6.89115 6.93959 0 15.5 0C24.0604 0 31 6.89115 31 15.3918Z"/>
                        </svg>
                        <span>
                            Clientes registrados
                        </span>
                    </div>
                </div>
            }
            {
                swith &&
                <div style={{display: "flex", justifyContent: "space-between", flexWrap: "wrap", width: "100%", alignItems: "center", marginBottom: "32px", marginTop: "20px"}}>
                    <div style={{width: "50%"}}>
                        <Switch opcion1={opcionesSwitch1!} opcion2={opcionesSwitch2!}/>
                    </div>
                    <div style={{ display: "flex", gap: "50px"}}>
                        <div className="resultado-busqueda">
                            <span>Resultados:</span>
                            <span style={{color: "#1A3D7D"}}> 42</span>
                        </div>
                        <div className="resultado-busqueda">
                            {
                                finanzas ? 
                                <>
                                <span>Total: </span>
                                <span style={{color: "#1A3D7D", fontWeight: "600"}}>500 Bs </span>
                                </>
                                :
                                <>
                                <span>Ordenar por: </span>
                                <select className="select-filtro" name="filter">
                                    <option value="">Más reciente</option>
                                    <option value="">Más antiguos</option>
                                </select>
                                </>
                            }
                        </div>
                    </div>
                </div>
            }
            <div className="filtroScroll" style={{height: exportar && add ? "62vh" : "65vh", maxHeight: exportar && add ? "62vh" : "75vh", marginTop: swith ? "auto" : "1em" }}>
                {children}
            </div>
            {paginacion &&
                <div style={{width: "100%", display: "flex", justifyContent: "end"}}>
                    <div style={{display: "flex", gap: "15px", width: "145px", minWidth: "145px"}}>
                        <div>
                            <button type="button" className="boton-paginado">
                                <img style={{transform: "rotate(90deg)"}} src="./Desplegable-icon.svg" alt="" />
                            </button>
                        </div>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <span className="text-paginado">3 De 20</span>
                        </div>
                        <div>
                            <button type="button" className="boton-paginado">
                                <img style={{transform: "rotate(-0.25turn)"}} src="./Desplegable-icon.svg" alt="" />
                            </button>
                        </div>
                    </div>
                </div>
            }
            <div style={{width: "100%", height: "100%", display:"flex", justifyContent: exportar && add === true ? "space-between" : exportar === true ? "start" : "end", alignItems: "end"}}>
                {exportar && 
                    <div className="boton-exportar">
                        <button type="button" className="btn-export" onClick={exportToExcel}>
                            <img src="./IconDocumento.svg" alt="" />
                        </button>
                        <span style={{textAlign: "center"}}>Exportar</span>
                    </div>
                }
                {add && onAdd &&
                    <div style={{marginBottom: "1em"}}>
                        <button type="button" className="btn-agregar" onClick={onAdd}>
                            <span className="material-symbols-outlined">
                                add
                            </span>
                        </button>
                    </div>
                }
            </div>
        </div>
        </>
    )
}

export{ FiltroPaginado }