import { FC, useState } from 'react';

type typeContadorProduct = {
    onDecrementar: (cantidad: number) => void,
    onIncrementar: (cantidad: number) => void,
}

const Contador: FC<typeContadorProduct> = ({ onDecrementar, onIncrementar }) => {
    const [count, setCount] = useState((1));

    const decrementar = () => {
        if (count > 0) {
            onDecrementar(count - 1);
            setCount(count - 1);
        }
    };

    const incrementar = () => {
        onIncrementar(count + 1);
        setCount(count + 1);
    };

    return (
        <>
            <div className="FiltroClientes-Botones">
                <button className="FiltroClientes-Botonesbtn" onClick={decrementar}>
                    <span className="material-symbols-outlined">
                        do_not_disturb_on
                    </span>
                </button>
                <span className="FiltroClientes-BotonesNumero">
                    {count}
                </span>
                <button className="FiltroClientes-Botonesbtn" onClick={incrementar}>
                    <span className="material-symbols-outlined">
                        add_circle
                    </span>
                </button>
            </div>
        </>
    );
};

export { Contador };