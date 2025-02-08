import { useContext, useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "./Inputs";
import { motion } from "framer-motion";
import ImageUploadField from "./ImageUploadField";
import GoogleMapWithSelection from "./GoogleInputMap";
import { ClientesContext } from "../Contenido/Clientes/ClientesContext";
import * as Yup from 'yup'
import { ClientsApiConector } from "../../../api/classes";
import { District, Zone } from "../../../type/City";
import { IClientForm } from "../../../api/types/clients";
import { formatNumber, isValidPhoneNumber } from "libphonenumber-js";
import { AuthService } from "../../../api/services/AuthService";
import toast from "react-hot-toast";
import { Client } from "../../../type/Cliente/Client";

const ClientForm = ({
  isOpen,
  onCancel,
  zones,
  allClients,
  selectedClient
}: {
  onCancel?: () => void;
  isOpen: boolean;
  zones: Zone[];
  allClients: Client[];
  selectedClient: Client
}) => {
  const user = AuthService.getUser()
  const [isJeshua, setIsJeshua] = useState<boolean>(false)
  const [active, setActive] = useState(false);

  const [disti, setDisti] = useState<District[]>(selectedClient._id !== "" ? zones.find(z => z._id === selectedClient.zone)?.districts || [] : []);
  const [date, setDate] = useState(true);


  const [uploading, setUploading] = useState(false);
  const [mapinteration, setMapinteration] = useState(false);

  const d: { defaultValues?: IClientForm } = selectedClient._id !== "" ?
    {
      defaultValues: {
        ...selectedClient,
        fullName: (!selectedClient || selectedClient.fullName === "Sin nombre") ? "" : selectedClient.fullName,
        zone: selectedClient.zone, district: selectedClient.district,
        phoneLandLine: selectedClient.phoneLandLine ? formatNumber(selectedClient.phoneLandLine, "BO", "NATIONAL").replaceAll(" ", "") : undefined,
        phoneNumber: formatNumber(selectedClient.phoneNumber, "BO", "NATIONAL").replaceAll(" ", ""),
        address: selectedClient.address,
        dayrenew: Number(selectedClient.renewInDays) > 0,
      },
    } :
    {};

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IClientForm>({
    defaultValues: d.defaultValues,
    mode: 'all'
  });

  useEffect(() => {
    if (user) {
      setIsJeshua(user.organization.toLowerCase() === "jeshua")
    }
  }, [user])


  const onSubmit: SubmitHandler<IClientForm> = async (data) => {
    setActive(true)

    if (exists) {
      toast.error(
        (t) => (
          <div>
            <p className="mb-4 text-center text-[#888]">
              Ya existe un cliente con este nombre ¿Deseas crear el proveedor con este nombre de todos modos?
            </p>
            <div className="flex justify-center">
              <button
                className="bg-red-500 px-3 py-1 rounded-lg ml-2 text-white"
                onClick={() => { toast.dismiss(t.id); setActive(false) }}
              >
                Cancelar
              </button>
              <button
                className="bg-blue_custom px-3 py-1 rounded-lg ml-2 text-white"
                onClick={async () => {
                  toast.dismiss(t.id);
                  saveClient(data)
                }}
              >
                Proceder
              </button>
            </div>
          </div>
        ),
        {
          className: "shadow-md dark:shadow-slate-400 border border-slate-100 bg-main-background",
          icon: null,
          position: "top-center",
          duration: 2 * 60000
        }
      );
    } else {
      saveClient(data)
    }
  };

  const saveClient = async (data: IClientForm) => {
    let res = null

    if (selectedClient._id !== "") {
      res = await ClientsApiConector.updateClient({
        clientId: selectedClient._id,
        data: {
          address: data.address,
          billingInfo: data.billingInfo,
          ciBackImage: data.ciBackImage,
          ciFrontImage: data.ciFrontImage,
          comment: "",
          district: data.district,
          fullName: data.fullName || "Sin nombre",
          location: data.location,
          reference: data.reference,
          clientImage: data.clientImage,
          phoneNumber: formatNumber(data.phoneNumber, "BO", "E.164"),
          renewInDays: data.dayrenew ? data.renewInDays : null,
          storeImage: data.storeImage,
          zone: data.zone,
          email: data.email,
          averageRenewal: !data.dayrenew,
          phoneLandLine: data.phoneLandLine ? formatNumber(data.phoneLandLine, "BO", "E.164") : null,
          isAgency: data.isAgency,
          isClient: data.isClient,
        }
      })
    } else {
      res = await ClientsApiConector.registerClient({
        data: {
          address: data.address,
          billingInfo: data.billingInfo,
          ciBackImage: data.ciBackImage,
          ciFrontImage: data.ciFrontImage,
          comment: "",
          reference: data.reference || "",
          credit: 0,
          district: data.district,
          fullName: data.fullName || "Sin nombre",
          hasContract: data.hasContract,
          hasLoan: data.hasLoan,
          hasOrder: data.hasOrder,
          isAgency: data.isAgency,
          isClient: data.isClient,
          location: data.location,
          phoneNumber: formatNumber(data.phoneNumber, "BO", "E.164"),
          renewInDays: data.dayrenew ? data.renewInDays : undefined,
          storeImage: data.storeImage,
          user: AuthService.getUser()?._id || '',
          zone: data.zone,
          email: data.email,
          averageRenewal: !data.dayrenew,
          phoneLandLine: data.phoneLandLine ? formatNumber(data.phoneLandLine, "BO", "E.164") : undefined
        }
      })
    }

    if (res) {
      toast.success(`Cliente ${selectedClient._id === "" ? "registrado" : "editado"} correctamente`);
      window.location.reload();
    } else {
      toast.error("Upps error al crear cliente");
      setActive(false)
    }
  }

  const selectedZone = watch('zone')
  useEffect(() => {
    if (selectedZone) {
      const zon = zones.find(z => z._id === selectedZone)
      const dists = zon?.districts || []
      setDisti(dists)
      // if (dists.length > 0) {
      //   if (selectedClient._id === "") {
      //     setValue('district', dists[0]._id, { shouldValidate: true })
      //   } else {
      //     // if (dists.some(d => d._id === selectedClient.district)) {
      //     //   setValue('district', selectedClient.district, { shouldValidate: true })
      //     // } else {
      //     //   setValue('district', "null", { shouldValidate: true })
      //     // }
      //   }
      // } else { setValue('district', "null", { shouldValidate: true }) }
    }
  }, [selectedZone, zones, setValue, selectedClient])

  const handleCheckboxChange = (type: "isClient" | "isAgency") => {
    if (type === "isClient") {
      setValue("isClient", true, { shouldValidate: true });
      setValue("isAgency", false, { shouldValidate: true });
    } else {
      setValue("isAgency", true, { shouldValidate: true });
      setValue("isClient", false, { shouldValidate: true });
    }
  };

  const handleCheckboxChangeReno = (type: "dayrenew" | "hasOrder") => {
    if (type === "dayrenew") {
      setValue("dayrenew", true, { shouldValidate: true });
      setDate(true);
    } else {
      setValue("dayrenew", false, { shouldValidate: true });
      setDate(false);
    }
  };

  useEffect(() => {
    if (selectedClient._id === "") {
      setValue("isClient", true, { shouldValidate: true });
      setValue("isAgency", false, { shouldValidate: true });
      setValue("dayrenew", true, { shouldValidate: true });
      setValue("hasOrder", false, { shouldValidate: true });
      setValue("renewInDays", 0, { shouldValidate: true });
      setDate(true)
    } else {
      setDate(Number(selectedClient.renewInDays) > 0)
    }
  }, [selectedClient, setValue]);

  const [googleMapsUrl, setGoogleMapsUrl] = useState<string>(`https://www.google.com/maps?q=`)
  const address = watch("address")
  useEffect(() => {
    if (address) {
      const newAddress = `https://www.google.com/maps?q=${encodeURIComponent(address)}`
      setGoogleMapsUrl(newAddress)
      setValue('linkAddress', newAddress)
    } else {
      setGoogleMapsUrl("https://www.google.com/maps?q")
      setValue('linkAddress', "")
    }
  }, [address, setValue])

  const saveImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      `${process.env.REACT_APP_API_UPLOAD_PRESENT}`
    );
    formData.append("api_key", `${process.env.REACT_APP_API_UPLOAD_KEY}`);

    const response = await fetch(`${process.env.REACT_APP_API_UPLOAD_FILE}`, {
      method: "POST",
      body: formData,
    });

    const responseData = await response.json();
    return responseData;
  };

  const name = watch('fullName')
  const exists = useMemo<boolean>(() => {
    return !!name && allClients.some(p => p.fullName && p.fullName.trim().toLowerCase() === name.trim().toLowerCase() && p._id !== selectedClient._id)
  }, [name, allClients, selectedClient])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 justify-center items-center w-full"
    >
      {/* Select photo */}
      <motion.div
        initial={{ opacity: 0, left: 100 }}
        animate={{ opacity: 1, left: 0 }}
        exit={{ opacity: 0, left: 100 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center justify-center w-full gap-4 p-6 top-10 z-20 bg-main-background"
      >
        <button
          type="button"
          className="max-sm:w-full max-sm:h-56 w-32 h-32 relative cursor-pointer group max-sm:flex max-sm:justify-center"
        >
          <img
            src={
              watch("clientImage") ||
              "https://imgs.search.brave.com/8TK6e_BWCEnl1l51_KJIw2kP1zPhk79MhP75VA4Zlgs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2UwL2I3/LzZkL2UwYjc2ZDlk/OTRlZGM5YjU3Y2Q3/NWRiOTYzNzNlZWU2/LmpwZw"
            }
            alt="logo.png"
            className="max-sm:w-56 max-sm:h-56 w-32 h-32 rounded-full shadow-md"
          />
          <div className="max-sm:w-full max-sm:h-56 w-32 h-32 rounded-full bg-gray-800/50 absolute top-0 z-10 scale-0 group-hover:scale-100" />
          <i className="fas fa-camera text-xl absolute -bottom-1 right-3 z-10 text-gray_custom"></i>
          <label className="cursor-pointer">
            <input
              name="file"
              className="absolute top-0 h-full w-full left-0 z-30 opacity-0 cursor-pointer"
              type="file"
              accept="image/jpeg,image/jpg"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setUploading(true);
                  try {
                    const uploadResponse = await saveImage(file);
                    const downloadURL = uploadResponse.secure_url;
                    setValue("clientImage", downloadURL);
                  } catch (error) {
                    console.error("Error uploading to Cloudinary:", error);
                  } finally {
                    setUploading(false);
                  }
                }
              }}
            />
          </label>
        </button>
        {uploading && (
          <div className="text-green_custom top-0 font-normal text-sm w-full my-1">
            Subiendo...
          </div>
        )}

        {errors.clientImage && (
          <div className="text-green_custom top-0 font-normal text-sm w-full my-1">
            <i className="fa-solid fa-triangle-exclamation"></i>{" "}
            {errors?.clientImage?.message}
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-2 max-sm:grid-cols-1 md:grid-cols-2 gap-4 w-full px-6">
        <div className="flex flex-col">
          <Input
            label="Nombre"
            name="fullName"
            register={register}
            errors={errors.fullName}
            required={!isJeshua}
          />
          {exists &&
            <span className="text-yellow-500 font-normal text-sm w-full flex gap-2 items-center mt-1">
              <i className="fa-solid fa-triangle-exclamation"></i>
              Existe un proveedor con este nombre
            </span>
          }
        </div>
        <Input
          label="Datos de Factura"
          name="billingInfo.name"
          register={register}
          errors={errors.billingInfo?.name}
          required={!isJeshua}
        />
        <Input
          label="Numero de NIT"
          name="billingInfo.NIT"
          register={register}
          numericalOnly
          errors={errors.billingInfo?.NIT}
          required={!isJeshua}
        />
        <Input
          label="Numero de Telefono Fijo"
          name="phoneLandLine"
          register={register}
          icon={<i className="fa-solid fa-phone"></i>}
          errors={errors.phoneLandLine}
          validateAmount={(value: string) => { if (value && !isValidPhoneNumber(value, "BO")) { return "Número de teléfono incorrecto" } return true }}
        />
        <Input
          label="Numero de whatsapp"
          name="phoneNumber"
          register={register}
          errors={errors.phoneNumber}
          className="pl-24"
          icon={
            <div className="flex items-center gap-2 justify-center py-1">
              <i className="fa-brands fa-square-whatsapp text-green-500"></i>
              <p className="text-sm">(591)</p>
            </div>
          }
          validateAmount={(value: string) => { if (!isValidPhoneNumber(value, "BO") && !isJeshua) { return "Número de teléfono incorrecto" } return true }}
          required={!isJeshua}
        />
        <Input
          label="Correo Electrónico"
          name="email"
          register={register}
          className="lowercase"
          icon={<i className="fa-solid fa-envelope"></i>}
          errors={errors.email}
          validateAmount={(value: string) => {
            try {
              Yup.string().email("Dirección de correo incorrecta").validateSync(value)
              return true
            } catch (error: any) {
              console.log(error.message)
              return error.message as string
            }
          }}
        />

        <div>
          <Input
            label="Dirección"
            name="address"
            register={register}
            errors={errors.address}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-2 col-span-2 max-sm:col-span-1 flex gap-2 items-center"
          >
            <i className="fa-solid fa-location-dot text-sm"></i>
            <a
              href={googleMapsUrl}
              target="_blank"
              className="text-xs underline"
              rel="noreferrer"
              tabIndex={-1}
            >
              Ver ubicacion en Google Maps
            </a>
          </motion.div>
        </div>
        <Input
          label="Referencia"
          name="reference"
          register={register}
          errors={errors.reference}
        />
        {/* {selectedClient._id === "" && (
          <div className="col-span-2 max-sm:col-span-1">
            <Input
              label="Enlace de ubicación"
              name="linkAddress"
              placeholder="(Opcional)"
              register={register}
              icon={<i className="fa-solid fa-location-dot"></i>}
            />
          </div>
        )} */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full flex flex-col gap-2"
        >
          <label>Zona</label>
          <select
            {...register("zone", {
              required: "La zona es requerida",
            })}
            className="p-2 py-2.5 rounded-md font-pricedown focus:outline-4 bg-main-background outline outline-2 outline-black"
          >
            <option value={""}>Selecciona una zona</option>
            {zones.length > 0 &&
              zones.map((city, index) => (
                <option value={city._id} key={index}>
                  {city.name}
                </option>
              ))}
          </select>
          {errors.zone && (
            <span className="text-red-500 font-normal text-sm font-pricedown">
              <i className="fa-solid fa-triangle-exclamation"></i>{" "}
              {errors.zone.message}
            </span>
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full flex flex-col gap-2"
        >
          <label>Barrio</label>
          <select
            {...register("district", {
              required: "El barrio es requerido"
            })}
            className="p-2 py-2.5 rounded-md font-pricedown focus:outline-4 bg-main-background outline outline-2 outline-black"
          >
            {disti && disti.length > 0 ? (
              <>
                <option value={""}>Selecciona un barrio</option>
                {
                  disti.map((row, index) => (
                    <option value={row._id} key={index}>
                      {row.name}
                    </option>
                  ))
                }
              </>
            ) : (
              <option value={""}>Sin resultados</option>
            )}
          </select>
          {errors.district && (
            <span className="text-red-500 font-normal text-sm font-pricedown">
              <i className="fa-solid fa-triangle-exclamation"></i>{" "}
              {errors.district.message}
            </span>
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full flex gap-3 text-md items-center col-span-2 max-sm:col-span-1"
        >
          <input
            type="checkbox"
            {...register("isClient", {
              onChange: (e) => handleCheckboxChange("isClient"),
            })}
            className="w-5 h-5 text-blue-900 bg-gray-100 border-gray-300 rounded accent-blue-700"
            id="isClient"
          />
          <label htmlFor="isClient" className="mr-4">
            Cliente Habitual
          </label>
          <input
            type="checkbox"
            {...register("isAgency", {
              onChange: (e) => handleCheckboxChange("isAgency"),
            })}
            className="w-5 h-5 text-blue-900 bg-gray-100 border-gray-300 rounded accent-blue-700"
            id="isAgency"
          />
          <label htmlFor="isAgency">Agencia</label>
        </motion.div>
        <ImageUploadField
          value={watch('ciBackImage')}
          fieldName={"ciBackImage"}
          label={"Por favor, adjunta foto del carnet (trasero)"}
          register={register}
          setValue={setValue}
          errors={errors.ciBackImage}
          required={false}
        />
        <ImageUploadField
          value={watch('ciFrontImage')}
          fieldName={"ciFrontImage"}
          label={"Por favor, adjunta foto del carnet (delantero)"}
          register={register}
          setValue={setValue}
          errors={errors.ciFrontImage}
          required={false}
        />
        <ImageUploadField
          value={watch('storeImage')}
          fieldName={"storeImage"}
          label={"Por favor, adjunta foto de la tienda"}
          register={register}
          setValue={setValue}
          errors={errors.storeImage}
          required={!isJeshua}
        />
        <div className="w-full col-span-2 max-sm:col-span-1 relative">
          <h1 className="text-sm font-medium">
            Selecciona una ubicación en el mapa
          </h1>
          <GoogleMapWithSelection
            visible={isOpen}
            disable={mapinteration}
            linkAddress={watch("linkAddress")}
            latitude={Number(watch("location.latitude"))}
            longitude={Number(watch("location.longitude"))}
            onChange={(coordinates: { lat: number; lng: number }) => {
              setValue("location.latitude", `${coordinates.lat}`, { shouldValidate: true });
              setValue("location.longitude", `${coordinates.lng}`, { shouldValidate: true });
            }}
          />

          <input type="hidden" {...register('location.latitude', { required: true })} className="bg-transparent" />
          <input type="hidden" {...register('location.longitude', { required: true })} className="bg-transparent" />

          <button
            type="button"
            onClick={() => setMapinteration(!mapinteration)}
            className="absolute bg-blue-500 text-white py-2 px-8 top-7 rounded-md translate-y-0.5 z-[10] right-14"
          >
            {mapinteration ? "Editar" : "Bloquear"}
          </button>

          {
            (errors.location?.latitude || errors.location?.longitude) &&
            <span className="text-red-500 font-normal text-sm">
              <i className="fa-solid fa-triangle-exclamation"></i>{" "}
              Ubicación no definida
            </span>
          }
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col justify-center items-center col-span-2 max-sm:col-span-1 pr-6 border-b border-black pb-4 relative"
        >
          <div className="flex justify-between items-center gap-4 w-full">
            <div className={`flex gap-4 font-semibold w-full ${date ? "items-start" : "items-center"}`}>
              <i
                onClick={() => {
                  handleCheckboxChangeReno("dayrenew");
                }}
                className={`fa-solid fa-calendar-days text-3xl cursor-pointer  ${!watch("dayrenew")
                  ? `text-zinc-300 hover:text-blue_custom`
                  : "text-blue_custom"
                  }`}
              ></i>

              {date ? (
                <div className="bg-main-background z-10 relative w-full">
                  <p className={`transition-all absolute top-0 left-1 w-fit -translate-y-1/2 h-fit text-sm bg-main-background z-[20] px-2 ${!watch("dayrenew") ? "!text-zinc-300" : "!text-blue_custom"}`}>
                    Periodo de Renovacion
                  </p>
                  <Input
                    placeholder="Periodo de Renovacion"
                    type="number"
                    label="Periodo Renovacion"
                    register={register}
                    name="renewInDays"
                    numericalOnly
                    isVisibleLable
                    className="w-full"
                    errors={errors.renewInDays}
                    required={date}
                    validateAmount={(val: number) => date ? val <= 0 ? "Indique un valor" : true : true}
                  />
                </div>
              ) : <p
                className={`${!watch("dayrenew") ? "text-zinc-300" : "text-blue_custom"} ${date && "text-transparent"
                  }`}
              >
                Periodo de Renovacion
              </p>}
            </div>
            <div className="flex items-center gap-2">
              <label
                htmlFor="switch-component"
                className="text-sm font-semibold"
              >
                Estado:
              </label>
              <div className="relative inline-block w-11 h-5">
                <input
                  id="switch-component"
                  type="checkbox"
                  readOnly
                  onClick={() => handleCheckboxChangeReno("dayrenew")}
                  checked={watch("dayrenew")}
                  className="peer appearance-none w-16 h-5 bg-slate-300 rounded-full checked:bg-blue_custom cursor-pointer transition-colors duration-300"
                />
                <label
                  htmlFor="switch-component"
                  className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-12 peer-checked:border-blue_custom cursor-pointer"
                ></label>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col justify-center items-center col-span-2 max-sm:col-span-1 pr-6 border-b border-black pb-4 relative"
        >
          <div className="flex justify-between items-center gap-4 w-full">
            <div className="flex gap-4 items-center justify-center font-semibold">
              <i
                onClick={() => {
                  handleCheckboxChangeReno("hasOrder");
                }}
                className={`fa-solid fa-calendar-days text-3xl cursor-pointer ${watch("dayrenew")
                  ? `text-zinc-300 hover:text-blue_custom`
                  : "text-blue_custom"
                  }`}
              ></i>
              <p className={`${watch("dayrenew") ? "text-zinc-300" : "text-blue_custom"}`}>
                Renovacion Promedio
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label
                htmlFor="switch-component-2"
                className="text-sm font-semibold"
              >
                Estado:
              </label>
              <div className="relative inline-block w-11 h-5">
                <input
                  id="switch-component-2"
                  type="checkbox"
                  onClick={() => handleCheckboxChangeReno("hasOrder")}
                  readOnly
                  checked={!watch("dayrenew")}
                  className="peer appearance-none w-16 h-5 bg-slate-300 rounded-full checked:bg-blue_custom cursor-pointer transition-colors duration-300"
                />
                <label
                  htmlFor="switch-component-2"
                  className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-12 peer-checked:border-blue_custom cursor-pointer"
                ></label>
              </div>
            </div>
          </div>
          {/* {date2 && (
            <div className="absolute w-44 top-0 -translate-y-0.5 bg-white left-9 z-10">
              <Input
                type="date"
                label="Renovacion Promedio"
                register={register}
                isVisibleLable
                className="w-full"
                name="renewInDaysNumber"
                errors={errors.renewInDaysNumber}
                required={date2}
              />
            </div>
          )} */}
        </motion.div>
      </div>
      <div className="w-full  sticky bottom-0 bg-main-background h-full z-50">
        <div className="py-4 flex flex-row gap-4 items-center justify-center px-6">
          <button
            onClick={onCancel}
            className="w-full outline outline-2 outline-blue-500 py-2 rounded-full text-blue-600 font-black shadow-xl"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="w-full outline outline-2 outline-blue-500 bg-blue-500 py-2 rounded-full text-white font-black shadow-xl truncate"
          >
            {
              active ?
                <i className="fa-solid fa-spinner animate-spin"></i> :
                <span>
                  {selectedClient._id !== "" ? "Editar" : "Registrar"} cliente
                </span>
            }
          </button>
        </div>
      </div>
    </form>
  );
};

export default ClientForm;
