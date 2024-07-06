import React, { useEffect, useState } from "react";
import "./CuadroRealizarPedido.css";
import { loadClients } from "../../../../services/ClientsService";
import { GetProducts } from "../../../../services/ProductsService";
import { Client } from "../../../../type/Cliente/Client";
import Product from "../../../../type/Products/Products";
import { saveOrder } from "../../../../services/OrdersService";
import { OpcionesPedidos } from "../../Contenido/Pedidos/CuadroPedidos/OpcionesPedidos/OpcionesPedidos";

const CuadroRealizarPedido = () => {
  // Estado para almacenar la lista de clientes y productos disponibles
  const [clientes, setClientes] = useState<Client[]>([]);
  const [productos, setProductos] = useState<Product[]>([]);
  const [showMiniModal, setShowMiniModal] = useState(false);

  // Cargar clientes y productos al montar el componente
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await loadClients();
        setClientes(response.data);
      } catch (error) {
        console.log("Error fetching clients:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await GetProducts();
        setProductos(response.data);
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };

    fetchClients();
    fetchProducts();
  }, []);

  // Función para manejar el envío del formulario de pedido
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Obtener datos del formulario
    const client = formData.get("cliente") as string;
    const product = formData.get("producto") as string;
    const quantity = formData.get("cantidad") as string;
    const price = formData.get("precio") as string;

    // Construir objeto de datos para enviar al servicio de orden
    const orderData = {
      client,
      detail: [
        {
          product,
          quantity: Number(quantity),
          price: Number(price),
        },
      ],
      total: Number(quantity) * Number(price),
      creditSale: false,
    };

    try {
      // Llamar al servicio para guardar la orden
      const responseStatus = await saveOrder(orderData);
      if (responseStatus === 201) {
        console.log("Order saved successfully");
      } else {
        console.log("Failed to save order");
      }
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  // Función para manejar el clic en las opciones del pedido
  const handleOpcionesClick = () => {
    setShowMiniModal(!showMiniModal);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="RealizarPedidoCuadro">
          <div className="titulo-RealizarPedido">
            <div>
              <span className="RealizarPedido-title">Realizar Pedido</span>
            </div>
            <div className="opciones-svg" onClick={handleOpcionesClick}>
              <img src="./Opciones-icon.svg" alt="" />
              {showMiniModal && <OpcionesPedidos />}
            </div>
          </div>
          <div>
            {/* Selector de cliente */}
            <select
              name="cliente"
              id="cliente"
              className="selec-pedido"
              required
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente._id} value={cliente._id}>
                  {cliente.fullName}
                </option>
              ))}
            </select>
            {/* Selector de producto */}
            <select
              name="producto"
              id="producto"
              className="selec-pedido"
              required
            >
              <option value="">Seleccione un producto</option>
              {productos.map((producto) => (
                <option key={producto._id} value={producto._id}>
                  {producto.name}
                </option>
              ))}
            </select>
            {/* Selección de cantidad y precio */}
            <div style={{ marginTop: "11px", gap: "15px", display: "flex" }}>
              <div className="cantidad-pedido">
                <span style={{ marginLeft: "10px" }}>Cantidad</span>
                <div className="numero-pedido">
                  <button type="button" className="boton">
                    <img src="./BotonMenos-icon.svg" alt="" />
                  </button>
                  <div>
                    <input
                      name="cantidad"
                      type="number"
                      min="1"
                      defaultValue="1"
                      className="numero-solicitado"
                      required
                    />
                  </div>
                  <button type="button" className="boton">
                    <img src="./BotonMas-icon.svg" alt="" />
                  </button>
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <input
                  name="precio"
                  type="number"
                  min="0"
                  defaultValue="15"
                  className="numero-input"
                  required
                />
                <div
                  className="letras-Bs"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <span>Bs</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Botón para realizar el pedido */}
            <div
              style={{
                minWidth: "96%",
                width: "96%",
                marginTop: "11px",
                display: "flex",
                justifyContent: "end",
              }}
            >
              <button className="boton-realizar-pedido" type="submit">
                Realizar Pedido
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export { CuadroRealizarPedido };
