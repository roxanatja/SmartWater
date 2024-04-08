"use client";
import { ChangeEvent, useContext, useState, useEffect } from "react";
import { ImagenInsertar } from "../ui/ImagenInsertar";
import { GetZone } from "@/lib/services/ZonesService";
import { Map } from "@vis.gl/react-google-maps";
import { saveClient } from "@/lib/services/ClientsService";
import {
  X,
  Image,
  CalendarDays,
  MapIcon,
  Phone,
  ImagePlus,
} from "lucide-react";
import * as Switch from "@radix-ui/react-switch";

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

interface AgregarClienteProps {
  onClose: () => void;
}

const AgregarCliente: React.FC<AgregarClienteProps> = ({ onClose }) => {
  const [zones, setZones] = useState<Array<Zone>>([]);
  //   const [showModal, setShowModal] = useState(false);

  const loadZones = async () => {
    try {
      const response = await fetch("/api/zones");
      const data = await response.json();
      setZones(data);
      setDistricts(data[0].districts);
    } catch (error) {
      console.error("Error loading zones:", error);
    }
  };

  useEffect(() => {
    loadZones();
  }, []);
  // Cerrar y mostrar el modal
  useEffect(() => {
    const handleCloseOnEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleCloseOnEsc);

    return () => {
      window.removeEventListener("keydown", handleCloseOnEsc);
    };
  }, [onClose]);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [storeImage, setStoreImage] = useState<File | null>(null);
  const [checkbox1, setCheckbox1] = useState<boolean>(false);
  const [checkbox2, setCheckbox2] = useState<boolean>(false);
  const [imageCarnetTrasero, setImageCarnetTrasero] = useState<string | null>(
    null
  );
  const [imageCarnetDelantero, setImageCarnetDelantero] = useState<
    string | null
  >(null);
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

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setStoreImage(file);
      setSelectedImage(URL.createObjectURL(file));
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

  const handleAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setAddress(value);
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
    zones.map((zone: any) => {
      if (zone.name === value) {
        setZoneSelected(zone._id);
        setDistricts(zone.districts);
      }
    });
  };

  const handleDistricChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    districts.map((district) => {
      if (district._id === value) {
        setDistrictSelected(district._id);
      }
    });
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

  const toggleSwitch = () => {
    setIsChecked(!isChecked);
  };

  const toggleSwitch2 = () => {
    setIsChecked2(!isChecked2);
  };

  const saveData = async () => {
    let urlStoreImg, urlCarnetTrasero, urlCarnetDelantero;
    let frontCarnetImage: File | undefined;
    let backCarnetImage: File | undefined;

    if (imageCarnetTrasero && imageCarnetDelantero) {
      backCarnetImage = await convertUrlToFile(
        imageCarnetTrasero,
        `${fullName}-carnetTrasero.jpg`
      );
      frontCarnetImage = await convertUrlToFile(
        imageCarnetDelantero,
        `${fullName}-carnetDelantero.jpg`
      );
    } else {
      console.error("No se encontró imagen del carnet");
      return window.alert(
        "Por favor, adjunte una imagen del carnet trasero/delantero de identidad."
      );
    }

    if (storeImage && backCarnetImage && frontCarnetImage) {
      urlStoreImg = await saveImage(storeImage);
      urlCarnetTrasero = await saveImage(backCarnetImage);
      urlCarnetDelantero = await saveImage(frontCarnetImage);
    } else {
      console.error("No se encontró imagen de la tienda");
      return window.alert("Por favor, adjunte una imagen de la tienda.");
    }

    const dataToSave = {
      user: "63d955b101f27eac0197bb16", //esto  esta hardcoded, me imagino que le estan asignando todos los clientes a un usuario? Tambien falta un  ID
      storeImage: urlStoreImg.secure_url,
      fullName: fullName,
      phoneNumber: await verifyPhoneNumber(phoneNumber),
      email: email,
      address: address,
      comment: comment,
      ciFrontImage: urlCarnetDelantero.secure_url,
      ciBackImage: urlCarnetTrasero.secure_url,
      zone: zoneSelected,
      district: districtSelected,
      location: {
        latitude: latitude,
        longitude: longitude,
      },
      renewInDays: "10",
      billingInfo: {
        NIT: nit,
        phoneNumber: phoneNumber,
      },
      isClient: checkbox1,
      isAgency: checkbox2,
    };
    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();

      if (response.status === 200) {
        console.log("Cliente registrado correctamente", responseData);
        alert("Cliente registrado correctamente");
        window.location.reload();
      } else {
        console.error("Error al registrar el cliente", responseData);
        alert("Error al registrar el cliente");
      }
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
      alert("Error al registrar el cliente");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="bg-white w-1/2 p-6 rounded-lg shadow-lg flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-blue-900">
              Registrar cliente
            </span>
            <button className="focus:outline-none" onClick={onClose}>
              <X />
            </button>
          </div>
          <div className="flex flex-col items-center gap-6">
            {selectedImage ? (
              <img
                className="w-24 h-24 rounded-full overflow-hidden"
                src={selectedImage}
                alt=""
                onClick={handleSelectImage}
              />
            ) : (
              <div
                className="w-24 h-24 bg-blue-300 rounded-full flex items-center justify-center"
                onClick={handleSelectImage}
              >
                <span className="text-5xl font-semibold text-white">LV</span>
              </div>
            )}
            <button
              className="focus:outline-none absolute  mt-14 ml-14"
              onClick={handleSelectImage}
            >
              <ImagePlus className="w-10 h-10 text-blue-800" />
            </button>
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
        <div className="overflow-y-auto max-h-[70vh] pr-2 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-sm font-normal">Nombre</label>
              <input
                type="text"
                className="w-full border border-black rounded-md px-4 py-2 text-center text-sm"
                placeholder="Juan Alvarez"
                value={fullName}
                onChange={handleNameChange}
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-sm font-normal">
                Datos de facturación
              </label>
              <input
                type="text"
                className="w-full border border-black rounded-md px-4 py-2 text-center text-sm"
                value={bill}
                onChange={handleBillChange}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-sm font-normal">Número de NIT</label>
              <input
                type="text"
                className="w-full border border-black rounded-md px-4 py-2 text-center text-sm"
                value={nit}
                onChange={handleNitChange}
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-sm font-normal">Correo electrónico</label>
              <input
                type="email"
                className="w-full border border-black rounded-md px-4 py-2 text-center text-sm"
                placeholder="juanalvarez@gmail.com"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-sm font-normal">Número de teléfono</label>
              <div className="flex w-full">
                <div className="w-12 flex items-center justify-center border border-black rounded-l-md">
                  <Phone />
                </div>
                <input
                  type="text"
                  className="w-full border border-black rounded-r-md px-4 py-2 text-sm"
                  placeholder="591 7510584"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-sm font-normal">Dirección</label>
              <input
                type="text"
                className="w-full border border-black rounded-md px-4 py-2 text-center text-sm"
                placeholder="Av. Abel Iturralde 1067, La Paz"
                value={address}
                onChange={handleAddressChange}
              />
              <div className="mt-2 flex items-center gap-2">
                <MapIcon />
                <a
                  className="text-xsfont-normal underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={url}
                >
                  Ver ubicación en Google Maps
                </a>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-sm font-normal">Referencia</label>
              <input
                type="text"
                className="w-full border border-black rounded-md px-4 py-2 text-center text-sm"
                value={comment}
                onChange={handleCommentChange}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-sm font-normal">Zona</label>
              <select
                id="zona"
                name="zona"
                className="border border-black rounded-md px-4 py-2 text-sm bg-white"
                onChange={handleZoneChange}
              >
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-sm font-normal">Barrio</label>
              <select
                id="barrio"
                name="zona"
                className="border border-black rounded-md px-4 py-2 text-sm bg-white"
                onChange={handleDistricChange}
              >
                {districts.map((district) => (
                  <option key={district._id} value={district._id}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-10 w-full">
            <div className="flex items-center gap-4">
              <input
                className="w-4 h-5"
                type="checkbox"
                checked={checkbox1}
                onChange={handleCheckbox1Change}
              />
              <label className="text-sm font-normal">Cliente habitual</label>
            </div>
            <div className="flex items-center gap-4">
              <input
                className="w-4 h-5"
                type="checkbox"
                checked={checkbox2}
                onChange={handleCheckbox2Change}
              />
              <label className="text-sm font-normal">Agencia</label>
            </div>
          </div>
          <div className="flex gap-4">
            <ImagenInsertar
              texto="Por favor, adjunta foto del carnet (trasero)"
              imagenSelect={imageCarnetTrasero}
              onImagenSeleccionada={setImageCarnetTrasero}
              id="trasero"
            />
          </div>
          <div className="flex gap-4">
            <ImagenInsertar
              texto="Por favor, adjunta foto del carnet (Delantero)"
              imagenSelect={imageCarnetDelantero}
              onImagenSeleccionada={setImageCarnetDelantero}
              id="delantero"
            />
          </div>
          <div className="flex gap-4">
            <div className="w-full">
              {showMap ? (
                <>
                  <button
                    onClick={() => setShowMap(false)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Ocultar mapa
                  </button>
                  <Map style={{ height: "400px" }} />{" "}
                </>
              ) : (
                <button
                  onClick={() => showMapLocation()}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Mostrar mapa
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CalendarDays />
                <span
                  className="text-sm font-semibold"
                  style={{ color: isChecked ? "#000" : "" }}
                >
                  Período de Renovación
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-black">
                  Estado:
                </span>
                <Switch.Root
                  className="w-16 h-5 bg-gray-300 rounded-full relative"
                  checked={isChecked}
                  onCheckedChange={toggleSwitch}
                >
                  <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform duration-300 transform translate-x-0 checked:translate-x-11" />
                </Switch.Root>
              </div>
            </div>
            <div className="w-full h-px border-b border-black"></div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CalendarDays />
                <span
                  className="text-sm font-semibold"
                  style={{ color: isChecked2 ? "#000" : "" }}
                >
                  Renovación Promedio
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-black">
                  Estado:
                </span>
                <Switch.Root
                  className="w-16 h-5 bg-gray-300 rounded-full relative"
                  checked={isChecked2}
                  onCheckedChange={toggleSwitch2}
                >
                  <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform duration-300 transform translate-x-0 checked:translate-x-11" />
                </Switch.Root>
              </div>
            </div>
            <div className="w-full h-px border-b border-black"></div>
          </div>
        </div>
        <div className="modal-footer flex justify-around">
          <button
            type="button"
            className="px-5 bg-slate-400 rounded-full text-white"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="bg-blue-500 px-5 py-2 rounded-full text-white"
            onClick={saveData}
          >
            Registrar cliente
          </button>
        </div>
      </div>
    </div>
  );
};
export default AgregarCliente;
