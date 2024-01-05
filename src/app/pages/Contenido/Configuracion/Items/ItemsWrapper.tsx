import { FC } from "react";
import { ItemsProvider } from "./ItemsContext";
import { Items } from "./Items";



const ItemsWrapper: FC = () => {

    return (
        <>
        <ItemsProvider>
            <Items/>
        </ItemsProvider>
        </>
    )

}

export { ItemsWrapper }