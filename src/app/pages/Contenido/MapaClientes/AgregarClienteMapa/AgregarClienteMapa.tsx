import { ChangeEvent, useContext, useState, useRef } from "react";
import "./AgregarClienteMapa.css";
//import { GoogleMapComponent } from "../../../components/GoogleMaps/GoogleMapComponent";
import { ImagenInsertar } from "../../../components/ImagenInsertar/ImagenInsertar";
import { MapaClientesContext } from "../MapaClientesContext";
import {
  GoogleMap,
  LoadScript,
  StandaloneSearchBox,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";

const AgregarClienteMapa = () => {
  const { setShowModal } = useContext(MapaClientesContext);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [checkbox1, setCheckbox1] = useState<boolean>(false);
  const [checkbox2, setCheckbox2] = useState<boolean>(false);
  const [imageCarnetTrasero, setImageCarnetTrasero] = useState<string | null>(
    null
  );
  const [imageCarnetDelantero, setImageCarnetDelantero] = useState<
    string | null
  >(null);
  const [imageCasa, setImageCasa] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] =
    useState<google.maps.LatLng | null>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isChecked2, setIsChecked2] = useState<boolean>(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: -21.5367,
    lng: -64.7296,
  }); // Default center in Tarija, Bolivia
  //const apiKey = 'TU_API_KEY';
  const autocompleteRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [address, setAddress] = useState<string>("");
  const searchBoxRef = useRef<any>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleSelectImage = () => {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    fileInput.click();
  };

  const handleCheckbox1Change = () => {
    setCheckbox1(!checkbox1);
    if (checkbox2) {
      setCheckbox2(false);
    }
  };

  const handleCheckbox2Change = () => {
    setCheckbox2(!checkbox2);
    if (checkbox1) {
      setCheckbox1(false);
    }
  };

  /*const handleLocationSelect = (location: google.maps.LatLng) => {
        setSelectedLocation(location);
    };*/
  const onLoad = (ref: any) => {
    searchBoxRef.current = ref;
  };

  const onPlacesChanged = () => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces();
      if (places.length > 0) {
        const selectedPlace = places[0];
        if (selectedPlace.geometry) {
          const lat = selectedPlace.geometry.location.lat();
          const lng = selectedPlace.geometry.location.lng();
          const latLng = new google.maps.LatLng(lat, lng);
          setSelectedLocation(latLng);
          setMapCenter({ lat, lng }); // Update map center
        } else {
          // Provide feedback if no geometry is found
          console.log("No geometry found for the selected place");
        }
      } else {
        // Provide feedback if no places are found
        console.log("No places found");
      }
    }
  };

  // Function to handle address selection
  const handlePlaceChanged = () => {
    if (autocomplete && autocompleteRef.current) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const location = place.geometry.location;
        const lat = location.lat(); // Asegúrate de que lat() y lng() sean llamados correctamente
        const lng = location.lng();

        setAddress(place.formatted_address || "");
        // Opcionalmente, centra el mapa en la ubicación seleccionada
        if (mapRef.current) {
          mapRef.current.setCenter({ lat, lng });
          mapRef.current.setZoom(15);
        }
        // Opcionalmente, filtra los clientes u otras acciones
        // Example: filterClientsByAddress(place.formatted_address || "");
      }
    }
  };

  const toggleSwitch = () => {
    setIsChecked(!isChecked);
  };
  const toggleSwitch2 = () => {
    setIsChecked2(!isChecked2);
  };

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="modal-overlay">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="Titulo-Modal">
                <div>
                  <span>Regitrar cliente</span>
                </div>
                <div>
                  <button
                    type="button"
                    className="btn"
                    onClick={handleCloseModal}
                  >
                    <img src="./cerrar.svg" alt="" />
                  </button>
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {selectedImage !== null ? (
                  <img className="img-modal" src={selectedImage} alt="" />
                ) : (
                  <div className="img-modal">
                    <span className="letras-img">LV</span>
                  </div>
                )}
                <button
                  onClick={handleSelectImage}
                  className="btn-camara"
                  type="button"
                >
                  <img src="./CamaraIcon.svg" alt="" />
                </button>
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>
            <div className="modal-body">
              <div className="grupo-input">
                <div className="input-grup">
                  <label className="label-grup">Nombre</label>
                  <input type="text" className="input-text" />
                </div>
                <div className="input-grup">
                  <label className="label-grup">Datos de facturación</label>
                  <input type="text" className="input-text" />
                </div>
              </div>
              <div className="grupo-input">
                <div className="input-grup">
                  <label className="label-grup">Número de NIT</label>
                  <input type="text" className="input-text" />
                </div>
                <div className="input-grup">
                  <label className="label-grup">Número de whastapp*</label>
                  <input type="text" className="input-text" />
                </div>
              </div>
              <div className="grupo-input">
                <div className="input-grup">
                  <label className="label-grup">Número de teléfono</label>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        width: "15%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "5px",
                        border: "1px solid #000",
                        borderEndEndRadius: "0px",
                        borderStartEndRadius: "0px",
                      }}
                    >
                      <img src="./Telefono-icon.svg" alt="" />
                    </div>
                    <input
                      type="text"
                      className="input-text"
                      style={{
                        width: "100%",
                        borderStartStartRadius: "0px",
                        borderEndStartRadius: "0px",
                        textAlign: "start",
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="grupo-input">
                <div className="input-grup">
                  <label className="label-grup">Dirección</label>
                  <input type="text" className="input-text" />
                  <div className="ubicacion" style={{ marginTop: "10px" }}>
                    <img src="./Googlemap-Icon.svg" alt="" />
                    <a
                      className="text-ubi"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://www.google.com/maps/@${selectedLocation?.lat()},${selectedLocation?.lng()},15z`}
                    >
                      Ver ubicación en Google Maps
                    </a>
                  </div>
                  <div className="grupo-input">
                    <div className="Ubi-Google">
                      <LoadScript
                        googleMapsApiKey={
                          process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""
                        }
                      >
                        <GoogleMap
                          mapContainerStyle={{ width: "100%", height: "300px" }}
                          center={mapCenter} // Use mapCenter state
                          zoom={12}
                        >
                          <StandaloneSearchBox
                            onLoad={onLoad}
                            onPlacesChanged={onPlacesChanged}
                          >
                            <Autocomplete
                              onLoad={(autocompleteInstance) =>
                                setAutocomplete(autocompleteInstance)
                              }
                              onPlaceChanged={handlePlaceChanged}
                            >
                              <input
                                type="text"
                                placeholder="Enter address"
                                ref={autocompleteRef}
                                style={{
                                  boxSizing: `border-box`,
                                  border: `1px solid transparent`,
                                  width: `240px`,
                                  height: `32px`,
                                  padding: `0 12px`,
                                  borderRadius: `3px`,
                                  outline: `none`,
                                  fontSize: `16px`,
                                  position: `absolute`,
                                  top: `10px`,
                                  left: `10px`,
                                  zIndex: `1`,
                                }}
                              />
                            </Autocomplete>
                          </StandaloneSearchBox>
                          {selectedLocation && (
                            <Marker
                              position={{
                                lat: selectedLocation.lat(),
                                lng: selectedLocation.lng(),
                              }}
                            />
                          )}
                        </GoogleMap>
                      </LoadScript>
                    </div>
                  </div>
                </div>
                <div className="input-grup">
                  <label className="label-grup">Referencia</label>
                  <input type="text" className="input-text" />
                </div>
              </div>
              <div className="grupo-input" style={{ gap: "20px" }}>
                <div className="input-grup">
                  <label className="label-grup">Zona</label>
                  <select name="zona" className="input-select">
                    <option value="Zona Norte">Zona Norte</option>
                    <option value="Zona Sur">Zona Sur</option>
                  </select>
                </div>
                <div className="input-grup">
                  <label className="label-grup">Barrio</label>
                  <select name="zona" className="input-select">
                    <option value="Guadaquivir">Guadaquivir</option>
                    <option value="Guadaquivir">Guadaquivir</option>
                  </select>
                </div>
              </div>
              <div className="grupo-checbox">
                <div className="grupo-check">
                  <input
                    className="input-check"
                    type="checkbox"
                    checked={checkbox1}
                    onChange={handleCheckbox1Change}
                  />
                  <label className="text-check">Cliente habitual</label>
                </div>
                <div className="grupo-check">
                  <input
                    className="input-check"
                    type="checkbox"
                    checked={checkbox2}
                    onChange={handleCheckbox2Change}
                  />
                  <label className="text-check">Agencia</label>
                </div>
              </div>
              <div className="grupo-input">
                <div className="grupo-input">
                  <ImagenInsertar
                    texto="Porfavor, adjunta foto del carnet (trasero)"
                    imagenSelect={imageCarnetTrasero}
                    onImagenSeleccionada={setImageCarnetTrasero}
                    id="trasero"
                  />
                </div>
              </div>
              <div className="grupo-input">
                <div className="grupo-input">
                  <ImagenInsertar
                    texto="Porfavor, adjunta foto del carnet (Delantero)"
                    imagenSelect={imageCarnetDelantero}
                    onImagenSeleccionada={setImageCarnetDelantero}
                    id="delantero"
                  />
                </div>
              </div>
              <div className="grupo-input">
                <div className="grupo-input">
                  <ImagenInsertar
                    texto="Foto de la fachada del domicilio"
                    imagenSelect={imageCasa}
                    onImagenSeleccionada={setImageCasa}
                    id="casa"
                  />
                </div>
              </div>
              <div className="grupo-input">
                <div className="Ubi-Google">
                  {/* <GoogleMapComponent apiKey={apiKey} onLocationSelect={handleLocationSelect} /> */}
                </div>
                {/* {selectedLocation && (
                                <div className="Ubi-Google">
                                    Ubicación seleccionada: {selectedLocation.lat()}, {selectedLocation.lng()}
                                </div>
                            )} */}
              </div>
              <div className="grupo-input" style={{ flexDirection: "column" }}>
                <div className="switch-input">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      flex: "1 0 0",
                    }}
                  >
                    <img src="./Calendario-icon.svg" alt="" />
                    <span
                      className="title-switch"
                      style={{ color: isChecked ? "#000" : "" }}
                    >
                      Período de Renovación
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "22px",
                    }}
                  >
                    <div>
                      <span className="title-switch" style={{ color: "#000" }}>
                        Estado:
                      </span>
                    </div>
                    <label className="switch-container">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={toggleSwitch}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "1px black solid",
                  }}
                ></div>
              </div>
              <div className="grupo-input" style={{ flexDirection: "column" }}>
                <div className="switch-input">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      flex: "1 0 0",
                    }}
                  >
                    <img src="./Calendario-icon.svg" alt="" />
                    <span
                      className="title-switch"
                      style={{ color: isChecked2 ? "#000" : "" }}
                    >
                      Renovación Promedio
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "22px",
                    }}
                  >
                    <div>
                      <span className="title-switch" style={{ color: "#000" }}>
                        Estado:
                      </span>
                    </div>
                    <label className="switch-container">
                      <input
                        type="checkbox"
                        checked={isChecked2}
                        onChange={toggleSwitch2}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "1px black solid",
                  }}
                ></div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancelar"
                onClick={handleCloseModal}
              >
                Cancelar
              </button>
              <button type="button" className="btn-registrar">
                Registrar cliente
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export { AgregarClienteMapa };
