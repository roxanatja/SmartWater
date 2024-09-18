import React, { useState, useContext, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import ApiMethodSales from "../../../Class/api.sales";
import { OrdenBody } from "../../../type/Order/Order";
import Product from "../../../type/Products/Products";
import { ClientesContext } from "../Contenido/Clientes/ClientesContext";

const RegisterPedido = () => {
  const { selectedClient } = useContext(ClientesContext);
  const Cantidad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const [products, setProducts] = useState<Product[]>([]);

  const getProduct = useCallback(async () => {
    const api = new ApiMethodSales();
    const res = await api.GetProducts();
    setProducts(res);
  }, []);

  useEffect(() => {
    getProduct();
  }, [getProduct]);
  
  const { register, handleSubmit, watch, setValue, control } =
    useForm<OrdenBody>({
      defaultValues: {
        detail: [{ product: "", quantity: "0" }],
      },
    });

  return (
    <form>
      <div className="">
        <div className="RegistrarPedido-NombreCliente">
          <div className="RegistrarPedido-Nombre">
            <img
              src={selectedClient.storeImage || ""}
              alt=""
              className="imagen-pequena"
            />
            <span>{selectedClient.fullName}</span>
          </div>
          <div
            className="RegistrarPedido-Nombre"
            style={{ gap: "10px", fontWeight: "400" }}
          >
            <i className="fa-brands fa-whatsapp text-xl text-green-500"></i>
            <span>{selectedClient.phoneNumber}</span>
          </div>
        </div>
        <div className="RegistrarPedido-AgregarProducto">
          <div className="RegistrarPedido-AgregarProductoTitulo">
            <span>Agregar producto</span>
            <button
              onClick={handleOpcionesClick}
              className={
                opcionesVisibles
                  ? "RegistrarPedido-btnAgregarProducto AgregarProductoactive-btn"
                  : "RegistrarPedido-btnAgregarProducto"
              }
            >
              <span className="material-symbols-outlined">expand_more</span>
            </button>
          </div>
          <div className="lineagris"></div>
          {opcionesVisibles && (
            <>
              <div className="flex justify-between w-full px-80 text-md font-medium -translate-x-3">
                <p>Cantidad</p>
                <p>Producto</p>
              </div>
              <div className="bg-gradient-to-b from-transparentLight via-customLightBlue to-customBlue grid grid-cols-2 rounded-b-2xl w-full py-20 gap-10">
                <OptionScrooll
                  options={Cantidad}
                  onOptionChange={(selectedOption) =>
                    setSelectedCantidad(selectedOption)
                  }
                />
                <OptionScrooll
                  options={products.map((product) => product.name)}
                  onOptionChange={(selectedOption) =>
                    setSelectedProducto(
                      products.find(
                        (product) => product.name === selectedOption
                      )
                    )
                  }
                />
              </div>
              <div className="text-2xl rounded-2xl w-full flex flex-col items-center gap-2 text-black pr-2.5 shadow-md border p-2 shadow-zinc-300">
                <i
                  className="fa-solid fa-plus rounded-full shadow-md shadow-zinc-400 px-3 py-2.5 bg-blue_custom text-white hover:rotate-90 transition-all cursor-pointer"
                  onClick={selectedEdit ? saveEditProduct : AgregarProducto}
                ></i>
                <p className="text-base font-semibold"> Agregar Producto</p>
              </div>
              {productosAgregados.length > 0 ? (
                <>
                  {productosAgregados.map((item, index) => (
                    <div
                      className="RegistrarPedido-productoAgregado"
                      style={{
                        border:
                          item.id === editId && selectedEdit
                            ? "2px solid blue"
                            : "none",
                      }}
                    >
                      <div className="RegistrarPedido-productoAgregado1">
                        <span>{item.productoSeleccionado.name}</span>
                        <div className="RegistrarPedido-productoAgregadobtncontainer">
                          <button
                            className="RegistrarPedido-productoAgregadoBTN"
                            onClick={() => DeleteProducto(item.id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z"
                                fill="#C50000"
                              />
                            </svg>
                          </button>
                          <button
                            className="RegistrarPedido-productoAgregadoBTN"
                            onClick={() => editProduct(item.id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M3 17.46V20.5C3 20.78 3.22 21 3.5 21H6.54C6.67 21 6.8 20.95 6.89 20.85L17.81 9.94L14.06 6.19L3.15 17.1C3.05 17.2 3 17.32 3 17.46ZM20.71 7.04C20.8027 6.94749 20.8762 6.8376 20.9264 6.71663C20.9766 6.59565 21.0024 6.46597 21.0024 6.335C21.0024 6.20403 20.9766 6.07435 20.9264 5.95338C20.8762 5.83241 20.8027 5.72252 20.71 5.63L18.37 3.29C18.2775 3.1973 18.1676 3.12375 18.0466 3.07357C17.9257 3.02339 17.796 2.99756 17.665 2.99756C17.534 2.99756 17.4043 3.02339 17.2834 3.07357C17.1624 3.12375 17.0525 3.1973 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"
                                fill="#1A3D7D"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="RegistrarPedido-productoAgregadoCantidad">
                        <span>
                          Cantidad:{" "}
                          <span style={{ color: "#1A3D7D" }}>
                            {item.cantidadSeleccionada}
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}
                </>
              ) : null}
            </>
          )}
        </div>
        <div className="RegistrarPedido-FechaComentario">
          <div className="RegistrarPedido-AgregarComentario">
            <label
              htmlFor="FechaPedido"
              onClick={toggleCalendario}
              style={{ cursor: "pointer" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="27"
                viewBox="0 0 25 27"
                fill="none"
              >
                <g clipPath="url(#clip0_9_28590)">
                  <path
                    d="M7.47098 0C8.3928 0 9.13755 0.754102 9.13755 1.6875V3.375H15.8038V1.6875C15.8038 0.754102 16.5486 0 17.4704 0C18.3922 0 19.137 0.754102 19.137 1.6875V3.375H21.6368C23.017 3.375 24.1367 4.50879 24.1367 5.90625V8.4375H0.804688V5.90625C0.804688 4.50879 1.92442 3.375 3.30455 3.375H5.8044V1.6875C5.8044 0.754102 6.54915 0 7.47098 0ZM0.804688 10.125H24.1367V24.4688C24.1367 25.8662 23.017 27 21.6368 27H3.30455C1.92442 27 0.804688 25.8662 0.804688 24.4688V10.125ZM4.97112 13.5C4.51281 13.5 4.13783 13.8797 4.13783 14.3438V19.4062C4.13783 19.8703 4.51281 20.25 4.97112 20.25H9.97083C10.4291 20.25 10.8041 19.8703 10.8041 19.4062V14.3438C10.8041 13.8797 10.4291 13.5 9.97083 13.5H4.97112Z"
                    fill="#1A3D7D"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_9_28590">
                    <rect
                      width="23.332"
                      height="27"
                      fill="white"
                      transform="translate(0.804688)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </label>
            <div style={{ display: mostrarCalendario !== true ? "none" : "" }}>
              <DatePicker
                minDate={new Date()}
                id="FechaPedido"
                selected={fecha}
                onChange={handleFechaChange}
                dateFormat={"dd-mm-yyyy"}
                dropdownMode="select"
                onClickOutside={() => setMostrarCalendario(false)}
              />
            </div>
            <span>
              {fecha === null
                ? "Fecha de entrega"
                : moment(fecha).format("DD/MM/YYYY")}
            </span>
          </div>
          <div className="RegistrarPedido-AgregarComentario">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="23"
              viewBox="0 0 24 23"
              fill="none"
            >
              <path
                d="M3 0C1.34531 0 0 1.23423 0 2.75229V15.1376C0 16.6557 1.34531 17.8899 3 17.8899H7.5V21.3303C7.5 21.5926 7.65938 21.8291 7.9125 21.9452C8.16563 22.0614 8.47031 22.0355 8.7 21.8807L14.4984 17.8899H21C22.6547 17.8899 24 16.6557 24 15.1376V2.75229C24 1.23423 22.6547 0 21 0H3Z"
                fill="#1A3D7D"
              />
            </svg>
            <input
              type="text"
              placeholder="Agregar Comentario"
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
      <div style={{ width: "100%", textAlign: "end", marginTop: "10px" }}>
        <button className="RegistrarPedido-btnVender" onClick={saveOrderData}>
          <span>{loadingSale ? "Cargando" : "Registrar Pedido"}</span>
        </button>
      </div>
    </form>
  );
};

export default RegisterPedido;
