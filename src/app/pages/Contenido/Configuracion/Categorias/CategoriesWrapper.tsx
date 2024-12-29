import { FC } from "react";
import { CategoriesProvider } from "./categories/CategoriesContext";
import { Categories } from "./categories/Categories";
import { useParams } from "react-router-dom";
import { Unidades } from "./unidades/Unidades";
import { UnidadesProvider } from "./unidades/UnidadesContext";

const CategoriesWrapper: FC = () => {
    const params = useParams()

    if (!params?.section) { return null }

    return (
        <>
            {
                params.section === "Categorias" &&
                <CategoriesProvider>
                    <Categories />
                </CategoriesProvider>
            }
            {
                params.section === "Unidades" &&
                <UnidadesProvider>
                    <Unidades />
                </UnidadesProvider>
            }
        </>
    )
}

export { CategoriesWrapper }