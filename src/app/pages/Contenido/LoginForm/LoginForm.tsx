import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticationService from "../../../../services/AuthenService";
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
      const response = await AuthenticationService.login(phoneNumber, password);
      console.log("Usuario autenticado:", response);
      navigate("/Inicio");
    } catch (error: any) {
      setError("Error al iniciar sesión. Por favor revisa tus credenciales.");
      console.error("Error al iniciar sesión:", error.message);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-content">
        <div className="login-header">
          <h1 className="login-title">Iniciar Sesión</h1>
        </div>
        <div className="login-body">
          <form onSubmit={handleLogin}>
            <input
              className={`login-input ${phoneNumberError && "error"}`}
              type="text"
              placeholder="Número de teléfono"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            {phoneNumberError && (
              <p className="error-message">{phoneNumberError}</p>
            )}

            <input
              className={`login-input ${passwordError && "error"}`}
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <p className="error-message">{passwordError}</p>}

            {error && <p className="error-message">{error}</p>}

            <button className="login-btn" type="submit">
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
