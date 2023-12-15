import { ChangeEvent, useState } from "react";

type ImagenCarnet = {
  imagenSelect: string;
  onImagenSeleccionada: (imagen: string | null) => void;
};

const ImagenInsertar: React.FC<ImagenCarnet> = ({ imagenSelect, onImagenSeleccionada }) => {
  const [imageCarnet, setImageCarnet] = useState<string | null>(null);

  const fileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageCarnet(imageUrl);
      onImagenSeleccionada(imageUrl); // Llamar a la función de retorno de llamada con la nueva imagen
    }
  };

  const CarnetImage = () => {
    const fileInput = document.getElementById("Carnet") as HTMLInputElement;
    fileInput.click();
  };

  const resetImageCarnet = () => {
    setImageCarnet(null);
    onImagenSeleccionada(null); // Llamar a la función de retorno de llamada con null para indicar que no hay imagen
  };

  return (
    <>
      <div className="img-carnet">
        {imageCarnet !== null ? (
          <div className="boton-img">
            <img className="carnet" src={imageCarnet} alt="Carnet " />
            <button onClick={resetImageCarnet} type="button" className="btn">
              Seleccionar otra imagen
            </button>
          </div>
        ) : (
          <>
            <div className="boton-img">
              <button onClick={CarnetImage} type="button" className="btn">
                <img src="./img-icon.svg" alt="Insertar imagen" />
              </button>
              <input
                type="file"
                id="Carnet"
                accept="image/*"
                onChange={fileChange}
                style={{ display: "none" }}
              />
              <span className="text-img">
                {imagenSelect}
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export { ImagenInsertar };
