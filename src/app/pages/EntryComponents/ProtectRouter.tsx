import { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthenticationService from "../../../services/AuthenService";

interface ProtectedRouteProps {
  redirectPath?: string;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({
  redirectPath = "/users/login",
}) => {
  const isAuthenticated = AuthenticationService.isLoggedIn();

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
