import { ChangeEvent, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EditClient.css";
import { ImagenInsertar } from "../../../components/ImagenInsertar/ImagenInsertar";
import { ClientesContext } from "../ClientesContext";
import GoogleMaps from "../../../components/GoogleMaps/GoogleMaps";
import { GetZone } from "../../../../../services/ZonesService";
import { updateClient } from "../../../../../services/ClientsService";

interface District {
  _id: string;
  name: string;
  description: string;
}

interface Zone {
  id: string;
  name: string;
  districts: Array<District>;
}

const ClientEdit = () => {
  const { selectedClient } = useContext(ClientesContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [zones, setZones] = useState<Array<Zone>>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageDuplicated, setSelectedImageDuplicated] = useState<
    string | null
  >(null);
  const [storeImage, setStoreImage] = useState<File | null>(null);
  const [imageCarnetTrasero, setImageCarnetTrasero] = useState<string | null>(
    null
  );
  const [imageCarnetDelantero, setImageCarnetDelantero] = useState<
    string | null
  >(null);
  const [imageCarnetTraseroDuplicated, setImageCarnetTraseroDuplicated] =
    useState<string | null>(null);
  const [imageCarnetDelanteroDuplicated, setImageCarnetDelanteroDuplicated] =
    useState<string | null>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isChecked2, setIsChecked2] = useState<boolean>(false);
  const api: string = "AIzaSyApnMcPn7E_7oPoQzelrTZX0OjDwrNbsco";
  const [showMap, setShowMap] = useState<boolean>(false);
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");

  const [fullName, setFullName] = useState<string>("");
  const [bill, setBill] = useState<string>("");
  const [nit, setNit] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  let url = `https://www.google.com/maps/place/${address}`;
  const [zoneSelected, setZoneSelected] = useState<string>("");
  const [districts, setDistricts] = useState<District[]>([]);
  const [districtSelected, setDistrictSelected] = useState<string>("");
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    const loadClientData = async () => {
      if (selectedClient) {
        console.log("Cliente seleccionado:", selectedClient);

        // Función para obtener coordenadas
        const getCoordinatesClient = async () => {
          if (!selectedClient.address) return;
          const url = `https://nominatim.openstreetmap.org/search?format=json&q=${selectedClient.address}`;
          const response = await fetch(url);
          const data = await response.json();
          let latitude = "0",
            longitude = "0";

          if (data.length > 0) {
            latitude = data[0].lat;
            longitude = data[0].lon;
          } else {
            console.error("No se encontraron coordenadas");
          }

          setLatitude(latitude);
          setLongitude(longitude);
        };

        // Función para cargar zonas
        const loadZones = async () => {
          try {
            const resp = await GetZone();
            setZones(resp.data);
            if (resp.data.length > 0) {
              setDistricts(resp.data[0].districts); // Inicializa distritos según la primera zona
            }
          } catch (error) {
            console.error("Error cargando zonas", error);
          }
        };

        // Cargar datos del cliente
        const loadClientData = () => {
          if (selectedClient.billingInfo) {
            console.log("Cargando datos del cliente:", selectedClient);
            setFullName(selectedClient.fullName);
            setNit(selectedClient.billingInfo.NIT);
            setEmail(selectedClient.email);
            setPhoneNumber(selectedClient.phoneNumber);
            setAddress(selectedClient.address);
            setLatitude(selectedClient.location.latitude);
            setLongitude(selectedClient.location.longitude);
            setComment(selectedClient.comment);
            setZoneSelected(selectedClient.zone);
            setDistrictSelected(selectedClient.district);
            setSelectedImage(selectedClient.storeImage);
            setImageCarnetTrasero(selectedClient.ciBackImage);
            setImageCarnetTraseroDuplicated(selectedClient.ciBackImage);
            setImageCarnetDelantero(selectedClient.ciFrontImage);
            setImageCarnetDelanteroDuplicated(selectedClient.ciFrontImage);
          }
          setIsLoading(false);
        };

        loadClientData();
        loadZones();
        getCoordinatesClient();
      }
    };

    loadClientData();
  }, [selectedClient]); // Dependencia en selectedClient

  if (isLoading) {
    return <p>Cargando Informaciond del cliente</p>;
  }

  const handleCloseModal = () => {
    navigate("/Clientes");
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setStoreImage(file);
      setSelectedImageDuplicated(URL.createObjectURL(file));
    }
  };

  const handleSelectImage = () => {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    fileInput.click();
  };

  const saveImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "nn9rw8nv");
    formData.append("api_key", "799292358463167");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/ddpagwxh6/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const responseData = await response.json();
    return responseData;
  };

  const convertUrlToFile = async (
    url: string,
    fileName: string
  ): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], fileName);
  };

  const capitalize = (value: string) => {
    //Función para capitalizar la primera letra de cada palabra.
    return value.replace(/(^|\s)\S/g, (char) => char.toUpperCase());
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    const capitalizedValue = capitalize(value);

    setFullName(capitalizedValue);
  };

  const handleBillChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setBill(value);
  };

  const handleNitChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setNit(value);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setEmail(value);
  };

  const handlePhoneNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setPhoneNumber(value);
  };

  const verifyPhoneNumber = (value: string) => {
    if (!value.startsWith("+")) {
      var newValue = "+" + value;

      return newValue;
    } else {
      return value;
    }
  };

  const getCoordinates = async () => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${address}`;
    const response = await fetch(url);
    const data = await response.json();
    let latitude = "0",
      longitude = "0";

    if (data.length > 0) {
      latitude = data[0].lat;
      longitude = data[0].lon;
    } else {
      console.error("No se encontraron coordenadas");
    }

    setLatitude(latitude);
    setLongitude(longitude);
  };

  const handleAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setAddress(value);
  };

  const showMapLocation = () => {
    getCoordinates();
    console.log("Mostrar mapa", longitude, latitude);
    setShowMap(true);
  };

  const handleCommentChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setComment(value);
  };

  const handleZoneChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    // eslint-disable-next-line
    zones.map((zone: any) => {
      if (zone.name === value) {
        setZoneSelected(zone._id);
        setDistricts(zone.districts);
      }
    });
  };

  const handleDistricChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    // eslint-disable-next-line
    districts.map((district) => {
      if (district._id === value) {
        setDistrictSelected(district._id);
      }
    });
  };

  const toggleSwitch = () => {
    setIsChecked(!isChecked);
  };
  const toggleSwitch2 = () => {
    setIsChecked2(!isChecked2);
  };

  const saveData = async () => {
    let urlStoreImg,
      urlCarnetTrasero,
      urlCarnetDelantero,
      urlStoreImgCloud,
      urlCarnetDelanteroCLOUD,
      urlCarnetTraseroCLOUD;
    let frontCarnetImage: File | undefined;
    let backCarnetImage: File | undefined;
    if (
      imageCarnetDelantero !== imageCarnetDelanteroDuplicated &&
      imageCarnetDelantero
    ) {
      frontCarnetImage = await convertUrlToFile(
        imageCarnetDelantero,
        `${fullName}-carnetDelantero.jpg`
      );
      urlCarnetDelanteroCLOUD = await saveImage(frontCarnetImage);
      urlCarnetDelantero = urlCarnetDelanteroCLOUD.secure_url;
    } else {
      urlCarnetDelantero = imageCarnetDelantero;
    }

    if (
      imageCarnetTrasero !== imageCarnetTraseroDuplicated &&
      imageCarnetTrasero
    ) {
      backCarnetImage = await convertUrlToFile(
        imageCarnetTrasero,
        `${fullName}-carnetTrasero.jpg`
      );
      urlCarnetTraseroCLOUD = await saveImage(backCarnetImage);
      urlCarnetTrasero = urlCarnetTraseroCLOUD.secure_url;
    } else {
      urlCarnetTrasero = imageCarnetTrasero;
    }

    if (selectedImageDuplicated !== selectedImage && storeImage) {
      urlStoreImgCloud = await saveImage(storeImage);
      urlStoreImg = urlStoreImgCloud.secure_url;
    } else {
      urlStoreImg = selectedImage;
    }

    try {
      const dataToSave = {
        storeImage: urlStoreImg,
        fullName: fullName,
        phoneNumber: await verifyPhoneNumber(phoneNumber),
        email: email,
        address: address,
        comment: comment,
        zone: zoneSelected,
        district: districtSelected,
        ciFrontImage: urlCarnetDelantero,
        ciBackImage: urlCarnetTrasero,
        location: {
          latitude: latitude,
          longitude: longitude,
        },
        renewInDays: "10",
        averageRenewal: false,
      };

      const resp = await updateClient(selectedClient._id, dataToSave);

      if (resp === 200) {
        console.log("Client successfully updated", dataToSave);
        window.alert("Cliente actualizado correctamente");
        window.location.reload();
      } else {
        console.error("Error to update the client", dataToSave);
        window.alert("Error al actualizar el cliente");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="modal-overlay">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="Titulo-Modal">
                <div>
                  <span>Editar cliente</span>
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
                  <input
                    type="text"
                    className="input-text"
                    placeholder={fullName}
                    value={fullName}
                    onChange={handleNameChange}
                  />
                </div>
                <div className="input-grup">
                  <label className="label-grup">Datos de facturación</label>
                  <input
                    type="text"
                    className="input-text"
                    placeholder={bill}
                    value={bill}
                    onChange={handleBillChange}
                  />
                </div>
              </div>
              <div className="grupo-input">
                <div className="input-grup">
                  <label className="label-grup">Número de NIT</label>
                  <input
                    type="text"
                    className="input-text"
                    placeholder={nit}
                    value={nit}
                    onChange={handleNitChange}
                  />
                </div>
                <div className="input-grup">
                  <label className="label-grup">Correo electronico</label>
                  <input
                    type="email"
                    className="input-text"
                    placeholder="juanAlvares@gmail.com"
                    value={email}
                    onChange={handleEmailChange}
                  />
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
                      placeholder={phoneNumber}
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                    />
                  </div>
                </div>
              </div>
              <div className="grupo-input">
                <div className="input-grup">
                  <label className="label-grup">Dirección</label>
                  <input
                    type="text"
                    className="input-text"
                    placeholder={address}
                    value={address}
                    onChange={handleAddressChange}
                  />
                  <div className="ubicacion" style={{ marginTop: "10px" }}>
                    <img src="./Googlemap-Icon.svg" alt="" />
                    <a
                      className="text-ubi"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={url}
                    >
                      Ver ubicación en Google Maps
                    </a>
                  </div>
                </div>
                <div className="input-grup">
                  <label className="label-grup">Referencia</label>
                  <input
                    type="text"
                    className="input-text"
                    placeholder={comment}
                    value={comment}
                    onChange={handleCommentChange}
                  />
                </div>
              </div>
              <div className="grupo-input" style={{ gap: "20px" }}>
                <div className="input-grup">
                  <label className="label-grup">Zona</label>
                  <select
                    id="zona"
                    name="zona"
                    className="input-select"
                    onChange={handleZoneChange}
                  >
                    {zones.map((zone) => {
                      return (
                        <option key={zone.id} value={zone.id}>
                          {zone.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="input-grup">
                  <label className="label-grup">Barrio</label>
                  <select
                    id="barrio"
                    name="zona"
                    className="input-select"
                    onChange={handleDistricChange}
                  >
                    {districts.map((district) => {
                      return (
                        <option key={district._id} value={district._id}>
                          {district.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="grupo-input">
                <ImagenInsertar
                  texto="Porfavor, adjunta foto del carnet (trasero)"
                  imagenSelect={imageCarnetTrasero}
                  onImagenSeleccionada={setImageCarnetTrasero}
                  id="trasero"
                />
              </div>
              <div className="grupo-input">
                <ImagenInsertar
                  texto="Porfavor, adjunta foto del carnet (Delantero)"
                  imagenSelect={imageCarnetDelantero}
                  onImagenSeleccionada={setImageCarnetDelantero}
                  id="delantero"
                />
              </div>
              <div className="grupo-input">
                <div className="Ubi-Google">
                  {showMap ? (
                    <>
                      <button
                        onClick={() => setShowMap(false)}
                        className="btn-ubi"
                      >
                        Ocultar mapa
                      </button>
                      <GoogleMaps
                        apiKey={api}
                        latitude={latitude}
                        longitude={longitude}
                      />
                    </>
                  ) : (
                    <button
                      onClick={() => showMapLocation()}
                      className="btn-ubi"
                    >
                      Mostrar mapa
                    </button>
                  )}
                </div>
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
              <button
                type="button"
                className="btn-registrar"
                onClick={saveData}
              >
                Editar cliente
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export { ClientEdit };
