import { createContext, useContext, useState } from "react";
import { Toaster } from "react-hot-toast";
import PageLoader from "./pages/components/PageLoader/PageLoader";

type SmartwaterContextType = {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showMiniModal: boolean;
  setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedOption: boolean;
  setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SmartwaterContext = createContext<SmartwaterContextType>(
  {} as SmartwaterContextType
);

export const useGlobalContext = () => {
  return useContext(SmartwaterContext)
}

export const SmartwaterProvider = ({ children }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<boolean>(false);

  return (
    <>
      <SmartwaterContext.Provider
        value={{
          loading,
          setLoading,
          showModal,
          setShowModal,
          showMiniModal,
          setShowMiniModal,
          selectedOption,
          setSelectedOption,
        }}
      >
        {children}
      </SmartwaterContext.Provider>
      <PageLoader loading={loading} />
      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  );
};
