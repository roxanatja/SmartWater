import React, { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Input from "./Inputs";
import { motion } from "framer-motion";
import ImageUploadField from "./ImageUploadField";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import GoogleMapWithSelection from "./GoogleInputMap";
import { storage } from "../../SmartwaterWrapper";
import GetApiMethod from "../../../Class/api.class";
import { City, District, Client } from "../../../Class/types.data";

const ClientForm = ({ onCancel }: { onCancel?: () => void }) => {
  const [city, setCity] = useState<City[]>([]);
  const [disti, setDisti] = useState<District[]>([]);
  const [date, setDate] = useState(false);
  const [date2, setDate2] = useState(false);
  const [uploading, setUploading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Client>();

  const onSubmit: SubmitHandler<Client> = async (data) => {
    const api = new GetApiMethod();
    let values = data;
    try {
      if (data.district === "null") {
        values = { ...data, district: null };
        console.log(values);
      }
      const response = await api.registerClient(values);
      console.log(response);
      toast.success("Cliente registrado exitosamente");
    } catch (error) {
      console.error(error);
      toast.error("Upps error al crear cliente");
    }
  };

  const getCitys = useCallback(async () => {
    const api = new GetApiMethod();
    const data = await api.getCities();
    setCity(data);
  }, []);

  useEffect(() => {
    getCitys();
  }, [getCitys]);

  const handleCheckboxChange = (type: "isClient" | "isAgency") => {
    if (type === "isClient") {
      setValue("isClient", true);
      setValue("isAgency", false);
    } else {
      setValue("isAgency", true);
      setValue("isClient", false);
    }
  };

  const handleCheckboxChangeReno = (type: "hasLoan" | "hasOrder") => {
    if (type === "hasLoan") {
      setValue("hasLoan", true);
      setValue("hasOrder", false);
      setDate(true);
      setDate2(false);
    } else {
      setValue("hasOrder", true);
      setValue("hasLoan", false);
      setDate(false);
      setDate2(true);
    }
  };

  useEffect(() => {
    setValue("isClient", true);
    setValue("isAgency", false);
    setValue("hasLoan", true);
    setValue("hasOrder", false);
    // setValue("renewInDays", "");
    // setValue("renewInDaysNumber", "");
    setValue("zone", city?.[0]?._id);
    setValue("address", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue]);

  const googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    watch("address")
  )}`;

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
        className="flex flex-col items-center justify-center w-full gap-4 p-6 sticky top-10 z-20 bg-white"
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
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setUploading(true);
                  const storageRef = ref(
                    storage,
                    `images/clientImage/${file.name}`
                  );
                  const uploadTask = uploadBytesResumable(storageRef, file);

                  uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                      // Puedes manejar el progreso aquí si lo deseas
                    },
                    (error) => {
                      console.error("Error uploading file:", error);
                      setUploading(false);
                    },
                    async () => {
                      const downloadURL = await getDownloadURL(
                        uploadTask.snapshot.ref
                      );
                      setValue("clientImage", downloadURL);
                      setUploading(false);
                    }
                  );
                }
              }}
              required={!watch("clientImage")}
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
            {errors.clientImage && (
              <>
                <i className="fa-solid fa-triangle-exclamation"></i>{" "}
                {errors.clientImage.message}
              </>
            )}
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-2 max-sm:grid-cols-1 md:grid-cols-2 gap-4 w-full px-6">
        <Input
          label="Nombre"
          name="fullName"
          register={register}
          errors={errors.fullName}
          required
        />
        <Input
          label="Datos de Factura"
          name="billingInfo.name"
          register={register}
          errors={errors.billingInfo?.name}
          required
        />
        <Input
          label="Numero de NIT"
          name="billingInfo.NIT"
          register={register}
          errors={errors.billingInfo?.NIT}
          required
        />
        <Input
          label="Numero de whatsapp"
          name="whatsAppNumber"
          register={register}
          errors={errors.whatsAppNumber}
          className="pl-24"
          icon={
            <div className="flex items-center gap-2 justify-center py-1">
              <i className="fa-brands fa-square-whatsapp text-green-500"></i>
              <p className="text-sm">(591)</p>
            </div>
          }
          required
        />
        <div className="col-span-2 max-sm:col-span-1">
          <Input
            label="Numero de Telefono"
            name="phoneNumber"
            register={register}
            icon={<i className="fa-solid fa-phone"></i>}
            errors={errors.phoneNumber}
            required
          />
        </div>
        <Input
          label="Dirreccion"
          name="address"
          register={register}
          errors={errors.address}
          required
        />
        <Input
          label="Referencia"
          name="reference"
          register={register}
          errors={errors.reference}
          required
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-2 max-sm:col-span-1 flex gap-1 items-center"
        >
          <i className="fa-solid fa-location-dot"></i>
          <a href={googleMapsUrl} target="_blank" className="text-sm underline">
            Ver ubicacion en Google Maps
          </a>
        </motion.div>
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
              required: "se requiere una zona",
              onChange: (e) => {
                const da = city.find((x) => x._id === e.target.value);
                if (da && da.districtsId.length > 0) {
                  setDisti(da.districtsId);
                } else {
                  setDisti([]);
                }
              },
            })}
            className="p-2 py-2.5 rounded-md font-pricedown focus:outline-4 bg-transparent outline outline-2 outline-black text-black"
          >
            {city.map((city, index) => (
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
            {...register("district")}
            className="p-2 py-2.5 rounded-md font-pricedown focus:outline-4 bg-transparent outline outline-2 outline-black text-black"
          >
            {disti.length > 0 ? (
              disti.map((row, index) => (
                <option value={row._id} key={index}>
                  {row.name}
                </option>
              ))
            ) : (
              <option value={"null"}>Sin resultados</option>
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
            className="w-5 h-5 text-blue-900 bg-gray-100 border-gray-300 rounded focus:ring-blue-900 focus:ring-2"
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
            className="w-5 h-5 text-blue-900 bg-gray-100 border-gray-300 rounded focus:ring-blue-900 focus:ring-2"
            id="isAgency"
          />
          <label htmlFor="isAgency">Agencia</label>
        </motion.div>
        <ImageUploadField
          watchField={watch}
          fieldName={"ciBackImage"}
          label={"Porfavor, adjunta foto del carnet (trasero)"}
          register={register}
          setValue={setValue}
          errors={errors}
        />
        <ImageUploadField
          watchField={watch}
          fieldName={"ciFrontImage"}
          label={"Porfavor, adjunta foto del carnet (delantero)"}
          register={register}
          setValue={setValue}
          errors={errors}
        />
        <ImageUploadField
          watchField={watch}
          fieldName={"storeImage"}
          label={"Porfavor, adjunta foto de la tienda"}
          register={register}
          setValue={setValue}
          errors={errors}
        />

        <div className="w-full col-span-2 max-sm:col-span-1">
          <h1>Selecciona una ubicación en el mapa</h1>
          <GoogleMapWithSelection
            onChange={(coordinates: { lat: number; lng: number }) => {
              setValue("location.latitude", `${coordinates.lat}`);
              setValue("location.longitude", `${coordinates.lng}`);
            }}
          />
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col justify-center items-center col-span-2 max-sm:col-span-1 pr-6 border-b border-black pb-4 relative"
        >
          <div className="flex justify-between items-center gap-4 w-full">
            <div className="flex gap-2 items-center justify-center font-semibold">
              <i
                onClick={() => {
                  handleCheckboxChangeReno("hasLoan");
                }}
                className={`fa-solid fa-calendar-days text-3xl cursor-pointer ${
                  watch("renewInDays") === ""
                    ? `text-zinc-300 hover:text-blue-900`
                    : "text-blue-900"
                }`}
              ></i>

              <p className={`${watch("hasOrder") ? "text-zinc-300" : ""}`}>
                Periodo de Renovacion
              </p>
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
                  onClick={() => handleCheckboxChangeReno("hasLoan")}
                  checked={watch("hasLoan")}
                  className="peer appearance-none w-16 h-5 bg-slate-300 rounded-full checked:bg-blue-900 cursor-pointer transition-colors duration-300"
                />
                <label
                  htmlFor="switch-component"
                  className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-12 peer-checked:border-blue-900 cursor-pointer"
                ></label>
              </div>
            </div>
          </div>
          {date && (
            <Input
              type="date"
              label="Periodo Renovacion"
              register={register}
              name="fgdg"
              isVisibleLable
              className="absolute w-44 -top-9 -translate-y-0.5 bg-white left-9"
              errors={errors.renewInDays}
              required={date}
            />
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col justify-center items-center col-span-2 max-sm:col-span-1 pr-6 border-b border-black pb-4"
        >
          <div className="flex justify-between items-center gap-4 w-full">
            <div className="flex gap-2 items-center justify-center font-semibold">
              <i
                onClick={() => {
                  handleCheckboxChangeReno("hasOrder");
                }}
                className={`fa-solid fa-calendar-days text-3xl cursor-pointer ${
                  watch("renewInDaysNumber") === ""
                    ? `text-zinc-300 hover:text-blue-900`
                    : "text-blue-900"
                }`}
              ></i>
              <p className={`${watch("hasLoan") ? "text-zinc-300" : ""}`}>
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
                  checked={watch("hasOrder")}
                  className="peer appearance-none w-16 h-5 bg-slate-300 rounded-full checked:bg-blue-900 cursor-pointer transition-colors duration-300"
                />
                <label
                  htmlFor="switch-component-2"
                  className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-12 peer-checked:border-blue-900 cursor-pointer"
                ></label>
              </div>
            </div>
          </div>
          {date2 && (
            <Input
              type="date"
              label="Renovacion Promedio"
              register={register}
              isVisibleLable
              className="absolute w-44 -top-9 -translate-y-0.5 bg-white left-9"
              name="fgdg"
              errors={errors.renewInDaysNumber}
              required={date2}
            />
          )}
        </motion.div>
      </div>
      <div className="w-full  sticky bottom-0 bg-white h-full z-50">
        <div className="py-4 flex flex-row gap-4 items-center justify-center px-6">
          <button
            onClick={onCancel}
            className="w-full outline outline-2 outline-blue-500 py-2 rounded-full text-blue-600 font-black shadow-xl"
          >
            Cancelar
          </button>
          <button className="w-full outline outline-2 outline-blue-500 bg-blue-500 py-2 rounded-full text-white font-black shadow-xl truncate">
            Registrar cliente
          </button>
        </div>
      </div>
    </form>
  );
};

export default ClientForm;
