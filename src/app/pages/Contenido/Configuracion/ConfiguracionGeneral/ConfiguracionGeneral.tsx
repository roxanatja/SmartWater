import { FC, useState } from "react";
import "./ConfiguracionGeneral.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";

const ConfiguracionGeneral: FC = () => {

    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [isChecked2, setIsChecked2] = useState<boolean>(false);

    const toggleSwitch = () => {
        setIsChecked(!isChecked);
        if (isChecked2) {
            setIsChecked2(false)
        }
    };

    const toggleSwitch2 = () => {
        setIsChecked2(!isChecked2);
        if (isChecked) {
            setIsChecked(false)
        }
    };

    return(
        <>
        <div>
            <PageTitle titulo="Configuración general" icon="../../../Configuracion-icon.svg"/>
            <div className="ConfiguracionGeneral-container">
                <div className="ConfiguracionGeneral-item">
                    <div className="ConfiguracionGeneral-itemLetras">
                        <svg xmlns="http://www.w3.org/2000/svg" width="29" height="24" viewBox="0 0 29 24" fill="none">
                            <path d="M9.1967 1.99875C7.11258 3.14875 5.70375 5.17875 5.70375 7.49875C5.70375 9.81875 7.11258 11.8488 9.23163 12.9987C5.65718 12.9987 2.79297 10.5387 2.79297 7.49875C2.79297 6.04006 3.46765 4.64111 4.66858 3.60966C5.86951 2.57821 7.49832 1.99875 9.1967 1.99875ZM22.6678 3.49875L24.3328 4.92875L6.20441 20.4988L4.53944 19.0688L22.6678 3.49875ZM15.4724 5.92875L13.7492 4.99875L12.0726 5.99875L12.5616 4.29875L10.9432 3.23875L12.9807 3.11875L13.656 1.46875L14.4361 3.09875L16.4504 3.12875L14.8786 4.25875L15.4724 5.92875ZM11.6301 9.53875L10.2795 8.80875L8.97548 9.58875L9.37135 8.26875L8.10224 7.43875L9.68571 7.34875L10.2097 6.05875L10.8035 7.32875L12.3869 7.35875L11.1644 8.22875L11.6301 9.53875ZM22.5863 13.4987C22.5863 14.9574 21.9116 16.3564 20.7107 17.3878C19.5098 18.4193 17.881 18.9988 16.1826 18.9988C14.7621 18.9988 13.4464 18.5988 12.3869 17.9288L21.3405 10.2387C22.1206 11.1487 22.5863 12.2787 22.5863 13.4987ZM17.4633 20.0788L20.6885 18.9288L20.409 22.2788L17.4633 20.0788ZM22.5048 17.3787L23.8438 14.6087L26.4053 17.1487L22.5048 17.3787ZM23.8438 12.4187L22.5165 9.63875L26.4053 9.87875L23.8438 12.4187ZM11.6767 18.9288L14.9018 20.0788L11.9561 22.2688L11.6767 18.9288Z" fill="black"/>
                        </svg>
                        <span>automatico</span>
                    </div>
                    <div>

                    </div>
                </div>
                <div className="ConfiguracionGeneral-item">
                    <div className="ConfiguracionGeneral-itemLetras">
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="22" viewBox="0 0 26 22" fill="none">
                            <path d="M12.8524 6C9.63887 6 7.03081 8.24 7.03081 11C7.03081 13.76 9.63887 16 12.8524 16C16.0659 16 18.674 13.76 18.674 11C18.674 8.24 16.0659 6 12.8524 6ZM11.6881 0V4H14.0167V0H11.6881ZM11.6881 18V22H14.0167V18H11.6881ZM25.6598 10H21.0026V12H25.6598V10ZM4.70218 10H0.0449219V12H4.70218V10ZM17.7891 16.66L20.6649 19.13L22.3066 17.72L19.4308 15.25L17.7891 16.66ZM3.3865 4.28L6.26236 6.75L7.90404 5.34L5.02819 2.87L3.3865 4.28ZM6.26236 15.24L3.3865 17.71L5.02819 19.12L7.90404 16.65L6.26236 15.24ZM20.6766 2.87L17.8007 5.34L19.4424 6.75L22.3183 4.28L20.6766 2.87Z" fill="black"/>
                        </svg>
                        <span>Luz</span>
                    </div>
                    <div>
                        <label className="ConfiguracionGeneral-switch-container">
                            <input className="inputSwitch" type="checkbox" checked={isChecked} onChange={toggleSwitch} />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
                <div className="ConfiguracionGeneral-item">
                    <div className="ConfiguracionGeneral-itemLetras">
                        <svg xmlns="http://www.w3.org/2000/svg" width="29" height="24" viewBox="0 0 29 24" fill="none">
                            <path d="M14.598 21C11.6872 21 9.21302 20.125 7.17547 18.375C5.13792 16.625 4.11914 14.5 4.11914 12C4.11914 9.5 5.13792 7.375 7.17547 5.625C9.21302 3.875 11.6872 3 14.598 3C14.8696 3 15.1367 3.00833 15.399 3.025C15.6614 3.04167 15.9183 3.06667 16.1698 3.1C15.3742 3.58333 14.7385 4.21267 14.2626 4.988C13.7868 5.76333 13.5493 6.60067 13.5501 7.5C13.5501 9 14.1614 10.275 15.3839 11.325C16.6064 12.375 18.0909 12.9 19.8374 12.9C20.9047 12.9 21.8846 12.6957 22.7773 12.287C23.6699 11.8783 24.3976 11.3327 24.9604 10.65C24.9992 10.8667 25.0283 11.0873 25.0477 11.312C25.0671 11.5367 25.0768 11.766 25.0768 12C25.0768 14.5 24.058 16.625 22.0205 18.375C19.9829 20.125 17.5088 21 14.598 21Z" fill="black"/>
                        </svg>
                        <span>Dark mode</span>
                    </div>
                    <div>
                        <label className="ConfiguracionGeneral-switch-container">
                            <input className="inputSwitch" type="checkbox" checked={isChecked2} onChange={toggleSwitch2} />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export{ConfiguracionGeneral}