import { ChangeEvent } from "react";
import "./ImagenInsertar.css";

type ImagenCarnetProps = {
  imagenSelect: string | null;
  texto: string;
  onImagenSeleccionada: (imagen: string | null) => void;
  id: string; // Identificador único para la imagen
};

const ImagenInsertar: React.FC<ImagenCarnetProps> = ({ imagenSelect, onImagenSeleccionada, id, texto }) => {
  
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
    <div className="img-carnet">
      {imagenSelect !== null ? (
        <div className="boton-img">
          <img className="carnet" src={imagenSelect} alt="Carnet" />
          <button onClick={resetImageCarnet} type="button" className="btn">
            Seleccionar otra imagen
          </button>
        </div>
      ) : (
        <div className="boton-img">
          <button onClick={CarnetImage} type="button" className="btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="81" height="80" viewBox="0 0 81 80" fill="none">
              <g clipPath="url(#clip0_9_29676)">
                <path d="M70.9531 11.5C72.3281 11.5 73.4531 12.625 73.4531 14V63.9688L72.6719 62.9531L51.4219 35.4531C50.7188 34.5312 49.6094 34 48.4531 34C47.2969 34 46.2031 34.5312 45.4844 35.4531L32.5156 52.2344L27.75 45.5625C27.0469 44.5781 25.9219 44 24.7031 44C23.4844 44 22.3594 44.5781 21.6562 45.5781L9.15625 63.0781L8.45312 64.0469V64V14C8.45312 12.625 9.57812 11.5 10.9531 11.5H70.9531ZM10.9531 4C5.4375 4 0.953125 8.48438 0.953125 14V64C0.953125 69.5156 5.4375 74 10.9531 74H70.9531C76.4688 74 80.9531 69.5156 80.9531 64V14C80.9531 8.48438 76.4688 4 70.9531 4H10.9531ZM23.4531 34C24.438 34 25.4133 33.806 26.3232 33.4291C27.2332 33.0522 28.06 32.4997 28.7564 31.8033C29.4529 31.1069 30.0053 30.2801 30.3822 29.3701C30.7591 28.4602 30.9531 27.4849 30.9531 26.5C30.9531 25.5151 30.7591 24.5398 30.3822 23.6299C30.0053 22.7199 29.4529 21.8931 28.7564 21.1967C28.06 20.5003 27.2332 19.9478 26.3232 19.5709C25.4133 19.194 24.438 19 23.4531 19C22.4682 19 21.4929 19.194 20.583 19.5709C19.6731 19.9478 18.8463 20.5003 18.1498 21.1967C17.4534 21.8931 16.9009 22.7199 16.524 23.6299C16.1471 24.5398 15.9531 25.5151 15.9531 26.5C15.9531 27.4849 16.1471 28.4602 16.524 29.3701C16.9009 30.2801 17.4534 31.1069 18.1498 31.8033C18.8463 32.4997 19.6731 33.0522 20.583 33.4291C21.4929 33.806 22.4682 34 23.4531 34Z" fill="#606060"/>
              </g>
              <defs>
                <clipPath id="clip0_9_29676">
                  <rect width="80" height="80" fill="white" transform="translate(0.953125)"/>
                </clipPath>
              </defs>
            </svg>
          </button>
          <input
            type="file"
            id={id}
            accept="image/*"
            onChange={fileChange}
            style={{ display: "none" }}
          />
          <span className="text-img">
            {texto}
          </span>
        </div>
      )}
    </div>
  );
};

export { ImagenInsertar };
