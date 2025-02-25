import React, { useContext, useEffect, useState } from 'react'
import { MonitoreoDistribuidoresContext } from './MonitoreoDistribuidoresContext'
import { Link, useNavigate } from 'react-router-dom';
import { PageTitle } from '../../components/PageTitle/PageTitle';
import { useSessionStorage } from '@uidotdev/usehooks';
import { markerStyles } from '../../components/LeafletMap/constants';
import Modal from '../../EntryComponents/Modal';
import CobroMiniModal from '../../components/CashRegister/CashRegister';
import { OpcionesClientes } from './OpcionesClientes/OpcionesClientes';
import RegistrarClientePedido from '../Pedidos/RegistrarCliente/RegistrarClientePedido';
import toast from 'react-hot-toast';
import { OrdersApiConector } from '../../../../api/classes';
import { useGlobalContext } from '../../../SmartwaterContext';
import { clientWithStatus } from '../MapaClientes/MapaClientesContext';
import PostponeModal from './PostponeModal';

const MapClientDetails = () => {
    const { selectedClient, setSelectedClient, setShowMiniModal, showMiniModal, zones, allClients, setSelectedOrder } = useContext(MonitoreoDistribuidoresContext)
    const { setLoading } = useGlobalContext()

    const navigate = useNavigate();
    const [returnUrl, setReturnUrl] = useSessionStorage("returnUrl", "")

    const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
    const [showCobroPopUp, setShowCobroPopUp] = useState<boolean>(false);
    const [showPostponeModal, setShowPostponeModal] = useState<boolean>(false);

    const handleClick = () => {
        setSelectedClient(clientWithStatus);
    };

    useEffect(() => {
        if (selectedClient._id === "") {
            console.log(returnUrl)
            if (returnUrl) {
                navigate(returnUrl)
                setReturnUrl("")
            } else {
                navigate(-1)
            }
        }
    }, [selectedClient, navigate])

    const goToLoans = () => {
        const filters = btoa(JSON.stringify({
            text: selectedClient.fullName || "Sin nombre",
            clients: [selectedClient._id],
            pagination: {
                pageSize: 12,
                page: 1,
                sort: 'desc'
            }
        }))
        navigate(`/Prestamos?filters=${filters}`)
    }

    const goToOrders = () => {
        const filters = btoa(JSON.stringify({
            text: selectedClient.fullName || "Sin nombre",
            clients: selectedClient._id ? [selectedClient._id] : [],
            pagination: {
                pageSize: 12,
                page: 1,
                sort: 'desc'
            }
        }))
        navigate(`/Pedidos/EnCurso?filters=${filters}`)
    }

    const cancelOrder = async (orderId: string) => {
        toast.error(
            (t) => (
                <div>
                    <p className="mb-4 text-center text-[#888]">
                        Se <b>cancelará</b> este pedido <br /> pulsa <b>Proceder</b> para continuar
                    </p>
                    <div className="flex justify-center">
                        <button
                            className="bg-red-500 px-3 py-1 rounded-lg ml-2 text-white"
                            onClick={() => { toast.dismiss(t.id); }}
                        >
                            Cancelar
                        </button>
                        <button
                            className="bg-blue_custom px-3 py-1 rounded-lg ml-2 text-white"
                            onClick={async () => {
                                toast.dismiss(t.id);
                                const response = await OrdersApiConector.cancel({ orderId });
                                if (!!response) {
                                    if (response.mensaje) {
                                        toast.success(response.mensaje, {
                                            position: "top-center",
                                            duration: 2000
                                        });
                                        window.location.reload();
                                    }
                                } else {
                                    toast.error("Error al cancelar el pedido", {
                                        position: "top-center",
                                        duration: 2000
                                    });
                                }
                            }}
                        >
                            Proceder
                        </button>
                    </div>
                </div>
            ),
            {
                className: "shadow-md dark:shadow-slate-400 border border-slate-100 bg-main-background",
                icon: null,
                position: "top-center"
            }
        );
    }

    const onSell = async (orderId?: string) => {
        if (orderId) {
            setLoading(true);

            const order = await OrdersApiConector.getOne({ orderId })
            if (order) {
                setSelectedOrder(order)
                navigate("/MonitoreoDistribuidores/RegistrarVenta")
            } else {
                toast.error("No se encontró el pedido")
            }

            setLoading(false)
        } else {
            navigate("/MonitoreoDistribuidores/RegistrarVenta")
        }
    }

    return (
        <>
            <div className="px-10 h-screen overflow-y-auto">
                <PageTitle titulo="Mapa de clientes" icon="../clientes-icon.svg" />

                <div className={`w-full h-[calc(100%_-_122px)] my-4 rounded-[20px] !text-white px-8 py-5 relative overflow-hidden`}>
                    <div className="absolute top-0 left-0 bottom-0 right-0 content-[''] bg-center bg-cover bg-no-repeat z-0" style={{
                        backgroundImage: `url(${selectedClient.storeImage || "/map-details-bg.png"})`,
                        filter: selectedClient.storeImage ? "brightness(70%)" : "grayscale(100%) brightness(70%)"
                    }}></div>

                    <div className="w-full h-full overflow-auto z-10 flex flex-col relative">
                        <div className="flex w-full justify-between items-center">
                            <div
                                className={`gap-3 text-[18px] font-semibold flex items-start cursor-pointer text-white mt-0 filter drop-shadow-lg`}
                                onClick={handleClick}
                            >
                                <button className="cursor-pointer bg-none border-none">
                                    <span className="material-symbols-outlined translate-y-0.5 text-white">
                                        arrow_back
                                    </span>
                                </button>
                                <span>{selectedClient.fullName || "Sin nombre"}</span>
                            </div>

                            {
                                (selectedClient.status === 'inProgress' && selectedClient.numberOfOrders && selectedClient.numberOfOrders > 1) &&
                                <button type='button' className='relative mr-3 mt-4' onClick={() => {
                                    goToOrders()
                                }}>
                                    <div className="bg-blue_bright rounded-full w-[22.5px] h-[22.5px] text-white text-xs font-semibold absolute -right-1 -top-2 flex items-center justify-center">{selectedClient.numberOfOrders}</div>
                                    <svg width="50" height="50" viewBox="0 0 55 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 2.25C0 1.00312 1.0217 0 2.29167 0H6.63628C8.73698 0 10.599 1.2 11.4679 3H50.7127C53.224 3 55.0573 5.34375 54.3984 7.725L50.4835 22.0031C49.6719 24.9469 46.9505 27 43.8472 27H16.2995L16.8151 29.6719C17.0252 30.7313 17.9705 31.5 19.0686 31.5H46.5972C47.8672 31.5 48.8889 32.5031 48.8889 33.75C48.8889 34.9969 47.8672 36 46.5972 36H19.0686C15.7648 36 12.9288 33.6937 12.3177 30.5156L7.39062 5.10938C7.32378 4.75313 7.00868 4.5 6.63628 4.5H2.29167C1.0217 4.5 0 3.49688 0 2.25ZM12.2222 43.5C12.2222 42.909 12.3408 42.3239 12.5711 41.7779C12.8014 41.232 13.139 40.7359 13.5646 40.318C13.9903 39.9002 14.4955 39.5687 15.0516 39.3425C15.6077 39.1164 16.2037 39 16.8056 39C17.4074 39 18.0034 39.1164 18.5595 39.3425C19.1156 39.5687 19.6209 39.9002 20.0465 40.318C20.4721 40.7359 20.8097 41.232 21.04 41.7779C21.2703 42.3239 21.3889 42.909 21.3889 43.5C21.3889 44.091 21.2703 44.6761 21.04 45.2221C20.8097 45.768 20.4721 46.2641 20.0465 46.682C19.6209 47.0998 19.1156 47.4313 18.5595 47.6575C18.0034 47.8836 17.4074 48 16.8056 48C16.2037 48 15.6077 47.8836 15.0516 47.6575C14.4955 47.4313 13.9903 47.0998 13.5646 46.682C13.139 46.2641 12.8014 45.768 12.5711 45.2221C12.3408 44.6761 12.2222 44.091 12.2222 43.5ZM44.3056 39C45.5211 39 46.6869 39.4741 47.5465 40.318C48.406 41.1619 48.8889 42.3065 48.8889 43.5C48.8889 44.6935 48.406 45.8381 47.5465 46.682C46.6869 47.5259 45.5211 48 44.3056 48C43.09 48 41.9242 47.5259 41.0646 46.682C40.2051 45.8381 39.7222 44.6935 39.7222 43.5C39.7222 42.3065 40.2051 41.1619 41.0646 40.318C41.9242 39.4741 43.09 39 44.3056 39Z" fill={markerStyles[selectedClient.status].backgroundColor} />
                                    </svg>
                                </button>

                            }
                            {
                                (selectedClient.status === 'renewClient' || selectedClient.status === 'attended') &&
                                <button type='button' className='relative mr-3 mt-4' onClick={() => setShowPostponeModal(true)}>
                                    <svg width="50" height="50" viewBox="0 0 109 103" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M54.1985 102.297C47.8371 102.297 41.8779 101.068 36.3206 98.6117C30.7634 96.1549 25.9288 92.8401 21.8168 88.6673C17.7048 84.4877 14.441 79.5775 12.0254 73.9369C9.60984 68.2963 8.40034 62.2439 8.39694 55.7797C8.39694 49.319 9.60644 43.2666 12.0254 37.6225C14.4444 31.9784 17.7082 27.0683 21.8168 22.8921C25.9321 18.7158 30.7668 15.4011 36.3206 12.9477C41.8745 10.4944 47.8338 9.26597 54.1985 9.26252C60.5598 9.26252 66.5191 10.4909 72.0763 12.9477C77.6336 15.4045 82.4682 18.721 86.5801 22.8972C90.6921 27.0734 93.9576 31.9836 96.3766 37.6277C98.7956 43.2717 100.003 49.3224 100 55.7797C100 62.2404 98.7905 68.2928 96.3715 73.9369C93.9525 79.581 90.6887 84.4911 86.5801 88.6673C82.4648 92.8436 77.6302 96.16 72.0763 98.6168C66.5225 101.074 60.5632 102.3 54.1985 102.297ZM68.4478 77.4877L75.5725 70.2517L59.2875 53.7123V29.9368H49.1094V57.8471L68.4478 77.4877ZM21.6285 0.734375L28.7532 7.97038L7.12468 29.9368L0 22.7008L21.6285 0.734375ZM86.7684 0.734375L108.397 22.7008L101.272 29.9368L79.6438 7.97038L86.7684 0.734375Z" fill={markerStyles[selectedClient.status].backgroundColor} />
                                    </svg>

                                </button>

                            }
                        </div>

                        <div className="flex flex-col items-center justify-center h-full w-full gap-4">
                            {
                                !selectedClient._id &&
                                <button onClick={() => setShowRegisterModal(true)}
                                    className='bg-black/20 min-w-[275px] px-8 py-3 rounded-[25px] border-white border backdrop-blur-md font-semibold'>Registrar cliente</button>
                            }

                            {
                                selectedClient.status === 'inProgress' &&
                                <>
                                    {
                                        (selectedClient.associatedOrders && selectedClient.associatedOrders.length === 1) && <>
                                            {
                                                !!selectedClient._id &&
                                                <button
                                                    onClick={() => {
                                                        if (selectedClient.associatedOrders && selectedClient.associatedOrders.length === 1) {
                                                            onSell(selectedClient.associatedOrders[0])
                                                        }
                                                    }}
                                                    className='bg-black/20 min-w-[275px] px-8 py-3 rounded-[25px] border backdrop-blur-md font-semibold border-white'>
                                                    Vender
                                                </button>
                                            }
                                            <button
                                                onClick={() => {
                                                    if (selectedClient.associatedOrders && selectedClient.associatedOrders.length === 1) {
                                                        cancelOrder(selectedClient.associatedOrders[0])
                                                    }
                                                }}
                                                className='bg-black/20 min-w-[275px] px-8 py-3 rounded-[25px] border backdrop-blur-md font-semibold'
                                                style={{
                                                    borderColor: markerStyles[selectedClient.status].backgroundColor,
                                                    color: markerStyles[selectedClient.status].backgroundColor
                                                }}>
                                                Cancelar
                                            </button>
                                        </>
                                    }
                                </>
                            }

                            {
                                (selectedClient.status !== 'inProgress') && <>
                                    <button
                                        onClick={() => { onSell() }}
                                        className='bg-black/20 min-w-[275px] px-8 py-3 rounded-[25px] border backdrop-blur-md font-semibold border-white'>
                                        Vender
                                    </button>
                                </>
                            }

                            {
                                selectedClient._id &&
                                <div className="flex w-full justify-between items-center sm:w-1/2 md:w-1/3 lg:w-1/4 mt-16">
                                    <div className="infoClientes-ventas relative z-10">
                                        <button
                                            disabled={!selectedClient.credit || selectedClient.credit === 0}
                                            className={`infoClientes-moneda cursor-pointer border-0 min-w-[100px] disabled:!bg-gray-400`}
                                            style={{ backgroundColor: markerStyles[selectedClient.status].backgroundColor }}
                                            onClick={() => setShowCobroPopUp(true)}
                                        >
                                            <img src="/Moneda-icon.svg" alt="" />
                                            <div>
                                                <span>{selectedClient.credit?.toString()} Bs.</span>
                                            </div>
                                        </button>
                                    </div>

                                    <div className="infoClientes-ventas relative z-10">
                                        <button
                                            onClick={() => goToLoans()}
                                            disabled={selectedClient.numberOfLoans === 0}
                                            className={`infoClientes-moneda cursor-pointer border-0 disabled:!bg-gray-400 min-w-[100px]`}
                                            style={{ backgroundColor: markerStyles[selectedClient.status].backgroundColor }}
                                        >
                                            <svg width="9" height="20" viewBox="0 0 9 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd"
                                                    d="M1.76895 10.6828H7.23003C7.27107 10.6828 7.31171 10.6909 7.34963 10.7066C7.38755 10.7223 7.42201 10.7453 7.45103 10.7744C7.48005 10.8034 7.50308 10.8378 7.51878 10.8758C7.53449 10.9137 7.54257 10.9543 7.54257 10.9954V16.4003C7.54257 16.4413 7.53449 16.482 7.51878 16.5199C7.50308 16.5578 7.48005 16.5923 7.45103 16.6213C7.42201 16.6503 7.38755 16.6733 7.34963 16.6891C7.31171 16.7048 7.27107 16.7128 7.23003 16.7128H1.76907C1.72803 16.7128 1.68738 16.7048 1.64946 16.6891C1.61154 16.6733 1.57709 16.6503 1.54807 16.6213C1.51904 16.5923 1.49602 16.5578 1.48032 16.5199C1.46461 16.482 1.45653 16.4413 1.45653 16.4003V10.9954C1.45653 10.9543 1.46461 10.9137 1.48032 10.8758C1.49602 10.8378 1.51904 10.8034 1.54807 10.7744C1.57709 10.7453 1.61154 10.7223 1.64946 10.7066C1.68738 10.6909 1.72803 10.6828 1.76907 10.6828H1.76895ZM0.748362 8.71582C0.554661 8.7162 0.369001 8.79331 0.232033 8.93028C0.0950659 9.06724 0.0179529 9.2529 0.0175781 9.4466V18.0549H8.98164V9.4466C8.98126 9.2529 8.90415 9.06724 8.76718 8.93028C8.63021 8.79331 8.44455 8.7162 8.25085 8.71582H0.748362ZM5.73764 10.0204C5.73764 9.95959 5.75566 9.90018 5.78942 9.84965C5.82319 9.79912 5.87117 9.75974 5.92732 9.73648C5.98347 9.71322 6.04525 9.70714 6.10485 9.71899C6.16445 9.73085 6.2192 9.76011 6.26218 9.80309C6.30515 9.84606 6.33441 9.90081 6.34627 9.96041C6.35813 10.02 6.35204 10.0818 6.32878 10.1379C6.30553 10.1941 6.26614 10.2421 6.21561 10.2758C6.16508 10.3096 6.10568 10.3276 6.04491 10.3276C5.96342 10.3276 5.88526 10.2952 5.82764 10.2376C5.77002 10.18 5.73764 10.1018 5.73764 10.0204ZM2.64692 10.0204C2.64692 9.95959 2.66494 9.90018 2.69871 9.84965C2.73247 9.79912 2.78046 9.75974 2.8366 9.73648C2.89275 9.71322 2.95453 9.70714 3.01414 9.71899C3.07374 9.73085 3.12849 9.76011 3.17146 9.80309C3.21443 9.84606 3.2437 9.90081 3.25555 9.96041C3.26741 10.02 3.26133 10.0818 3.23807 10.1379C3.21481 10.1941 3.17543 10.2421 3.1249 10.2758C3.07437 10.3096 3.01496 10.3276 2.95419 10.3276C2.8727 10.3276 2.79455 10.2952 2.73692 10.2376C2.6793 10.18 2.64693 10.1018 2.64692 10.0204Z"
                                                    fill="#F0F4FD" />
                                                <path
                                                    d="M1.55484 1.26318H7.37112C7.41216 1.26318 7.4528 1.27126 7.49072 1.28697C7.52864 1.30268 7.5631 1.3257 7.59212 1.35472C7.62114 1.38374 7.64416 1.4182 7.65987 1.45612C7.67558 1.49404 7.68366 1.53468 7.68366 1.57572V4.25558C6.90576 4.3873 5.52564 4.54913 4.54993 4.2612C3.47802 3.94491 2.06825 4.16933 1.2423 4.35566V1.57584C1.2423 1.5348 1.25039 1.49415 1.26609 1.45624C1.2818 1.41832 1.30482 1.38386 1.33384 1.35484C1.36286 1.32582 1.39732 1.30279 1.43524 1.28709C1.47316 1.27138 1.5138 1.2633 1.55484 1.2633V1.26318ZM7.68366 4.88476V5.45336C7.68194 6.09035 7.42814 6.70075 6.97772 7.15118C6.5273 7.6016 5.91689 7.8554 5.2799 7.85712H3.64606C3.00903 7.85543 2.39858 7.60162 1.94813 7.15117C1.49768 6.70073 1.24387 6.09027 1.24219 5.45324V4.99398C1.97379 4.81749 3.36528 4.56144 4.37403 4.8591C5.41654 5.16671 6.82033 5.02421 7.68354 4.88464L7.68366 4.88476Z"
                                                    fill="#F0F4FD" />
                                                <path
                                                    d="M7.35999 1.88837H1.56528C1.31511 1.88756 1.07542 1.78783 0.89853 1.61093C0.721635 1.43404 0.6219 1.19435 0.621094 0.944183C0.621094 0.425861 1.04625 0 1.56528 0H7.35999C7.87831 0 8.30417 0.425158 8.30417 0.944183C8.30348 1.19439 8.20379 1.43414 8.02687 1.61106C7.84995 1.78798 7.61019 1.88768 7.35999 1.88837Z"
                                                    fill="#F0F4FD" />
                                                <path
                                                    d="M5.32755 9.34083H3.67192C3.63087 9.34083 3.59023 9.33275 3.55231 9.31704C3.51439 9.30133 3.47993 9.27831 3.45091 9.24929C3.42189 9.22027 3.39887 9.18581 3.38316 9.14789C3.36746 9.10997 3.35937 9.06933 3.35938 9.02829V7.54457C3.35937 7.50353 3.36746 7.46289 3.38316 7.42497C3.39887 7.38705 3.42189 7.35259 3.45091 7.32357C3.47993 7.29455 3.51439 7.27153 3.55231 7.25582C3.59023 7.24011 3.63087 7.23203 3.67192 7.23203H5.27997V7.23285C5.28606 7.23238 5.29216 7.23215 5.29825 7.23203V7.23285C5.30786 7.23203 5.31759 7.23145 5.32743 7.23145C5.36847 7.23144 5.40912 7.23953 5.44704 7.25523C5.48496 7.27094 5.51941 7.29396 5.54843 7.32298C5.57745 7.35201 5.60048 7.38646 5.61618 7.42438C5.63189 7.4623 5.63997 7.50294 5.63997 7.54399V9.02829C5.63997 9.06933 5.63189 9.10997 5.61618 9.14789C5.60048 9.18581 5.57745 9.22027 5.54843 9.24929C5.51941 9.27831 5.48496 9.30133 5.44704 9.31704C5.40912 9.33275 5.36847 9.34083 5.32743 9.34083H5.32755Z"
                                                    fill="#F0F4FD" />
                                                <path
                                                    d="M3.47867 14.6216H5.5188C5.55984 14.6216 5.60049 14.6297 5.63841 14.6454C5.67633 14.6611 5.71078 14.6841 5.7398 14.7131C5.76882 14.7421 5.79184 14.7766 5.80755 14.8145C5.82326 14.8524 5.83134 14.8931 5.83134 14.9341C5.83135 14.9581 5.82863 14.9819 5.82325 15.0053L5.51259 16.7999L5.51282 16.8007C5.50025 16.8733 5.46246 16.939 5.40612 16.9865C5.34977 17.0339 5.2785 17.0599 5.20485 17.0599H3.7925C3.71593 17.0599 3.64204 17.0317 3.58483 16.9808C3.52761 16.93 3.49105 16.8599 3.48207 16.7838L3.17106 14.9872L3.17059 14.9873C3.15647 14.9057 3.17536 14.8217 3.22312 14.754C3.27087 14.6863 3.34358 14.6403 3.42524 14.6262C3.44285 14.6231 3.46069 14.6216 3.47856 14.6216H3.47867Z"
                                                    fill="#F0F4FD" />
                                                <path
                                                    d="M4.18766 11.9934V12.1433C4.18766 12.2262 4.22059 12.3057 4.2792 12.3643C4.33781 12.4229 4.41731 12.4559 4.5002 12.4559C4.58309 12.4559 4.66259 12.4229 4.7212 12.3643C4.77981 12.3057 4.81274 12.2262 4.81274 12.1433V11.9934H5.08227C5.12332 11.9934 5.16396 11.9854 5.20188 11.9697C5.2398 11.954 5.27425 11.9309 5.30327 11.9019C5.3323 11.8729 5.35532 11.8384 5.37102 11.8005C5.38673 11.7626 5.39481 11.7219 5.39481 11.6809V10.543C5.39481 10.502 5.38673 10.4613 5.37102 10.4234C5.35532 10.3855 5.3323 10.351 5.30327 10.322C5.27425 10.293 5.2398 10.27 5.20188 10.2543C5.16396 10.2386 5.12332 10.2305 5.08227 10.2305H3.91801C3.87697 10.2305 3.83632 10.2386 3.7984 10.2543C3.76048 10.27 3.72603 10.293 3.69701 10.322C3.66799 10.351 3.64496 10.3855 3.62926 10.4234C3.61355 10.4613 3.60547 10.502 3.60547 10.543V11.6809C3.60547 11.7219 3.61355 11.7626 3.62926 11.8005C3.64496 11.8384 3.66799 11.8729 3.69701 11.9019C3.72603 11.9309 3.76048 11.954 3.7984 11.9697C3.83632 11.9854 3.87697 11.9934 3.91801 11.9934H4.18766Z"
                                                    fill="#F0F4FD" />
                                                <path fill-rule="evenodd" clip-rule="evenodd"
                                                    d="M8.98164 18.6802H0.0175781V19.6876C0.0175766 19.7287 0.0256594 19.7693 0.0413655 19.8072C0.0570716 19.8452 0.0800931 19.8796 0.109115 19.9086C0.138138 19.9377 0.172593 19.9607 0.210513 19.9764C0.248433 19.9921 0.289074 20.0002 0.330118 20.0002H8.6691C8.71014 20.0002 8.75078 19.9921 8.7887 19.9764C8.82662 19.9607 8.86108 19.9377 8.8901 19.9086C8.91912 19.8796 8.94214 19.8452 8.95785 19.8072C8.97355 19.7693 8.98164 19.7287 8.98164 19.6876V18.6802Z"
                                                    fill="#F0F4FD" />
                                            </svg>
                                            <div>
                                                <span>{selectedClient.numberOfLoans || 0}</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            }
                        </div>
                        {
                            (selectedClient._id) && <>
                                {
                                    !selectedClient.deactivated &&
                                    <button className="absolute left-1/2 bottom-0 -translate-x-1/2" title='Más opciones' onClick={() => setShowMiniModal(true)}>
                                        <i className="fa-solid fa-angles-up text-2xl"></i>
                                    </button>
                                }
                                <Link to={"/MonitoreoDistribuidores/Informacion"} className="absolute right-0 top-1/2 -translate-y-1/2" title='Información del cliente'>
                                    <i className="fa-solid fa-angles-right text-2xl"></i>
                                </Link>
                            </>
                        }
                    </div>
                </div>
            </div>

            <Modal
                isOpen={showCobroPopUp}
                onClose={() => setShowCobroPopUp(false)}
                className="p-6 w-2/12"
            >
                <CobroMiniModal client={selectedClient} onClose={() => setShowCobroPopUp(false)} />
            </Modal>

            <Modal
                isOpen={showPostponeModal}
                onClose={() => setShowPostponeModal(false)}
                className="!w-3/12"
            >
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30">
                    Posponer
                </h2>
                <PostponeModal onClose={() => setShowPostponeModal(false)} />
            </Modal>


            <Modal
                isOpen={selectedClient._id !== "" && showMiniModal ? true : false}
                onClose={() => { setShowMiniModal(false); }} className="w-3/12" >
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30">
                    Opciones Cliente
                </h2>
                <div className="p-6">
                    <OpcionesClientes onClose={() => { setShowMiniModal(false); }} />
                </div>
            </Modal>

            <Modal
                isOpen={showRegisterModal && !selectedClient._id}
                onClose={() => {
                    setShowRegisterModal(false);
                }}
                className="w-3/12"
            >
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Registrar Cliente
                </h2>
                <div className="p-6">
                    <RegistrarClientePedido onCancel={() => {
                        setShowRegisterModal(false);
                    }}
                        allClients={allClients}
                        isOpen={showRegisterModal && !selectedClient._id}
                        zones={zones}
                        selectedClient={selectedClient}
                        associatedOrder={selectedClient.associatedOrders![0]}
                    />
                </div>
            </Modal >
        </>
    );
}

export default MapClientDetails