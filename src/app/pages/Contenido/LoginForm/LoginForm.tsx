import React, { useState, FormEvent } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthService } from "../../../../api/services/AuthService";
import "./LoginForm.css";

const LoginForm = () => {
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");

  const validatePhoneNumber = (value: string) => {
    const isValid = /^[0-9+\s()-]+$/.test(value);
    return isValid;
  };

  const validatePassword = (value: string) => {
    return value.length >= 6;
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePhoneNumber(phoneNumber)) {
      setPhoneNumberError("Por favor ingrese un teléfono válido");
      return;
    } else {
      setPhoneNumberError("");
    }

    if (!validatePassword(password)) {
      setPasswordError(
        "Por favor ingrese una contraseña válida (mínimo 6 caracteres)"
      );
      return;
    } else {
      setPasswordError("");
    }

    try {
      await AuthService.login(phoneNumber, password);
      toast.success("Usuario autenticado");
      navigate("/Inicio");
    } catch (error: any) {
      setError("Error al iniciar sesión. Por favor revisa tus credenciales.");
      console.error("Error al iniciar sesión:", error.message);
    }
  };

  const [passwordState, setPasswordState] = useState<boolean>(false)

  return (
    <motion.div
      className="login-overlay"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="login-content bg-main-background"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 50 }}
      >
        <div className="login-header">
          <h1 className="login-title text-blue_custom">Iniciar Sesión</h1>
        </div>
        <div className="login-body">
          <form onSubmit={handleLogin}>
            <motion.input
              className={`login-input bg-transparent text-font-color border-font-color ${phoneNumberError && "error"}`}
              type="tel"
              placeholder="Número de teléfono"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            />
            {phoneNumberError && (
              <motion.p
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {phoneNumberError}
              </motion.p>
            )}

            <div className="relative mb-[20px]">
              <motion.input
                className={`login-input bg-transparent text-font-color border-font-color !mb-0 ${passwordError && "error"}`}
                type={passwordState ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              />
              <div className="absolute top-1/2 right-2 -translate-y-1/2" onClick={() => setPasswordState(!passwordState)}>
                {
                  passwordState &&
                  <i className="far fa-eye-slash"></i>
                }
                {
                  !passwordState &&
                  <i className="far fa-eye"></i>
                }
              </div>
            </div>
            {passwordError && (
              <motion.p
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {passwordError}
              </motion.p>
            )}

            {error && (
              <motion.p
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.p>
            )}

            <motion.button
              className="login-btn bg-blue_custom mt-6"
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Iniciar Sesión
            </motion.button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginForm;
