import { motion } from "framer-motion";
import { memo, useState } from "react";

interface ImageUploadFieldProps {
  watchField: any;
  fieldName: string;
  label: string;
  register: any;
  setValue: any;
  errors: any;
  required?: boolean;
}

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

const ImageUploadField = memo<ImageUploadFieldProps>(
  ({ watchField, fieldName, label, setValue, errors, required }) => {
    const [active, setActive] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setUploading(true);

        try {
          const uploadResponse = await saveImage(file);
          const downloadURL = uploadResponse.secure_url;

          setValue(fieldName, downloadURL);
          setActive(true);
        } catch (error) {
          console.error("Error uploading to Cloudinary:", error);
        } finally {
          setUploading(false);
        }
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, left: 100 }}
        animate={{ opacity: 1, left: 0 }}
        exit={{ opacity: 0, left: 100 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center justify-center w-full gap-4 relative col-span-2 max-sm:col-span-1 z-0"
      >
        <button
          type="button"
          className="max-sm:w-full max-sm:h-56 w-full h-72 relative cursor-pointer group flex justify-center items-center"
        >
          <img
            src={watchField(fieldName) || ""}
            alt=""
            className="max-sm:w-full max-sm:h-56 w-full h-72 rounded-[3rem] shadow-md bg-zinc-300 object-contain"
          />
          <div className="max-sm:w-full max-sm:h-56 w-full h-72 rounded-[3rem] bg-zinc-800/50 absolute top-0 z-10 scale-0 group-hover:scale-100" />
          {!active && !uploading && !watchField(fieldName) && (
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
              required={
                required !== undefined ? required : !watchField(fieldName)
              }
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
