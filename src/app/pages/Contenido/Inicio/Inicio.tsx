import { BarChart } from "../../components/Barchart/Barchart";
import { CuadroClientes } from "../../components/CuadroClientes/CuadroClientes";
import { CuadroInformativo } from "../../components/CuadroInformativo/CuadroInformativo";
import { CuadroRealizarPedido } from "../../components/CuadroRealizarPedido/CuadroRealizarPedido";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import "./Inicio.css";
import { FC } from "react";

const Inicio: FC = () => {

    return (
        <>
            <div>
                <PageTitle titulo="Inicio" icon="./home-icon.svg" />
                <div className="Cuadros-informativos">
                    <CuadroInformativo
                        titulo="Clientes nuevos"
                        numero="18"
                        porcentajeVerde="+8.2%" />

                    <CuadroInformativo
                        titulo="Préstamos activos"
                        numero="25"
                        porcentajeRojo="+8.2%" />

                    <CuadroInformativo
                        titulo="Pedidos totales"
                        numero="1,236"
                        porcentajeVerde="+8.2%" />

                    <CuadroInformativo
                        titulo="Clientes nuevos"
                        numero="1,783"
                        letra="Bs"
                        porcentajeVerde="+8.2%" />
                </div>
                <div className="sub-title">
                    <span>Acciones rápidas</span>
                </div>
                <div className="Cuadros">
                    <div>
                        <CuadroClientes/>
                    </div>
                    <div>
                        <CuadroRealizarPedido/>
                    </div>
                </div>
                <BarChart/>
            </div>
        </>
    )
}

export { Inicio }