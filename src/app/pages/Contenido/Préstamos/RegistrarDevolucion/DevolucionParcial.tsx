import { FC, useState } from "react";
import "./RegistrarDevolucion.css";
import { OptionScrooll } from "../../../components/OptionScrooll/OptionScrooll";

type ProductosAdd = {
    id: number,
    cantidadSeleccionada: string,
    productoSeleccionado: string,
}

const DevolucionParcial: FC = () => {

    const [opcionesVisibles, setOpcionesVisibles] = useState<boolean>(true);
    const [productosAgregados, setProductosAgregados] = useState<Array<ProductosAdd>>([]);
    const [selectedCantidad, setSelectedCantidad] = useState<string>('');
    const [selectedProducto, setSelectedProducto] = useState<string>('');
    const Cantidad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    const Producto = ["Botellón de 20 Lts", "Botellón de 10 Lts", "Botellón de 5 Lts"];

    const handleOpcionesClick = () => {
        setOpcionesVisibles(!opcionesVisibles);
    };

    const AgregarProducto = () => {
        var TodosProductos = [...productosAgregados]
        var ProductoNew: ProductosAdd = {
            id: productosAgregados.length + 1,
            cantidadSeleccionada: selectedCantidad,
            productoSeleccionado:  selectedProducto,
        }
        TodosProductos.push(ProductoNew);
        setProductosAgregados(TodosProductos);
    }

    const DeleteProducto = (id: number) => {
        var TodosProductos = productosAgregados.filter(P => P.id !== id);
        setProductosAgregados(TodosProductos);
    }

    return(
        <>
        <form onSubmit={(e) => e.preventDefault()}>
            <div className="RegistrarDevolucion-scrooll">
                <div className="RegistrarDevolucion-NombreCliente">
                    <div className="RegistrarDevolucion-Nombre">
                        <img src="../Cliente2.svg" alt="" />
                        <span>Daniela Ayala</span>
                    </div>
                </div>
                <div className="RegistrarDevolucion-ProductosAdevolver">
                    <div className="RegistrarDevolucion-Producto">
                        <div className="RegistrarDevolucion-Producto1">
                            <div className="RegistrarDevolucion-Producto2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="20" viewBox="0 0 15 20" fill="none">
                                    <path d="M2.38505 9.26562V17.2265C2.38505 19.3771 13.518 19.3771 13.518 17.2265L13.5178 9.26562C13.5178 9.26562 12.2295 7.91797 10.1526 7.91797C8.07633 7.91797 6.92028 9.39587 4.87026 9.39587C2.82054 9.39571 2.38477 9.26563 2.38477 9.26563L2.38505 9.26562Z" fill="#1A3D7D"/>
                                    <path d="M7.95123 20C4.88592 20 1.30648 19.4632 1.30648 17.95V17.3718C1.06652 17.2275 0.914062 16.9699 0.914062 16.6898C0.914062 16.4097 1.06652 16.1525 1.30648 16.0079V12.7139C1.06652 12.5697 0.914062 12.312 0.914062 12.0316C0.914062 11.7516 1.06652 11.4944 1.30648 11.3498V8.05578C1.06652 7.91122 0.914062 7.65388 0.914062 7.37378C0.914062 7.09292 1.0678 6.83463 1.30904 6.69071C1.39255 5.62053 3.60565 3.70342 6.22636 2.83483C6.22204 2.80197 6.21964 2.76879 6.21964 2.73545C6.21964 2.45677 6.36442 2.20583 6.59895 2.06015V1.40495C6.41849 1.25883 6.31083 1.03109 6.31083 0.781694C6.31083 0.35065 6.63574 0 7.03534 0H8.86737C9.26667 0 9.5916 0.35065 9.5916 0.781694C9.5916 1.03156 9.48377 1.25932 9.30348 1.40527V2.06873C9.52872 2.21609 9.66774 2.46424 9.66774 2.73529C9.66774 2.76707 9.66566 2.79853 9.66198 2.83C12.2901 3.69672 14.5101 5.61697 14.5936 6.69102C14.8347 6.83526 14.9881 7.09323 14.9881 7.37393C14.9881 7.6537 14.8358 7.91121 14.5962 8.05577V11.3501C14.8358 11.4943 14.9881 11.7518 14.9881 12.0316C14.9881 12.3117 14.8358 12.5689 14.5962 12.7136V16.0079C14.8358 16.1521 14.9881 16.4096 14.9881 16.6894C14.9881 16.9692 14.8358 17.2265 14.5962 17.3713V17.9497C14.5962 19.4632 11.0163 20 7.95103 20L7.95123 20ZM7.03538 0.447681C6.89141 0.447681 6.7695 0.601121 6.7695 0.782595C6.7695 0.917029 6.83526 1.03853 6.93732 1.09212L7.05746 1.15552V2.34939L6.91156 2.405C6.76967 2.45906 6.67816 2.58897 6.67816 2.73634C6.67816 2.78665 6.69032 2.83712 6.714 2.88635L6.82518 3.11752L6.57513 3.19431C3.91953 4.00994 1.7647 5.93128 1.7647 6.75329V6.98804L1.614 7.04163C1.46955 7.09304 1.37228 7.227 1.37228 7.37483C1.37228 7.52282 1.46955 7.6571 1.614 7.70866L1.7647 7.76225V11.646L1.614 11.6995C1.46955 11.7506 1.37228 11.8845 1.37228 12.0327C1.37228 12.181 1.46923 12.3152 1.614 12.3663L1.7647 12.4198V16.304L1.614 16.3574C1.46955 16.4085 1.37228 16.5425 1.37228 16.6906C1.37228 16.8386 1.46923 16.9729 1.614 17.024L1.7647 17.0774V17.9505C1.7647 18.8497 4.4819 19.5539 7.95077 19.5539C11.4195 19.5539 14.1368 18.8498 14.1368 17.9505V17.0776L14.2872 17.024C14.4317 16.9726 14.5288 16.8386 14.5288 16.6906C14.5288 16.5428 14.4318 16.4088 14.2872 16.3574L14.1368 16.3038V12.4196L14.2872 12.366C14.4317 12.3146 14.5288 12.1805 14.5288 12.0323C14.5288 11.8845 14.4318 11.7505 14.2872 11.6991L14.1368 11.6456V7.76209L14.2872 7.7085C14.4317 7.65709 14.5288 7.52297 14.5288 7.37483C14.5288 7.227 14.4318 7.09303 14.2872 7.04147L14.1368 6.98788V6.75344C14.1367 5.92844 11.9757 4.00419 9.31371 3.19056L9.06559 3.1147L9.17405 2.88446C9.19693 2.83602 9.20845 2.78617 9.20845 2.73663C9.20845 2.59285 9.1203 2.46356 8.98416 2.40748L8.84434 2.34985V1.15489L8.96528 1.09165C9.06671 1.03853 9.13245 0.917184 9.13245 0.782284C9.13245 0.60065 9.01087 0.44737 8.86689 0.44737H7.03515L7.03538 0.447681Z" fill="#1A3D7D"/>
                                </svg>
                                <span>20 lts</span>
                            </div>
                            <div className="RegistrarDevolucion-Producto2">
                                <span>3 Unidades</span>
                            </div>
                        </div>
                        <div className="RegistrarDevolucion-Producto1">
                            <div className="RegistrarDevolucion-Producto2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="20" viewBox="0 0 10 20" fill="none">
                                    <g clip-path="url(#clip0_9_32731)">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.66544 10.6828H8.12651C8.16756 10.6828 8.2082 10.6909 8.24612 10.7066C8.28404 10.7223 8.31849 10.7453 8.34751 10.7744C8.37654 10.8034 8.39956 10.8378 8.41527 10.8758C8.43097 10.9137 8.43905 10.9543 8.43905 10.9954V16.4003C8.43905 16.4413 8.43097 16.482 8.41527 16.5199C8.39956 16.5578 8.37654 16.5923 8.34751 16.6213C8.31849 16.6503 8.28404 16.6733 8.24612 16.6891C8.2082 16.7048 8.16756 16.7128 8.12651 16.7128H2.66555C2.62451 16.7128 2.58387 16.7048 2.54595 16.6891C2.50803 16.6733 2.47357 16.6503 2.44455 16.6213C2.41553 16.5923 2.39251 16.5578 2.3768 16.5199C2.36109 16.482 2.35301 16.4413 2.35301 16.4003V10.9954C2.35301 10.9543 2.36109 10.9137 2.3768 10.8758C2.39251 10.8378 2.41553 10.8034 2.44455 10.7744C2.47357 10.7453 2.50803 10.7223 2.54595 10.7066C2.58387 10.6909 2.62451 10.6828 2.66555 10.6828H2.66544ZM1.64485 8.71582C1.45115 8.7162 1.26549 8.79331 1.12852 8.93028C0.99155 9.06724 0.914437 9.2529 0.914062 9.4466V18.0549H9.87812V9.4466C9.87775 9.2529 9.80063 9.06724 9.66366 8.93028C9.5267 8.79331 9.34104 8.7162 9.14734 8.71582H1.64485ZM6.63412 10.0204C6.63412 9.95959 6.65214 9.90018 6.68591 9.84965C6.71967 9.79912 6.76766 9.75974 6.8238 9.73648C6.87995 9.71322 6.94173 9.70714 7.00134 9.71899C7.06094 9.73085 7.11569 9.76011 7.15866 9.80309C7.20163 9.84606 7.2309 9.90081 7.24275 9.96041C7.25461 10.02 7.24852 10.0818 7.22527 10.1379C7.20201 10.1941 7.16263 10.2421 7.1121 10.2758C7.06157 10.3096 7.00216 10.3276 6.94139 10.3276C6.8599 10.3276 6.78175 10.2952 6.72412 10.2376C6.6665 10.18 6.63413 10.1018 6.63412 10.0204ZM3.54341 10.0204C3.54341 9.95959 3.56143 9.90018 3.59519 9.84965C3.62895 9.79912 3.67694 9.75974 3.73309 9.73648C3.78923 9.71322 3.85102 9.70714 3.91062 9.71899C3.97022 9.73085 4.02497 9.76011 4.06795 9.80309C4.11092 9.84606 4.14018 9.90081 4.15204 9.96041C4.16389 10.02 4.15781 10.0818 4.13455 10.1379C4.1113 10.1941 4.07191 10.2421 4.02138 10.2758C3.97085 10.3096 3.91145 10.3276 3.85068 10.3276C3.76918 10.3276 3.69103 10.2952 3.63341 10.2376C3.57579 10.18 3.54341 10.1018 3.54341 10.0204Z" fill="#1A3D7D"/>
                                        <path d="M2.45133 1.26318H8.2676C8.30864 1.26318 8.34929 1.27126 8.38721 1.28697C8.42513 1.30268 8.45958 1.3257 8.4886 1.35472C8.51763 1.38374 8.54065 1.4182 8.55635 1.45612C8.57206 1.49404 8.58014 1.53468 8.58014 1.57572V4.25558C7.80225 4.3873 6.42213 4.54913 5.44642 4.2612C4.3745 3.94491 2.96473 4.16933 2.13879 4.35566V1.57584C2.13879 1.5348 2.14687 1.49415 2.16258 1.45624C2.17828 1.41832 2.2013 1.38386 2.23033 1.35484C2.25935 1.32582 2.2938 1.30279 2.33172 1.28709C2.36964 1.27138 2.41029 1.2633 2.45133 1.2633V1.26318ZM8.58014 4.88476V5.45336C8.57842 6.09034 8.32462 6.70075 7.8742 7.15117C7.42378 7.6016 6.81337 7.8554 6.17638 7.85712H4.54255C3.90552 7.85543 3.29506 7.60162 2.84461 7.15117C2.39416 6.70072 2.14036 6.09027 2.13867 5.45324V4.99398C2.87028 4.81749 4.26177 4.56144 5.27052 4.8591C6.31302 5.16671 7.71682 5.02421 8.58002 4.88464L8.58014 4.88476Z" fill="#1A3D7D"/>
                                        <path d="M8.25647 1.88837H2.46176C2.2116 1.88756 1.97191 1.78783 1.79501 1.61093C1.61812 1.43404 1.51838 1.19435 1.51758 0.944183C1.51758 0.425861 1.94274 0 2.46176 0H8.25647C8.77479 0 9.20065 0.425158 9.20065 0.944183C9.19997 1.19439 9.10027 1.43414 8.92335 1.61106C8.74643 1.78798 8.50667 1.88768 8.25647 1.88837Z" fill="#1A3D7D"/>
                                        <path d="M6.22403 9.34083H4.5684C4.52736 9.34083 4.48671 9.33275 4.44879 9.31704C4.41087 9.30133 4.37642 9.27831 4.3474 9.24929C4.31837 9.22027 4.29535 9.18581 4.27965 9.14789C4.26394 9.10997 4.25586 9.06933 4.25586 9.02829V7.54457C4.25586 7.50353 4.26394 7.46289 4.27965 7.42497C4.29535 7.38705 4.31837 7.35259 4.3474 7.32357C4.37642 7.29455 4.41087 7.27153 4.44879 7.25582C4.48671 7.24011 4.52736 7.23203 4.5684 7.23203H6.17645V7.23285C6.18255 7.23238 6.18864 7.23215 6.19473 7.23203V7.23285C6.20434 7.23203 6.21407 7.23145 6.22391 7.23145C6.26496 7.23144 6.3056 7.23953 6.34352 7.25523C6.38144 7.27094 6.41589 7.29396 6.44492 7.32298C6.47394 7.35201 6.49696 7.38646 6.51267 7.42438C6.52837 7.4623 6.53646 7.50294 6.53645 7.54399V9.02829C6.53646 9.06933 6.52837 9.10997 6.51267 9.14789C6.49696 9.18581 6.47394 9.22027 6.44492 9.24929C6.41589 9.27831 6.38144 9.30133 6.34352 9.31704C6.3056 9.33275 6.26496 9.34083 6.22391 9.34083H6.22403Z" fill="#1A3D7D"/>
                                        <path d="M4.37516 14.6216H6.41528C6.45633 14.6216 6.49697 14.6297 6.53489 14.6454C6.57281 14.6611 6.60726 14.6841 6.63629 14.7131C6.66531 14.7421 6.68833 14.7766 6.70404 14.8145C6.71974 14.8524 6.72783 14.8931 6.72782 14.9341C6.72783 14.9581 6.72512 14.9819 6.71974 15.0053L6.40907 16.7999L6.40931 16.8007C6.39673 16.8733 6.35894 16.939 6.3026 16.9865C6.24626 17.0339 6.17498 17.0599 6.10134 17.0599H4.68899C4.61242 17.0599 4.53853 17.0317 4.48131 16.9808C4.4241 16.93 4.38754 16.8599 4.37856 16.7838L4.06754 14.9872L4.06707 14.9873C4.05295 14.9057 4.07185 14.8217 4.1196 14.754C4.16736 14.6863 4.24006 14.6403 4.32172 14.6262C4.33933 14.6231 4.35717 14.6216 4.37504 14.6216H4.37516Z" fill="#1A3D7D"/>
                                        <path d="M5.08414 11.9934V12.1433C5.08414 12.2262 5.11707 12.3057 5.17568 12.3643C5.2343 12.4229 5.31379 12.4559 5.39668 12.4559C5.47958 12.4559 5.55907 12.4229 5.61768 12.3643C5.6763 12.3057 5.70922 12.2262 5.70922 12.1433V11.9934H5.97876C6.0198 11.9934 6.06044 11.9854 6.09836 11.9697C6.13628 11.954 6.17074 11.9309 6.19976 11.9019C6.22878 11.8729 6.2518 11.8384 6.26751 11.8005C6.28321 11.7626 6.2913 11.7219 6.2913 11.6809V10.543C6.2913 10.502 6.28321 10.4613 6.26751 10.4234C6.2518 10.3855 6.22878 10.351 6.19976 10.322C6.17074 10.293 6.13628 10.27 6.09836 10.2543C6.06044 10.2386 6.0198 10.2305 5.97876 10.2305H4.81449C4.77345 10.2305 4.73281 10.2386 4.69489 10.2543C4.65697 10.27 4.62251 10.293 4.59349 10.322C4.56447 10.351 4.54145 10.3855 4.52574 10.4234C4.51004 10.4613 4.50195 10.502 4.50195 10.543V11.6809C4.50195 11.7219 4.51004 11.7626 4.52574 11.8005C4.54145 11.8384 4.56447 11.8729 4.59349 11.9019C4.62251 11.9309 4.65697 11.954 4.69489 11.9697C4.73281 11.9854 4.77345 11.9934 4.81449 11.9934H5.08414Z" fill="#1A3D7D"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.87812 18.6802H0.914063V19.6876C0.914061 19.7287 0.922144 19.7693 0.93785 19.8072C0.953556 19.8452 0.976577 19.8796 1.0056 19.9086C1.03462 19.9377 1.06908 19.9607 1.107 19.9764C1.14492 19.9921 1.18556 20.0002 1.2266 20.0002H9.56558C9.60662 20.0002 9.64727 19.9921 9.68519 19.9764C9.72311 19.9607 9.75756 19.9377 9.78658 19.9086C9.81561 19.8796 9.83863 19.8452 9.85433 19.8072C9.87004 19.7693 9.87812 19.7287 9.87812 19.6876V18.6802Z" fill="#1A3D7D"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_9_32731">
                                        <rect width="8.96419" height="20" fill="white" transform="translate(0.914062)"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                                <span>Dispensador</span>
                            </div>
                            <div className="RegistrarDevolucion-Producto2">
                                <span>3 Unidades</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <input type="radio" className="RegistrarDevolucion-inputRadio"/>
                    </div>
                </div>
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
                                        <tr style={{display: "flex", justifyContent: "center", width: "100%"}}>
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
                                        <tr style={{display: "flex", justifyContent: "center", width: "100%"}}>
                                            <td>
                                                <div className="RegistrarDevolucion-TablaBody" style={{borderRadius: "0px 0px 0px 20px"}}>
                                                    <OptionScrooll 
                                                        options={Cantidad}
                                                        onOptionChange={(selectedOption) => setSelectedCantidad(selectedOption)}/>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="RegistrarDevolucion-TablaBody" style={{borderRadius: "0px 0px 20px 0px"}}>
                                                    <OptionScrooll 
                                                        options={Producto}
                                                        onOptionChange={(selectedOption) => setSelectedProducto(selectedOption)}/>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <button className="RegistrarDevolucion-agregarproducto" onClick={AgregarProducto}>
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
                                                    <button className="RegistrarDevolucion-productoAgregadoBTN" onClick={() => DeleteProducto(item.id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                            <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="#C50000"/>
                                                        </svg>
                                                    </button>
                                                    <button className="RegistrarDevolucion-productoAgregadoBTN">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                            <path d="M3 17.46V20.5C3 20.78 3.22 21 3.5 21H6.54C6.67 21 6.8 20.95 6.89 20.85L17.81 9.94L14.06 6.19L3.15 17.1C3.05 17.2 3 17.32 3 17.46ZM20.71 7.04C20.8027 6.94749 20.8762 6.8376 20.9264 6.71663C20.9766 6.59565 21.0024 6.46597 21.0024 6.335C21.0024 6.20403 20.9766 6.07435 20.9264 5.95338C20.8762 5.83241 20.8027 5.72252 20.71 5.63L18.37 3.29C18.2775 3.1973 18.1676 3.12375 18.0466 3.07357C17.9257 3.02339 17.796 2.99756 17.665 2.99756C17.534 2.99756 17.4043 3.02339 17.2834 3.07357C17.1624 3.12375 17.0525 3.1973 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="#1A3D7D"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="RegistrarDevolucion-productoAgregadoCantidad">
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
                <div className="RegistrarDevolucion-FechaComentario">
                    <div className="RegistrarDevolucion-AgregarComentario">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="23" viewBox="0 0 24 23" fill="none">
                            <path d="M3 0C1.34531 0 0 1.23423 0 2.75229V15.1376C0 16.6557 1.34531 17.8899 3 17.8899H7.5V21.3303C7.5 21.5926 7.65938 21.8291 7.9125 21.9452C8.16563 22.0614 8.47031 22.0355 8.7 21.8807L14.4984 17.8899H21C22.6547 17.8899 24 16.6557 24 15.1376V2.75229C24 1.23423 22.6547 0 21 0H3Z" fill="#1A3D7D"/>
                        </svg>
                        <span>Agregar  comentario</span>
                    </div>
                </div>
            </div>
            <div style={{width: "100%", textAlign: "end", marginTop: "10px"}}>
                <button className="RegistrarDevolucion-btnVender">
                    <span>Registrar devolución</span>
                </button>
            </div>
        </form>
        </>
    )
}

export{DevolucionParcial}