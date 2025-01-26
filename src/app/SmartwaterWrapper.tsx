import { FC, useEffect } from "react";
import { SmartwaterProvider } from "./SmartwaterContext";
import { PaginaPrincipal } from "./pages/PaginaPrincipal/PaginaPrincipal";
import "../index.css";
import { useLocalStorage } from "@uidotdev/usehooks";
import NotificacionesProvider from "./pages/components/Notificaciones/NotificacionesContext";

const SmartwaterWrapper: FC = () => {
  const [theme, setTheme] = useLocalStorage<string>('theme', 'auto')

  useEffect(() => {
    if (!theme) {
      setTheme('auto')
    }

    let val = theme
    if (theme === 'auto') {
      val = getSystemMode()
    }

    const root = window.document.body;

    root.classList.remove(val === 'dark' ? 'light' : 'dark');
    root.classList.add(val);
  }, [theme, setTheme])


  const getSystemMode = (): "dark" | 'light' => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    } else {
      return 'light'
    }
  }

  return (
    <>
      <SmartwaterProvider>
        <NotificacionesProvider>
          <PaginaPrincipal />
        </NotificacionesProvider>
      </SmartwaterProvider>
    </>
  );
};

export { SmartwaterWrapper };
