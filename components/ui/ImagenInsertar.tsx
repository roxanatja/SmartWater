import { ChangeEvent } from "react";
import { Image } from "lucide-react";

type ImagenCarnetProps = {
  imagenSelect: string | null;
  texto: string;
  onImagenSeleccionada: (imagen: string | null) => void;
  id: string;
};

const ImagenInsertar: React.FC<ImagenCarnetProps> = ({
  imagenSelect,
  onImagenSeleccionada,
  id,
  texto,
}) => {
  const fileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onImagenSeleccionada(imageUrl); // Llamar a la función de retorno de llamada con la nueva imagen
    }
  };

  const CarnetImage = () => {
    const fileInput = document.getElementById(id) as HTMLInputElement;
    fileInput.click();
  };

  const resetImageCarnet = () => {
    onImagenSeleccionada(null);
  };

  return (
    <div className="w-full p-4 self-stretch rounded-3xl bg-gray-300">
      {imagenSelect !== null ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3">
          <img
            className="w-3/4 h-auto rounded-3xl bg-gray-300 object-cover"
            src={imagenSelect}
            alt="Carnet"
          />
          <button onClick={resetImageCarnet} type="button" className="btn">
            Seleccionar otra imagen
          </button>
        </div>
      ) : (
        <div
          className="w-full h-full flex flex-col items-center justify-center gap-3 "
          onClick={CarnetImage}
        >
          <button onClick={CarnetImage} type="button" className="btn">
            <Image />
          </button>
          <input
            type="file"
            id={id}
            accept="image/*"
            onChange={fileChange}
            className="hidden"
          />
          <span className="text-gray-600 font-semibold text-sm normal-case">
            {texto}
          </span>
        </div>
      )}
    </div>
  );
};

export { ImagenInsertar };
