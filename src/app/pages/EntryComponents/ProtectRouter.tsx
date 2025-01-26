import { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthService } from "../../../api/services/AuthService";

interface ProtectedRouteProps {
  redirectPath?: string;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({
  redirectPath = "/users/login",
}) => {
  const isAuthenticated = AuthService.isLoggedIn();

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
