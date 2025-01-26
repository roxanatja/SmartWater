import { FC } from "react";
import { PromotionsProvider } from "./PromocionesContext";
import { Promotions } from "./Promotions";



const PromocionesWrapper: FC = () => {

    return (
        <>
            <PromotionsProvider>
                <Promotions />
            </PromotionsProvider>
        </>
    )

}

export { PromocionesWrapper }