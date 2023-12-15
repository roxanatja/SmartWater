import { FiltroPaginado } from "../../components/FiltroPaginado/FiltroPaginado";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import "./MonitoreoDistribuidores.css";
import { FC } from "react";

const MonitoreoDistribuidores: FC = () => {

    return (
        <>
            <div>
                <PageTitle titulo="Monitoreo de Distribuidores" icon="./envio-cronometrado 1.png"/>
                <FiltroPaginado add={false} exportar={false} paginacion={false}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <div style={{display: "flex", gap: "35px", marginBottom: "37px"}}>
                            <div className="Mapaclientes-ubicacion">
                                <svg xmlns="http://www.w3.org/2000/svg" width="39" height="38" viewBox="0 0 39 38" fill="none">
                                    <path d="M17.2319 2.09792C24 19.5978 7.23193 22.5979 0.231928 16.0979C-0.968072 23.698 2.7324 29.0979 5.73193 29.0979H23.7319C26.5 7.59778 21 1.09766 17.2319 2.09792Z" fill="#005B96"/>
                                    <path d="M27 17.5976V8.59756C37.4 7.79756 38.6667 14.5976 38 18.0976L27 17.5976Z" fill="#005B96"/>
                                    <path d="M27 21.068V29.5366C37.2632 30.2893 38.6579 24.891 38 21.5977L27 21.068Z" fill="#005B96"/>
                                    <path d="M32 32.0977H24C24 33.931 24.9 37.4977 28.5 37.0977C32.1 36.6977 32.3333 33.5977 32 32.0977Z" fill="#005B96"/>
                                    <path d="M14 32.5977H6C6 34.431 6.9 37.9977 10.5 37.5977C14.1 37.1977 14.3333 34.0977 14 32.5977Z" fill="#005B96"/>
                                    <path d="M12.5 1.11658C13.7569 1.84229 14.8025 2.88368 15.5332 4.13766C16.2639 5.39164 16.6545 6.81472 16.6662 8.26603C16.6779 9.71733 16.3104 11.1465 15.6 12.4122C14.8896 13.6778 13.861 14.7359 12.616 15.4818C11.371 16.2278 9.95281 16.6356 8.50175 16.665C7.05069 16.6943 5.61713 16.3442 4.34296 15.6493C3.0688 14.9543 1.99823 13.9387 1.23722 12.7028C0.476219 11.467 0.0511744 10.0538 0.00416676 8.60324L0 8.33324L0.00416676 8.06324C0.050836 6.62407 0.469623 5.22154 1.2197 3.9924C1.96978 2.76326 3.02554 1.74945 4.28408 1.04981C5.54261 0.350171 6.96096 -0.0114257 8.40084 0.000275205C9.84072 0.0119761 11.253 0.396575 12.5 1.11658ZM8.33333 3.33324C8.12922 3.33327 7.93222 3.40821 7.77969 3.54384C7.62716 3.67947 7.52971 3.86637 7.50583 4.06908L7.5 4.16658V8.33324L7.5075 8.44241C7.5265 8.58699 7.58311 8.72406 7.67167 8.83991L7.74417 8.92324L10.2442 11.4232L10.3225 11.4916C10.4686 11.605 10.6484 11.6665 10.8333 11.6665C11.0183 11.6665 11.198 11.605 11.3442 11.4916L11.4225 11.4224L11.4917 11.3441C11.6051 11.1979 11.6666 11.0182 11.6666 10.8332C11.6666 10.6483 11.6051 10.4686 11.4917 10.3224L11.4225 10.2441L9.16667 7.98741V4.16658L9.16083 4.06908C9.13695 3.86637 9.03951 3.67947 8.88698 3.54384C8.73445 3.40821 8.53745 3.33327 8.33333 3.33324Z" fill="#005B96"/>
                                </svg>
                                <span>
                                    Distribuidor 1
                                </span>
                            </div>
                            <div className="Mapaclientes-ubicacion">
                                <svg xmlns="http://www.w3.org/2000/svg" width="39" height="38" viewBox="0 0 39 38" fill="none">
                                    <path d="M17.3784 2.09792C24.1465 19.5978 7.37841 22.5979 0.378413 16.0979C-0.821587 23.698 2.87888 29.0979 5.87841 29.0979H23.8784C26.6465 7.59778 21.1465 1.09766 17.3784 2.09792Z" fill="#FBBC04"/>
                                    <path d="M27.1465 17.5976V8.59756C37.5465 7.79756 38.8132 14.5976 38.1465 18.0976L27.1465 17.5976Z" fill="#FBBC04"/>
                                    <path d="M27.1465 21.068V29.5366C37.4097 30.2893 38.8044 24.891 38.1465 21.5977L27.1465 21.068Z" fill="#FBBC04"/>
                                    <path d="M32.1465 32.0977H24.1465C24.1465 33.931 25.0465 37.4977 28.6465 37.0977C32.2465 36.6977 32.4798 33.5977 32.1465 32.0977Z" fill="#FBBC04"/>
                                    <path d="M14.1465 32.5977H6.14648C6.14648 34.431 7.04648 37.9977 10.6465 37.5977C14.2465 37.1977 14.4798 34.0977 14.1465 32.5977Z" fill="#FBBC04"/>
                                    <path d="M12.6465 1.11658C13.9034 1.84229 14.9489 2.88368 15.6797 4.13766C16.4104 5.39164 16.801 6.81472 16.8127 8.26603C16.8244 9.71733 16.4569 11.1465 15.7465 12.4122C15.0361 13.6778 14.0075 14.7359 12.7625 15.4818C11.5175 16.2278 10.0993 16.6356 8.64823 16.665C7.19718 16.6943 5.76361 16.3442 4.48945 15.6493C3.21528 14.9543 2.14471 13.9387 1.38371 12.7028C0.622703 11.467 0.197659 10.0538 0.150651 8.60324L0.146484 8.33324L0.150651 8.06324C0.19732 6.62407 0.616107 5.22154 1.36618 3.9924C2.11626 2.76326 3.17203 1.74945 4.43056 1.04981C5.68909 0.350171 7.10744 -0.0114257 8.54732 0.000275205C9.98721 0.0119761 11.3995 0.396575 12.6465 1.11658ZM8.47982 3.33324C8.27571 3.33327 8.0787 3.40821 7.92617 3.54384C7.77364 3.67947 7.6762 3.86637 7.65232 4.06908L7.64648 4.16658V8.33324L7.65398 8.44241C7.67299 8.58699 7.72959 8.72406 7.81815 8.83991L7.89065 8.92324L10.3907 11.4232L10.469 11.4916C10.6151 11.605 10.7948 11.6665 10.9798 11.6665C11.1648 11.6665 11.3445 11.605 11.4907 11.4916L11.569 11.4224L11.6382 11.3441C11.7515 11.1979 11.8131 11.0182 11.8131 10.8332C11.8131 10.6483 11.7515 10.4686 11.6382 10.3224L11.569 10.2441L9.31315 7.98741V4.16658L9.30732 4.06908C9.28344 3.86637 9.18599 3.67947 9.03346 3.54384C8.88093 3.40821 8.68393 3.33327 8.47982 3.33324Z" fill="#FBBC04"/>
                                </svg>
                                <span>
                                    Distribuidor 2
                                </span>
                            </div>
                            <div className="Mapaclientes-ubicacion">
                                <svg xmlns="http://www.w3.org/2000/svg" width="39" height="38" viewBox="0 0 39 38" fill="none">
                                    <path d="M17.3784 2.09792C24.1465 19.5978 7.37841 22.5979 0.378413 16.0979C-0.821587 23.698 2.87888 29.0979 5.87841 29.0979H23.8784C26.6465 7.59778 21.1465 1.09766 17.3784 2.09792Z" fill="#AEAEAE"/>
                                    <path d="M27.1465 17.5976V8.59756C37.5465 7.79756 38.8132 14.5976 38.1465 18.0976L27.1465 17.5976Z" fill="#AEAEAE"/>
                                    <path d="M27.1465 21.068V29.5366C37.4097 30.2893 38.8044 24.891 38.1465 21.5977L27.1465 21.068Z" fill="#AEAEAE"/>
                                    <path d="M32.1465 32.0977H24.1465C24.1465 33.931 25.0465 37.4977 28.6465 37.0977C32.2465 36.6977 32.4798 33.5977 32.1465 32.0977Z" fill="#AEAEAE"/>
                                    <path d="M14.1465 32.5977H6.14648C6.14648 34.431 7.04648 37.9977 10.6465 37.5977C14.2465 37.1977 14.4798 34.0977 14.1465 32.5977Z" fill="#AEAEAE"/>
                                    <path d="M12.6465 1.11658C13.9034 1.84229 14.9489 2.88368 15.6797 4.13766C16.4104 5.39164 16.801 6.81472 16.8127 8.26603C16.8244 9.71733 16.4569 11.1465 15.7465 12.4122C15.0361 13.6778 14.0075 14.7359 12.7625 15.4818C11.5175 16.2278 10.0993 16.6356 8.64823 16.665C7.19718 16.6943 5.76361 16.3442 4.48945 15.6493C3.21528 14.9543 2.14471 13.9387 1.38371 12.7028C0.622703 11.467 0.197659 10.0538 0.150651 8.60324L0.146484 8.33324L0.150651 8.06324C0.19732 6.62407 0.616107 5.22154 1.36618 3.9924C2.11626 2.76326 3.17203 1.74945 4.43056 1.04981C5.68909 0.350171 7.10744 -0.0114257 8.54732 0.000275205C9.98721 0.0119761 11.3995 0.396575 12.6465 1.11658ZM8.47982 3.33324C8.27571 3.33327 8.0787 3.40821 7.92617 3.54384C7.77364 3.67947 7.6762 3.86637 7.65232 4.06908L7.64648 4.16658V8.33324L7.65398 8.44241C7.67299 8.58699 7.72959 8.72406 7.81815 8.83991L7.89065 8.92324L10.3907 11.4232L10.469 11.4916C10.6151 11.605 10.7948 11.6665 10.9798 11.6665C11.1648 11.6665 11.3445 11.605 11.4907 11.4916L11.569 11.4224L11.6382 11.3441C11.7515 11.1979 11.8131 11.0182 11.8131 10.8332C11.8131 10.6483 11.7515 10.4686 11.6382 10.3224L11.569 10.2441L9.31315 7.98741V4.16658L9.30732 4.06908C9.28344 3.86637 9.18599 3.67947 9.03346 3.54384C8.88093 3.40821 8.68393 3.33327 8.47982 3.33324Z" fill="#AEAEAE"/>
                                </svg>
                                <span>
                                    Distribuidor 3
                                </span>
                            </div>
                            <div className="Mapaclientes-ubicacion">
                                <svg xmlns="http://www.w3.org/2000/svg" width="39" height="38" viewBox="0 0 39 38" fill="none">
                                    <path d="M17.6714 2.09792C24.4395 19.5978 7.67138 22.5979 0.671382 16.0979C-0.528618 23.698 3.17185 29.0979 6.17138 29.0979H24.1714C26.9395 7.59778 21.4395 1.09766 17.6714 2.09792Z" fill="#00AFEF"/>
                                    <path d="M27.4395 17.5976V8.59756C37.8395 7.79756 39.1061 14.5976 38.4395 18.0976L27.4395 17.5976Z" fill="#00AFEF"/>
                                    <path d="M27.4395 21.068V29.5366C37.7026 30.2893 39.0974 24.891 38.4395 21.5977L27.4395 21.068Z" fill="#00AFEF"/>
                                    <path d="M32.4395 32.0977H24.4395C24.4395 33.931 25.3395 37.4977 28.9395 37.0977C32.5395 36.6977 32.7728 33.5977 32.4395 32.0977Z" fill="#00AFEF"/>
                                    <path d="M14.4395 32.5977H6.43945C6.43945 34.431 7.33945 37.9977 10.9395 37.5977C14.5395 37.1977 14.7728 34.0977 14.4395 32.5977Z" fill="#00AFEF"/>
                                    <path d="M12.9395 1.11658C14.1963 1.84229 15.2419 2.88368 15.9726 4.13766C16.7034 5.39164 17.0939 6.81472 17.1056 8.26603C17.1174 9.71733 16.7498 11.1465 16.0395 12.4122C15.3291 13.6778 14.3005 14.7359 13.0555 15.4818C11.8105 16.2278 10.3923 16.6356 8.9412 16.665C7.49015 16.6943 6.05658 16.3442 4.78242 15.6493C3.50825 14.9543 2.43768 13.9387 1.67668 12.7028C0.915672 11.467 0.490628 10.0538 0.44362 8.60324L0.439453 8.33324L0.44362 8.06324C0.490289 6.62407 0.909076 5.22154 1.65915 3.9924C2.40923 2.76326 3.465 1.74945 4.72353 1.04981C5.98206 0.350171 7.40041 -0.0114257 8.84029 0.000275205C10.2802 0.0119761 11.6925 0.396575 12.9395 1.11658ZM8.77279 3.33324C8.56868 3.33327 8.37167 3.40821 8.21914 3.54384C8.06661 3.67947 7.96917 3.86637 7.94529 4.06908L7.93945 4.16658V8.33324L7.94695 8.44241C7.96595 8.58699 8.02256 8.72406 8.11112 8.83991L8.18362 8.92324L10.6836 11.4232L10.762 11.4916C10.9081 11.605 11.0878 11.6665 11.2728 11.6665C11.4578 11.6665 11.6375 11.605 11.7836 11.4916L11.862 11.4224L11.9311 11.3441C12.0445 11.1979 12.1061 11.0182 12.1061 10.8332C12.1061 10.6483 12.0445 10.4686 11.9311 10.3224L11.862 10.2441L9.60612 7.98741V4.16658L9.60029 4.06908C9.57641 3.86637 9.47896 3.67947 9.32643 3.54384C9.1739 3.40821 8.9769 3.33327 8.77279 3.33324Z" fill="#00AFEF"/>
                                </svg>
                                <span>
                                    Distribuidor 4
                                </span>
                            </div>
                        </div>
                        <div>

                        </div>
                    </div>
                </FiltroPaginado>
            </div>
        </>
    )
}

export { MonitoreoDistribuidores }