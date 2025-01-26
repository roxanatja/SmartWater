import "./CuadroPagosProveedor.css";
import { InvoceExpense } from "../../../../../../type/InvoceExpense";
import { Providers } from "../../../../../../type/providers";
import { formatDateTime } from "../../../../../../utils/helpers";

const CuadroPagosProveedor = ({
    invoice,
    providers
}: {
    providers: Providers[]
    invoice: InvoceExpense
}) => {
    return (
        <>
            <div className="CuadroCuentasPorCobrar-container">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div className="CuadroVentaCliente-header">
                        <div className="bg-blue_custom text-white px-3.5 py-1.5 rounded-full flex justify-center items-center relative">
                            <div className="opacity-0">.</div>
                            <p className="absolute font-extrabold whitespace-nowrap">
                                {providers.find(p => p._id === invoice.provider)?.fullName?.[0] || "S"}
                            </p>
                        </div>
                        <span>{providers.find(p => p._id === invoice.provider)?.fullName || "Proveedor desconocido"}</span>
                    </div>
                </div>
                <div className="flex justify-between">
                    <div className="CuadroVentaCliente-text">
                        <span>Pago {invoice.cashPayment ? "efectivo" : invoice.paymentMethodCurrentAccount ? "cuenta corriente" : "al contado"}</span>
                    </div>
                    <div className="CobrosClientes-pago">
                        <span className="text-blue_custom whitespace-nowrap text-end">{invoice.amount.toLocaleString()} <span>Bs.</span></span>
                    </div>
                </div>
                <div>
                    <div className="CuadroVentaCliente-text">
                        <span>Fecha: <span className="text-blue_custom">{formatDateTime(invoice.date, 'numeric', '2-digit', '2-digit')}</span></span>
                    </div>
                </div>
            </div>
        </>
    )
}

export { CuadroPagosProveedor }