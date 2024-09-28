import { FC } from "react";
import LoginForm from "./LoginForm";

const LoginPageWrapper: FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-50">
      <LoginForm />
    </div>
  );
};

export default LoginPageWrapper;
