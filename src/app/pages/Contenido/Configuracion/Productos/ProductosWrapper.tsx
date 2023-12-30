import { FC } from "react";
import { ProductosProvider } from "./ProductosContext";
import { Productos } from "./Productos";



const ProductosWrapper: FC = () => {

    return (
        <>
        <ProductosProvider>
            <Productos/>
        </ProductosProvider>
        </>
    )

}

export { ProductosWrapper }