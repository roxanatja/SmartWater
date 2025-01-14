import { FC, useEffect, useState } from "react";

type typeContadorProduct = {
  onDecrementar: (cantidad: number) => void;
  onIncrementar: (cantidad: number) => void;
  initialValue?: number;
  max?: number
  min?: number
  numberClassname?: string;
  iconsClassname?: string;
};

const Contador: FC<typeContadorProduct> = ({
  onDecrementar,
  onIncrementar,
  initialValue, max, min,
  iconsClassname, numberClassname
}) => {
  const [count, setCount] = useState(initialValue || 0);

  const decrementar = () => {
    if (count > 0) {
      const newValue = count - 1

      if (min && newValue >= min) {
        onDecrementar(newValue);
        setCount(newValue);
      }

      if (!min) {
        onDecrementar(newValue);
        setCount(newValue);
      }
    }
  };

  const incrementar = () => {
    const newValue = count + 1

    if (max && newValue <= max) {
      onIncrementar(newValue);
      setCount(newValue);
    }

    if (!max) {
      onIncrementar(newValue);
      setCount(newValue);
    }
  };

  useEffect(() => {
    if (initialValue) {
      setCount(initialValue)
    }
  }, [initialValue])

  return (
    <>
      <div className="FiltroClientes-Botones flex items-center gap-3">
        <button
          type="button"
          disabled={!!min && count <= min}
          className={`FiltroClientes-Botonesbtn flex items-center disabled:opacity-30 ${iconsClassname}`}
          onClick={decrementar}
        >
          <span className="material-symbols-outlined">do_not_disturb_on</span>
        </button>
        <span className={`FiltroClientes-BotonesNumero ${numberClassname}`}>{count}</span>
        <button
          type="button"
          disabled={!!max && count >= max}
          className={`FiltroClientes-Botonesbtn flex items-center disabled:opacity-30 ${iconsClassname}`}
          onClick={incrementar}
        >
          <span className="material-symbols-outlined">add_circle</span>
        </button>
      </div>
    </>
  );
};

export { Contador };
