import { FC, useContext, useEffect, useState } from "react";
import "./ReportesEgresos.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { Link } from "react-router-dom";
import Modal from "../../../EntryComponents/Modal";
import { FiltroEgresosGastos } from "../ReportesIngresos/FiltroEgresosGastos/FiltroEgresosGastos";
import { Zone } from "../../../../../type/City";
import { Providers } from "../../../../../type/providers";
import { Account } from "../../../../../type/AccountEntry";
import { User } from "../../../../../type/User";
import { ZonesApiConector, UsersApiConector, ProvidersApiConector, AccountEntryApiConector, ExpensesApiConector } from "../../../../../api/classes";
import { ReportesEgresosContext } from "./ReportesEgresosContext";
import FiltrosCuentasPorPagar from "./FiltrosCuentasPorPagar/FiltrosCuentasPorPagar";
import { Expense } from "../../../../../type/Expenses";
import FiltroPagoProveedores from "./FiltroPagoProveedores/FiltroPagoProveedores";
import FiltrosProveedores from "./FiltrosProveedores/FiltrosProveedores";

const ReportesEgresos: FC = () => {

    const {
        egresosGastos,
        setEgresosGastos,
        cuentasPorPagar,
        pagos,
        proveedores,
        setCuentasPorPagar,
        setpagos,
        setProveedores
    } = useContext(ReportesEgresosContext)

    const [expenses, setExpenses] = useState<Expense[]>([])
    const [zones, setZones] = useState<Zone[]>([])
    const [providers, setProviders] = useState<Providers[]>([])
    const [accounts, setAccounts] = useState<Account[]>([])
    const [distribuidores, setDistribuidores] = useState<User[]>([])

    useEffect(() => {
        ExpensesApiConector.get({ pagination: { page: 1, pageSize: 30000 } }).then(res => setExpenses(res?.data || []))
        ZonesApiConector.get({ pagination: { page: 1, pageSize: 30000 } }).then(res => setZones(res?.data || []))
        UsersApiConector.get({ pagination: { page: 1, pageSize: 30000 }, filters: { desactivated: false } }).then(res => setDistribuidores(res?.data || []))
        ProvidersApiConector.get({ pagination: { page: 1, pageSize: 30000 } }).then(res => setProviders(res?.data || []))
        AccountEntryApiConector.get().then(res => setAccounts(res || []))
    }, [])

    return (
        <>
            <div className="px-10">
                <PageTitle titulo="Reportes Egresos/ C por Pagar" icon="../../Reportes-icon.svg" />
                <div className="ReportesEgresos-container py-4 overflow-auto">
                    <button
                        className="ReportesIngresos-item"
                        onClick={() => setProveedores(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="74" height="68" viewBox="0 0 74 68" fill="none">
                            <path d="M10.75 52L0.75 55L1.75 58.5C2.55 60.9 4.75 61.8333 5.75 62H11.75L10.75 52Z" fill="currentColor" />
                            <path d="M19.2502 26.5L16.2502 24C13.4502 29.2 16.0835 32.8333 17.7502 34C17.3502 35.2 20.2502 39.1667 21.7502 41L21.2502 48.5L16.2502 50L17.2502 62H42.2502L43.2502 47.5V41L47.7502 34C50.9502 30.4 49.7502 25.8333 48.7502 24L46.2502 26.5C47.8502 29.7 45.9169 31.5 44.7502 32C45.9502 33.6 38.2502 41 34.2502 44.5H30.7502C27.1502 43.3 22.2502 35.6667 20.2502 32C17.0502 30.8 18.2502 27.8333 19.2502 26.5Z" fill="currentColor" />
                            <path d="M21.0609 5.41798C16.6609 9.41798 16.5 14.5 17 17C28.6001 8.6001 43.2278 12.9181 49.061 15.918C50.261 14.318 46.5609 8.41798 44.5609 5.41798L35.061 1.91801C33.561 -0.582426 31.3943 0.751342 30.561 1.91801L21.0609 5.41798Z" fill="currentColor" />
                            <path d="M47.561 18.9176C37.561 14.9176 23.3943 17.2509 17.561 18.9176C18.761 22.5176 21.061 24.0842 22.061 24.4175C32.061 19.2175 40.561 22.2508 43.561 24.4175C47.961 20.4175 48.061 19.0842 47.561 18.9176Z" fill="currentColor" />
                            <path d="M24.75 54L25.25 44.5L30.75 47.5H34.75L40.25 44.5V54.5C33.45 57.3 27.0833 55.3333 24.75 54Z" fill="none" />
                            <path d="M73.25 42.5H46.75L47.25 67.5H73.25V42.5Z" fill="currentColor" />
                            <path d="M65.2508 48H54.7508C53.9508 50.4 55.4174 51.3333 56.2508 51.5H63.75C65.75 50.5 65.5841 48.8333 65.2508 48Z" fill="none" />
                            <path d="M10.75 52L0.75 55L1.75 58.5C2.55 60.9 4.75 61.8333 5.75 62H11.75L10.75 52Z" stroke="none" />
                            <path d="M19.2502 26.5L16.2502 24C13.4502 29.2 16.0835 32.8333 17.7502 34C17.3502 35.2 20.2502 39.1667 21.7502 41L21.2502 48.5L16.2502 50L17.2502 62H42.2502L43.2502 47.5V41L47.7502 34C50.9502 30.4 49.7502 25.8333 48.7502 24L46.2502 26.5C47.8502 29.7 45.9169 31.5 44.7502 32C45.9502 33.6 38.2502 41 34.2502 44.5H30.7502C27.1502 43.3 22.2502 35.6667 20.2502 32C17.0502 30.8 18.2502 27.8333 19.2502 26.5Z" stroke="none" />
                            <path d="M21.0609 5.41798C16.6609 9.41798 16.5 14.5 17 17C28.6001 8.6001 43.2278 12.9181 49.061 15.918C50.261 14.318 46.5609 8.41798 44.5609 5.41798L35.061 1.91801C33.561 -0.582426 31.3943 0.751342 30.561 1.91801L21.0609 5.41798Z" stroke="none" />
                            <path d="M47.561 18.9176C37.561 14.9176 23.3943 17.2509 17.561 18.9176C18.761 22.5176 21.061 24.0842 22.061 24.4175C32.061 19.2175 40.561 22.2508 43.561 24.4175C47.961 20.4175 48.061 19.0842 47.561 18.9176Z" stroke="none" />
                            <path d="M24.75 54L25.25 44.5L30.75 47.5H34.75L40.25 44.5V54.5C33.45 57.3 27.0833 55.3333 24.75 54Z" stroke="none" />
                            <path d="M73.25 42.5H46.75L47.25 67.5H73.25V42.5Z" stroke="none" />
                            <path d="M65.2508 48H54.7508C53.9508 50.4 55.4174 51.3333 56.2508 51.5H63.75C65.75 50.5 65.5841 48.8333 65.2508 48Z" stroke="none" />
                        </svg>
                        <span>Proveedores</span>
                    </button>
                    <button
                        className="ReportesIngresos-item"
                        onClick={() => setEgresosGastos(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="62" height="64" viewBox="0 0 62 64" fill="none">
                            <path d="M56.745 31.8008L31.0089 39.7196L4.87695 31.8008V55.1612L31.0089 63.08L56.745 55.1612V31.8008Z" fill="currentColor" stroke="currentColor" stroke-width="0.791878" stroke-linejoin="round" />
                            <path d="M38.1367 42.8871L51.2027 38.9277" stroke="none" stroke-width="1.9797" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M38.1367 48.4301L51.2027 44.4707" stroke="none" stroke-width="1.9797" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M23.8819 48.4312L11.212 44.4717" stroke="none" stroke-width="1.9797" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M23.8815 42.8882L11.2114 39.3251" stroke="none" stroke-width="1.9797" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M31.0098 42.0957V57.9333" stroke="none" stroke-width="1.9797" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M3.2936 11.2124V0.917969H8.04487V11.2124H10.4205L5.66924 18.3393L0.917969 11.2124H3.2936Z" fill="currentColor" stroke="currentColor" stroke-width="0.791878" />
                            <path d="M21.1113 29.0301L13.9844 31.8016L19.9235 33.7813L21.1113 29.0301Z" fill="currentColor" />
                            <path d="M21.9032 34.5732L28.6341 13.9844L40.9082 17.9438L34.9691 36.157L31.0098 37.3448L21.9032 34.5732Z" fill="currentColor" />
                            <path d="M48.0351 31.8016C48.0351 25.1499 43.2839 24.8067 40.9082 25.4666L42.492 20.7153L53.1823 24.2788L51.2027 31.0098L48.0351 31.8016Z" fill="currentColor" />
                            <path d="M45.6595 32.9895L37.7407 35.3651L39.3245 29.0301C45.6595 25.229 46.1874 30.0859 45.6595 32.9895Z" fill="currentColor" />
                            <path d="M21.1113 29.0301L13.9844 31.8016L19.9235 33.7813L21.1113 29.0301Z" stroke="currentColor" stroke-width="0.791878" />
                            <path d="M21.9032 34.5732L28.6341 13.9844L40.9082 17.9438L34.9691 36.157L31.0098 37.3448L21.9032 34.5732Z" stroke="currentColor" stroke-width="0.791878" />
                            <path d="M48.0351 31.8016C48.0351 25.1499 43.2839 24.8067 40.9082 25.4666L42.492 20.7153L53.1823 24.2788L51.2027 31.0098L48.0351 31.8016Z" stroke="currentColor" stroke-width="0.791878" />
                            <path d="M45.6595 32.9895L37.7407 35.3651L39.3245 29.0301C45.6595 25.229 46.1874 30.0859 45.6595 32.9895Z" stroke="currentColor" stroke-width="0.791878" />
                            <path d="M53.9733 11.2124V0.917969H58.7246V11.2124H61.1002L56.3489 18.3393L51.5977 11.2124H53.9733Z" fill="currentColor" stroke="currentColor" stroke-width="0.791878" />
                            <ellipse cx="30.6765" cy="28.9357" rx="1.58376" ry="3.95939" transform="rotate(19.8496 30.6765 28.9357)" fill="none" />
                        </svg>
                        <span>Egresos y gastos</span>
                    </button>
                    <button
                        className="ReportesIngresos-item"
                        onClick={() => setCuentasPorPagar(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="65" height="64" viewBox="0 0 65 64" fill="none">
                            <path d="M34.9384 34.0614L1.58203 0.705078H8.852C9.53624 1.73143 8.56691 2.8433 7.99671 3.27095L31.9449 27.2191C34.6818 25.1664 37.6468 26.3638 38.7872 27.2191L46.4848 18.6662C45.8006 17.2977 44.3466 14.3897 44.7742 13.5344C45.2019 12.6791 46.1997 9.40053 46.0571 8.40269L38.7872 0.705078H42.2083L55.0377 14.3897L34.9384 34.0614Z" fill="currentColor" />
                            <path d="M23.3919 26.3638C23.3919 27.048 21.6814 26.6489 20.8261 26.3638L15.2667 18.6662L7.99671 10.9686L22.5367 34.0614L27.6684 30.2126C26.8131 30.6403 23.3919 25.5085 23.3919 26.3638Z" fill="currentColor" />
                            <path d="M34.9384 0.705078H22.5367C16.3786 11.6528 21.6814 15.245 26.3855 16.1003C31.0896 16.9556 37.3617 4.98153 34.9384 0.705078Z" fill="currentColor" />
                            <path d="M37.5042 21.2321C40.0701 22.9426 43.0636 16.9556 40.9254 15.6727C38.7872 14.3897 34.9384 19.5215 37.5042 21.2321Z" fill="currentColor" />
                            <path d="M57.1759 59.2925C57.1759 59.2925 65.7286 43.4697 64.4459 43.0419C63.1632 42.6142 58.4587 38.7098 49.0507 37.4825C39.6427 36.2553 39.2146 40.9038 37.5043 41.759C35.7939 42.6142 26.764 43.0418 24.2472 44.7525C21.7305 46.4632 23.3924 49.029 24.2472 49.029H41.7807C41.7807 49.029 42.636 48.6012 42.2084 49.8843C41.7807 51.1673 24.2472 51.5948 24.2472 51.5948C22.999 52 10.072 43.1616 6.28615 40.4761C2.50031 37.7905 0.299739 42.6142 2.00969 44.7525C3.71965 46.8909 29.8066 63.1413 29.8066 63.1413C33.912 64.5097 49.9062 56.2991 50.7613 55.8713C51.6164 55.4435 57.1759 59.2925 57.1759 59.2925Z" fill="currentColor" />
                            <path d="M22.9643 43.8971C21.2537 44.9235 21.6814 47.746 22.109 49.029L8.42437 39.6207C12.1877 35.1732 19.6857 40.6185 22.9643 43.8971Z" fill="currentColor" />
                            <path d="M24.2472 42.6142C25.7859 41.759 28.3608 40.8574 30.499 41C20.9198 33.8156 17.1198 35.9145 16.122 37.4825L24.2472 42.6142Z" fill="currentColor" />
                            <path d="M34.9384 34.0614L1.58203 0.705078H8.852C9.53624 1.73143 8.56691 2.8433 7.99671 3.27095L31.9449 27.2191C34.6818 25.1664 37.6468 26.3638 38.7872 27.2191L46.4848 18.6662C45.8006 17.2977 44.3466 14.3897 44.7742 13.5344C45.2019 12.6791 46.1997 9.40053 46.0571 8.40269L38.7872 0.705078H42.2083L55.0377 14.3897L34.9384 34.0614Z" stroke="currentColor" stroke-width="0.855291" />
                            <path d="M23.3919 26.3638C23.3919 27.048 21.6814 26.6489 20.8261 26.3638L15.2667 18.6662L7.99671 10.9686L22.5367 34.0614L27.6684 30.2126C26.8131 30.6403 23.3919 25.5085 23.3919 26.3638Z" stroke="currentColor" stroke-width="0.855291" />
                            <path d="M34.9384 0.705078H22.5367C16.3786 11.6528 21.6814 15.245 26.3855 16.1003C31.0896 16.9556 37.3617 4.98153 34.9384 0.705078Z" stroke="currentColor" stroke-width="0.855291" />
                            <path d="M37.5042 21.2321C40.0701 22.9426 43.0636 16.9556 40.9254 15.6727C38.7872 14.3897 34.9384 19.5215 37.5042 21.2321Z" stroke="currentColor" stroke-width="0.855291" />
                            <path d="M57.1759 59.2925C57.1759 59.2925 65.7286 43.4697 64.4459 43.0419C63.1632 42.6142 58.4587 38.7098 49.0507 37.4825C39.6427 36.2553 39.2146 40.9038 37.5043 41.759C35.7939 42.6142 26.764 43.0418 24.2472 44.7525C21.7305 46.4632 23.3924 49.029 24.2472 49.029H41.7807C41.7807 49.029 42.636 48.6012 42.2084 49.8843C41.7807 51.1673 24.2472 51.5948 24.2472 51.5948C22.999 52 10.072 43.1616 6.28615 40.4761C2.50031 37.7905 0.299739 42.6142 2.00969 44.7525C3.71965 46.8909 29.8066 63.1413 29.8066 63.1413C33.912 64.5097 49.9062 56.2991 50.7613 55.8713C51.6164 55.4435 57.1759 59.2925 57.1759 59.2925Z" stroke="currentColor" stroke-width="0.855291" />
                            <path d="M22.9643 43.8971C21.2537 44.9235 21.6814 47.746 22.109 49.029L8.42437 39.6207C12.1877 35.1732 19.6857 40.6185 22.9643 43.8971Z" stroke="currentColor" stroke-width="0.855291" />
                            <path d="M24.2472 42.6142C25.7859 41.759 28.3608 40.8574 30.499 41C20.9198 33.8156 17.1198 35.9145 16.122 37.4825L24.2472 42.6142Z" stroke="currentColor" stroke-width="0.855291" />
                        </svg>
                        <span>Cuentas por pagar</span>
                    </button>

                    <button
                        className="ReportesIngresos-item"
                        onClick={() => setpagos(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="76" height="76" viewBox="0 0 76 76" fill="none">
                            <path d="M36.309 7.10984C34.3895 7.45884 32.7384 8.34477 31.2082 9.86158C30.0001 11.0562 29.3021 12.1838 28.7652 13.7946C28.4699 14.6939 28.4162 15.0563 28.4296 16.6403C28.4296 18.2376 28.4699 18.5732 28.7786 19.5262C29.2887 21.0699 30.0001 22.1974 31.2216 23.4189C32.4431 24.6404 33.5707 25.3519 35.1143 25.8619C36.0674 26.1707 36.403 26.2109 38.0003 26.2109C39.5977 26.2109 39.9333 26.1707 40.8863 25.8619C42.43 25.3519 43.5575 24.6404 44.779 23.4189C46.0005 22.1974 46.712 21.0699 47.222 19.5262C47.5308 18.5732 47.571 18.2376 47.571 16.6403C47.571 15.0429 47.5308 14.7073 47.222 13.7543C46.712 12.2106 46.0005 11.0831 44.779 9.86158C42.9132 7.98234 40.9668 7.13669 38.403 7.04272C37.6245 7.01588 36.6848 7.04272 36.309 7.10984ZM39.0742 10.318V11.5126L39.4769 11.6737C40.0406 11.9019 40.8729 12.8818 41.0608 13.5261C41.3561 14.4926 41.3427 14.4926 40.148 14.4926C39.2755 14.4926 39.0742 14.4523 39.0742 14.2912C39.0742 13.9288 38.4433 13.4187 38.0003 13.4187C37.45 13.4187 36.9265 13.9422 36.9265 14.4926C36.9265 15.0563 37.45 15.5664 38.0137 15.5664C39.6648 15.5664 41.2219 17.1369 41.2219 18.788C41.2219 19.8752 40.3896 21.231 39.4769 21.6068L39.0742 21.7679V22.9625V24.1572H38.0003H36.9265V22.9625V21.7679L36.5238 21.6068C35.96 21.3786 35.1278 20.3987 34.9398 19.7544C34.6445 18.788 34.6579 18.788 35.8526 18.788C36.7251 18.788 36.9265 18.8282 36.9265 18.9893C36.9265 19.3517 37.5574 19.8618 38.0003 19.8618C38.5507 19.8618 39.0742 19.3383 39.0742 18.788C39.0742 18.2242 38.5507 17.7141 37.9869 17.7141C36.3358 17.7141 34.7788 16.1436 34.7788 14.4926C34.7788 13.4053 35.611 12.0495 36.5238 11.6737L36.9265 11.5126V10.318V9.12331H38.0003H39.0742V10.318Z" fill="currentColor" />
                            <path d="M9.00555 13.5927C8.75051 13.6733 8.227 14.0491 7.86458 14.425C6.91153 15.3646 6.64307 16.3713 7.01892 17.6331C7.23369 18.3714 8.34781 19.4855 9.08608 19.7003C9.48878 19.8211 11.3546 19.8613 15.7708 19.8613H21.8918V18.0358C21.8918 15.8478 21.7576 15.3512 20.9924 14.4921C20.0394 13.4317 19.932 13.4182 14.3211 13.4317C11.1935 13.4451 9.31428 13.4988 9.00555 13.5927ZM11.1533 16.6398V17.7136H10.0794H9.00555V16.6398V15.5659H10.0794H11.1533V16.6398ZM15.4487 16.6398V17.7136H14.3748H13.301V16.6398V15.5659H14.3748H15.4487V16.6398ZM19.7441 16.6398V17.7136H18.6702H17.5964V16.6398V15.5659H18.6702H19.7441V16.6398Z" fill="currentColor" />
                            <path d="M56.2551 13.5927C55.5974 13.8075 54.4698 14.9619 54.2685 15.6465C54.1745 15.9686 54.1074 16.9888 54.1074 18.0358V19.8613H60.2284C64.6446 19.8613 66.5104 19.8211 66.9131 19.7003C67.6514 19.4855 68.7655 18.3714 68.9803 17.6331C69.3293 16.4384 69.1011 15.4451 68.242 14.4921C67.289 13.4317 67.1816 13.4182 61.5707 13.4317C58.4431 13.4451 56.5639 13.4988 56.2551 13.5927ZM58.4028 16.6398V17.7136H57.329H56.2551V16.6398V15.5659H57.329H58.4028V16.6398ZM62.6982 16.6398V17.7136H61.6244H60.5505V16.6398V15.5659H61.6244H62.6982V16.6398ZM66.9937 16.6398V17.7136H65.9198H64.846V16.6398V15.5659H65.9198H66.9937V16.6398Z" fill="currentColor" />
                            <path d="M15.5161 26.4249C14.2812 26.747 13.1939 27.6329 12.6301 28.7873C12.1738 29.7135 12.1603 31.4451 12.6033 32.3445C13.0597 33.2975 13.61 33.8747 14.5362 34.3713C15.3148 34.7875 15.4759 34.8277 16.5229 34.8143C17.4893 34.8143 17.7712 34.7606 18.3484 34.4653C19.3552 33.9284 19.7847 33.5257 20.2948 32.5861C20.7109 31.8075 20.7512 31.6465 20.7512 30.5994C20.7512 29.5524 20.7109 29.3914 20.2948 28.6128C19.5297 27.2168 18.3618 26.4651 16.8047 26.3712C16.3215 26.3443 15.7443 26.3577 15.5161 26.4249Z" fill="currentColor" />
                            <path d="M58.4712 26.4249C57.2363 26.747 56.149 27.6329 55.5852 28.7873C55.1288 29.7135 55.1154 31.4451 55.5584 32.3445C56.0148 33.2975 56.5651 33.8747 57.4913 34.3713C58.2699 34.7875 58.4309 34.8277 59.4779 34.8143C60.4444 34.8143 60.7263 34.7606 61.3035 34.4653C62.3102 33.9284 62.7398 33.5257 63.2499 32.5861C63.666 31.8075 63.7062 31.6465 63.7062 30.5994C63.7062 29.5524 63.666 29.3914 63.2499 28.6128C62.4847 27.2168 61.3169 26.4651 59.7598 26.3712C59.2766 26.3443 58.6994 26.3577 58.4712 26.4249Z" fill="currentColor" />
                            <path d="M34.7793 34.68V41.3379H35.8532H36.927L36.9002 34.8545L36.8599 28.3846L36.323 28.304C36.0277 28.2638 35.5578 28.1832 35.2894 28.1161L34.7793 28.0222V34.68Z" fill="currentColor" />
                            <path d="M40.081 28.2101C39.7185 28.2906 39.3293 28.3712 39.2487 28.398C39.1145 28.4383 39.0742 29.8477 39.0742 34.8948V41.3379H40.1481H41.2219V34.6934C41.2219 28.4517 41.2085 28.049 40.9937 28.0624C40.8595 28.0758 40.4568 28.143 40.081 28.2101Z" fill="currentColor" />
                            <path d="M14.7107 37.231C13.2744 37.6873 12.214 38.6001 11.5966 39.929L11.2207 40.7344V46.9761V53.2179L11.6771 54.0636C12.1872 55.0032 12.6033 55.4059 13.6234 55.9428L14.308 56.3052L18.5363 56.3723C21.3418 56.426 22.8854 56.4931 23.1271 56.6005C23.6774 56.8421 24.5231 57.6609 24.7915 58.2247C25.0197 58.6677 25.0466 59.2046 25.1137 63.5134L25.1808 68.3189L25.6238 68.7484C25.9996 69.1243 26.1473 69.1914 26.7245 69.1914C27.3017 69.1914 27.4493 69.1243 27.8252 68.7484L28.2681 68.3189V62.3053V56.3052L27.8117 55.4596C27.3017 54.5065 26.8721 54.1038 25.8654 53.5937C25.2613 53.285 24.9526 53.2313 23.221 53.1508C21.5163 53.0702 21.1673 53.0165 20.4961 52.7078C19.4491 52.2246 19.0061 51.889 18.4021 51.1239C17.4893 49.9695 17.3551 49.4057 16.9255 44.7211C16.7108 42.3854 16.5497 40.4525 16.59 40.4257C16.6437 40.3585 18.59 40.1304 18.6303 40.184C18.6437 40.1975 18.8451 42.117 19.0598 44.4526C19.4894 49.003 19.5565 49.3252 20.3753 50.0903C20.5766 50.2917 21.0196 50.5735 21.3552 50.7212C21.919 50.9762 22.2277 51.0031 25.8922 51.0031H29.8252L30.1474 50.6675C30.5903 50.238 30.5903 49.6205 30.1474 49.191L29.8252 48.8554H26.6976C23.7042 48.8554 23.5297 48.842 22.966 48.5466C22.0129 48.0634 21.9055 47.7547 21.6102 44.6539C21.3149 41.4861 21.1941 40.7612 20.7377 39.9022C19.6102 37.7679 16.8584 36.5464 14.7107 37.231Z" fill="currentColor" />
                            <path d="M58.6723 37.231C57.7461 37.486 57.1152 37.835 56.3903 38.4659C55.048 39.674 54.7527 40.5867 54.3903 44.5868C54.1084 47.7547 54.001 48.0634 53.0346 48.5466C52.4708 48.842 52.2963 48.8554 49.3029 48.8554H46.1753L45.8532 49.191C45.6384 49.3923 45.5176 49.6742 45.5176 49.9292C45.5176 50.1843 45.6384 50.4662 45.8532 50.6675L46.1753 51.0031H50.1083C53.7728 51.0031 54.0816 50.9762 54.6453 50.7212C54.9809 50.5735 55.4239 50.2917 55.6252 50.0903C56.444 49.3252 56.5111 49.003 56.9407 44.4526C57.1555 42.117 57.3568 40.1975 57.3702 40.184C57.4105 40.1304 59.3569 40.3585 59.4106 40.4257C59.4508 40.4525 59.2897 42.3854 59.075 44.7211C58.6454 49.3252 58.5112 49.9292 57.679 51.0299C57.1152 51.7682 56.4709 52.2649 55.491 52.7078C54.8333 53.0165 54.4708 53.0702 52.7795 53.1508C51.1285 53.2313 50.7123 53.2984 50.1486 53.5669C49.3029 53.9696 48.4975 54.775 48.068 55.6341L47.7324 56.3052V62.3053V68.3189L48.1754 68.7484C48.5512 69.1243 48.6989 69.1914 49.2761 69.1914C49.8533 69.1914 50.0009 69.1243 50.3768 68.7484L50.8197 68.3189L50.8868 63.5134C50.954 59.2046 50.9808 58.6677 51.209 58.2247C51.4775 57.6609 52.3231 56.8421 52.8735 56.6005C53.1151 56.4931 54.6588 56.426 57.4642 56.3723L61.6925 56.3052L62.3771 55.9428C63.3972 55.4059 63.8134 55.0032 64.3234 54.0635L64.7798 53.2179V46.9761V40.7344L64.404 39.929C63.3704 37.7142 60.9945 36.5866 58.6723 37.231Z" fill="currentColor" />
                            <path d="M7.193 43.822L6.85742 44.1441V49.5536C6.85742 55.4195 6.89769 55.7954 7.60912 57.2048C8.09235 58.1578 9.26017 59.3391 10.1998 59.8492C11.6763 60.6277 12.0253 60.668 17.757 60.668H22.9652V59.9297C22.9652 59.3122 22.9115 59.1243 22.6296 58.8558L22.3075 58.5203H18.5087C14.3073 58.5203 13.7569 58.4397 12.3475 57.7015C11.4079 57.1914 10.2401 56.0101 9.75683 55.0571C9.05882 53.6879 9.00513 53.1779 9.00513 48.4798V44.1441L8.66955 43.822C8.4682 43.6072 8.18632 43.4864 7.93128 43.4864C7.67623 43.4864 7.39435 43.6072 7.193 43.822Z" fill="currentColor" />
                            <path d="M36.8194 45.1637C37.4369 46.0764 37.9604 46.8281 38.0007 46.8281C38.041 46.8281 38.5645 46.0764 39.1819 45.1637L40.2826 43.4858H38.0007H35.7188L36.8194 45.1637Z" fill="currentColor" />
                            <path d="M67.3289 43.822L66.9933 44.1441V48.359C66.9933 50.6812 66.9262 52.896 66.8591 53.2987C66.5235 55.0571 65.1946 56.8692 63.6509 57.7015C62.2415 58.4397 61.6911 58.5203 57.4897 58.5203H53.6909L53.3688 58.8558C53.0869 59.1243 53.0332 59.3122 53.0332 59.9297V60.668H58.2414C63.8791 60.668 64.2684 60.6277 65.6778 59.9163C66.6309 59.433 67.8121 58.2652 68.3222 57.3256C69.1007 55.8491 69.141 55.5135 69.141 49.5536V44.1441L68.8054 43.822C68.6041 43.6072 68.3222 43.4864 68.0671 43.4864C67.8121 43.4864 67.5302 43.6072 67.3289 43.822Z" fill="currentColor" />
                            <path d="M13.3009 66.037V69.2586H10.6163H7.93164V70.3324V71.4062H15.4486H22.9656V70.3324V69.2586H20.281H17.5963V66.037V62.8155H15.4486H13.3009V66.037Z" fill="currentColor" />
                            <path d="M58.4025 66.037V69.2586H55.7178H53.0332V70.3324V71.4062H60.5502H68.0671V70.3324V69.2586H65.3825H62.6979V66.037V62.8155H60.5502H58.4025V66.037Z" fill="currentColor" />
                        </svg>
                        <span>Pagos a proveedores</span>
                    </button>
                    <Link to={"/Reportes/Egresos/Graficos"}>
                        <div className="ReportesEgresos-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="88" height="76" viewBox="0 0 88 76" fill="none">
                                <path d="M27.1202 50.6667L38.1983 41.0083L45.4626 47.3417L58.3568 36.1792V41.1667H65.6212V25.3333H47.4603V31.6667H53.181L45.4626 38.3958L38.1983 32.0625L22.0352 46.2333L27.1202 50.6667ZM11.1387 66.5V9.5H76.5177V66.5H11.1387ZM18.403 60.1667H69.2533V15.8333H18.403V60.1667Z" fill="currentColor" />
                            </svg>
                            <span>Gráficos</span>
                        </div>
                    </Link>
                </div >
            </div >


            <Modal isOpen={egresosGastos} onClose={() => setEgresosGastos(false)}>
                <FiltroEgresosGastos distribuidores={distribuidores} zones={zones} accounts={accounts} providers={providers} />
            </Modal>
            <Modal isOpen={cuentasPorPagar} onClose={() => setCuentasPorPagar(false)}>
                <FiltrosCuentasPorPagar distribuidores={distribuidores} zones={zones} providers={providers} />
            </Modal>
            <Modal isOpen={pagos} onClose={() => setpagos(false)}>
                <FiltroPagoProveedores expenses={expenses} distribuidores={distribuidores} zones={zones} providers={providers} />
            </Modal>
            <Modal isOpen={proveedores} onClose={() => setProveedores(false)}>
                <FiltrosProveedores providers={providers} distribuidores={distribuidores} />
            </Modal>
        </>
    )
}

export { ReportesEgresos }