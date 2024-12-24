import React, { useEffect, useState, useRef } from "react";
import "./CuadroRealizarPedido.css";
import { Client } from "../../../../type/Cliente/Client";
import Product from "../../../../type/Products/Products";
import { ClientsApiConector, OrdersApiConector, ProductsApiConector } from "../../../../api/classes";
import toast from "react-hot-toast";

/**
 * Componente `CuadroRealizarPedido` para realizar pedidos.
 *
 * Este componente permite a los usuarios seleccionar un cliente, producto, cantidad y precio para realizar un pedido.
 * Se gestionan las solicitudes de carga de clientes y productos desde el servidor y se maneja el envío del pedido.
 */
const CuadroRealizarPedido = ({ onClose }: { onClose?: () => void }) => {
  // Estado para almacenar la lista de clientes
  const [clientes, setClientes] = useState<Client[]>([]);
  // Estado para almacenar la lista de productos
  const [productos, setProductos] = useState<Product[]>([]);
  const [cantidad, setCantidad] = useState<number>(0);
  // Estado para manejar el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  // Estado para el cliente seleccionado
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedProduct, setSelectedproduct] = useState<Product | null>(null);
  // Estado para mostrar u ocultar las opciones filtradas
  const [showOptions, setShowOptions] = useState(false);
  // Referencia para detectar clics fuera del componente
  const optionsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Efecto para cargar los clientes y productos al montar el componente
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await ClientsApiConector.getClients({ pagination: { page: 1, pageSize: 3000 } });
        setClientes(response?.data || []);
      } catch (error) {
        console.log("Error fetching clients:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await ProductsApiConector.get({ pagination: { page: 1, pageSize: 3000 } });
        setProductos(response?.data || []);
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };

    fetchClients();
    fetchProducts();
  }, []);

  // Filtrar clientes según el término de búsqueda
  const filteredClients = clientes.filter(
    (cliente) =>
      cliente.fullName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      cliente.phoneNumber.includes(searchTerm)
  );

  // Manejador para enviar el formulario de pedido
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const product = formData.get("producto") as string;
    const quantity = formData.get("cantidad") as string;
    const price = formData.get("precio") as string;

    if (!selectedClient || !product || !quantity || !price) {
      console.log("All fields are required");
      return;
    }

    // FIXME: Create order endpoint data request inconsistent
    const res = await OrdersApiConector.create({
      data: {
        client: selectedClient._id,
        clientNotRegistered: {
          address: selectedClient.address,
          district: selectedClient.district,
          fullName: selectedClient.fullName,
          location: selectedClient.location,
          phoneNumber: selectedClient.phoneNumber,
          zone: selectedClient.zone
        },
        comment: "",
        detail: [{
          product, quantity: Number(quantity)
        }]
      }
    })

    console.log(res)

    if (res) {
      toast.success("Pedido realizado con exito")
    } else {
      toast.error("Error al realizar el pedido")
    }

    resetForm()
    if (onClose) onClose()
  };

  // Manejador para seleccionar un cliente de las opciones filtradas
  const handleOptionClick = (cliente: Client) => {
    setSelectedClient(cliente);
    setSearchTerm(cliente.fullName);
    setShowOptions(false);
  };

  const handleQuantityIcons = (mode: 'inc' | 'dec') => {
    if (mode === 'dec' && cantidad > 0) {
      setCantidad(cantidad - 1)
    } else if (mode === 'inc') {
      setCantidad(cantidad + 1)
    }
  };

  // Cerrar las opciones al hacer clic fuera de ellas
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const resetForm = () => {
    if (!!formRef.current) {
      formRef.current.reset()
      setCantidad(0);
      setSelectedClient(null)
      setSelectedproduct(null)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} ref={formRef}>
        <div>
          <div className="buscador-cliente-container">
            <input
              type="text"
              placeholder="Buscar cliente por nombre o teléfono"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowOptions(true);
              }}
              className="buscador-cliente"
              style={{
                display: "block",
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            {showOptions && filteredClients.length > 0 && (
              <div ref={optionsRef} className="options-list">
                {filteredClients.map((cliente) => (
                  <div
                    key={cliente._id}
                    onClick={() => handleOptionClick(cliente)}
                    className="option-item"
                  >
                    {cliente.fullName} / {cliente.phoneNumber}
                  </div>
                ))}
              </div>
            )}
          </div>
          <h5 className="separador-seccion"> o </h5>
          <select
            name="cliente"
            id="cliente"
            className="selec-pedido"
            required
            value={selectedClient?._id || ""}
            onChange={(e) => {
              const selectedId = e.target.value;
              const client =
                clientes.find((c) => c._id === selectedId) || null;
              setSelectedClient(client);
            }}
          >
            <option value="">Seleccione un cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente._id} value={cliente._id}>
                {cliente.fullName}
              </option>
            ))}
          </select>
          <select
            name="producto"
            id="producto"
            className="selec-pedido"
            required
            value={selectedProduct?._id || ""}
            onChange={(e) => {
              const selectedId = e.target.value;
              const product =
                productos.find((c) => c._id === selectedId) || null;
              setSelectedproduct(product);
            }}
          >
            <option value="">Seleccione un producto</option>
            {productos.map((producto) => (
              <option key={producto._id} value={producto._id}>
                {producto.name} - {producto.price} Bs
              </option>
            ))}
          </select>
          <div style={{ marginTop: "11px", gap: "15px", display: "flex" }}>
            <div className="cantidad-pedido">
              <span style={{ marginLeft: "10px" }}>Cantidad</span>
              <div className="numero-pedido">
                <button type="button" className="boton" onClick={() => handleQuantityIcons('dec')}>
                  <img src="./BotonMenos-icon.svg" alt="" />
                </button>
                <div>
                  <input
                    name="cantidad"
                    type="number"
                    min="1"
                    value={cantidad}
                    onChange={e => setCantidad(parseInt(e.target.value))}
                    className="numero-solicitado"
                    required
                  />
                </div>
                <button type="button" className="boton" onClick={() => handleQuantityIcons('inc')}>
                  <img src="./BotonMas-icon.svg" alt="" />
                </button>
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <input
                name="precio"
                type="number"
                min="0"
                value={(Number(selectedProduct?.price) || 0) * cantidad}
                className="numero-input"
                required
                readOnly
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
      </form>
    </>
  );
};

export { CuadroRealizarPedido };
