import { FC, useState, useContext, useEffect } from "react";
import "./RegistrarPedido.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";
import { OptionScrooll } from "../../../components/OptionScrooll/OptionScrooll";
import moment from "moment";
import DatePicker from "react-datepicker";
import { ClientesContext } from "../ClientesContext";
import { saveOrder } from "../../../../../services/OrdersService";
import { GetProducts } from "../../../../../services/ProductsService";
import Product from "../../../../../type/Products/Products";

type ProductosAdd = {
  id: number;
  cantidadSeleccionada: string;
  productoSeleccionado: Product;
};

const RegistrarPedido: FC = () => {
  const { selectedClient } = useContext(ClientesContext);
  const [opcionesVisibles, setOpcionesVisibles] = useState<boolean>(true);
  const [productosAgregados, setProductosAgregados] = useState<
    Array<ProductosAdd>
  >([]);

  const handleOpcionesClick = () => {
    setOpcionesVisibles(!opcionesVisibles);
  };

  const handleClick = () => {
    navigate("/Clientes");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
    console.log("Comment changed:", e.target.value);
  };

  const AgregarProducto = () => {
    if (!selectedProducto || !selectedCantidad) {
      window.alert("Por favor seleccione un producto y una cantidad.");
      return;
    }

    const TodosProductos = [...productosAgregados];
    const ProductoNew: ProductosAdd = {
      id: productosAgregados.length + 1,
      cantidadSeleccionada: selectedCantidad,
      productoSeleccionado: selectedProducto,
    };
    TodosProductos.push(ProductoNew);
    setProductosAgregados(TodosProductos);
    setSelectedCantidad("");
    setSelectedProducto(undefined);
  };

  const editProduct = (id: number) => {
    const productToEdit = productosAgregados.find(
      (product) => product.id === id
    );
    if (productToEdit) {
      setSelectedEdit(true);
      setEditId(id);
      setSelectedCantidad(productToEdit.cantidadSeleccionada);
      setSelectedProducto(productToEdit.productoSeleccionado);
      console.log("Editing product with id:", id);
    }
  };

  const saveEditProduct = () => {
    const TodosProductos = productosAgregados.map((P) =>
      P.id === editId
        ? {
            ...P,
            cantidadSeleccionada: selectedCantidad,
            productoSeleccionado: selectedProducto as Product,
          }
        : P
    );
    setProductosAgregados(TodosProductos);
    setSelectedEdit(false);
    setSelectedCantidad("");
    setSelectedProducto(undefined);
    console.log(
      "Product edited:",
      TodosProductos.find((P) => P.id === editId)
    );
  };

  const DeleteProducto = (id: number) => {
    const TodosProductos = productosAgregados.filter((P) => P.id !== id);
    setProductosAgregados(TodosProductos);
  };

  const handleFechaChange = (date: Date | null) => {
    setFecha(date);
    setMostrarCalendario(false);
    console.log("Date changed:", date);
  };

  const saveOrderData = async () => {
    console.log("Selected client:", selectedClient);
    const allProducts = productosAgregados;
    setLoadingSale(true);

    if (allProducts.length === 0) {
      window.alert("No hay productos agregados para vender");
      console.log("No products to sell");
      setLoadingSale(false);
      return;
    }

    try {
      const orderData = {
        user: selectedClient.user,
        client: selectedClient._id,
        comment: comment,
        deliverDate: fecha,
        detail: productosAgregados.map((product) => ({
          productId: product.productoSeleccionado._id,
          quantity: product.cantidadSeleccionada,
        })),
      };

      console.log("Selected client: ", selectedClient);

      const resp = await saveOrder(orderData);
      if (resp === 200) {
        console.log("Order successfully registered", orderData);
        window.alert("Pedido registrado correctamente");
        navigate("/Clientes");
      } else {
        window.alert(
          "Error al registrar el pedido. Código de respuesta: " + resp
        );
      }
    } catch (error) {
      console.error("Error saving order:", error);
      window.alert("Error al registrar el pedido");
    } finally {
      setLoadingSale(false);
    }
  };

  return (
    <>
      <div>
        <PageTitle titulo="Clientes" icon="../clientes-icon.svg" />
        <div
          className="RegistrarVenta-titulo flex items-start cursor-pointer"
          onClick={handleClick}
        >
          <button className="RegistrarVenta-btn">
            <span className="material-symbols-outlined translate-y-0.5">
              arrow_back
            </span>
          </button>
          <span>Regresar</span>
        </div>
        <RegistrarPedido />
      </div>
    </>
  );
};

export { RegistrarPedido };
