import { FC } from "react";
import "./ReportesGraficos.css";
import { Link, useNavigate } from "react-router-dom";
import { PageTitle } from "../../../../components/PageTitle/PageTitle";

const ReportesGraficos: FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="px-10">
                <PageTitle titulo="Gráficos" icon="/Reportes-icon.svg" hasBack={true} onBack={() => navigate('/Reportes/Ingresos')} />
                <div className="ReportesGraficos-container">
                    <Link to={"/Reportes/Ingresos/Graficos/PrestamosVsVentas"}>
                        <div className="ReportesGraficos-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <path d="M35 44V7C35 6.20435 34.6839 5.44129 34.1213 4.87868C33.5587 4.31607 32.7956 4 32 4H8C7.20435 4 6.44129 4.31607 5.87868 4.87868C5.31607 5.44129 5 6.20435 5 7V41C5 41.7956 5.31607 42.5587 5.87868 43.1213C6.44129 43.6839 7.20435 44 8 44H35ZM35 44H40C40.7956 44 41.5587 43.6839 42.1213 43.1213C42.6839 42.5587 43 41.7956 43 41V24C43 23.4696 42.7893 22.9609 42.4142 22.5858C42.0391 22.2107 41.5304 22 41 22H37C36.4696 22 35.9609 22.2107 35.5858 22.5858C35.2107 22.9609 35 23.4696 35 24V44Z" stroke="white" stroke-width="4" stroke-linejoin="round" />
                                <path d="M11 12H19M11 19H23" stroke="white" strokeWidth="4" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <span>Préstamos Vs Ventas</span>
                        </div>
                    </Link>
                    <Link to={"/Reportes/Ingresos/Graficos/VentasPorProductos"}>
                        <div className="ReportesGraficos-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="41" height="59" viewBox="0 0 41 59" fill="none">
                                <path d="M4.28403 27.333V50.8176C4.28403 57.1619 36.716 57.1619 36.716 50.8176L36.7156 27.333C36.7156 27.333 32.9624 23.3574 26.9121 23.3574C20.8636 23.3574 17.4959 27.7172 11.5239 27.7172C5.55267 27.7168 4.2832 27.333 4.2832 27.333L4.28403 27.333Z" fill="#F0F4FD" />
                                <path d="M20.5004 59C11.5707 59 1.14318 57.4164 1.14318 52.9526V51.2468C0.444124 50.8212 0 50.0612 0 49.2349C0 48.4086 0.444136 47.6499 1.14318 47.2234V37.5061C0.444124 37.0805 0 36.3205 0 35.4934C0 34.6671 0.444136 33.9084 1.14318 33.4819V23.7645C0.444124 23.3381 0 22.579 0 21.7527C0 20.9241 0.447859 20.1621 1.15064 19.7376C1.39391 16.5806 7.84101 10.9251 15.4756 8.36276C15.463 8.2658 15.456 8.16793 15.456 8.06958C15.456 7.24747 15.8778 6.50719 16.561 6.07745V4.14461C16.0353 3.71356 15.7216 3.04172 15.7216 2.306C15.7216 1.03442 16.6681 0 17.8322 0H23.1692C24.3325 0 25.279 1.03442 25.279 2.306C25.279 3.04309 24.9649 3.71498 24.4397 4.14555V6.10274C25.0959 6.53746 25.5008 7.2695 25.5008 8.06911C25.5008 8.16285 25.4948 8.25567 25.4841 8.34851C33.1401 10.9053 39.6074 16.5701 39.8508 19.7385C40.5531 20.164 41 20.925 41 21.7531C41 22.5784 40.5563 23.3381 39.8582 23.7645V33.4827C40.5563 33.9083 41 34.6678 41 35.4932C41 36.3194 40.5563 37.0782 39.8582 37.5051V47.2233C40.5563 47.6488 41 48.4084 41 49.2338C41 50.0592 40.5563 50.8183 39.8582 51.2452V52.9515C39.8582 57.4163 29.4293 58.9999 20.4998 58.9999L20.5004 59ZM17.8324 1.32066C17.4129 1.32066 17.0578 1.77331 17.0578 2.30866C17.0578 2.70524 17.2494 3.06368 17.5467 3.22175L17.8967 3.40878V6.93071L17.4717 7.09476C17.0583 7.25422 16.7917 7.63747 16.7917 8.07219C16.7917 8.22062 16.8271 8.3695 16.8961 8.51472L17.22 9.19667L16.4916 9.42323C8.75539 11.8293 2.47805 17.4973 2.47805 19.9222V20.6147L2.03904 20.7728C1.61822 20.9245 1.33487 21.3197 1.33487 21.7558C1.33487 22.1923 1.61822 22.5884 2.03904 22.7405L2.47805 22.8986V34.3558L2.03904 34.5134C1.61822 34.6641 1.33487 35.0593 1.33487 35.4964C1.33487 35.9338 1.61729 36.3299 2.03904 36.4807L2.47805 36.6383V48.0968L2.03904 48.2544C1.61822 48.4051 1.33487 48.8003 1.33487 49.2373C1.33487 49.6739 1.61729 50.07 2.03904 50.2207L2.47805 50.3783V52.9541C2.47805 55.6065 10.3937 57.6841 20.499 57.6841C30.604 57.6841 38.52 55.607 38.52 52.9541V50.3788L38.9581 50.2207C39.3789 50.0691 39.6618 49.6739 39.6618 49.2373C39.6618 48.8012 39.3794 48.406 38.9581 48.2544L38.52 48.0963V36.6378L38.9581 36.4797C39.3789 36.3281 39.6618 35.9324 39.6618 35.4954C39.6618 35.0593 39.3794 34.6641 38.9581 34.5125L38.52 34.3544V22.8982L38.9581 22.7401C39.3789 22.5884 39.6618 22.1928 39.6618 21.7557C39.6618 21.3197 39.3794 20.9244 38.9581 20.7723L38.52 20.6143V19.9227C38.5196 17.4889 32.2243 11.8124 24.4695 9.41214L23.7467 9.18836L24.0627 8.50917C24.1293 8.36626 24.1629 8.21921 24.1629 8.07307C24.1629 7.64892 23.9061 7.2675 23.5095 7.10208L23.1021 6.93205V3.40694L23.4545 3.22037C23.7499 3.06368 23.9415 2.70569 23.9415 2.30774C23.9415 1.77192 23.5873 1.31974 23.1678 1.31974H17.8317L17.8324 1.32066Z" fill="#F0F4FD" />
                            </svg>
                            <span>Ventas por producto</span>
                        </div>
                    </Link>
                    <Link to={"/Reportes/Ingresos/Graficos/VentasPorDistribuidor"}>
                        <div className="ReportesGraficos-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="63" height="50" viewBox="0 0 63 50" fill="none">
                                <g clipPath="url(#clip0_43_4174)">
                                    <path d="M4.6875 0C2.09961 0 0 2.09961 0 4.6875V35.9375C0 38.5254 2.09961 40.625 4.6875 40.625H6.25C6.25 45.8008 10.4492 50 15.625 50C20.8008 50 25 45.8008 25 40.625H37.5C37.5 45.8008 41.6992 50 46.875 50C52.0508 50 56.25 45.8008 56.25 40.625H59.375C61.1035 40.625 62.5 39.2285 62.5 37.5C62.5 35.7715 61.1035 34.375 59.375 34.375V28.125V25V23.1738C59.375 21.5137 58.7207 19.9219 57.5488 18.75L50 11.2012C48.8281 10.0293 47.2363 9.375 45.5762 9.375H40.625V4.6875C40.625 2.09961 38.5254 0 35.9375 0H4.6875ZM40.625 15.625H45.5762L53.125 23.1738V25H40.625V15.625ZM10.9375 40.625C10.9375 39.3818 11.4314 38.1895 12.3104 37.3104C13.1895 36.4314 14.3818 35.9375 15.625 35.9375C16.8682 35.9375 18.0605 36.4314 18.9396 37.3104C19.8186 38.1895 20.3125 39.3818 20.3125 40.625C20.3125 41.8682 19.8186 43.0605 18.9396 43.9396C18.0605 44.8186 16.8682 45.3125 15.625 45.3125C14.3818 45.3125 13.1895 44.8186 12.3104 43.9396C11.4314 43.0605 10.9375 41.8682 10.9375 40.625ZM46.875 35.9375C48.1182 35.9375 49.3105 36.4314 50.1896 37.3104C51.0686 38.1895 51.5625 39.3818 51.5625 40.625C51.5625 41.8682 51.0686 43.0605 50.1896 43.9396C49.3105 44.8186 48.1182 45.3125 46.875 45.3125C45.6318 45.3125 44.4395 44.8186 43.5604 43.9396C42.6814 43.0605 42.1875 41.8682 42.1875 40.625C42.1875 39.3818 42.6814 38.1895 43.5604 37.3104C44.4395 36.4314 45.6318 35.9375 46.875 35.9375Z" fill="#F0F4FD" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_43_4174">
                                        <rect width="62.5" height="50" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <span>Ventas por distribuidor</span>
                        </div>
                    </Link>
                    <Link to={"/Reportes/Ingresos/Graficos/CuentasPorCobrar"}>
                        <div className="ReportesGraficos-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="52" viewBox="0 0 44 52" fill="none"                            >
                                <path d="M1.78116 0.84155C2.73332 0.454715 3.85351 0.593579 4.64885 1.19863L9.17442 4.63056L13.7 1.19863C14.7082 0.434877 16.198 0.434877 17.195 1.19863L21.7206 4.63056L26.2461 1.19863C27.2543 0.434877 28.7329 0.434877 29.7411 1.19863L34.2667 4.63056L38.7923 1.19863C39.5876 0.593579 40.7078 0.454715 41.6599 0.84155C42.6121 1.22839 43.2282 2.07149 43.2282 3.00386V49.0274C43.2282 49.9598 42.6121 50.8029 41.6599 51.1897C40.7078 51.5765 39.5876 51.4377 38.7923 50.8326L34.2667 47.4007L29.7411 50.8326C28.7329 51.5964 27.2543 51.5964 26.2461 50.8326L21.7206 47.4007L17.195 50.8326C16.1868 51.5964 14.697 51.5964 13.7 50.8326L9.17442 47.4007L4.64885 50.8326C3.85351 51.4377 2.73332 51.5765 1.78116 51.1897C0.828996 50.8029 0.212891 49.9598 0.212891 49.0274V3.00386C0.212891 2.07149 0.828996 1.22839 1.78116 0.84155ZM10.9667 14.9065C9.98095 14.9065 9.17442 15.6207 9.17442 16.4935C9.17442 17.3664 9.98095 18.0805 10.9667 18.0805H32.4744C33.4602 18.0805 34.2667 17.3664 34.2667 16.4935C34.2667 15.6207 33.4602 14.9065 32.4744 14.9065H10.9667ZM9.17442 35.5377C9.17442 36.4106 9.98095 37.1248 10.9667 37.1248H32.4744C33.4602 37.1248 34.2667 36.4106 34.2667 35.5377C34.2667 34.6649 33.4602 33.9507 32.4744 33.9507H10.9667C9.98095 33.9507 9.17442 34.6649 9.17442 35.5377ZM10.9667 24.4286C9.98095 24.4286 9.17442 25.1428 9.17442 26.0156C9.17442 26.8885 9.98095 27.6026 10.9667 27.6026H32.4744C33.4602 27.6026 34.2667 26.8885 34.2667 26.0156C34.2667 25.1428 33.4602 24.4286 32.4744 24.4286H10.9667Z" fill="#ffffff" />
                            </svg>
                            <span>Cuentas por cobrar</span>
                        </div>
                    </Link>
                    <Link to={"/Reportes/Ingresos/Graficos/Clientes"}>
                        <div className="ReportesGraficos-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="82" height="52" viewBox="0 0 82 52" fill="none"                            >
                                <path d="M27.0638 7.89509C27.0638 5.97109 26.2006 4.12588 24.6641 2.76541C23.1277 1.40493 21.0438 0.640625 18.8709 0.640625C16.698 0.640625 14.6142 1.40493 13.0777 2.76541C11.5412 4.12588 10.6781 5.97109 10.6781 7.89509C10.6781 9.81909 11.5412 11.6643 13.0777 13.0248C14.6142 14.3852 16.698 15.1496 18.8709 15.1496C21.0438 15.1496 23.1277 14.3852 24.6641 13.0248C26.2006 11.6643 27.0638 9.81909 27.0638 7.89509ZM4.12377 26.0312C4.12377 28.0376 5.95436 29.6585 8.2202 29.6585H19.1782C20.4711 25.1925 24.1195 21.5539 28.8816 19.8423C27.6398 19.1622 26.1677 18.7768 24.6059 18.7768H12.3166C7.79776 18.7768 4.12377 22.03 4.12377 26.0312ZM63.2148 29.6585H73.7631C76.0289 29.6585 77.8595 28.0376 77.8595 26.0312C77.8595 22.03 74.1855 18.7768 69.6666 18.7768H57.3773C55.8796 18.7768 54.4714 19.1282 53.2681 19.7516C58.1454 21.4292 61.8962 25.1131 63.2148 29.6585ZM50.1062 22.6761C49.2229 22.4947 48.2884 22.404 47.3411 22.404H35.0518C33.9637 22.404 32.914 22.5287 31.9155 22.7554C27.9727 23.6735 24.7979 26.2806 23.4538 29.6585C23.0057 30.792 22.7497 32.0162 22.7497 33.2857C22.7497 35.292 24.5803 36.9129 26.8462 36.9129H55.5212C57.787 36.9129 59.6176 35.292 59.6176 33.2857C59.6176 32.0162 59.3744 30.792 58.9135 29.6585C57.531 26.1786 54.2026 23.5149 50.0934 22.6761H50.1062ZM72.1245 7.89509C72.1245 5.97109 71.2613 4.12588 69.7249 2.76541C68.1884 1.40493 66.1045 0.640625 63.9316 0.640625C61.7588 0.640625 59.6749 1.40493 58.1384 2.76541C56.6019 4.12588 55.7388 5.97109 55.7388 7.89509C55.7388 9.81909 56.6019 11.6643 58.1384 13.0248C59.6749 14.3852 61.7588 15.1496 63.9316 15.1496C66.1045 15.1496 68.1884 14.3852 69.7249 13.0248C71.2613 11.6643 72.1245 9.81909 72.1245 7.89509ZM41.1965 18.7768C43.9126 18.7768 46.5174 17.8214 48.438 16.1208C50.3586 14.4202 51.4375 12.1137 51.4375 9.7087C51.4375 7.3037 50.3586 4.9972 48.438 3.2966C46.5174 1.59601 43.9126 0.640625 41.1965 0.640625C38.4804 0.640625 35.8755 1.59601 33.9549 3.2966C32.0344 4.9972 30.9554 7.3037 30.9554 9.7087C30.9554 12.1137 32.0344 14.4202 33.9549 16.1208C35.8755 17.8214 38.4804 18.7768 41.1965 18.7768ZM4.12377 44.1674C1.85794 44.1674 0.0273438 45.7883 0.0273438 47.7946C0.0273438 49.801 1.85794 51.4219 4.12377 51.4219H77.8595C80.1253 51.4219 81.9559 49.801 81.9559 47.7946C81.9559 45.7883 80.1253 44.1674 77.8595 44.1674H4.12377Z" fill="#ffffff" />
                            </svg>
                            <span>Clientes</span>
                        </div>
                    </Link>
                    <Link to={"/Reportes/Ingresos/Graficos/Prestamos"}>
                        <div className="ReportesGraficos-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="58" height="50" viewBox="0 0 58 50" fill="none"                            >
                                <path d="M26.1259 7.38636C26.7472 7.38636 27.2604 7.225 27.6657 6.90227C28.071 6.57955 28.2746 6.17273 28.2765 5.68182C28.2765 5.18939 28.0729 4.78258 27.6657 4.46136C27.2585 4.14015 26.7452 3.97879 26.1259 3.97727C25.5046 3.97727 24.9913 4.13864 24.586 4.46136C24.1807 4.78409 23.9771 5.19091 23.9752 5.68182C23.9752 6.17424 24.1788 6.58106 24.586 6.90227C24.9932 7.22348 25.5065 7.38485 26.1259 7.38636ZM43.3309 50C39.3642 50 35.9824 48.8917 33.1856 46.675C30.3889 44.4583 28.9914 41.7788 28.9934 38.6364C28.9934 35.4924 30.3917 32.8121 33.1885 30.5955C35.9853 28.3788 39.3661 27.2712 43.3309 27.2727C47.2976 27.2727 50.6793 28.3811 53.4761 30.5977C56.2728 32.8144 57.6703 35.4939 57.6684 38.6364C57.6684 41.7803 56.27 44.4606 53.4732 46.6773C50.6764 48.8939 47.2957 50.0015 43.3309 50ZM41.8971 45.4545H44.7646V39.7727H51.9334V37.5H44.7646V31.8182H41.8971V37.5H34.7284V39.7727H41.8971V45.4545ZM11.7884 18.1818H40.4634V13.6364H11.7884V18.1818ZM25.1939 45.4545H6.05336C4.47624 45.4545 3.12565 45.0091 2.00159 44.1182C0.877526 43.2273 0.316453 42.1576 0.318364 40.9091V9.09091C0.318364 7.84091 0.880394 6.77045 2.00445 5.87955C3.12851 4.98864 4.47815 4.54394 6.05336 4.54545H18.0969C18.7182 3.18182 19.7581 2.08333 21.2167 1.25C22.6753 0.416667 24.3117 0 26.1259 0C27.9419 0 29.5793 0.416667 31.0379 1.25C32.4965 2.08333 33.5355 3.18182 34.1549 4.54545H46.1984C47.7755 4.54545 49.1261 4.99091 50.2501 5.88182C51.3742 6.77273 51.9353 7.84242 51.9334 9.09091V24.3182C50.5474 23.7879 49.149 23.3902 47.7382 23.125C46.3274 22.8598 44.8583 22.7273 43.3309 22.7273C42.8051 22.7273 42.3148 22.7364 41.8598 22.7545C41.4049 22.7727 40.9394 22.8205 40.4634 22.8977V22.7273H11.7884V27.2727H29.3518C28.4915 27.9167 27.7145 28.6174 27.0205 29.375C26.3266 30.1326 25.7177 30.947 25.1939 31.8182H11.7884V36.3636H23.4734C23.3778 36.7424 23.3176 37.1121 23.2928 37.4727C23.2679 37.8333 23.2565 38.2212 23.2584 38.6364C23.2584 39.8864 23.4017 41.0515 23.6885 42.1318C23.9752 43.2121 24.477 44.3197 25.1939 45.4545Z" fill="#ffffff" />
                            </svg>
                            <span>Préstamos</span>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    )
}

export { ReportesGraficos }