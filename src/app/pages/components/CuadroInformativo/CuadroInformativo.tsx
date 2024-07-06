import React from "react";
import "./CuadroInformativo.css";

// Props esperadas por los componentes CuadroInformativo y CuadroInformativo2.
type CuadroInformativoProps = {
  titulo: string;
  numero: string;
  porcentaje?: number;
  letra?: string;
};

// Componente funcional para mostrar un cuadro informativo con título, número y porcentaje.
const CuadroInformativo: React.FC<CuadroInformativoProps> = ({
  titulo,
  numero,
  porcentaje,
  letra,
}) => {
  // Función para determinar el color del porcentaje
  const getColorClass = (percentage: number | undefined): string => {
    if (percentage === undefined) return ""; // Si el porcentaje no está definido, no aplica clase

    if (percentage >= 0) {
      return "porcentaje-verde"; // Clase para porcentaje verde si es positivo
    } else if (percentage < 0) {
      return "porcentaje-rojo"; // Clase para porcentaje rojo si es negativo
    } else {
      return ""; // Sin clase si el porcentaje es cero
    }
  };

  // Función para calcular el porcentaje en formato de texto
  const calculatePercentageText = (percentage: number | undefined): string => {
    if (percentage === undefined) return "cargando";
    if (percentage === 0) return "+0%";

    const sign = percentage >= 0 ? "+" : "-";
    return `${sign}${percentage.toFixed(1)}%`;
  };

  return (
    <div className="cuadroGeneral">
      <div className="titulo-cuadro">
        <span>{titulo}</span>
      </div>

      {/* Condición para mostrar el número y letra si están definidos */}
      {numero !== "" && numero !== undefined ? (
        letra !== undefined ? (
          <div className="numero-letra">
            <span>{numero}</span>
            <span style={{ fontSize: "24px", marginLeft: "4px" }}>{letra}</span>
          </div>
        ) : (
          <div className="numero-cuadro">
            <span>{numero}</span>
          </div>
        )
      ) : (
        <div className="numero-cuadro"></div>
      )}

      {/* Condición para mostrar el porcentaje en verde o rojo */}
      <div className="cuadrogeneral-porcentaje">
        {porcentaje !== undefined ? (
          <div className={getColorClass(porcentaje)}>
            <span>{calculatePercentageText(porcentaje)}</span>
          </div>
        ) : (
          <div className="porcentaje-neutro">
            <span>Cargando</span>
          </div>
        )}
        <div className="letras-cuadro">
          <span>En el último mes</span>
        </div>
      </div>
    </div>
  );
};

// Componente funcional CuadroInformativo2, que no muestra "En el último mes".
const CuadroInformativo2: React.FC<CuadroInformativoProps> = ({
  titulo,
  numero,
  porcentaje,
  letra,
}) => {
  // Función para determinar el color del porcentaje
  const getColorClass = (percentage: number | undefined): string => {
    if (percentage === undefined) return ""; // Si el porcentaje no está definido, no aplica clase

    if (percentage >= 0) {
      return "porcentaje-verde"; // Clase para porcentaje verde si es positivo
    } else if (percentage < 0) {
      return "porcentaje-rojo"; // Clase para porcentaje rojo si es negativo
    } else {
      return ""; // Sin clase si el porcentaje es cero
    }
  };

  // Función para calcular el porcentaje en formato de texto
  const calculatePercentageText = (percentage: number | undefined): string => {
    if (percentage === undefined) return "cargando";
    if (percentage === 0) return "+0%";

    const sign = percentage >= 0 ? "+" : "-";
    return `${sign}${percentage.toFixed(1)}%`;
  };

  return (
    <div className="cuadroGeneral">
      <div className="titulo-cuadro">
        <span>{titulo}</span>
      </div>

      {/* Condición para mostrar el número y letra si están definidos */}
      {numero !== "" && numero !== undefined ? (
        letra !== undefined ? (
          <div className="numero-letra">
            <span>{numero}</span>
            <span style={{ fontSize: "24px", marginLeft: "4px" }}>{letra}</span>
          </div>
        ) : (
          <div className="numero-cuadro">
            <span>{numero}</span>
          </div>
        )
      ) : (
        <div className="numero-cuadro"></div>
      )}

      {/* Condición para mostrar el porcentaje en verde o rojo */}
      <div className="cuadrogeneral-porcentaje">
        {porcentaje !== undefined ? (
          <div className={getColorClass(porcentaje)}>
            <span>{calculatePercentageText(porcentaje)}</span>
          </div>
        ) : (
          <div className="porcentaje-neutro">
            <span>Cargando</span>
          </div>
        )}
      </div>
    </div>
  );
};

export { CuadroInformativo, CuadroInformativo2 };
