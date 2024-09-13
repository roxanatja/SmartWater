import { motion } from "framer-motion";
import { memo, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../SmartwaterWrapper";

interface ImageUploadFieldProps {
  watchField: any;
  fieldName: string;
  label: string;
  register: any;
  setValue: any;
  errors: any;
}

const ImageUploadField = memo<ImageUploadFieldProps>(
  ({ watchField, fieldName, label, register, setValue, errors }) => {
    const [active, setActive] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setUploading(true);
        const storageRef = ref(storage, `images/${fieldName}/${file.name}`);
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
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setValue(fieldName, downloadURL);
            setActive(true);
            setUploading(false);
          }
        );
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, left: 100 }}
        animate={{ opacity: 1, left: 0 }}
        exit={{ opacity: 0, left: 100 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center justify-center w-full gap-4 relative col-span-2 max-sm:col-span-1"
      >
        <button
          type="button"
          className="max-sm:w-full max-sm:h-56 w-full h-72 relative cursor-pointer group flex justify-center items-center"
        >
          <img
            src={watchField(fieldName) || ""}
            alt=""
            className="max-sm:w-full max-sm:h-56 w-full h-72 rounded-[3rem] shadow-md bg-zinc-300"
          />
          <div className="max-sm:w-full max-sm:h-56 w-full h-72 rounded-[3rem] bg-zinc-800/50 absolute top-0 z-10 scale-0 group-hover:scale-100" />
          {!active && !uploading && (
            <div className="absolute flex flex-col gap-4">
              <i className="fas fa-image text-9xl max-sm:text-8xl z-10 text-zinc-600"></i>
              <p className="text-sm tracking-wider max-sm:text-xs">{label}</p>
            </div>
          )}
          <label className="cursor-pointer">
            <input
              name={fieldName}
              className="absolute top-0 h-full w-full left-0 z-30 opacity-0 cursor-pointer"
              type="file"
              accept="image/jpeg,image/jpg"
              onChange={handleFileChange}
              required={!watchField(fieldName)}
            />
          </label>
        </button>
        {errors[fieldName] && (
          <div className="text-green_custom top-0 font-normal text-sm w-full my-1">
            <i className="fa-solid fa-triangle-exclamation"></i> Una imagen es
            requerida aquí
          </div>
        )}
        {uploading && <div className="text-gray-600 text-sm">Subiendo...</div>}
      </motion.div>
    );
  }
);

ImageUploadField.displayName = "ImageUploadField";

export default ImageUploadField;
