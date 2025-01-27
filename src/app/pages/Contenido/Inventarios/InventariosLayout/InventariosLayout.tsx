import { ReactNode } from "react";
import "./InventariosLayout.css"
import { useNavigate } from "react-router-dom";

type Props = {
    add?: boolean;
    children?: ReactNode;
    swith?: boolean;
    switchDetails?: {
        text: string;
        url: string;
        isSelected: boolean;
    }[];
    onAdd?: () => void;
    onFilter?: () => void;
    filtro?: boolean;
    activeFilters?: any;
    hasFilter?: boolean;
    filterInject?: ReactNode;
};

const InventariosLayout = ({
    switchDetails, activeFilters, add, children, filterInject, filtro, hasFilter, onAdd,
    onFilter, swith
}: Props) => {
    const navigate = useNavigate()

    return (
        <>
            <div className="flex justify-between flex-col pt-10 w-full h-full">
                <div className="flex flex-col gap-10">

                    <div className="w-full flex justify-between items-center gap-4 flex-wrap">
                        {
                            (swith && switchDetails && switchDetails?.length > 1) ?
                                <div className="w-full sm:w-1/2">
                                    <div className="switch-contenido">
                                        {
                                            switchDetails.map(d =>
                                                <div key={d.url}
                                                    className={`switch-option ${d.isSelected && "selected"}`}
                                                    onClick={() => navigate(d.url)}
                                                >
                                                    {d.text}
                                                </div>
                                            )
                                        }
                                    </div>
                                </div> :
                                <div></div>
                        }

                        {filtro && (
                            <div className="relative" >
                                {!!filterInject && filterInject}
                                <button
                                    type="button"
                                    className="boton-filtro relative"
                                    onClick={onFilter}
                                >
                                    {
                                        hasFilter &&
                                        <div className="bg-red-500 rounded-full p-[5px] absolute -top-1 -right-1" />
                                    }
                                    <span style={{ marginRight: "5px" }}>Filtrar</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <g clipPath="url(#clip0_35_4995)">
                                            <path
                                                d="M0 19.5C0 18.6703 0.670312 18 1.5 18H4.06406C4.64062 16.6734 5.9625 15.75 7.5 15.75C9.0375 15.75 10.3594 16.6734 10.9359 18H22.5C23.3297 18 24 18.6703 24 19.5C24 20.3297 23.3297 21 22.5 21H10.9359C10.3594 22.3266 9.0375 23.25 7.5 23.25C5.9625 23.25 4.64062 22.3266 4.06406 21H1.5C0.670312 21 0 20.3297 0 19.5ZM9 19.5C9 18.6703 8.32969 18 7.5 18C6.67031 18 6 18.6703 6 19.5C6 20.3297 6.67031 21 7.5 21C8.32969 21 9 20.3297 9 19.5ZM18 12C18 11.1703 17.3297 10.5 16.5 10.5C15.6703 10.5 15 11.1703 15 12C15 12.8297 15.6703 13.5 16.5 13.5C17.3297 13.5 18 12.8297 18 12ZM16.5 8.25C18.0375 8.25 19.3594 9.17344 19.9359 10.5H22.5C23.3297 10.5 24 11.1703 24 12C24 12.8297 23.3297 13.5 22.5 13.5H19.9359C19.3594 14.8266 18.0375 15.75 16.5 15.75C14.9625 15.75 13.6406 14.8266 13.0641 13.5H1.5C0.670312 13.5 0 12.8297 0 12C0 11.1703 0.670312 10.5 1.5 10.5H13.0641C13.6406 9.17344 14.9625 8.25 16.5 8.25ZM9 3C8.17031 3 7.5 3.67031 7.5 4.5C7.5 5.32969 8.17031 6 9 6C9.82969 6 10.5 5.32969 10.5 4.5C10.5 3.67031 9.82969 3 9 3ZM12.4359 3H22.5C23.3297 3 24 3.67031 24 4.5C24 5.32969 23.3297 6 22.5 6H12.4359C11.8594 7.32656 10.5375 8.25 9 8.25C7.4625 8.25 6.14062 7.32656 5.56406 6H1.5C0.670312 6 0 5.32969 0 4.5C0 3.67031 0.670312 3 1.5 3H5.56406C6.14062 1.67344 7.4625 0.75 9 0.75C10.5375 0.75 11.8594 1.67344 12.4359 3Z"
                                                fill="currentColor"
                                            />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_35_4995">
                                                <rect width="24" height="24" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="overflow-y-auto max-h-[70vh] pb-[140px]">
                        {children}
                    </div>
                </div>

                <div className="flex justify-between sticky right-0 bottom-0 px-5 w-full h-[130px] bg-main-background z-[40]">
                    <div></div>
                    <div className="flex flex-col-reverse gap-4 justify-center items-end">
                        {add && onAdd && (
                            <div style={{ marginBottom: "1em" }}>
                                <button type="button" className="btn-agregar bg-blue_custom -translate-x-3" onClick={onAdd}>
                                    <span className="material-symbols-outlined">add</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div >
        </>
    )
}

export default InventariosLayout