import React, { useEffect, useState, useRef } from "react";
import "./CuadroRealizarPedido.css";
import { Client } from "../../../../type/Cliente/Client";
import Product from "../../../../type/Products/Products";
import { ClientsApiConector, OrdersApiConector, ProductsApiConector } from "../../../../api/classes";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { AuthService } from "../../../../api/services/AuthService";
import { IOrderBody } from "../../../../api/types/orders";
import { useForm } from "react-hook-form";

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

  const [selectedProducts, setSelectedproducts] = useState<IOrderBody['data']['detail']>([]);
  // Estado para mostrar u ocultar las opciones filtradas
  const [showOptions, setShowOptions] = useState(false);
  // Referencia para detectar clics fuera del componente
  const optionsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { watch, setValue, register } = useForm<IOrderBody['data']>()

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
    if (!selectedClient || selectedProducts.length === 0) {
      console.log("All fields are required");
      return;
    }

    const res = await OrdersApiConector.create({
      data: {
        deliverDate: "",
        user: AuthService.getUser()?._id || "",
        client: selectedClient._id,
        comment: "",
        detail: selectedProducts
      }
    })

    if (res) {
      toast.success("Pedido realizado con exito")
    } else {
      toast.error("Error al realizar el pedido")
    }

    resetForm()
    window.location.reload()
    if (onClose) onClose()
  };

  const [toEdit, setToEdit] = useState<{ product: string; quantity: number } | null>(null)

  const handleAddItem = () => {
    const prod = watch('detail.0.product')
    const quant = watch('detail.0.quantity')

    if (!!prod && quant > 0) {

      if (toEdit) {
        setSelectedproducts((prev => prev.map(s => ({ ...s, quantity: quant }))))
        setToEdit(null)
      } else {
        if (selectedProducts.some(p => p.product === prod)) {
          setSelectedproducts((prev => prev.map(s => ({ ...s, quantity: s.product === prod ? s.quantity + quant : s.quantity }))))
        } else {
          setSelectedproducts((prev => [...prev, { product: prod, quantity: quant }]))
        }
      }

      setValue('detail.0.product', "", { shouldValidate: true })
      setValue('detail.0.quantity', 1, { shouldValidate: true })
      setCantidad(0)
    }
  }

  const handleDeleteItem = (it: string) => {
    setValue('detail.0.product', "", { shouldValidate: true })
    setValue('detail.0.quantity', 1, { shouldValidate: true })
    setToEdit(null)
    setSelectedproducts((prev => prev.filter(p => p.product !== it)))
  }

  // Manejador para seleccionar un cliente de las opciones filtradas
  const handleOptionClick = (cliente: Client) => {
    setSelectedClient(cliente);
    setSearchTerm("");
    setShowOptions(false);
  };

  const handleQuantityIcons = (mode: 'inc' | 'dec') => {
    if (mode === 'dec' && cantidad > 1) {
      setValue('detail.0.quantity', cantidad - 1, { shouldValidate: true })
      setCantidad(cantidad - 1)
    } else if (mode === 'inc') {
      setValue('detail.0.quantity', cantidad + 1, { shouldValidate: true })
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
      setValue('detail.0.quantity', 1, { shouldValidate: true })
      setValue('detail.0.product', "", { shouldValidate: true })
      setCantidad(1);
      setSelectedClient(null)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} ref={formRef}>
        <div>
          <div className="buscador-cliente-container relative">
            <input
              type="text"
              placeholder="Buscar cliente por nombre o teléfono"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowOptions(true);
              }}
              className="buscador-cliente bg-blocks "
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
              <div ref={optionsRef} className="absolute w-full top-[50px] left-0 bg-blocks rounded-xl max-h-[200px] overflow-auto">
                {filteredClients.map((cliente) => (
                  <div
                    key={cliente._id}
                    onClick={() => handleOptionClick(cliente)}
                    className="option-item bg-blocks"
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
            className="selec-pedido bg-blocks"
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
            disabled={!!toEdit}
            id="producto"
            className="selec-pedido bg-blocks"
            {...register('detail.0.product')}
          >
            <option value="">Seleccione un producto</option>
            {productos.map((producto) => (
              <option key={producto._id} value={producto._id}>
                {producto.name} - {producto.price} Bs
              </option>
            ))}
          </select>
          <div style={{ marginTop: "11px", gap: "15px", display: "flex" }}>
            <div className="cantidad-pedido bg-blocks text-inherit">
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
                    value={watch('detail.0.quantity')}
                    onChange={e => {
                      setValue('detail.0.quantity', parseInt(e.target.value), { shouldValidate: true })
                      setCantidad(parseInt(e.target.value))
                    }}
                    className="numero-solicitado bg-blocks text-inherit"
                    required
                  />
                </div>
                <button type="button" className="boton" onClick={() => handleQuantityIcons('inc')}>
                  <img src="./BotonMas-icon.svg" alt="" />
                </button>
              </div>
            </div>
            <button type="button" onClick={() => handleAddItem()} className="text-xs bg-blue_custom rounded-[20px] py-2 px-4 disabled:bg-gray-400" disabled={!watch('detail.0.product') || watch('detail.0.quantity') === 0}>
              {toEdit ? "Editar" : "Agregar"}
            </button>
          </div>

          <div className={`w-full mt-4`}>
            <div className="max-h-[300px] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
              {selectedProducts.map((product, index) => (
                <motion.div
                  key={index}
                  className={`mb-2 flex justify-between items-center bg-blocks dark:border-blocks shadow-md border shadow-zinc-300/25 rounded-2xl p-2 ${product.product === toEdit?.product && "border-2 border-blue_custom"
                    }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col gap-4 p-1">
                    <p className="text-xs">
                      {productos.find(p => p._id === product.product)?.name}
                    </p>
                    <div className="flex gap-4 items-center">
                      <p className="text-xs">Cantidad: {product.quantity}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center flex-col pr-4 text-xs">
                    <button
                      type="button"
                      className="text-blue_custom hover:text-blue-600"
                      onClick={() => {
                        setValue('detail.0.product', product.product, { shouldValidate: true })
                        setValue('detail.0.quantity', product.quantity, { shouldValidate: true })
                        setCantidad(product.quantity)
                        setToEdit(product)
                      }}
                    >
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button
                      type="button"
                      className="text-red-700 hover:text-red-500"
                      onClick={() => handleDeleteItem(product.product)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: "11px",
              display: "flex",
              justifyContent: "end",
            }}
          >
            <button className="boton-realizar-pedido !outline-none !border-0 disabled:bg-gray-400" type="submit" disabled={!selectedClient || selectedProducts.length === 0}>
              Realizar Pedido
            </button>
          </div>
        </div>
      </form >
    </>
  );
};

export { CuadroRealizarPedido };
