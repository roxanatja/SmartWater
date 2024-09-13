import { FC } from "react";
import { SmartwaterProvider } from "./SmartwaterContext";
import { PaginaPrincipal } from "./pages/PaginaPrincipal/PaginaPrincipal";
import { initializeApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getStorage, FirebaseStorage } from "firebase/storage";
import "../index.css";

const firebaseConfig = {
  apiKey: "AIzaSyAHkX9ADza8CHBaJqGrqOZogdUCtvENVE8",
  authDomain: "colmaapp.firebaseapp.com",
  projectId: "colmaapp",
  storageBucket: "colmaapp.appspot.com",
  messagingSenderId: "181613723730",
  appId: "1:181613723730:web:82044a6c16dedb00655f8b",
  measurementId: "G-R5CSFFQGL2",
};

export let analytics: Analytics | undefined;
export let storage: FirebaseStorage;

if (typeof window !== "undefined") {
  const app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  storage = getStorage(app);
}

const SmartwaterWrapper: FC = () => {
  return (
    <>
      <SmartwaterProvider>
        <PaginaPrincipal />
      </SmartwaterProvider>
    </>
  );
};

export { SmartwaterWrapper };
